'use client';

import React, { useState } from 'react';
import {
  Activity,
  LogIn,
  LogOut,
  Music,
  Phone,
  CreditCard,
  Upload,
  Settings,
  Shield,
  UserPlus,
  Volume2,
  Power,
  Search,
  Filter,
  ChevronDown,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

type ActivityType =
  | 'login'
  | 'tone_assigned'
  | 'tone_uploaded'
  | 'line_activated'
  | 'line_deactivated'
  | 'subscription_changed'
  | 'settings_updated'
  | 'security_changed';

interface ActivityEntry {
  id: number;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

const activityTypeConfig: Record<ActivityType, { icon: React.ElementType; iconBg: string; iconColor: string; label: string; badgeBg: string; badgeColor: string }> = {
  login: {
    icon: LogIn,
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
    label: 'Login',
    badgeBg: 'bg-teal-500/10',
    badgeColor: 'text-teal-400',
  },
  tone_assigned: {
    icon: Volume2,
    iconBg: 'bg-cyan-500/15',
    iconColor: 'text-cyan-400',
    label: 'Tone Assigned',
    badgeBg: 'bg-cyan-500/10',
    badgeColor: 'text-cyan-400',
  },
  tone_uploaded: {
    icon: Upload,
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    label: 'Tone Uploaded',
    badgeBg: 'bg-violet-500/10',
    badgeColor: 'text-violet-400',
  },
  line_activated: {
    icon: Phone,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
    label: 'Line Activated',
    badgeBg: 'bg-emerald-500/10',
    badgeColor: 'text-emerald-400',
  },
  line_deactivated: {
    icon: Power,
    iconBg: 'bg-red-500/15',
    iconColor: 'text-red-400',
    label: 'Line Deactivated',
    badgeBg: 'bg-red-500/10',
    badgeColor: 'text-red-400',
  },
  subscription_changed: {
    icon: CreditCard,
    iconBg: 'bg-amber-500/15',
    iconColor: 'text-amber-400',
    label: 'Subscription',
    badgeBg: 'bg-amber-500/10',
    badgeColor: 'text-amber-400',
  },
  settings_updated: {
    icon: Settings,
    iconBg: 'bg-slate-500/15',
    iconColor: 'text-slate-400',
    label: 'Settings',
    badgeBg: 'bg-slate-500/10',
    badgeColor: 'text-slate-400',
  },
  security_changed: {
    icon: Shield,
    iconBg: 'bg-rose-500/15',
    iconColor: 'text-rose-400',
    label: 'Security',
    badgeBg: 'bg-rose-500/10',
    badgeColor: 'text-rose-400',
  },
};

const allActivities: ActivityEntry[] = [
  { id: 1, type: 'login', title: 'Logged in from Dar es Salaam', description: 'Chrome on macOS - IP: 197.250.x.x', timestamp: '10 minutes ago' },
  { id: 2, type: 'tone_assigned', title: 'Tone assigned to +255 712 345 678', description: 'Corporate Welcome set as active tone', timestamp: '2 hours ago' },
  { id: 3, type: 'line_activated', title: 'Phone line activated', description: '+255 789 012 345 - Vodacom', timestamp: '5 hours ago' },
  { id: 4, type: 'subscription_changed', title: 'Subscription renewed', description: 'Pro Plan - TZS 57,000/month', timestamp: '1 day ago' },
  { id: 5, type: 'tone_uploaded', title: 'Custom tone uploaded', description: 'Holiday Greeting 2025 - 32s', timestamp: '2 days ago' },
  { id: 6, type: 'settings_updated', title: 'Notification preferences updated', description: 'Email notifications enabled for billing', timestamp: '2 days ago' },
  { id: 7, type: 'security_changed', title: 'Password changed', description: 'Password updated successfully', timestamp: '3 days ago' },
  { id: 8, type: 'login', title: 'Logged in from mobile app', description: 'iOS App - Dar es Salaam', timestamp: '3 days ago' },
  { id: 9, type: 'tone_assigned', title: 'Tone assigned to +254 722 456 789', description: 'Retail Jingle set as active tone', timestamp: '4 days ago' },
  { id: 10, type: 'line_deactivated', title: 'Phone line deactivated', description: '+255 654 789 012 - Telkom', timestamp: '5 days ago' },
  { id: 11, type: 'tone_uploaded', title: 'Custom tone uploaded', description: 'Startup Vibes - 20s', timestamp: '1 week ago' },
  { id: 12, type: 'subscription_changed', title: 'Plan upgraded', description: 'Starter → Pro Plan', timestamp: '1 week ago' },
  { id: 13, type: 'login', title: 'Logged in from Arusha', description: 'Firefox on Windows', timestamp: '1 week ago' },
  { id: 14, type: 'settings_updated', title: 'Profile information updated', description: 'Phone number and organization changed', timestamp: '2 weeks ago' },
  { id: 15, type: 'tone_assigned', title: 'Tone assigned to +255 689 234 567', description: 'Finance Professional set as active tone', timestamp: '2 weeks ago' },
  { id: 16, type: 'line_activated', title: 'Phone line activated', description: '+254 722 456 789 - Safaricom', timestamp: '3 weeks ago' },
];

const activityFilterOptions: { value: string; label: string }[] = [
  { value: 'all', label: 'All Activities' },
  { value: 'login', label: 'Login' },
  { value: 'tone_assigned', label: 'Tone Assigned' },
  { value: 'tone_uploaded', label: 'Tone Uploaded' },
  { value: 'line_activated', label: 'Line Activated' },
  { value: 'line_deactivated', label: 'Line Deactivated' },
  { value: 'subscription_changed', label: 'Subscription' },
  { value: 'settings_updated', label: 'Settings' },
  { value: 'security_changed', label: 'Security' },
];

export default function ActivityPage() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [visibleCount, setVisibleCount] = useState(10);

  const filteredActivities = allActivities.filter((activity) => {
    const matchesFilter = filter === 'all' || activity.type === filter;
    const matchesSearch =
      activity.title.toLowerCase().includes(search.toLowerCase()) ||
      activity.description.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const visibleActivities = filteredActivities.slice(0, visibleCount);
  const hasMore = visibleCount < filteredActivities.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-slate-400 mt-1">
          Track all actions and events on your account
        </p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <Input
            placeholder="Search activities..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-white/10 text-slate-300 placeholder:text-slate-500 focus-visible:border-teal-500/50 pl-9"
          />
        </div>
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[200px] bg-white/5 border-white/10 text-slate-300">
            <Filter className="size-4 mr-2 text-slate-500" />
            <SelectValue />
          </SelectTrigger>
          <SelectContent className="bg-[#0a1628] border-white/10">
            {activityFilterOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-slate-300 focus:bg-white/5 focus:text-white"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Activity Count */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">
          Showing <span className="text-white font-medium">{visibleActivities.length}</span> of{' '}
          <span className="text-white font-medium">{filteredActivities.length}</span> activities
        </span>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-3">
        {visibleActivities.map((activity, index) => {
          const config = activityTypeConfig[activity.type];
          return (
            <div
              key={activity.id}
              className="glass-card rounded-xl p-4 flex items-start gap-4 group"
            >
              {/* Timeline connector */}
              <div className="flex flex-col items-center shrink-0">
                <div className={cn('flex items-center justify-center size-10 rounded-lg', config.iconBg)}>
                  <config.icon className={cn('size-5', config.iconColor)} />
                </div>
                {index < visibleActivities.length - 1 && (
                  <div className="w-px h-6 bg-white/5 mt-2" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-slate-200">{activity.title}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{activity.description}</p>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant="outline"
                      className={cn('text-[10px] font-medium border', config.badgeBg, config.badgeColor)}
                    >
                      {config.label}
                    </Badge>
                    <span className="text-[10px] text-slate-500 whitespace-nowrap">
                      {activity.timestamp}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredActivities.length === 0 && (
        <div className="glass-card rounded-xl p-12 text-center">
          <Activity className="size-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No activities found</h3>
          <p className="text-sm text-slate-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}

      {/* Load More */}
      {hasMore && (
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            onClick={() => setVisibleCount((prev) => prev + 10)}
          >
            Load More
            <ChevronDown className="size-4 ml-2" />
          </Button>
        </div>
      )}
    </div>
  );
}
