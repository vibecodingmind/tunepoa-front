import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/admin/revenue - Revenue data for charts (ADMIN/MANAGER only)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (session.user.role !== "ADMIN" && session.user.role !== "MANAGER") {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const months = parseInt(searchParams.get("months") || "12");

    // Get paid invoices grouped by month
    const invoices = await db.invoice.findMany({
      where: { status: "paid" },
      orderBy: { paidAt: "desc" },
      take: 100,
    });

    // Group revenue by month
    const monthlyRevenue: Record<string, number> = {};
    const now = new Date();
    for (let i = months - 1; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
      monthlyRevenue[key] = 0;
    }

    invoices.forEach((invoice) => {
      if (invoice.paidAt) {
        const date = new Date(invoice.paidAt);
        const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
        if (key in monthlyRevenue) {
          monthlyRevenue[key] += invoice.amount;
        }
      }
    });

    const revenueChart = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
    }));

    // Payment status breakdown
    const [paid, pending, failed] = await Promise.all([
      db.invoice.count({ where: { status: "paid" } }),
      db.invoice.count({ where: { status: "pending" } }),
      db.invoice.count({ where: { status: "failed" } }),
    ]);

    // Revenue by plan
    const subscriptions = await db.subscription.findMany({
      where: { status: { in: ["ACTIVE", "TRIAL"] } },
      select: { planType: true, amount: true },
    });

    const revenueByPlan = {
      starter: subscriptions.filter((s) => s.planType === "STARTER").reduce((sum, s) => sum + s.amount, 0),
      pro: subscriptions.filter((s) => s.planType === "PRO").reduce((sum, s) => sum + s.amount, 0),
      enterprise: subscriptions.filter((s) => s.planType === "ENTERPRISE").reduce((sum, s) => sum + s.amount, 0),
    };

    // Recent transactions
    const recentTransactions = await db.invoice.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
      },
    });

    return NextResponse.json({
      revenueChart,
      paymentStatus: { paid, pending, failed },
      revenueByPlan,
      recentTransactions,
      mrr: Object.values(monthlyRevenue).pop() || 0,
      totalRevenue: Object.values(monthlyRevenue).reduce((a, b) => a + b, 0),
    });
  } catch (error) {
    console.error("[ADMIN_REVENUE_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch revenue data" },
      { status: 500 }
    );
  }
}
