'use client';

import React, { useState } from 'react';
import {
  Check,
  Crown,
  Zap,
  Building2,
  CreditCard,
  Calendar,
  Shield,
  ArrowRight,
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
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';

const plans = [
  {
    id: 'starter',
    name: 'Starter',
    icon: Zap,
    monthlyPrice: 20000,
    annualPrice: 192000,
    description: 'Perfect for small businesses getting started',
    features: [
      '3 Phone Lines',
      '5 Ringback Tones',
      'Basic Analytics',
      'Email Support',
      'Standard Tone Library',
    ],
    color: 'from-slate-500/20 to-slate-600/10',
    iconBg: 'bg-slate-500/15',
    iconColor: 'text-slate-400',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    icon: Crown,
    monthlyPrice: 57000,
    annualPrice: 547200,
    description: 'Best for growing businesses with more needs',
    features: [
      '10 Phone Lines',
      '25 Ringback Tones',
      'Advanced Analytics',
      'Priority Support',
      'Premium Tone Library',
      'Custom Tone Upload',
      'Scheduled Tones',
      'API Access',
    ],
    color: 'from-teal-500/20 to-cyan-500/10',
    iconBg: 'bg-teal-500/15',
    iconColor: 'text-teal-400',
    popular: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    icon: Building2,
    monthlyPrice: 0,
    annualPrice: 0,
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited Phone Lines',
      'Unlimited Ringback Tones',
      'Custom Analytics Dashboard',
      'Dedicated Account Manager',
      'Custom Tone Production',
      'White-label Solutions',
      'SSO & Advanced Security',
      'SLA Guarantee',
    ],
    color: 'from-violet-500/20 to-purple-500/10',
    iconBg: 'bg-violet-500/15',
    iconColor: 'text-violet-400',
    popular: false,
  },
];

const billingHistory = [
  { id: 'INV-2025-001', date: 'Mar 1, 2025', amount: 57000, status: 'paid' as const },
  { id: 'INV-2025-002', date: 'Feb 1, 2025', amount: 57000, status: 'paid' as const },
  { id: 'INV-2025-003', date: 'Jan 1, 2025', amount: 57000, status: 'paid' as const },
  { id: 'INV-2024-012', date: 'Dec 1, 2024', amount: 57000, status: 'paid' as const },
  { id: 'INV-2024-011', date: 'Nov 1, 2024', amount: 57000, status: 'paid' as const },
];

function formatTZS(amount: number) {
  return `TZS ${amount.toLocaleString()}`;
}

