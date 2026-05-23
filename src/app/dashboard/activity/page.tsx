'use client';

import React, { useState, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from '@tanstack/react-table';
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
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Clock,
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

// ─── Types ────────────────────────────────────────────────────
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
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  timestamp: string;
}

// ─── Config ───────────────────────────────────────────────────
const activityTypeConfig: Record<ActivityType, { icon: React.ElementType; iconBg: string; iconColor: string; label: string; badgeBg: string; badgeColor: string }> = {
  login: { icon: LogIn, iconBg: 'bg-teal-500/15', iconColor: 'text-teal-400', label: 'Login', badgeBg: 'bg-teal-500/10', badgeColor: 'text-teal-400' },
  tone_assigned: { icon: Volume2, iconBg: 'bg-cyan-500/15', iconColor: 'text-cyan-400', label: 'Tone Assigned', badgeBg: 'bg-cyan-500/10', badgeColor: 'text-cyan-400' },
  tone_uploaded: { icon: Upload, iconBg: 'bg-violet-500/15', iconColor: 'text-violet-400', label: 'Tone Uploaded', badgeBg: 'bg-violet-500/10', badgeColor: 'text-violet-400' },
  line_activated: { icon: Phone, iconBg: 'bg-emerald-500/15', iconColor: 'text-emerald-400', label: 'Line Activated', badgeBg: 'bg-emerald-500/10', badgeColor: 'text-emerald-400' },
  line_deactivated: { icon: Power, iconBg: 'bg-red-500/15', iconColor: 'text-red-400', label: 'Line Deactivated', badgeBg: 'bg-red-500/10', badgeColor: 'text-red-400' },
  subscription_changed: { icon: CreditCard, iconBg: 'bg-amber-500/15', iconColor: 'text-amber-400', label: 'Subscription', badgeBg: 'bg-amber-500/10', badgeColor: 'text-amber-400' },
  settings_updated: { icon: Settings, iconBg: 'bg-slate-500/15', iconColor: 'text-slate-400', label: 'Settings', badgeBg: 'bg-slate-500/10', badgeColor: 'text-slate-400' },
  security_changed: { icon: Shield, iconBg: 'bg-rose-500/15', iconColor: 'text-rose-400', label: 'Security', badgeBg: 'bg-rose-500/10', badgeColor: 'text-rose-400' },
};

// ─── Mock Data ────────────────────────────────────────────────
const allActivities: ActivityEntry[] = [
  { id: '1', type: 'login', title: 'Logged in from Dar es Salaam', description: 'Chrome on macOS - IP: 197.250.x.x', timestamp: '10 minutes ago' },
  { id: '2', type: 'tone_assigned', title: 'Tone assigned to +255 712 345 678', description: 'Corporate Welcome set as active tone', timestamp: '2 hours ago' },
  { id: '3', type: 'line_activated', title: 'Phone line activated', description: '+255 789 012 345 - Vodacom', timestamp: '5 hours ago' },
  { id: '4', type: 'subscription_changed', title: 'Subscription renewed', description: 'Pro Plan - TZS 57,000/month', timestamp: '1 day ago' },
  { id: '5', type: 'tone_uploaded', title: 'Custom tone uploaded', description: 'Holiday Greeting 2025 - 32s', timestamp: '2 days ago' },
  { id: '6', type: 'settings_updated', title: 'Notification preferences updated', description: 'Email notifications enabled for billing', timestamp: '2 days ago' },
  { id: '7', type: 'security_changed', title: 'Password changed', description: 'Password updated successfully', timestamp: '3 days ago' },
  { id: '8', type: 'login', title: 'Logged in from mobile app', description: 'iOS App - Dar es Salaam', timestamp: '3 days ago' },
  { id: '9', type: 'tone_assigned', title: 'Tone assigned to +254 722 456 789', description: 'Retail Jingle set as active tone', timestamp: '4 days ago' },
  { id: '10', type: 'line_deactivated', title: 'Phone line deactivated', description: '+255 654 789 012 - Telkom', timestamp: '5 days ago' },
  { id: '11', type: 'tone_uploaded', title: 'Custom tone uploaded', description: 'Startup Vibes - 20s', timestamp: '1 week ago' },
  { id: '12', type: 'subscription_changed', title: 'Plan upgraded', description: 'Starter → Pro Plan', timestamp: '1 week ago' },
  { id: '13', type: 'login', title: 'Logged in from Arusha', description: 'Firefox on Windows', timestamp: '1 week ago' },
  { id: '14', type: 'settings_updated', title: 'Profile information updated', description: 'Phone number and organization changed', timestamp: '2 weeks ago' },
  { id: '15', type: 'tone_assigned', title: 'Tone assigned to +255 689 234 567', description: 'Finance Professional set as active tone', timestamp: '2 weeks ago' },
  { id: '16', type: 'line_activated', title: 'Phone line activated', description: '+254 722 456 789 - Safaricom', timestamp: '3 weeks ago' },
];

