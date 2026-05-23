'use client';

import React from 'react';
import {
  Music,
  Phone,
  BarChart3,
  CreditCard,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Plus,
  Upload,
  Zap,
  Clock,
  Play,
  UserPlus,
  Volume2,
  CheckCircle2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from 'recharts';

const callData = [
  { day: 'Mon', calls: 145, answered: 128 },
  { day: 'Tue', calls: 189, answered: 167 },
  { day: 'Wed', calls: 224, answered: 198 },
  { day: 'Thu', calls: 176, answered: 159 },
  { day: 'Fri', calls: 267, answered: 234 },
  { day: 'Sat', calls: 134, answered: 118 },
  { day: 'Sun', calls: 98, answered: 87 },
];

const recentActivity = [
  {
    id: 1,
    icon: Volume2,
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
    title: 'Tone assigned to +255 712 345 678',
    description: 'Corporate Welcome tone set as active',
    time: '2 hours ago',
  },
  {
    id: 2,
    icon: UserPlus,
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    title: 'New phone line added',
    description: '+255 789 012 345 - Vodacom',
    time: '5 hours ago',
  },
  {
    id: 3,
    icon: CheckCircle2,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    title: 'Subscription renewed',
    description: 'Pro Plan - TZS 57,000/month',
    time: '1 day ago',
  },
  {
    id: 4,
    icon: Upload,
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    title: 'Custom tone uploaded',
    description: 'Holiday Greeting 2025 - 32s',
    time: '2 days ago',
  },
  {
    id: 5,
    icon: Play,
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    title: 'Tone preview played',
    description: 'Hospitality Welcome - 28s',
    time: '3 days ago',
  },
];

const stats = [
  {
    title: 'Active Tones',
    value: '8',
    change: '+2',
    trend: 'up' as const,
    icon: Music,
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
  },
  {
    title: 'Phone Lines',
    value: '5',
    change: '+1',
    trend: 'up' as const,
    icon: Phone,
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
  },
  {
    title: 'Total Calls This Month',
    value: '1,233',
    change: '+12.5%',
    trend: 'up' as const,
    icon: BarChart3,
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
  },
  {
    title: 'Subscription Status',
    value: 'Active',
    change: 'Pro Plan',
    trend: 'up' as const,
    icon: CreditCard,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
  },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Welcome back, James! 👋
          </h1>
          <p className="text-slate-400 mt-1">
            Here&apos;s what&apos;s happening with your ringback tones today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
          >
            <Upload className="size-4 mr-2" />
            Upload Tone
          </Button>
          <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg shadow-teal-500/20">
            <Plus className="size-4 mr-2" />
            Add Phone Line
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.title}
            className="glass-card rounded-xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={cn('flex items-center justify-center size-10 rounded-lg', stat.iconBg)}>
                <stat.icon className={cn('size-5', stat.iconColor)} />
              </div>
              <Badge
                variant="secondary"
                className={cn(
                  'text-[10px] font-medium border-0',
                  stat.trend === 'up'
                    ? 'bg-emerald-500/10 text-emerald-400'
                    : 'bg-red-500/10 text-red-400'
                )}
              >
                {stat.trend === 'up' ? (
                  <TrendingUp className="size-3 mr-0.5" />
                ) : (
                  <TrendingDown className="size-3 mr-0.5" />
                )}
                {stat.change}
              </Badge>
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-sm text-slate-400 mt-1">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Charts and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Call Analytics Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Call Analytics</h3>
              <p className="text-sm text-slate-400">Last 7 days performance</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-teal-500" />
                <span className="text-xs text-slate-400">Total Calls</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="size-3 rounded-full bg-cyan-500" />
                <span className="text-xs text-slate-400">Answered</span>
              </div>
            </div>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={callData}>
                <defs>
                  <linearGradient id="colorCalls" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14b8a6" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#14b8a6" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorAnswered" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis
                  dataKey="day"
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.3)"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'rgba(10, 22, 40, 0.95)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '8px',
                    color: '#fff',
                    boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="calls"
                  stroke="#14b8a6"
                  strokeWidth={2}
                  fill="url(#colorCalls)"
                />
                <Area
                  type="monotone"
                  dataKey="answered"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  fill="url(#colorAnswered)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-semibold text-white">Recent Activity</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 text-xs"
            >
              View All
              <ArrowRight className="size-3 ml-1" />
            </Button>
          </div>
          <div className="space-y-4 max-h-[340px] overflow-y-auto pr-1">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <div
                  className={cn(
                    'flex items-center justify-center size-9 rounded-lg shrink-0',
                    activity.iconBg
                  )}
                >
                  <activity.icon className={cn('size-4', activity.iconColor)} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {activity.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">
                    {activity.description}
                  </p>
                </div>
                <span className="text-[10px] text-slate-500 shrink-0 mt-1">
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="glass-card rounded-xl p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto flex-col gap-3 py-6 border-white/10 bg-white/5 text-slate-300 hover:bg-teal-500/10 hover:text-teal-400 hover:border-teal-500/20"
          >
            <Volume2 className="size-6" />
            <span className="font-medium">Assign Tone</span>
            <span className="text-xs text-slate-500">Set a tone for a phone line</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-3 py-6 border-white/10 bg-white/5 text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-400 hover:border-cyan-500/20"
          >
            <Phone className="size-6" />
            <span className="font-medium">Add Phone Line</span>
            <span className="text-xs text-slate-500">Register a new number</span>
          </Button>
          <Button
            variant="outline"
            className="h-auto flex-col gap-3 py-6 border-white/10 bg-white/5 text-slate-300 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/20"
          >
            <Zap className="size-6" />
            <span className="font-medium">Upgrade Plan</span>
            <span className="text-xs text-slate-500">Get more features</span>
          </Button>
        </div>
      </div>
    </div>
  );
}


