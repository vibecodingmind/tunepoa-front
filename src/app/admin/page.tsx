'use client';

import React from 'react';
import {
  Users,
  CreditCard,
  DollarSign,
  Phone,
  Library,
  UserPlus,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
} from 'lucide-react';
import {
  AreaChart,
  Area,
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
  Legend,
} from 'recharts';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

// ─── Mock Data ────────────────────────────────────────────────
const statsCards = [
  { title: 'Total Users', value: '12,847', change: '+12.5%', trend: 'up' as const, icon: Users, color: 'from-teal-500 to-cyan-400' },
  { title: 'Active Subscriptions', value: '3,291', change: '+8.2%', trend: 'up' as const, icon: CreditCard, color: 'from-emerald-500 to-green-400' },
  { title: 'Monthly Revenue', value: 'TZS 45.2M', change: '+15.3%', trend: 'up' as const, icon: DollarSign, color: 'from-violet-500 to-purple-400' },
  { title: 'Total Phone Lines', value: '8,432', change: '+6.7%', trend: 'up' as const, icon: Phone, color: 'from-amber-500 to-yellow-400' },
  { title: 'Total Tones', value: '1,256', change: '+3.1%', trend: 'up' as const, icon: Library, color: 'from-rose-500 to-pink-400' },
  { title: 'New Signups This Month', value: '482', change: '-2.4%', trend: 'down' as const, icon: UserPlus, color: 'from-sky-500 to-blue-400' },
];

const revenueData = [
  { month: 'Jun', revenue: 28500000 },
  { month: 'Jul', revenue: 31200000 },
  { month: 'Aug', revenue: 29800000 },
  { month: 'Sep', revenue: 33500000 },
  { month: 'Oct', revenue: 35800000 },
  { month: 'Nov', revenue: 34200000 },
  { month: 'Dec', revenue: 38100000 },
  { month: 'Jan', revenue: 39500000 },
  { month: 'Feb', revenue: 37800000 },
  { month: 'Mar', revenue: 41200000 },
  { month: 'Apr', revenue: 43500000 },
  { month: 'May', revenue: 45200000 },
];

const userGrowthData = [
  { month: 'Dec', users: 9200 },
  { month: 'Jan', users: 9850 },
  { month: 'Feb', users: 10400 },
  { month: 'Mar', users: 11100 },
  { month: 'Apr', users: 12000 },
  { month: 'May', users: 12847 },
];

const subscriptionDistribution = [
  { name: 'Starter', value: 1840, color: '#14b8a6' },
  { name: 'Pro', value: 1120, color: '#06b6d4' },
  { name: 'Enterprise', value: 331, color: '#8b5cf6' },
];

const recentSignups = [
  { name: 'Amina Hassan', email: 'amina@vodacom.co.tz', org: 'Vodacom Tanzania', plan: 'Pro', date: '2 hours ago' },
  { name: 'Joseph Mwangi', email: 'joseph@safaricom.ke', org: 'Safaricom Kenya', plan: 'Enterprise', date: '5 hours ago' },
  { name: 'Fatima Abubakar', email: 'fatima@airtel.co.tz', org: 'Airtel Tanzania', plan: 'Starter', date: '1 day ago' },
  { name: 'David Okafor', email: 'david@mtn.ng', org: 'MTN Nigeria', plan: 'Pro', date: '1 day ago' },
  { name: 'Grace Mrema', email: 'grace@tigo.co.tz', org: 'Tigo Tanzania', plan: 'Starter', date: '2 days ago' },
];

const recentActivities = [
  { user: 'Admin User', action: 'Approved tone "Serenade of Dar"', time: '10 min ago', type: 'approve' },
  { user: 'Amina Hassan', action: 'Upgraded to Pro plan', time: '25 min ago', type: 'upgrade' },
  { user: 'System', action: 'Monthly billing cycle completed', time: '1 hour ago', type: 'system' },
  { user: 'Joseph Mwangi', action: 'Uploaded 3 new tones', time: '2 hours ago', type: 'upload' },
  { user: 'Fatima Abubakar', action: 'New signup from Airtel Tanzania', time: '3 hours ago', type: 'signup' },
  { user: 'Admin User', action: 'Updated pricing for Starter plan', time: '4 hours ago', type: 'settings' },
  { user: 'David Okafor', action: 'Added 5 phone lines', time: '5 hours ago', type: 'lines' },
  { user: 'System', action: 'Auto-renewal for 142 subscriptions', time: '6 hours ago', type: 'system' },
  { user: 'Grace Mrema', action: 'Submitted support ticket #482', time: '8 hours ago', type: 'support' },
  { user: 'Admin User', action: 'Rejected tone "Loud Beats v2"', time: '10 hours ago', type: 'reject' },
];

