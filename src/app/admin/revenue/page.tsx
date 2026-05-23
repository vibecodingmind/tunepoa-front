'use client';

import React from 'react';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Download,
  MoreHorizontal,
} from 'lucide-react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

// ─── Mock Data ────────────────────────────────────────────────
const summaryCards = [
  { title: 'MRR', value: 'TZS 45.2M', change: '+12.3%', trend: 'up' as const, icon: DollarSign, color: 'from-teal-500 to-cyan-400' },
  { title: 'Total Revenue', value: 'TZS 487M', change: '+28.5%', trend: 'up' as const, icon: TrendingUp, color: 'from-emerald-500 to-green-400' },
  { title: 'ARPU', value: 'TZS 13.7K', change: '+5.1%', trend: 'up' as const, icon: DollarSign, color: 'from-violet-500 to-purple-400' },
  { title: 'Churn Rate', value: '4.2%', change: '-0.8%', trend: 'down' as const, icon: TrendingDown, color: 'from-rose-500 to-pink-400' },
];

const revenueTrendData = [
  { month: 'Jun', revenue: 28500000, expenses: 18200000 },
  { month: 'Jul', revenue: 31200000, expenses: 19100000 },
  { month: 'Aug', revenue: 29800000, expenses: 18800000 },
  { month: 'Sep', revenue: 33500000, expenses: 19500000 },
  { month: 'Oct', revenue: 35800000, expenses: 20100000 },
  { month: 'Nov', revenue: 34200000, expenses: 19800000 },
  { month: 'Dec', revenue: 38100000, expenses: 21500000 },
  { month: 'Jan', revenue: 39500000, expenses: 22000000 },
  { month: 'Feb', revenue: 37800000, expenses: 21200000 },
  { month: 'Mar', revenue: 41200000, expenses: 22800000 },
  { month: 'Apr', revenue: 43500000, expenses: 23500000 },
  { month: 'May', revenue: 45200000, expenses: 24100000 },
];

const revenueByPlan = [
  { plan: 'Starter', monthly: 343000, annual: 588000 },
  { plan: 'Pro', monthly: 894000, annual: 1428000 },
  { plan: 'Enterprise', monthly: 1200000, annual: 4800000 },
];

const paymentStatus = [
  { name: 'Paid', value: 2890, color: '#10b981' },
  { name: 'Pending', value: 234, color: '#f59e0b' },
  { name: 'Failed', value: 67, color: '#ef4444' },
];

const recentTransactions = [
  { id: 'TXN-001', user: 'Vodacom Tanzania', amount: 'TZS 149,000', plan: 'Pro', status: 'Paid', date: '2025-05-22' },
  { id: 'TXN-002', user: 'Safaricom Kenya', amount: 'TZS 1,200,000', plan: 'Enterprise', status: 'Paid', date: '2025-05-21' },
  { id: 'TXN-003', user: 'Airtel Tanzania', amount: 'TZS 49,000', plan: 'Starter', status: 'Pending', date: '2025-05-21' },
  { id: 'TXN-004', user: 'MTN Nigeria', amount: 'TZS 49,000', plan: 'Starter', status: 'Failed', date: '2025-05-20' },
  { id: 'TXN-005', user: 'Tigo Tanzania', amount: 'TZS 149,000', plan: 'Pro', status: 'Paid', date: '2025-05-20' },
  { id: 'TXN-006', user: 'Safaricom Kenya', amount: 'TZS 1,200,000', plan: 'Enterprise', status: 'Paid', date: '2025-05-19' },
  { id: 'TXN-007', user: 'Vodacom Tanzania', amount: 'TZS 149,000', plan: 'Pro', status: 'Paid', date: '2025-05-18' },
  { id: 'TXN-008', user: 'Zantel Tanzania', amount: 'TZS 149,000', plan: 'Pro', status: 'Pending', date: '2025-05-17' },
  { id: 'TXN-009', user: 'Telkom Kenya', amount: 'TZS 49,000', plan: 'Starter', status: 'Failed', date: '2025-05-16' },
  { id: 'TXN-010', user: 'Safaricom Kenya', amount: 'TZS 149,000', plan: 'Pro', status: 'Paid', date: '2025-05-15' },
];

