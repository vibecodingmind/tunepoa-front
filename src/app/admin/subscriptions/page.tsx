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
  CreditCard,
  Search,
  Filter,
  MoreHorizontal,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  Eye,
  RefreshCw,
  XCircle,
  CheckCircle2,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
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
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

// ─── Types ────────────────────────────────────────────────────
type SubStatus = 'Active' | 'Trial' | 'Past Due' | 'Cancelled';
type PlanType = 'Starter' | 'Pro' | 'Enterprise';

interface Subscription {
  id: string;
  user: string;
  email: string;
  plan: PlanType;
  status: SubStatus;
  billingPeriod: 'Monthly' | 'Annual';
  amount: string;
  startDate: string;
  phoneLines: number;
}

// ─── Mock Data ────────────────────────────────────────────────
const mockSubscriptions: Subscription[] = [
  { id: '1', user: 'Amina Hassan', email: 'amina@vodacom.co.tz', plan: 'Pro', status: 'Active', billingPeriod: 'Monthly', amount: 'TZS 149,000', startDate: '2025-01-15', phoneLines: 12 },
  { id: '2', user: 'Joseph Mwangi', email: 'joseph@safaricom.ke', plan: 'Enterprise', status: 'Active', billingPeriod: 'Annual', amount: 'TZS 1,200,000', startDate: '2025-02-03', phoneLines: 25 },
  { id: '3', user: 'Fatima Abubakar', email: 'fatima@airtel.co.tz', plan: 'Starter', status: 'Trial', billingPeriod: 'Monthly', amount: 'TZS 0', startDate: '2025-05-10', phoneLines: 5 },
  { id: '4', user: 'David Okafor', email: 'david@mtn.ng', plan: 'Starter', status: 'Cancelled', billingPeriod: 'Monthly', amount: 'TZS 49,000', startDate: '2024-11-20', phoneLines: 0 },
  { id: '5', user: 'Grace Mrema', email: 'grace@tigo.co.tz', plan: 'Pro', status: 'Active', billingPeriod: 'Monthly', amount: 'TZS 149,000', startDate: '2025-04-01', phoneLines: 8 },
  { id: '6', user: 'Samuel Ndegwa', email: 'samuel@safaricom.ke', plan: 'Enterprise', status: 'Active', billingPeriod: 'Annual', amount: 'TZS 1,200,000', startDate: '2024-06-15', phoneLines: 3 },
  { id: '7', user: 'Maria Kimaro', email: 'maria@vodacom.co.tz', plan: 'Pro', status: 'Past Due', billingPeriod: 'Monthly', amount: 'TZS 149,000', startDate: '2025-01-28', phoneLines: 10 },
  { id: '8', user: 'Ahmed Saleh', email: 'ahmed@airtel.co.tz', plan: 'Starter', status: 'Trial', billingPeriod: 'Monthly', amount: 'TZS 0', startDate: '2025-05-12', phoneLines: 3 },
  { id: '9', user: 'Peter Odhiambo', email: 'peter@telkom.ke', plan: 'Starter', status: 'Cancelled', billingPeriod: 'Monthly', amount: 'TZS 49,000', startDate: '2024-09-14', phoneLines: 0 },
  { id: '10', user: 'Lucy Mwanyika', email: 'lucy@vodacom.co.tz', plan: 'Pro', status: 'Active', billingPeriod: 'Monthly', amount: 'TZS 149,000', startDate: '2024-08-22', phoneLines: 2 },
  { id: '11', user: 'Hassan Juma', email: 'hassan@zantel.co.tz', plan: 'Pro', status: 'Active', billingPeriod: 'Monthly', amount: 'TZS 149,000', startDate: '2025-03-05', phoneLines: 6 },
  { id: '12', user: 'Esther Wambui', email: 'esther@safaricom.ke', plan: 'Enterprise', status: 'Active', billingPeriod: 'Annual', amount: 'TZS 1,200,000', startDate: '2025-04-18', phoneLines: 15 },
  { id: '13', user: 'Michael Temu', email: 'michael@airtel.co.tz', plan: 'Starter', status: 'Past Due', billingPeriod: 'Monthly', amount: 'TZS 49,000', startDate: '2024-07-30', phoneLines: 0 },
  { id: '14', user: 'Sarah Msofe', email: 'sarah@tigo.co.tz', plan: 'Starter', status: 'Active', billingPeriod: 'Monthly', amount: 'TZS 49,000', startDate: '2025-02-14', phoneLines: 4 },
  { id: '15', user: 'James Kariuki', email: 'james@safaricom.ke', plan: 'Pro', status: 'Active', billingPeriod: 'Monthly', amount: 'TZS 149,000', startDate: '2025-05-01', phoneLines: 7 },
  { id: '16', user: 'Ibrahim Musa', email: 'ibrahim@mtn.ng', plan: 'Enterprise', status: 'Active', billingPeriod: 'Annual', amount: 'TZS 1,200,000', startDate: '2025-01-07', phoneLines: 20 },
  { id: '17', user: 'Catherine Luhanga', email: 'catherine@airtel.co.tz', plan: 'Starter', status: 'Cancelled', billingPeriod: 'Monthly', amount: 'TZS 49,000', startDate: '2024-12-19', phoneLines: 0 },
];