export default function ActivityPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  const filteredData = useMemo(() => {
    return allActivities.filter((activity) => {
      return typeFilter === 'all' || activity.type === typeFilter;
    });
  }, [typeFilter]);

  const columns = useMemo<ColumnDef<ActivityEntry>[]>(
    () => [
      {
        accessorKey: 'type',
        header: 'Type',
        cell: ({ row }) => {
          const config = activityTypeConfig[row.original.type];
          const Icon = config.icon;
          return (
            <div className="flex items-center gap-3">
              <div className={cn('flex items-center justify-center w-8 h-8 rounded-lg', config.iconBg)}>
                <Icon className={cn('w-4 h-4', config.iconColor)} />
              </div>
              <Badge className={cn('text-[10px] font-medium border', config.badgeBg, config.badgeColor)}>
                {config.label}
              </Badge>
            </div>
          );
        },
      },
      {
        accessorKey: 'title',
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="text-white/40 hover:text-white hover:bg-white/[0.04] -ml-3">
            Activity <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div>
            <p className="text-white text-sm font-medium">{row.original.title}</p>
            <p className="text-white/30 text-xs mt-0.5">{row.original.description}</p>
          </div>
        ),
      },
      {
        accessorKey: 'timestamp',
        header: 'Time',
        cell: ({ row }) => (
          <div className="flex items-center gap-1.5">
            <Clock className="w-3 h-3 text-white/20" />
            <span className="text-white/40 text-sm">{row.original.timestamp}</span>
          </div>
        ),
      },
    ],
    []
  );

  const table = useReactTable({
    data: filteredData,
    columns,
    state: { sorting, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 10 } },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-white/40 text-sm mt-1">Track all actions and events on your account</p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Search activities..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-teal-500/50 focus:ring-teal-500/20"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[180px] h-9 bg-white/[0.04] border-white/[0.08] text-white">
              <Filter className="w-3 h-3 mr-1 text-white/30" />
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
              <SelectItem value="all" className="text-white/70 focus:text-white focus:bg-white/[0.06]">All Activities</SelectItem>
              {Object.entries(activityTypeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key} className="text-white/70 focus:text-white focus:bg-white/[0.06]">{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Data Table */}
      <div className="glass-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="border-b border-white/[0.06]">
                  {headerGroup.headers.map((header) => (
                    <th key={header.id} className="h-11 px-4 text-left align-middle text-xs font-medium text-white/40 whitespace-nowrap">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <tr key={row.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    {row.getVisibleCells().map((cell) => (
                      <td key={cell.id} className="px-4 py-3 align-middle">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    ))}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length} className="h-32 text-center text-white/30">
                    <Activity className="w-8 h-8 text-white/20 mx-auto mb-2" />
                    No activities found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
          <p className="text-white/30 text-xs">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of {filteredData.length} activities
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white/40 text-xs px-2">
              {table.getState().pagination.pageIndex + 1} / {table.getPageCount()}
            </span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