const activityTypeConfig: Record<string, { color: string; icon: string }> = {
  approve: { color: 'text-emerald-400', icon: '✓' },
  upgrade: { color: 'text-teal-400', icon: '↑' },
  system: { color: 'text-sky-400', icon: '⚙' },
  upload: { color: 'text-violet-400', icon: '↑' },
  signup: { color: 'text-cyan-400', icon: '+' },
  settings: { color: 'text-amber-400', icon: '⚙' },
  lines: { color: 'text-rose-400', icon: '☎' },
  support: { color: 'text-orange-400', icon: '?' },
  reject: { color: 'text-red-400', icon: '✗' },
};

function formatTZS(value: number) {
  if (value >= 1000000) return `TZS ${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `TZS ${(value / 1000).toFixed(0)}K`;
  return `TZS ${value}`;
}

// ─── Custom Tooltip ───────────────────────────────────────────
function CustomTooltip({ active, payload, label, formatter }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-sm">
      <p className="text-white/50 text-xs mb-1">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <p key={idx} className="text-white font-medium">
          {formatter ? formatter(entry.value) : entry.value.toLocaleString()}
        </p>
      ))}
    </div>
  );
}

export default function AdminOverviewPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard Overview</h1>
        <p className="text-white/40 text-sm mt-1">Platform-wide analytics and insights</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((stat) => {
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
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span className={`text-sm font-medium ${stat.trend === 'up' ? 'text-emerald-400' : 'text-red-400'}`}>
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
        {/* Revenue Chart */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Revenue Trend</h3>
              <p className="text-white/40 text-xs mt-0.5">Last 12 months</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +15.3%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip formatter={formatTZS} />} />
              <Area type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={2} fill="url(#revenueGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User Growth Chart */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">User Growth</h3>
              <p className="text-white/40 text-xs mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={userGrowthData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip formatter={(v: number) => v.toLocaleString() + ' users'} />} />
              <Bar dataKey="users" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Subscription Distribution */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Subscription Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={subscriptionDistribution}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {subscriptionDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }}
                itemStyle={{ color: '#fff' }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-6 mt-2">
            {subscriptionDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-white/50 text-xs">{item.name} ({item.value.toLocaleString()})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Signups */}
        <div className="glass-card rounded-xl p-5 lg:col-span-1">
          <h3 className="text-white font-semibold mb-4">Recent Signups</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentSignups.map((user, idx) => (
              <div key={idx} className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                <Avatar className="h-9 w-9 border border-white/10">
                  <AvatarFallback className="bg-gradient-to-br from-teal-600/40 to-cyan-500/40 text-white text-xs">
                    {user.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-white text-sm font-medium truncate">{user.name}</p>
                  <p className="text-white/30 text-xs truncate">{user.org}</p>
                </div>
                <div className="text-right shrink-0">
                  <Badge
                    className={
                      user.plan === 'Enterprise'
                        ? 'bg-violet-500/20 text-violet-400 border-violet-500/30'
                        : user.plan === 'Pro'
                          ? 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30'
                          : 'bg-teal-500/20 text-teal-400 border-teal-500/30'
                    }
                  >
                    {user.plan}
                  </Badge>
                  <p className="text-white/20 text-[10px] mt-0.5">{user.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-5 lg:col-span-1">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivities.map((activity, idx) => {
              const config = activityTypeConfig[activity.type] || { color: 'text-white/50', icon: '•' };
              return (
                <div key={idx} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${config.color} bg-white/[0.04]`}>
                    {config.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white/70 text-sm">
                      <span className="text-white font-medium">{activity.user}</span> {activity.action}
                    </p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <Clock className="w-3 h-3 text-white/20" />
                      <span className="text-white/20 text-xs">{activity.time}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