const txnStatusStyles: Record<string, string> = {
  Paid: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Failed: 'bg-red-500/20 text-red-400 border-red-500/30',
};

function formatTZS(value: number) {
  if (value >= 1000000) return `TZS ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `TZS ${(value / 1000).toFixed(0)}K`;
  return `TZS ${value}`;
}

function CustomTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-sm">
      <p className="text-white/50 text-xs mb-1">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <p key={idx} style={{ color: entry.color }} className="font-medium">
          {entry.name}: {formatter ? formatter(entry.value) : entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Revenue Analytics</h1>
          <p className="text-white/40 text-sm mt-1">Track platform revenue, payments, and financial metrics</p>
        </div>
        <Button variant="outline" className="border-white/[0.08] text-white/60 hover:text-white hover:bg-white/[0.06] hover:border-white/[0.12]">
          <Download className="w-4 h-4 mr-2" /> Export Report
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.title} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/40 text-sm">{stat.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center opacity-80`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-emerald-400" />
                )}
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-emerald-400'}`}>
                  {stat.change}
                </span>
                <span className="text-white/30 text-xs ml-1">vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue Trend */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Revenue Trend</h3>
              <p className="text-white/40 text-xs mt-0.5">Last 12 months — Revenue vs Expenses</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={revenueTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip formatter={formatTZS} />} />
              <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} dot={false} name="Revenue" />
              <Line type="monotone" dataKey="expenses" stroke="#f59e0b" strokeWidth={2} dot={false} name="Expenses" strokeDasharray="5 5" />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-teal-500 rounded" /><span className="text-white/40 text-xs">Revenue</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-0.5 bg-amber-500 rounded" style={{ borderTop: '1px dashed' }} /><span className="text-white/40 text-xs">Expenses</span></div>
          </div>
        </div>

        {/* Revenue by Plan */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Revenue by Plan</h3>
              <p className="text-white/40 text-xs mt-0.5">Monthly vs Annual breakdown</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={revenueByPlan}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="plan" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(1)}M`} />
              <Tooltip content={<CustomTooltip formatter={formatTZS} />} />
              <Bar dataKey="monthly" fill="#14b8a6" radius={[4, 4, 0, 0]} name="Monthly" />
              <Bar dataKey="annual" fill="#06b6d4" radius={[4, 4, 0, 0]} name="Annual" />
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center justify-center gap-6 mt-2">
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-teal-500" /><span className="text-white/40 text-xs">Monthly</span></div>
            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-sm bg-cyan-500" /><span className="text-white/40 text-xs">Annual</span></div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Payment Status Pie */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Payment Status</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={paymentStatus} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={4} dataKey="value">
                {paymentStatus.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} itemStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {paymentStatus.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-white/40 text-xs">{item.name} ({item.value.toLocaleString()})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Transactions</h3>
            <Button variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/[0.06] text-xs">View All</Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="h-9 px-3 text-left text-xs font-medium text-white/40">ID</th>
                  <th className="h-9 px-3 text-left text-xs font-medium text-white/40">User</th>
                  <th className="h-9 px-3 text-left text-xs font-medium text-white/40">Plan</th>
                  <th className="h-9 px-3 text-left text-xs font-medium text-white/40">Amount</th>
                  <th className="h-9 px-3 text-left text-xs font-medium text-white/40">Status</th>
                  <th className="h-9 px-3 text-left text-xs font-medium text-white/40">Date</th>
                </tr>
              </thead>
              <tbody>
                {recentTransactions.map((txn) => (
                  <tr key={txn.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-3 py-2.5 text-white/40 text-xs font-mono">{txn.id}</td>
                    <td className="px-3 py-2.5 text-white text-sm">{txn.user}</td>
                    <td className="px-3 py-2.5 text-white/60 text-sm">{txn.plan}</td>
                    <td className="px-3 py-2.5 text-white text-sm font-medium">{txn.amount}</td>
                    <td className="px-3 py-2.5"><Badge className={txnStatusStyles[txn.status]}>{txn.status}</Badge></td>
                    <td className="px-3 py-2.5 text-white/40 text-sm">{txn.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
