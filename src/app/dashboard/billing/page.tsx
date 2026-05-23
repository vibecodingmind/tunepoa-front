'use client';

import React from 'react';
import {
  Receipt,
  TrendingUp,
  AlertCircle,
  Calendar,
  Download,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { cn } from '@/lib/utils';

const summaryCards = [
  {
    title: 'Total Spent',
    value: 'TZS 684,000',
    subtitle: 'Last 12 months',
    icon: DollarSign,
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
  },
  {
    title: 'Outstanding',
    value: 'TZS 0',
    subtitle: 'No pending payments',
    icon: AlertCircle,
    iconBg: 'bg-emerald-500/15',
    iconColor: 'text-emerald-400',
  },
  {
    title: 'Next Payment',
    value: 'TZS 57,000',
    subtitle: 'Due Apr 1, 2025',
    icon: Calendar,
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
  },
];

const invoices = [
  {
    id: 'INV-2025-003',
    date: 'Mar 1, 2025',
    amount: 57000,
    status: 'paid' as const,
    description: 'Pro Plan - Monthly',
  },
  {
    id: 'INV-2025-002',
    date: 'Feb 1, 2025',
    amount: 57000,
    status: 'paid' as const,
    description: 'Pro Plan - Monthly',
  },
  {
    id: 'INV-2025-001',
    date: 'Jan 1, 2025',
    amount: 57000,
    status: 'paid' as const,
    description: 'Pro Plan - Monthly',
  },
  {
    id: 'INV-2024-012',
    date: 'Dec 1, 2024',
    amount: 57000,
    status: 'paid' as const,
    description: 'Pro Plan - Monthly',
  },
  {
    id: 'INV-2024-011',
    date: 'Nov 1, 2024',
    amount: 57000,
    status: 'paid' as const,
    description: 'Pro Plan - Monthly',
  },
  {
    id: 'INV-2024-010',
    date: 'Oct 15, 2024',
    amount: 37000,
    status: 'paid' as const,
    description: 'Starter → Pro Upgrade (Prorated)',
  },
  {
    id: 'INV-2024-009',
    date: 'Oct 1, 2024',
    amount: 20000,
    status: 'paid' as const,
    description: 'Starter Plan - Monthly',
  },
  {
    id: 'INV-2024-008',
    date: 'Sep 1, 2024',
    amount: 20000,
    status: 'failed' as const,
    description: 'Starter Plan - Monthly (Retried)',
  },
];

const statusConfig = {
  paid: {
    label: 'Paid',
    className: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  },
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  },
  failed: {
    label: 'Failed',
    className: 'bg-red-500/10 text-red-400 border-red-500/20',
  },
};

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString()}`;
}

export default function BillingPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Billing</h1>
        <p className="text-slate-400 mt-1">
          View your billing history and manage payment methods
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {summaryCards.map((card) => (
          <div key={card.title} className="glass-card rounded-xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className={cn('flex items-center justify-center size-10 rounded-lg', card.iconBg)}>
                <card.icon className={cn('size-5', card.iconColor)} />
              </div>
              <div>
                <p className="text-xs text-slate-500">{card.title}</p>
                <p className="text-xl font-bold text-white">{card.value}</p>
              </div>
            </div>
            <p className="text-xs text-slate-500">{card.subtitle}</p>
          </div>
        ))}
      </div>

      {/* Payment Method */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Payment Method</h3>
            <p className="text-xs text-slate-500 mt-1">Vodacom M-Pesa &bull;&bull;&bull;&bull; 4567</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white text-xs"
          >
            Update
          </Button>
        </div>
      </div>

      {/* Invoices Table */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Invoice History</h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Invoice #</TableHead>
                <TableHead className="text-slate-400 font-medium">Description</TableHead>
                <TableHead className="text-slate-400 font-medium">Date</TableHead>
                <TableHead className="text-slate-400 font-medium">Amount</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => {
                const status = statusConfig[invoice.status];
                return (
                  <TableRow key={invoice.id} className="border-white/5 hover:bg-white/[0.02]">
                    <TableCell className="font-medium text-white text-sm">{invoice.id}</TableCell>
                    <TableCell className="text-sm text-slate-400">{invoice.description}</TableCell>
                    <TableCell className="text-sm text-slate-400">{invoice.date}</TableCell>
                    <TableCell className="text-sm text-slate-300 font-medium">{formatTZS(invoice.amount)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={cn('text-[10px] font-medium border', status.className)}
                      >
                        {status.label}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 text-xs"
                      >
                        <Download className="size-3.5 mr-1" />
                        PDF
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