const statusStyles: Record<SubStatus, string> = {
  Active: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Trial: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  'Past Due': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const planStyles: Record<PlanType, string> = {
  Starter: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  Pro: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
  Enterprise: 'bg-violet-500/20 text-violet-400 border-violet-500/30',
};

const summaryCards = [
  { title: 'Active', count: 11, icon: CheckCircle2, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  { title: 'Trial', count: 2, icon: Clock, color: 'text-sky-400', bg: 'bg-sky-500/10' },
  { title: 'Past Due', count: 2, icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
  { title: 'Cancelled', count: 3, icon: XCircle, color: 'text-red-400', bg: 'bg-red-500/10' },
];

const planDistribution = [
  { name: 'Starter', value: 7, color: '#14b8a6' },
  { name: 'Pro', value: 6, color: '#06b6d4' },
  { name: 'Enterprise', value: 4, color: '#8b5cf6' },
];

export default function SubscriptionsPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [planFilter, setPlanFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredData = useMemo(() => {
    return mockSubscriptions.filter((sub) => {
      const matchesPlan = planFilter === 'all' || sub.plan === planFilter;
      const matchesStatus = statusFilter === 'all' || sub.status === statusFilter;
      return matchesPlan && matchesStatus;
    });
  }, [planFilter, statusFilter]);

  const columns = useMemo<ColumnDef<Subscription>[]>(
    () => [
      {
        accessorKey: 'user',
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="text-white/40 hover:text-white hover:bg-white/[0.04] -ml-3">
            User <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => (
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8 border border-white/10">
              <AvatarFallback className="bg-gradient-to-br from-teal-600/40 to-cyan-500/40 text-white text-xs">
                {row.original.user.split(' ').map((n) => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white text-sm font-medium">{row.original.user}</p>
              <p className="text-white/30 text-xs">{row.original.email}</p>
            </div>
          </div>
        ),
      },
      {
        accessorKey: 'plan',
        header: 'Plan',
        cell: ({ row }) => <Badge className={planStyles[row.original.plan]}>{row.original.plan}</Badge>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => <Badge className={statusStyles[row.original.status]}>{row.original.status}</Badge>,
      },
      {
        accessorKey: 'billingPeriod',
        header: 'Billing',
        cell: ({ row }) => <span className="text-white/60 text-sm">{row.original.billingPeriod}</span>,
      },
      {
        accessorKey: 'amount',
        header: 'Amount',
        cell: ({ row }) => <span className="text-white text-sm font-medium">{row.original.amount}</span>,
      },
      {
        accessorKey: 'startDate',
        header: 'Start Date',
        cell: ({ row }) => <span className="text-white/40 text-sm">{row.original.startDate}</span>,
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
            <DropdownMenuContent className="w-48 bg-[#0f1d32] border-white/[0.08]" align="end">
              <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06]"><Eye className="w-4 h-4 mr-2" /> View Details</DropdownMenuItem>
              <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06]"><RefreshCw className="w-4 h-4 mr-2" /> Change Plan</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/[0.06]" />
              <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-white/[0.06]"><XCircle className="w-4 h-4 mr-2" /> Cancel Subscription</DropdownMenuItem>
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
    initialState: { pagination: { pageSize: 8 } },
  });

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Subscriptions</h1>
        <p className="text-white/40 text-sm mt-1">Manage and monitor all platform subscriptions</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="glass-card rounded-xl p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/40 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.count}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg ${card.bg} flex items-center justify-center`}>
                  <Icon className={`w-5 h-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Chart & Filters Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Plan Distribution Chart */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Plan Distribution</h3>
          <ResponsiveContainer width="100%" height={180}>
            <PieChart>
              <Pie data={planDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value">
                {planDistribution.map((entry, idx) => (
                  <Cell key={idx} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ background: 'rgba(10,22,40,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} itemStyle={{ color: '#fff' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            {planDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-white/40 text-xs">{item.name} ({item.value})</span>
              </div>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="glass-card rounded-xl p-5 lg:col-span-2">
          <div className="flex flex-col sm:flex-row gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input placeholder="Search by user or email..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-teal-500/50 focus:ring-teal-500/20" />
            </div>
            <Select value={planFilter} onValueChange={setPlanFilter}>
              <SelectTrigger className="w-full sm:w-[130px] h-9 bg-white/[0.04] border-white/[0.08] text-white">
                <SelectValue placeholder="Plan" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
                <SelectItem value="all" className="text-white/70 focus:text-white focus:bg-white/[0.06]">All Plans</SelectItem>
                <SelectItem value="Starter" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Starter</SelectItem>
                <SelectItem value="Pro" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Pro</SelectItem>
                <SelectItem value="Enterprise" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Enterprise</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[130px] h-9 bg-white/[0.04] border-white/[0.08] text-white">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
                <SelectItem value="all" className="text-white/70 focus:text-white focus:bg-white/[0.06]">All Status</SelectItem>
                <SelectItem value="Active" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Active</SelectItem>
                <SelectItem value="Trial" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Trial</SelectItem>
                <SelectItem value="Past Due" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Past Due</SelectItem>
                <SelectItem value="Cancelled" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <p className="text-white/30 text-xs">Monthly Revenue</p>
              <p className="text-white font-bold text-lg mt-1">TZS 893K</p>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <p className="text-white/30 text-xs">Annual Revenue</p>
              <p className="text-white font-bold text-lg mt-1">TZS 4.8M</p>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <p className="text-white/30 text-xs">Avg Revenue/Sub</p>
              <p className="text-white font-bold text-lg mt-1">TZS 52.5K</p>
            </div>
            <div className="bg-white/[0.03] rounded-lg p-3 text-center">
              <p className="text-white/30 text-xs">Churn Rate</p>
              <p className="text-white font-bold text-lg mt-1">4.2%</p>
            </div>
          </div>
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
                  <td colSpan={columns.length} className="h-32 text-center text-white/30">No subscriptions found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
          <p className="text-white/30 text-xs">
            Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of {filteredData.length}
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}><ChevronsLeft className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="text-white/40 text-xs px-2">{table.getState().pagination.pageIndex + 1} / {table.getPageCount()}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}><ChevronRight className="w-4 h-4" /></Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => table.setPageIndex(table.getPageCount() - 1)} disabled={!table.getCanNextPage()}><ChevronsRight className="w-4 h-4" /></Button>
          </div>
        </div>
      </div>
    </div>
  );
}
