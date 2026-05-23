import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/lines/[id] - Get line details
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const line = await db.telecomLine.findUnique({
      where: { id },
      include: {
        toneAssignments: {
          include: {
            tone: {
              select: { id: true, name: true, category: true, coverImage: true, audioUrl: true },
            },
          },
        },
        organization: {
          select: { id: true, name: true },
        },
        callAnalytics: {
          orderBy: { date: "desc" },
          take: 30,
        },
        user: {
          select: { id: true, name: true, email: true },
        },
      },
    });

    if (!line) {
      return NextResponse.json({ error: "Line not found" }, { status: 404 });
    }

    // Only owner or admin can view
    if (session.user.role !== "ADMIN" && line.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(line);
  } catch (error) {
    console.error("[LINE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch line" },
      { status: 500 }
    );
  }
}

// PATCH /api/lines/[id] - Update line (change tone assignment, label)
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingLine = await db.telecomLine.findUnique({ where: { id } });
    if (!existingLine) {
      return NextResponse.json({ error: "Line not found" }, { status: 404 });
    }

    // Only owner or admin can update
    if (session.user.role !== "ADMIN" && existingLine.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { label, status, toneId, organizationId } = body;

    const updateData: Record<string, unknown> = {};
    if (label !== undefined) updateData.label = label;
    if (status !== undefined) updateData.status = status;
    if (organizationId !== undefined) updateData.organizationId = organizationId;

    if (status === "ACTIVE" && !existingLine.activatedAt) {
      updateData.activatedAt = new Date();
    }

    // Handle tone assignment
    if (toneId !== undefined) {
      // Deactivate existing assignments
      await db.toneAssignment.updateMany({
        where: { telecomLineId: id, isActive: true },
        data: { isActive: false },
      });

      // Create new assignment
      if (toneId) {
        await db.toneAssignment.create({
          data: {
            toneId,
            userId: session.user.id,
            telecomLineId: id,
            isActive: true,
          },
        });
      }

      // Log activity
      await db.activity.create({
        data: {
          userId: session.user.id,
          type: "TONE_ASSIGNED",
          description: toneId
            ? `Assigned tone to line ${existingLine.number}`
            : `Removed tone from line ${existingLine.number}`,
          metadata: JSON.stringify({ lineId: id, toneId }),
        },
      });
    }

    const line = await db.telecomLine.update({
      where: { id },
      data: updateData,
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
      },
    });

    return NextResponse.json(line);
  } catch (error) {
    console.error("[LINE_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update line" },
      { status: 500 }
    );
  }
}

// DELETE /api/lines/[id] - Remove/deactivate line
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    const existingLine = await db.telecomLine.findUnique({ where: { id } });
    if (!existingLine) {
      return NextResponse.json({ error: "Line not found" }, { status: 404 });
    }

    // Only owner or admin can delete
    if (session.user.role !== "ADMIN" && existingLine.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await db.telecomLine.update({
      where: { id },
      data: { status: "SUSPENDED" },
    });

    // Log activity
    await db.activity.create({
      data: {
        userId: session.user.id,
        type: "LINE_SUSPENDED",
        description: `Deactivated line: ${existingLine.number}`,
        metadata: JSON.stringify({ lineId: id }),
      },
    });

    return NextResponse.json({ message: "Line deactivated successfully" });
  } catch (error) {
    console.error("[LINE_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to deactivate line" },
      { status: 500 }
    );
  }
}
