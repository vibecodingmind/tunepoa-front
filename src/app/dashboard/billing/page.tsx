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
  Receipt,
  TrendingUp,
  AlertCircle,
  Calendar,
  Download,
  DollarSign,
  CreditCard,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  ArrowUpDown,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────
type InvoiceStatus = 'paid' | 'pending' | 'failed';

interface Invoice {
  id: string;
  date: string;
  amount: number;
  status: InvoiceStatus;
  description: string;
}

// ─── Mock Data ────────────────────────────────────────────────
const spendingData = [
  { month: 'Oct', amount: 20000 },
  { month: 'Nov', amount: 20000 },
  { month: 'Dec', amount: 20000 },
  { month: 'Jan', amount: 57000 },
  { month: 'Feb', amount: 57000 },
  { month: 'Mar', amount: 57000 },
];

const invoices: Invoice[] = [
  { id: 'INV-2025-003', date: 'Mar 1, 2025', amount: 57000, status: 'paid', description: 'Pro Plan - Monthly' },
  { id: 'INV-2025-002', date: 'Feb 1, 2025', amount: 57000, status: 'paid', description: 'Pro Plan - Monthly' },
  { id: 'INV-2025-001', date: 'Jan 1, 2025', amount: 57000, status: 'paid', description: 'Pro Plan - Monthly' },
  { id: 'INV-2024-012', date: 'Dec 1, 2024', amount: 57000, status: 'paid', description: 'Pro Plan - Monthly' },
  { id: 'INV-2024-011', date: 'Nov 1, 2024', amount: 57000, status: 'paid', description: 'Pro Plan - Monthly' },
  { id: 'INV-2024-010', date: 'Oct 15, 2024', amount: 37000, status: 'paid', description: 'Starter → Pro Upgrade (Prorated)' },
  { id: 'INV-2024-009', date: 'Oct 1, 2024', amount: 20000, status: 'paid', description: 'Starter Plan - Monthly' },
  { id: 'INV-2024-008', date: 'Sep 1, 2024', amount: 20000, status: 'failed', description: 'Starter Plan - Monthly (Retried)' },
];

const statusStyles: Record<InvoiceStatus, { label: string; className: string }> = {
  paid: { label: 'Paid', className: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  pending: { label: 'Pending', className: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  failed: { label: 'Failed', className: 'bg-red-500/20 text-red-400 border-red-500/30' },
};

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString()}`;
}

// ─── Custom Tooltip ───────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card rounded-lg px-3 py-2 text-sm">
      <p className="text-white/50 text-xs mb-1">{label}</p>
      <p className="text-white font-medium">{formatTZS(payload[0].value)}</p>
    </div>
  );
}

export default function BillingPage() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredData = useMemo(() => {
    return invoices.filter((inv) => {
      return statusFilter === 'all' || inv.status === statusFilter;
    });
  }, [statusFilter]);

  const columns = useMemo<ColumnDef<Invoice>[]>(
    () => [
      {
        accessorKey: 'id',
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="text-white/40 hover:text-white hover:bg-white/[0.04] -ml-3">
            Invoice <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => <span className="text-white text-sm font-medium">{row.original.id}</span>,
      },
      {
        accessorKey: 'description',
        header: 'Description',
        cell: ({ row }) => <span className="text-white/60 text-sm">{row.original.description}</span>,
      },
      {
        accessorKey: 'date',
        header: 'Date',
        cell: ({ row }) => <span className="text-white/40 text-sm">{row.original.date}</span>,
      },
      {
        accessorKey: 'amount',
        header: ({ column }) => (
          <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')} className="text-white/40 hover:text-white hover:bg-white/[0.04] -ml-3">
            Amount <ArrowUpDown className="ml-2 h-3 w-3" />
          </Button>
        ),
        cell: ({ row }) => <span className="text-white/70 text-sm font-medium">{formatTZS(row.original.amount)}</span>,
      },
      {
        accessorKey: 'status',
        header: 'Status',
        cell: ({ row }) => {
          const status = statusStyles[row.original.status];
          return <Badge className={status.className}>{status.label}</Badge>;
        },
      },
      {
        id: 'actions',
        cell: ({ row }) => (
          <Button variant="ghost" size="sm" className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 text-xs h-8">
            <Download className="w-3.5 h-3.5 mr-1" />
            PDF
          </Button>
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
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-white/40 text-sm mt-1">View your billing history and manage payment methods</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { title: 'Total Spent', value: 'TZS 684,000', subtitle: 'Last 12 months', icon: DollarSign, color: 'from-teal-500 to-cyan-400', change: '+15.3%', trend: 'up' },
          { title: 'Outstanding', value: 'TZS 0', subtitle: 'No pending payments', icon: AlertCircle, color: 'from-emerald-500 to-green-400', change: 'Clear', trend: 'up' },
          { title: 'Next Payment', value: 'TZS 57,000', subtitle: 'Due Apr 1, 2025', icon: Calendar, color: 'from-violet-500 to-purple-400', change: 'Pro Plan', trend: 'up' },
        ].map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="glass-card rounded-xl p-5">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-white/40 text-sm">{card.title}</p>
                  <p className="text-2xl font-bold text-white mt-1">{card.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center opacity-80`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
              </div>
              <div className="flex items-center gap-1 mt-3">
                {card.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4 text-emerald-400" />
                ) : (
                  <ArrowDownRight className="w-4 h-4 text-red-400" />
                )}
                <span className="text-emerald-400 text-sm font-medium">{card.change}</span>
                <span className="text-white/30 text-xs ml-1">{card.subtitle}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spending Trend + Payment Method */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Spending Chart */}
        <div className="lg:col-span-2 glass-card rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold">Spending Trend</h3>
              <p className="text-white/40 text-xs mt-0.5">Last 6 months</p>
            </div>
            <div className="flex items-center gap-1 text-emerald-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4" />
              +185%
            </div>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <AreaChart data={spendingData}>
              <defs>
                <linearGradient id="spendGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#14b8a6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
              <XAxis dataKey="month" tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'rgba(255,255,255,0.4)', fontSize: 12 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="amount" stroke="#14b8a6" strokeWidth={2} fill="url(#spendGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Method */}
        <div className="glass-card rounded-xl p-5">
          <h3 className="text-white font-semibold mb-4">Payment Method</h3>
          <div className="glass-card rounded-lg p-4 mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500 to-red-600 flex items-center justify-center">
                <CreditCard className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-white text-sm font-medium">Vodacom M-Pesa</p>
                <p className="text-white/30 text-xs">····4567 · Primary</p>
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full border-white/[0.08] bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] text-xs"
          >
            Update Payment Method
          </Button>
        </div>
      </div>

      {/* Invoice Table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Invoice History</h2>

        {/* Filters */}
        <div className="glass-card rounded-xl p-4 mb-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                placeholder="Search invoices..."
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
                <SelectItem value="paid" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Paid</SelectItem>
                <SelectItem value="pending" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Pending</SelectItem>
                <SelectItem value="failed" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
                      No invoices found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-between px-4 py-3 border-t border-white/[0.06]">
            <p className="text-white/30 text-xs">
              Showing {table.getState().pagination.pageIndex * table.getState().pagination.pageSize + 1}-{Math.min((table.getState().pagination.pageIndex + 1) * table.getState().pagination.pageSize, filteredData.length)} of {filteredData.length} invoices
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
    </div>
  );
}
