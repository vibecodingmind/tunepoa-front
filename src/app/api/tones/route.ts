import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/tones - List all approved tones (public, with category filter)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      status: "APPROVED",
    };

    if (category) {
      where.category = category.toUpperCase();
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { description: { contains: search } },
      ];
    }

    const [tones, total] = await Promise.all([
      db.tone.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          createdBy: {
            select: { id: true, name: true },
          },
          _count: {
            select: { assignments: true },
          },
        },
      }),
      db.tone.count({ where }),
    ]);

    return NextResponse.json({
      tones,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("[TONES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch tones" },
      { status: 500 }
    );
  }
}

// POST /api/tones - Create a new tone (ADMIN/MANAGER only)
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { name, description, category, duration, audioUrl, coverImage, isPremium, status } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Tone name is required" },
        { status: 400 }
      );
    }

    const tone = await db.tone.create({
      data: {
        name,
        description,
        category: category || "CORPORATE",
        duration: duration || null,
        audioUrl,
        coverImage,
        isPremium: isPremium || false,
        status: status || "APPROVED",
        createdById: session.user.id,
      },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
    });

    // Log activity
    await db.activity.create({
      data: {
        userId: session.user.id,
        type: "TONE_ASSIGNED",
        description: `Created new tone: ${name}`,
        metadata: JSON.stringify({ toneId: tone.id }),
      },
    });

    return NextResponse.json(tone, { status: 201 });
  } catch (error) {
    console.error("[TONES_POST]", error);
    return NextResponse.json(
      { error: "Failed to create tone" },
      { status: 500 }
    );
  }
}
