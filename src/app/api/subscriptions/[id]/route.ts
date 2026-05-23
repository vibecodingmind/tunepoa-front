import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// PATCH /api/subscriptions/[id] - Update subscription (change plan, cancel)
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

    const existingSub = await db.subscription.findUnique({ where: { id } });
    if (!existingSub) {
      return NextResponse.json({ error: "Subscription not found" }, { status: 404 });
    }

    // Only owner or admin can update
    if (session.user.role !== "ADMIN" && existingSub.userId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await request.json();
    const { planType, billingPeriod, status } = body;

    const updateData: Record<string, unknown> = {};

    if (planType) {
      const planLimits: Record<string, { maxUsers: number; maxLines: number; amount: number }> = {
        STARTER: { maxUsers: 1, maxLines: 1, amount: 20000 },
        PRO: { maxUsers: 3, maxLines: 5, amount: 57000 },
        ENTERPRISE: { maxUsers: 50, maxLines: 100, amount: 0 },
      };
      const limits = planLimits[planType] || planLimits.STARTER;
      updateData.planType = planType;
      updateData.maxUsers = limits.maxUsers;
      updateData.maxLines = limits.maxLines;
      updateData.amount = limits.amount;
    }

    if (billingPeriod) {
      updateData.billingPeriod = billingPeriod;
    }

    if (status) {
      updateData.status = status;

      if (status === "CANCELLED") {
        updateData.cancelledAt = new Date();
      }
    }

    const subscription = await db.subscription.update({
      where: { id },
      data: updateData,
    });

    // Log activity
    const activityType = status === "CANCELLED" ? "PLAN_DOWNGRADED" : planType ? "PLAN_UPGRADED" : "PROFILE_UPDATED";
    await db.activity.create({
      data: {
        userId: session.user.id,
        type: activityType,
        description: status === "CANCELLED"
          ? "Cancelled subscription"
          : `Updated subscription to ${planType || existingSub.planType}`,
        metadata: JSON.stringify({ subscriptionId: id }),
      },
    });

    return NextResponse.json(subscription);
  } catch (error) {
    console.error("[SUBSCRIPTION_PATCH]", error);
    return NextResponse.json(
      { error: "Failed to update subscription" },
      { status: 500 }
    );
  }
}
