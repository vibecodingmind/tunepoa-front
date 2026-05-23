import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/subscriptions - Get current user's subscription
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscription = await db.subscription.findFirst({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      include: {
        organization: {
          select: { id: true, name: true },
        },
        invoices: {
          orderBy: { createdAt: "desc" },
          take: 5,
        },
      },
    });

    if (!subscription) {
      return NextResponse.json({ subscription: null });
    }

    return NextResponse.json({ subscription });
  } catch (error) {
    console.error("[SUBSCRIPTIONS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch subscription" },
      { status: 500 }
    );
  }
}

// POST /api/subscriptions - Create/upgrade subscription
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { planType, billingPeriod, organizationId } = body;

    if (!planType) {
      return NextResponse.json(
        { error: "Plan type is required" },
        { status: 400 }
      );
    }

    // Check for existing active subscription
    const existingSub = await db.subscription.findFirst({
      where: {
        userId: session.user.id,
        status: { in: ["ACTIVE", "TRIAL"] },
      },
    });

    if (existingSub) {
      // Upgrade/downgrade existing subscription
      const planLimits: Record<string, { maxUsers: number; maxLines: number; amount: number }> = {
        STARTER: { maxUsers: 1, maxLines: 1, amount: 20000 },
        PRO: { maxUsers: 3, maxLines: 5, amount: 57000 },
        ENTERPRISE: { maxUsers: 50, maxLines: 100, amount: 0 },
      };

      const limits = planLimits[planType] || planLimits.STARTER;
      const isUpgrade = planType !== existingSub.planType;

      const subscription = await db.subscription.update({
        where: { id: existingSub.id },
        data: {
          planType,
          billingPeriod: billingPeriod || existingSub.billingPeriod,
          amount: limits.amount,
          maxUsers: limits.maxUsers,
          maxLines: limits.maxLines,
          status: "ACTIVE",
          currentPeriodStart: new Date(),
          currentPeriodEnd: new Date(
            new Date().setMonth(
              new Date().getMonth() +
                (billingPeriod === "ANNUALLY" ? 12 : 1)
            )
          ),
        },
      });

      // Log activity
      await db.activity.create({
        data: {
          userId: session.user.id,
          type: isUpgrade ? "PLAN_UPGRADED" : "PLAN_DOWNGRADED",
          description: `${isUpgrade ? "Upgraded" : "Changed"} subscription to ${planType}`,
          metadata: JSON.stringify({ subscriptionId: subscription.id, planType }),
        },
      });

      return NextResponse.json(subscription);
    }

    // Create new subscription
    const planLimits: Record<string, { maxUsers: number; maxLines: number; amount: number }> = {
      STARTER: { maxUsers: 1, maxLines: 1, amount: 20000 },
      PRO: { maxUsers: 3, maxLines: 5, amount: 57000 },
      ENTERPRISE: { maxUsers: 50, maxLines: 100, amount: 0 },
    };

    const limits = planLimits[planType] || planLimits.STARTER;

    const subscription = await db.subscription.create({
      data: {
        userId: session.user.id,
        planType,
        billingPeriod: billingPeriod || "MONTHLY",
        status: "TRIAL",
        amount: limits.amount,
        maxUsers: limits.maxUsers,
        maxLines: limits.maxLines,
        organizationId: organizationId || session.user.organizationId,
        currentPeriodStart: new Date(),
        currentPeriodEnd: new Date(
          new Date().setDate(new Date().getDate() + 14) // 14-day trial
        ),
      },
    });

    // Log activity
    await db.activity.create({
      data: {
        userId: session.user.id,
        type: "PLAN_UPGRADED",
        description: `Subscribed to ${planType} plan`,
        metadata: JSON.stringify({ subscriptionId: subscription.id, planType }),
      },
    });

    return NextResponse.json(subscription, { status: 201 });
  } catch (error) {
    console.error("[SUBSCRIPTIONS_POST]", error);
    return NextResponse.json(
      { error: "Failed to create subscription" },
      { status: 500 }
    );
  }
}
