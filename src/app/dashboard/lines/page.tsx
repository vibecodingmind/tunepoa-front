'use client';

import React from 'react';
import {
  Phone,
  Plus,
  MoreHorizontal,
  Music,
  BarChart3,
  Power,
  Signal,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

const providers = [
  { name: 'Vodacom', color: 'bg-red-500', textColor: 'text-red-400', initial: 'V' },
  { name: 'Safaricom', color: 'bg-green-500', textColor: 'text-green-400', initial: 'S' },
  { name: 'Airtel', color: 'bg-red-600', textColor: 'text-red-400', initial: 'A' },
  { name: 'Telkom', color: 'bg-blue-500', textColor: 'text-blue-400', initial: 'T' },
  { name: 'Mango', color: 'bg-orange-500', textColor: 'text-orange-400', initial: 'M' },
  { name: 'Maroc', color: 'bg-amber-500', textColor: 'text-amber-400', initial: 'MR' },
];

const phoneLines = [
  {
    id: 1,
    number: '+255 712 345 678',
    provider: providers[0],
    status: 'active' as const,
    activeTone: 'Corporate Welcome',
    lastActivity: '2 hours ago',
  },
  {
    id: 2,
    number: '+255 789 012 345',
    provider: providers[0],
    status: 'active' as const,
    activeTone: 'Hotel Ambience',
    lastActivity: '5 hours ago',
  },
  {
    id: 3,
    number: '+254 722 456 789',
    provider: providers[1],
    status: 'active' as const,
    activeTone: 'Retail Jingle',
    lastActivity: '1 day ago',
  },
  {
    id: 4,
    number: '+255 689 234 567',
    provider: providers[2],
    status: 'pending' as const,
    activeTone: '—',
    lastActivity: '3 days ago',
  },
  {
    id: 5,
    number: '+255 654 789 012',
    provider: providers[3],
    status: 'inactive' as const,
    activeTone: '—',
    lastActivity: '1 week ago',
  },
];

const statusConfig = {
  active: {
    label: 'Active',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    dot: 'bg-emerald-500',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
    dot: 'bg-red-500',
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    dot: 'bg-amber-500',
  },
  suspended: {
    label: 'Suspended',
    className: 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    dot: 'bg-slate-500',
  },
};

export default function PhoneLinesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Phone Lines</h1>
          <p className="text-slate-400 mt-1">
            Manage your business phone lines and their assigned tones
          </p>
        </div>
        <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg shadow-teal-500/20">
          <Plus className="size-4 mr-2" />
          Add Phone Line
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Lines', value: phoneLines.length, icon: Phone, color: 'text-teal-400', bg: 'bg-teal-500/15' },
          { label: 'Active', value: phoneLines.filter(l => l.status === 'active').length, icon: Signal, color: 'text-emerald-400', bg: 'bg-emerald-500/15' },
          { label: 'Pending', value: phoneLines.filter(l => l.status === 'pending').length, icon: BarChart3, color: 'text-amber-400', bg: 'bg-amber-500/15' },
          { label: 'Inactive', value: phoneLines.filter(l => l.status === 'inactive').length, icon: Power, color: 'text-red-400', bg: 'bg-red-500/15' },
        ].map((stat) => (
          <div key={stat.label} className="glass-card rounded-xl p-4">
            <div className={cn('flex items-center justify-center size-8 rounded-lg mb-3', stat.bg)}>
              <stat.icon className={cn('size-4', stat.color)} />
            </div>
            <p className="text-2xl font-bold text-white">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
        <Input
          placeholder="Search phone lines..."
          className="bg-white/5 border-white/10 text-slate-300 placeholder:text-slate-500 focus-visible:border-teal-500/50 pl-9"
        />
      </div>

      {/* Phone Lines Table */}
      {phoneLines.length > 0 ? (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Number</TableHead>
                <TableHead className="text-slate-400 font-medium">Provider</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium">Active Tone</TableHead>
                <TableHead className="text-slate-400 font-medium">Last Activity</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {phoneLines.map((line) => {
                const status = statusConfig[line.status];
                return (
                  <TableRow key={line.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center justify-center size-9 rounded-lg bg-white/5">
                          <Phone className="size-4 text-slate-400" />
                        </div>
                        <span className="font-medium text-white text-sm">{line.number}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className={cn('flex items-center justify-center size-7 rounded-md text-white text-[10px] font-bold', line.provider.color)}>
                          {line.provider.initial}
                        </div>
                        <span className="text-sm text-slate-300">{line.provider.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] font-medium border', status.className)}
                      >
                        <div className={cn('size-1.5 rounded-full mr-1.5', status.dot)} />
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {line.activeTone !== '—' ? (
                        <div className="flex items-center gap-1.5">
                          <Music className="size-3.5 text-teal-400" />
                          <span className="text-sm text-slate-300">{line.activeTone}</span>
                        </div>
                      ) : (
                        <span className="text-sm text-slate-600">—</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <span className="text-sm text-slate-500">{line.lastActivity}</span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="size-8 text-slate-400 hover:text-white hover:bg-white/5"
                          >
                            <MoreHorizontal className="size-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="bg-[#0a1628] border-white/10"
                        >
                          <DropdownMenuItem className="text-slate-300 focus:bg-white/5 focus:text-white cursor-pointer">
                            <Music className="size-4 mr-2" />
                            Change Tone
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-slate-300 focus:bg-white/5 focus:text-white cursor-pointer">
                            <BarChart3 className="size-4 mr-2" />
                            View Analytics
                          </DropdownMenuItem>
                          <DropdownMenuSeparator className="bg-white/5" />
                          <DropdownMenuItem className="text-red-400 focus:bg-red-500/10 focus:text-red-300 cursor-pointer">
                            <Power className="size-4 mr-2" />
                            {line.status === 'active' ? 'Deactivate' : 'Activate'}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <Phone className="size-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No phone lines yet</h3>
          <p className="text-sm text-slate-500 mb-6">
            Add your first phone line to start managing ringback tones
          </p>
          <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg shadow-teal-500/20">
            <Plus className="size-4 mr-2" />
            Add Phone Line
          </Button>
        </div>
      )}
    </div>
  );
}
