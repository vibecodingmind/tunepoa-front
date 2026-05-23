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
  Phone,
  Plus,
  MoreHorizontal,
  Music,
  BarChart3,
  Power,
  Signal,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Check,
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────
type LineStatus = 'active' | 'inactive' | 'pending';

interface PhoneLine {
  id: string;
  number: string;
  provider: string;
  providerColor: string;
  providerInitial: string;
  status: LineStatus;
  activeTone: string | null;
  lastActivity: string;
  callCount: number;
}

// ─── Mock Data ────────────────────────────────────────────────
const phoneLines: PhoneLine[] = [
  { id: '1', number: '+255 712 345 678', provider: 'Vodacom', providerColor: 'bg-red-500', providerInitial: 'V', status: 'active', activeTone: 'Corporate Welcome', lastActivity: '2 hours ago', callCount: 342 },
  { id: '2', number: '+255 789 012 345', provider: 'Vodacom', providerColor: 'bg-red-500', providerInitial: 'V', status: 'active', activeTone: 'Hotel Ambience', lastActivity: '5 hours ago', callCount: 289 },
  { id: '3', number: '+254 722 456 789', provider: 'Safaricom', providerColor: 'bg-green-500', providerInitial: 'S', status: 'active', activeTone: 'Retail Jingle', lastActivity: '1 day ago', callCount: 156 },
  { id: '4', number: '+255 689 234 567', provider: 'Airtel', providerColor: 'bg-red-600', providerInitial: 'A', status: 'pending', activeTone: null, lastActivity: '3 days ago', callCount: 0 },
  { id: '5', number: '+255 654 789 012', provider: 'Telkom', providerColor: 'bg-blue-500', providerInitial: 'T', status: 'inactive', activeTone: null, lastActivity: '1 week ago', callCount: 0 },
];

const availableTones = [
  'Corporate Welcome',
  'Hotel Ambience',
  'Retail Jingle',
  'Clinic Calm',
  'Finance Professional',
  'Holiday Greeting',
  'Startup Vibes',
  'Resort Paradise',
];

