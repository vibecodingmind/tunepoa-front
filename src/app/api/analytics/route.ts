import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";

// GET /api/analytics - Get call analytics for current user's lines (with date range filter)
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const lineId = searchParams.get("lineId");

    // Get user's lines
    const userLines = await db.telecomLine.findMany({
      where: { userId: session.user.id },
      select: { id: true, number: true, provider: true, label: true },
    });

    const lineIds = userLines.map((l) => l.id);

    if (lineIds.length === 0) {
      return NextResponse.json({
        analytics: [],
        summary: {
          totalCalls: 0,
          avgWaitTime: 0,
          avgRetentionRate: 0,
          totalLines: 0,
        },
        lines: [],
      });
    }

    const where: Record<string, unknown> = {
      telecomLineId: lineId ? lineId : { in: lineIds },
    };

    if (startDate || endDate) {
      where.date = {};
      if (startDate) (where.date as Record<string, unknown>).gte = new Date(startDate);
      if (endDate) (where.date as Record<string, unknown>).lte = new Date(endDate);
    }

    const analytics = await db.callAnalytic.findMany({
      where,
      orderBy: { date: "desc" },
      include: {
        telecomLine: {
          select: { id: true, number: true, provider: true, label: true },
        },
      },
    });

    // Calculate summary
    const summary = {
      totalCalls: analytics.reduce((sum, a) => sum + a.totalCalls, 0),
      avgWaitTime: analytics.length > 0
        ? Math.round(analytics.reduce((sum, a) => sum + a.avgWaitTime, 0) / analytics.length)
        : 0,
      avgRetentionRate: analytics.length > 0
        ? Math.round(analytics.reduce((sum, a) => sum + a.retentionRate, 0) / analytics.length * 100) / 100
        : 0,
      totalLines: lineIds.length,
    };

    return NextResponse.json({
      analytics,
      summary,
      lines: userLines,
    });
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
