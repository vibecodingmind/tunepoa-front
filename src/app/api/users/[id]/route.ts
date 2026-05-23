import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

// GET /api/users/[id] - Get user details (ADMIN or self only)
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

    // Only ADMIN or self can view user details
    if (session.user.role !== "ADMIN" && session.user.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const user = await db.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        organizationId: true,
        organization: {
          select: { id: true, name: true, email: true, phone: true },
        },
        _count: {
          select: {
            telecomLines: true,
            subscriptions: true,
            activities: true,
            tones: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch user" },
      { status: 500 }
    );
  }
}

// PATCH /api/users/[id] - Update user profile (ADMIN or self only)
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

    // Only ADMIN or self can update user
    if (session.user.role !== "ADMIN" && session.user.id !== id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const existingUser = await db.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await request.json();
    const { name, phone, image, role, isActive, organizationId, password } = body;

    // Only ADMIN can change role and active status
    const updateData: Record<string, unknown> = {};
    if (name !== undefined) updateData.name = name;
    if (phone !== undefined) updateData.phone = phone;
    if (image !== undefined) updateData.image = image;
    if (organizationId !== undefined) updateData.organizationId = organizationId;

    if (password) {
      updateData.password = await bcrypt.hash(password, 12);
    }

    // Only ADMIN can change role and active status
    if (session.user.role === "ADMIN") {
      if (role !== undefined) updateData.role = role;
      if (isActive !== undefined) updateData.isActive = isActive;
    }

    const user = await db.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        role: true,
        isActive: true,
        image: true,
        createdAt: true,
        updatedAt: true,
        organizationId: true,
      },
    });

    // Log activity
    await db.activity.create({
      data: {
        userId: session.user.id,
        type: password ? "PASSWORD_CHANGED" : "PROFILE_UPDATED",
        description: password ? "Password changed" : "Profile updated",
        metadata: JSON.stringify({ targetUserId: id }),
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.error("[USER_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}

// DELETE /api/users/[id] - Deactivate user (ADMIN only)
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

    const existingUser = await db.user.findUnique({ where: { id } });
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Don't allow deactivating yourself
    if (session.user.id === id) {
      return NextResponse.json(
        { error: "Cannot deactivate your own account" },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id },
      data: { isActive: false },
    });

    // Log activity
    await db.activity.create({
      data: {
        userId: session.user.id,
        type: "USER_DEACTIVATED",
        description: `Deactivated user: ${existingUser.email}`,
        metadata: JSON.stringify({ deactivatedUserId: id }),
      },
    });

    return NextResponse.json({ message: "User deactivated successfully" });
  } catch (error) {
    console.error("[USER_DELETE]", error);
    return NextResponse.json(
      { error: "Failed to deactivate user" },
      { status: 500 }
    );
  }
}