export default function SubscriptionPage() {
  const [isAnnual, setIsAnnual] = useState(false);
  const currentPlan = 'pro';

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Subscription</h1>
        <p className="text-slate-400 mt-1">
          Manage your plan and billing preferences
        </p>
      </div>

      {/* Current Plan Card */}
      <div className="glass-premium rounded-xl p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-12 rounded-xl bg-teal-500/15">
              <Crown className="size-6 text-teal-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white">Pro Plan</h2>
                <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
                  Active
                </Badge>
              </div>
              <p className="text-sm text-slate-400 mt-1">
                {formatTZS(57000)}/month &middot; Billed monthly
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-slate-500">Next billing date</p>
              <p className="text-sm font-medium text-white">April 1, 2025</p>
            </div>
            <Button
              variant="outline"
              className="border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white"
            >
              Cancel Plan
            </Button>
          </div>
        </div>

        {/* Features in use */}
        <div className="mt-6 pt-6 border-t border-white/5">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Phone Lines', used: 5, total: 10 },
              { label: 'Ringback Tones', used: 8, total: 25 },
              { label: 'Custom Uploads', used: 2, total: 10 },
              { label: 'API Calls', used: 1243, total: 5000 },
            ].map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-xs text-slate-400">{item.label}</span>
                  <span className="text-xs text-slate-500">
                    {item.used}/{item.total}
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-teal-500 to-cyan-500"
                    style={{ width: `${(item.used / item.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Billing Toggle */}
      <div className="flex items-center justify-center gap-4">
        <span className={cn('text-sm font-medium', !isAnnual ? 'text-white' : 'text-slate-400')}>
          Monthly
        </span>
        <Switch
          checked={isAnnual}
          onCheckedChange={setIsAnnual}
          className="data-[state=checked]:bg-teal-500"
        />
        <span className={cn('text-sm font-medium', isAnnual ? 'text-white' : 'text-slate-400')}>
          Annual
        </span>
        {isAnnual && (
          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]">
            Save 20%
          </Badge>
        )}
      </div>

      {/* Plan Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = plan.id === currentPlan;
          const price = isAnnual ? plan.annualPrice : plan.monthlyPrice;

          return (
            <div
              key={plan.id}
              className={cn(
                'glass-card rounded-xl p-6 relative',
                isCurrent && 'ring-2 ring-teal-500/30'
              )}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white border-0 text-[10px] px-3">
                    Recommended
                  </Badge>
                </div>
              )}

              <div className={cn('flex items-center justify-center size-12 rounded-xl mb-4', plan.iconBg)}>
                <plan.icon className={cn('size-6', plan.iconColor)} />
              </div>

              <h3 className="text-lg font-bold text-white">{plan.name}</h3>
              <p className="text-xs text-slate-500 mt-1">{plan.description}</p>

              <div className="mt-4 mb-6">
                {price > 0 ? (
                  <>
                    <span className="text-3xl font-bold text-white">
                      {formatTZS(isAnnual ? Math.round(price / 12) : price)}
                    </span>
                    <span className="text-sm text-slate-400">/month</span>
                    {isAnnual && (
                      <p className="text-xs text-slate-500 mt-1">
                        {formatTZS(price)}/year billed annually
                      </p>
                    )}
                  </>
                ) : (
                  <>
                    <span className="text-3xl font-bold text-white">Custom</span>
                    <p className="text-xs text-slate-500 mt-1">Contact us for pricing</p>
                  </>
                )}
              </div>

              <ul className="space-y-3 mb-6">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2">
                    <Check className={cn('size-4 shrink-0', isCurrent ? 'text-teal-400' : 'text-slate-500')} />
                    <span className="text-sm text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              {isCurrent ? (
                <Button
                  className="w-full bg-white/5 text-slate-400 border border-white/10 cursor-default"
                  disabled
                >
                  Current Plan
                </Button>
              ) : plan.id === 'enterprise' ? (
                <Button
                  variant="outline"
                  className="w-full border-violet-500/30 bg-violet-500/5 text-violet-400 hover:bg-violet-500/10 hover:text-violet-300"
                >
                  Contact Sales
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              ) : (
                <Button
                  variant="outline"
                  className={cn(
                    'w-full',
                    plan.id === 'starter'
                      ? 'border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 hover:text-white'
                      : 'border-teal-500/30 bg-teal-500/5 text-teal-400 hover:bg-teal-500/10 hover:text-teal-300'
                  )}
                >
                  {plan.id === 'starter' ? 'Downgrade' : 'Upgrade'}
                  <ArrowRight className="size-4 ml-2" />
                </Button>
              )}
            </div>
          );
        })}
      </div>

      {/* Billing History */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Billing History</h2>
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-white/5 hover:bg-transparent">
                <TableHead className="text-slate-400 font-medium">Invoice</TableHead>
                <TableHead className="text-slate-400 font-medium">Date</TableHead>
                <TableHead className="text-slate-400 font-medium">Amount</TableHead>
                <TableHead className="text-slate-400 font-medium">Status</TableHead>
                <TableHead className="text-slate-400 font-medium text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {billingHistory.map((invoice) => (
                <TableRow key={invoice.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell className="font-medium text-white text-sm">{invoice.id}</TableCell>
                  <TableCell className="text-sm text-slate-400">{invoice.date}</TableCell>
                  <TableCell className="text-sm text-slate-300">{formatTZS(invoice.amount)}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px]"
                    >
                      Paid
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/10 text-xs"
                    >
                      Download
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
