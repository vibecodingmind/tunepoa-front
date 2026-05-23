import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/stats - Platform-wide statistics (ADMIN/MANAGER only)
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const [
      totalUsers,
      activeSubscriptions,
      trialSubscriptions,
      totalLines,
      totalTones,
      totalRevenue,
      newUsersThisMonth,
      contactMessages,
    ] = await Promise.all([
      db.user.count(),
      db.subscription.count({ where: { status: "ACTIVE" } }),
      db.subscription.count({ where: { status: "TRIAL" } }),
      db.telecomLine.count(),
      db.tone.count({ where: { status: "APPROVED" } }),
      db.invoice.aggregate({ where: { status: "paid" }, _sum: { amount: true } }),
      db.user.count({
        where: {
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      db.contactMessage.count({ where: { status: "new" } }),
    ]);

    // Get users by role
    const adminCount = await db.user.count({ where: { role: "ADMIN" } });
    const managerCount = await db.user.count({ where: { role: "MANAGER" } });
    const clientCount = await db.user.count({ where: { role: "CLIENT" } });

    // Get subscription distribution
    const starterCount = await db.subscription.count({ where: { planType: "STARTER" } });
    const proCount = await db.subscription.count({ where: { planType: "PRO" } });
    const enterpriseCount = await db.subscription.count({ where: { planType: "ENTERPRISE" } });

    return NextResponse.json({
      totalUsers,
      activeSubscriptions,
      trialSubscriptions,
      totalLines,
      totalTones,
      totalRevenue: totalRevenue._sum.amount || 0,
      newUsersThisMonth,
      unreadMessages: contactMessages,
      usersByRole: {
        admin: adminCount,
        manager: managerCount,
        client: clientCount,
      },
      subscriptionsByPlan: {
        starter: starterCount,
        pro: proCount,
        enterprise: enterpriseCount,
      },
    });
  } catch (error) {
    console.error("[ADMIN_STATS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch stats" },
      { status: 500 }
    );
  }
}