const statusStyles: Record<LineStatus, { label: string; className: string; dot: string }> = {
  active: { label: 'Active', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30', dot: 'bg-emerald-500' },
  inactive: { label: 'Inactive', className: 'bg-red-500/20 text-red-400 border-red-500/30', dot: 'bg-red-500' },
  pending: { label: 'Pending', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30', dot: 'bg-amber-500' },
};

export default function PhoneLinesPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedLineId, setSelectedLineId] = useState<string>('');
  const [selectedTone, setSelectedTone] = useState<string>('');

  // Filter data
  const filteredData = useMemo(() => {
    return phoneLines.filter((line) => {
      const matchesStatus = statusFilter === 'all' || line.status === statusFilter;
      return matchesStatus;
    });
  }, [statusFilter]);

  // Columns
  const columns = useMemo<ColumnDef<PhoneLine>[]>(
    () => [
      {
        accessorKey: 'number',
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="text-white/40 hover:text-white hover:bg-white/[0.04] -ml-3">
            Number <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-white/[0.04]">
              <Phone className="w-4 h-4 text-white/40" />
            </div>
            <span className="text-white text-sm font-medium">{row.original.number}</span>
          </div>
        ),
      },
      {
        accessorKey: 'provider',
        header: 'Provider',
        cell: ({ row }) => (
          <div className="flex items-center gap-2">
            <div className={cn('flex items-center justify-center w-7 h-7 rounded-md text-white text-[10px] font-bold', row.original.providerColor)}>
              {row.original.providerInitial}
            </div>
            <span className="text-white/60 text-sm">{row.original.provider}</span>
          </div>
        ),
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = statusStyles[row.original.status];
          return (
            <Badge className={status.className}>
              <div className={cn('w-1.5 h-1.5 rounded-full mr-1.5', status.dot)} />
              {status.label}
            </Badge>
          );
        },
        filterFn: (row, id, value) => value === 'all' || row.original.status === value,
      },
      {
        accessorKey: 'activeTone',
        header: 'Active Tone',
        cell: ({ row }) => (
          row.original.activeTone ? (
            <div className="flex items-center gap-1.5">
              <Music className="w-3.5 h-3.5 text-teal-400" />
              <span className="text-white/60 text-sm">{row.original.activeTone}</span>
            </div>
          ) : (
            <span className="text-white/20 text-sm">—</span>
          )
        ),
      },
      {
        accessorKey: 'callCount',
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="text-white/40 hover:text-white hover:bg-white/[0.04] -ml-3">
            Calls <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <span className="text-white/40 text-sm">{row.original.callCount > 0 ? row.original.callCount.toLocaleString() : '—'}</span>
        ),
      },
      {
        accessorKey: 'lastActivity',
        header: 'Last Activity',
        cell: ({ row }) => <span className="text-white/40 text-sm">{row.original.lastActivity}</span>,
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-44 bg-[#0f1d32] border-white/[0.08]" align="end">
              <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06] cursor-pointer" onClick={() => { setSelectedLineId(row.original.id); setAssignDialogOpen(true); }}>
                <Music className="w-4 h-4 mr-2" /> Change Tone
              </DropdownMenuItem>
              <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06] cursor-pointer">
                <BarChart3 className="w-4 h-4 mr-2" /> View Analytics
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem className="text-amber-400 focus:text-amber-300 focus:bg-white/[0.06] cursor-pointer">
                <Power className="w-4 h-4 mr-2" /> {row.original.status === 'active' ? 'Deactivate' : 'Activate'}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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

  const activeCount = phoneLines.filter((l) => l.status === 'active').length;
  const pendingCount = phoneLines.filter((l) => l.status === 'pending').length;
  const inactiveCount = phoneLines.filter((l) => l.status === 'inactive').length;

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Phone Lines</h1>
          <p className="text-white/40 text-sm mt-1">
            {phoneLines.length} total · {activeCount} active · {pendingCount} pending · {inactiveCount} inactive
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
          <Plus className="w-4 h-4 mr-2" /> Add Phone Line
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Lines', value: phoneLines.length, icon: Phone, color: 'from-teal-500 to-cyan-400' },
          { label: 'Active', value: activeCount, icon: Signal, color: 'from-emerald-500 to-green-400' },
          { label: 'Pending', value: pendingCount, icon: BarChart3, color: 'from-amber-500 to-yellow-400' },
          { label: 'Inactive', value: inactiveCount, icon: Power, color: 'from-red-500 to-rose-400' },
        ].map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="glass-card rounded-xl p-4">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/40 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                </div>
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center opacity-80`}>
                  <Icon className="w-4 h-4 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Search phone lines..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
              className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-teal-500/50 focus:ring-teal-500/20"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px] h-9 bg-white/[0.04] border-white/[0.08] text-white">
              <Filter className="w-3 h-3 mr-1 text-white/30" />
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
              <SelectItem value="all" className="text-white/70 focus:text-white focus:bg-white/[0.06]">All Status</SelectItem>
              <SelectItem value="active" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Active</SelectItem>
              <SelectItem value="pending" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Pending</SelectItem>
              <SelectItem value="inactive" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Inactive</SelectItem>
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
                    No phone lines found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
          <p className="text-white/30 text-xs">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of {filteredData.length} lines
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

      {/* Add Phone Line Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="bg-[#0a1628] border-white/[0.08] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Add Phone Line</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Phone Number</Label>
              <Input placeholder="+255 XXX XXX XXX" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Provider</Label>
              <Select>
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue placeholder="Select provider" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
                  <SelectItem value="vodacom" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Vodacom</SelectItem>
                  <SelectItem value="safaricom" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Safaricom</SelectItem>
                  <SelectItem value="airtel" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Airtel</SelectItem>
                  <SelectItem value="telkom" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Telkom</SelectItem>
                  <SelectItem value="tigo" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Tigo</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Assign Tone (Optional)</Label>
              <Select>
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue placeholder="Select a tone" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
                  {availableTones.map((tone) => (
                    <SelectItem key={tone} value={tone} className="text-white/70 focus:text-white focus:bg-white/[0.06]">{tone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAddDialogOpen(false)} className="text-white/60 hover:text-white hover:bg-white/[0.06]">Cancel</Button>
            <Button onClick={() => setAddDialogOpen(false)} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
              <Plus className="w-4 h-4 mr-2" /> Add Line
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Assign Tone Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="bg-[#0a1628] border-white/[0.08] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Change Tone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Select Tone</Label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue placeholder="Choose a tone to assign" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
                  {availableTones.map((tone) => (
                    <SelectItem key={tone} value={tone} className="text-white/70 focus:text-white focus:bg-white/[0.06]">{tone}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setAssignDialogOpen(false)} className="text-white/60 hover:text-white hover:bg-white/[0.06]">Cancel</Button>
            <Button onClick={() => setAssignDialogOpen(false)} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
              <Check className="w-4 h-4 mr-2" /> Assign Tone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
