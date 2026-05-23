import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/lines - List current user's telecom lines
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const lines = await db.telecomLine.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        toneAssignments: {
          where: { isActive: true },
          include: {
            tone: {
              select: { id: true, name: true, category: true, coverImage: true },
            },
          },
        },
        organization: {
          select: { id: true, name: true },
        },
        _count: {
          select: { callAnalytics: true },
        },
      },
    });

    return NextResponse.json({ lines });
  } catch (error) {
    console.error("[LINES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch lines" },
      { status: 500 }
    );
  }
}

// POST /api/lines - Add a new telecom line for current user
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { number, provider, label, organizationId } = body;

    if (!number || !provider) {
      return NextResponse.json(
        { error: "Phone number and provider are required" },
        { status: 400 }
      );
    }

    // Check subscription limits
    const activeSubscription = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ["ACTIVE", "TRIAL"] },
      },
      orderBy: { createdAt: "desc" },
    });

    if (activeSubscription) {
      const currentLineCount = await db.telecomLine.count({
        where: { userId: session.user.id },
      });

      if (currentLineCount >= activeSubscription.maxLines) {
        return NextResponse.json(
          { error: "You have reached the maximum number of lines for your subscription plan" },
          { status: 400 }
        );
      }
    }

    const line = await db.telecomLine.create({
      data: {
        number,
        provider: provider.toUpperCase(),
        label,
        userId: session.user.id,
        organizationId: organizationId || session.user.organizationId,
        status: "PENDING_ACTIVATION",
      },
      include: {
        toneAssignments: {
          where: { isActive: true },
          include: {
            tone: {
              select: { id: true, name: true, category: true },
            },
          },
        },
        organization: {
          select: { id: true, name: true },
        },
      },
    });

    // Log activity
    await db.activity.create({
      data: {
        userId: session.user.id,
        type: "LINE_ACTIVATED",
        description: `Added telecom line: ${number} (${provider})`,
        metadata: JSON.stringify({ lineId: line.id }),
      },
    });

    return NextResponse.json(line, { status: 201 });
  } catch (error) {
    console.error("[LINES_POST]", error);
    return NextResponse.json(
      { error: "Failed to create line" },
      { status: 500 }
    );
  }
}
