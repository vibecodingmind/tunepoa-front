import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/tones/[id] - Get single tone details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const tone = await db.tone.findUnique({
      where: { id },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
        assignments: {
          where: { isActive: true },
          include: {
            user: {
              select: { id: true, name: true, email: true },
            },
            telecomLine: {
              select: { id: true, number: true, provider: true },
            },
          },
        },
        _count: {
          select: { assignments: true },
        },
      },
    });

    if (!tone) {
      return NextResponse.json({ error: "Tone not found" }, { status: 404 });
    }

    return NextResponse.json(tone);
  } catch (error) {
    console.error("[TONE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch tone" },
      { status: 500 }
    );
  }
}

// PATCH /api/tones/[id] - Update tone (ADMIN/MANAGER only)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const existingTone = await db.tone.findUnique({ where: { id } });
    if (!existingTone) {
      return NextResponse.json({ error: "Tone not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, description, category, duration, audioUrl, coverImage, isPremium, status } = body;

    const tone = await db.tone.update({
      where: { id },
      data: {
        ...(name !== undefined && { name }),
        ...(description !== undefined && { description }),
        ...(category !== undefined && { category }),
        ...(duration !== undefined && { duration }),
        ...(audioUrl !== undefined && { audioUrl }),
        ...(coverImage !== undefined && { coverImage }),
        ...(isPremium !== undefined && { isPremium }),
        ...(status !== undefined && { status }),
      },
      include: {
        createdBy: {
          select: { id: true, name: true },
        },
      },
    });

    return NextResponse.json(tone);
  } catch (error) {
    console.error("[TONE_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update tone" },
      { status: 500 }
    );
  }
}

// DELETE /api/tones/[id] - Delete tone (ADMIN only)
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Forbidden - Admin only" }, { status: 403 });
    }

    const { id } = await params;

    const existingTone = await db.tone.findUnique({ where: { id } });
    if (!existingTone) {
      return NextResponse.json({ error: "Tone not found" }, { status: 404 });
    }

    await db.tone.delete({ where: { id } });

    return NextResponse.json({ message: "Tone deleted successfully" });
  } catch (error) {
    console.error("[TONE_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to delete tone" },
      { status: 500 }
    );
  }
}
