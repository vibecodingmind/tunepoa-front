'use client';

import React from 'react';
import {
  Music,
  Phone,
  BarChart3,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  ArrowRight,
  Plus,
  Upload,
  Volume2,
  CheckCircle2,
  UserPlus,
  Play,
  Clock,
  Zap,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
} from 'recharts';
import { cn } from '@/lib/utils';

// ─── Mock Data ────────────────────────────────────────────────
const statsCards = [
  { title: 'Active Tones', value: '8', change: '+2 this month', trend: 'up' as const, icon: Music, color: 'from-teal-500 to-cyan-400' },
  { title: 'Phone Lines', value: '5', change: '+1 this week', trend: 'up' as const, icon: Phone, color: 'from-emerald-500 to-green-400' },
  { title: 'Total Calls', value: '1,233', change: '+12.5%', trend: 'up' as const, icon: BarChart3, color: 'from-violet-500 to-purple-400' },
  { title: 'Answer Rate', value: '89%', change: '+3.2%', trend: 'up' as const, icon: TrendingUp, color: 'from-amber-500 to-yellow-400' },
  { title: 'Subscription', value: 'Pro', change: 'Active', trend: 'up' as const, icon: CreditCard, color: 'from-rose-500 to-pink-400' },
  { title: 'Avg Listen Time', value: '24s', change: '-1.5s', trend: 'down' as const, icon: Clock, color: 'from-sky-500 to-blue-400' },
];

const callData = [
  { day: 'Mon', calls: 145, answered: 128 },
  { day: 'Tue', calls: 189, answered: 167 },
  { day: 'Wed', calls: 224, answered: 198 },
  { day: 'Thu', calls: 176, answered: 159 },
  { day: 'Fri', calls: 267, answered: 234 },
  { day: 'Sat', calls: 134, answered: 118 },
  { day: 'Sun', calls: 98, answered: 87 },
];

const weeklyTrends = [
  { week: 'W1', calls: 890 },
  { week: 'W2', calls: 1020 },
  { week: 'W3', calls: 1150 },
  { week: 'W4', calls: 1233 },
];

const toneUsage = [
  { name: 'Corporate', value: 4, color: '#14b8a6' },
  { name: 'Hospitality', value: 2, color: '#06b6d4' },
  { name: 'Retail', value: 1, color: '#8b5cf6' },
  { name: 'Healthcare', value: 1, color: '#f59e0b' },
];

const recentActivity = [
  { id: 1, icon: Volume2, iconBg: 'bg-teal-500/15', iconColor: 'text-teal-400', title: 'Tone assigned to +255 712 345 678', description: 'Corporate Welcome tone set as active', time: '2 hours ago' },
  { id: 2, icon: UserPlus, iconBg: 'bg-cyan-500/15', iconColor: 'text-cyan-400', title: 'New phone line added', description: '+255 789 012 345 - Vodacom', time: '5 hours ago' },
  { id: 3, icon: CheckCircle2, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', title: 'Subscription renewed', description: 'Pro Plan - TZS 57,000/month', time: '1 day ago' },
  { id: 4, icon: Upload, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', title: 'Custom tone uploaded', description: 'Holiday Greeting 2025 - 32s', time: '2 days ago' },
  { id: 5, icon: Play, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400', title: 'Tone preview played', description: 'Hospitality Welcome - 28s', time: '3 days ago' },
  { id: 6, icon: Zap, iconBg: 'bg-rose-500/15', iconColor: 'text-rose-400', title: 'Plan upgrade initiated', description: 'Considering Enterprise upgrade', time: '4 days ago' },
];

// ─── Custom Tooltip ───────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-sm">
      <p className="text-white/50 text-xs mb-1">{label}</p>
      {payload.map((entry: any, idx: number) => (
        <p key={idx} className="text-white font-medium">
          {entry.value.toLocaleString()} {entry.dataKey === 'calls' ? 'calls' : entry.dataKey === 'answered' ? 'answered' : entry.dataKey}
        </p>
      ))}
    </div>
  );
}

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back, James! 👋</h1>
          <p className="text-white/40 text-sm mt-1">Here&apos;s what&apos;s happening with your ringback tones today.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-white/[0.08] bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08]"
          >
            <Upload className="w-4 h-4 mr-2" />
            Upload Tone
          </Button>
          <Button className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
            <Plus className="w-4 h-4 mr-2" />
            Add Phone Line
          </Button>
        </div>
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
                <span className="text-white/30 text-xs ml-1">vs last period</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Call Analytics Chart */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Call Analytics</h3>
              <p className="text-white/40 text-xs mt-0.5">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-teal-500" />
                <span className="text-xs text-white/40">Total</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-500" />
                <span className="text-xs text-white/40">Answered</span>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={callData}>
              <defs>
                <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#06b6d4" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#06b6d4" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="day" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="calls" stroke="#14b8a6" strokeWidth={2} fill="url(#colorCalls)" />
              <Area type="monotone" dataKey="answered" stroke="#06b6d4" strokeWidth={2} fill="url(#colorAnswered)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Trends Bar Chart */}
        <div className="glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Weekly Call Trends</h3>
              <p className="text-white/40 text-xs mt-0.5">Last 4 weeks</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +12.5%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={weeklyTrends}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="week" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="calls" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tone Usage Distribution */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Tone Usage by Category</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={toneUsage}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {toneUsage.map((entry, idx) => (
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
            {toneUsage.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-white/50 text-xs">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Recent Activity</h3>
            <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 text-xs">
              View All
              <ArrowRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-3 max-h-80 overflow-y-auto">
            {recentActivity.map((activity) => {
              const Icon = activity.icon;
              return (
                <div key={activity.id} className="flex items-start gap-3 p-2 rounded-lg hover:bg-white/[0.03] transition-colors">
                  <div className={cn('flex items-center justify-center w-8 h-8 rounded-lg shrink-0', activity.iconBg)}>
                    <Icon className={cn('w-4 h-4', activity.iconColor)} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-medium truncate">{activity.title}</p>
                    <p className="text-white/30 text-xs truncate">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3 text-white/20" />
                    <span className="text-white/20 text-xs">{activity.time}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-white font-semibold mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-3 py-6 border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/20"
          >
            <Volume2 className="w-6 h-6" />
            <span className="font-medium">Assign Tone</span>
            <span className="text-xs text-white/30">Set a tone for a phone line</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-3 py-6 border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/20"
          >
            <Phone className="w-6 h-6" />
            <span className="font-medium">Add Phone Line</span>
            <span className="text-xs text-white/30">Register a new number</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-3 py-6 border-white/[0.08] bg-white/[0.04] text-white/70 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/20"
          >
            <Zap className="w-6 h-6" />
            <span className="font-medium">Upgrade Plan</span>
            <span className="text-xs text-white/30">Get more features</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
