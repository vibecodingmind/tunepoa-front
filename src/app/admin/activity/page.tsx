'use client';

import React, { useState, useMemo } from 'react';
import {
  Activity,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  UserPlus,
  Upload,
  CreditCard,
  Settings,
  MessageSquare,
  Shield,
  LogIn,
  LogOut,
  Pencil,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Phone,
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

// ─── Types ────────────────────────────────────────────────────
type ActivityType = 'signup' | 'login' | 'logout' | 'upload' | 'approve' | 'reject' | 'subscribe' | 'cancel' | 'payment' | 'settings' | 'edit' | 'delete' | 'support' | 'lines' | 'alert';

interface ActivityEntry {
  id: string;
  user: string;
  userInitials: string;
  action: string;
  type: ActivityType;
  timestamp: string;
  details?: string;
  ip?: string;
}

// ─── Mock Data ────────────────────────────────────────────────
const mockActivities: ActivityEntry[] = [
  { id: '1', user: 'Admin User', userInitials: 'AU', action: 'Approved tone "Serenade of Dar"', type: 'approve', timestamp: '2025-05-22 14:30', details: 'Tone ID: T-045', ip: '192.168.1.1' },
  { id: '2', user: 'Amina Hassan', userInitials: 'AH', action: 'Upgraded to Pro plan', type: 'subscribe', timestamp: '2025-05-22 14:15', details: 'From Starter to Pro', ip: '10.0.0.45' },
  { id: '3', user: 'System', userInitials: 'SY', action: 'Monthly billing cycle completed', type: 'payment', timestamp: '2025-05-22 12:00', details: '142 subscriptions processed', ip: 'system' },
  { id: '4', user: 'Joseph Mwangi', userInitials: 'JM', action: 'Uploaded 3 new tones', type: 'upload', timestamp: '2025-05-22 11:30', details: 'Tones: Bongo Mix, Swahili Jazz, Afro Beat', ip: '10.0.1.22' },
  { id: '5', user: 'Fatima Abubakar', userInitials: 'FA', action: 'New account created', type: 'signup', timestamp: '2025-05-22 10:45', details: 'Organization: Airtel Tanzania', ip: '10.0.2.88' },
  { id: '6', user: 'Admin User', userInitials: 'AU', action: 'Updated Starter plan pricing', type: 'settings', timestamp: '2025-05-22 09:30', details: 'Price changed from TZS 39K to TZS 49K', ip: '192.168.1.1' },
  { id: '7', user: 'David Okafor', userInitials: 'DO', action: 'Cancelled subscription', type: 'cancel', timestamp: '2025-05-22 08:20', details: 'Reason: Switching to competitor', ip: '10.0.3.15' },
  { id: '8', user: 'Grace Mrema', userInitials: 'GM', action: 'Added 5 phone lines', type: 'lines', timestamp: '2025-05-21 16:50', details: 'Total lines: 8', ip: '10.0.4.33' },
  { id: '9', user: 'System', userInitials: 'SY', action: 'Auto-renewal processed for 42 subscriptions', type: 'payment', timestamp: '2025-05-21 12:00', details: 'Total: TZS 6.2M', ip: 'system' },
  { id: '10', user: 'Samuel Ndegwa', userInitials: 'SN', action: 'Submitted support ticket #482', type: 'support', timestamp: '2025-05-21 10:30', details: 'Subject: API Integration Support', ip: '10.0.5.77' },
  { id: '11', user: 'Admin User', userInitials: 'AU', action: 'Rejected tone "Loud Beats v2"', type: 'reject', timestamp: '2025-05-21 09:15', details: 'Reason: Copyright violation', ip: '192.168.1.1' },
  { id: '12', user: 'Maria Kimaro', userInitials: 'MK', action: 'Logged in from new device', type: 'login', timestamp: '2025-05-21 08:00', details: 'Chrome on Windows, Dar es Salaam', ip: '10.0.6.44' },
  { id: '13', user: 'Ahmed Saleh', userInitials: 'AS', action: 'Started 14-day trial', type: 'signup', timestamp: '2025-05-20 15:30', details: 'Organization: Airtel Tanzania', ip: '10.0.7.12' },
  { id: '14', user: 'System', userInitials: 'SY', action: 'Payment gateway alert', type: 'alert', timestamp: '2025-05-20 14:00', details: '3 failed payment attempts detected', ip: 'system' },
  { id: '15', user: 'Esther Wambui', userInitials: 'EW', action: 'Upgraded to Enterprise plan', type: 'subscribe', timestamp: '2025-05-20 11:45', details: 'Annual billing selected', ip: '10.0.8.90' },
  { id: '16', user: 'Admin User', userInitials: 'AU', action: 'Edited tone "Karibu Sana"', type: 'edit', timestamp: '2025-05-20 10:00', details: 'Changed category from Music to Corporate', ip: '192.168.1.1' },
  { id: '17', user: 'Peter Odhiambo', userInitials: 'PO', action: 'Account deactivated', type: 'cancel', timestamp: '2025-05-19 16:20', details: 'Reason: Non-payment', ip: '10.0.9.55' },
  { id: '18', user: 'Lucy Mwanyika', userInitials: 'LM', action: 'Logged out', type: 'logout', timestamp: '2025-05-19 15:00', details: 'Session duration: 2h 15m', ip: '10.0.10.3' },
  { id: '19', user: 'Hassan Juma', userInitials: 'HJ', action: 'Changed assigned tone on 3 lines', type: 'lines', timestamp: '2025-05-19 13:30', details: 'New tone: Bongo Flava Mix', ip: '10.0.11.78' },
  { id: '20', user: 'System', userInitials: 'SY', action: 'Database backup completed', type: 'settings', timestamp: '2025-05-19 03:00', details: 'Size: 2.4GB, Duration: 12m', ip: 'system' },
  { id: '21', user: 'Ibrahim Musa', userInitials: 'IM', action: 'Payment of TZS 1,200,000 received', type: 'payment', timestamp: '2025-05-18 14:20', details: 'Enterprise annual plan', ip: '10.0.12.44' },
  { id: '22', user: 'Admin User', userInitials: 'AU', action: 'Deleted inactive user account', type: 'delete', timestamp: '2025-05-18 11:00', details: 'User: test_account_001', ip: '192.168.1.1' },
  { id: '23', user: 'Catherine Luhanga', userInitials: 'CL', action: 'New account created', type: 'signup', timestamp: '2025-05-17 09:30', details: 'Organization: Airtel Tanzania', ip: '10.0.13.67' },
  { id: '24', user: 'System', userInitials: 'SY', action: 'SSL certificate renewed', type: 'settings', timestamp: '2025-05-17 02:00', details: 'Expiry: 2026-05-17', ip: 'system' },
  { id: '25', user: 'James Kariuki', userInitials: 'JK', action: 'Uploaded custom tone', type: 'upload', timestamp: '2025-05-16 15:45', details: 'Tone: "Kenyan Fusion"', ip: '10.0.14.22' },
  { id: '26', user: 'Sarah Msofe', userInitials: 'SM', action: 'Subscription payment failed', type: 'alert', timestamp: '2025-05-16 12:00', details: 'Starter plan, TZS 49,000', ip: '10.0.15.89' },
  { id: '27', user: 'Admin User', userInitials: 'AU', action: 'Updated telecom provider settings', type: 'settings', timestamp: '2025-05-16 10:30', details: 'Enabled Vodacom API v2', ip: '192.168.1.1' },
  { id: '28', user: 'Robert Mutiso', userInitials: 'RM', action: 'Logged in from mobile', type: 'login', timestamp: '2025-05-16 08:15', details: 'Safari on iOS, Nairobi', ip: '10.0.16.11' },
];

const typeConfig: Record<ActivityType, { icon: React.ElementType; color: string; bgColor: string; label: string }> = {
  signup: { icon: UserPlus, color: 'text-teal-400', bgColor: 'bg-teal-500/15', label: 'Sign Up' },
  login: { icon: LogIn, color: 'text-sky-400', bgColor: 'bg-sky-500/15', label: 'Login' },
  logout: { icon: LogOut, color: 'text-white/40', bgColor: 'bg-white/5', label: 'Logout' },
  upload: { icon: Upload, color: 'text-violet-400', bgColor: 'bg-violet-500/15', label: 'Upload' },
  approve: { icon: CheckCircle2, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', label: 'Approve' },
  reject: { icon: XCircle, color: 'text-red-400', bgColor: 'bg-red-500/15', label: 'Reject' },
  subscribe: { icon: CreditCard, color: 'text-cyan-400', bgColor: 'bg-cyan-500/15', label: 'Subscribe' },
  cancel: { icon: XCircle, color: 'text-orange-400', bgColor: 'bg-orange-500/15', label: 'Cancel' },
  payment: { icon: CreditCard, color: 'text-emerald-400', bgColor: 'bg-emerald-500/15', label: 'Payment' },
  settings: { icon: Settings, color: 'text-amber-400', bgColor: 'bg-amber-500/15', label: 'Settings' },
  edit: { icon: Pencil, color: 'text-sky-400', bgColor: 'bg-sky-500/15', label: 'Edit' },
  delete: { icon: Trash2, color: 'text-red-400', bgColor: 'bg-red-500/15', label: 'Delete' },
  support: { icon: MessageSquare, color: 'text-orange-400', bgColor: 'bg-orange-500/15', label: 'Support' },
  lines: { icon: Phone, color: 'text-rose-400', bgColor: 'bg-rose-500/15', label: 'Phone Lines' },
  alert: { icon: AlertTriangle, color: 'text-amber-400', bgColor: 'bg-amber-500/15', label: 'Alert' },
};

export default function ActivityLogPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  const filteredActivities = useMemo(() => {
    return mockActivities.filter((activity) => {
      const matchesType = typeFilter === 'all' || activity.type === typeFilter;
      const matchesSearch =
        activity.user.toLowerCase().includes(search.toLowerCase()) ||
        activity.action.toLowerCase().includes(search.toLowerCase());
      return matchesType && matchesSearch;
    });
  }, [search, typeFilter]);

  const totalPages = Math.ceil(filteredActivities.length / pageSize);
  const paginatedActivities = filteredActivities.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  // Group by date
  const groupedActivities = useMemo(() => {
    const groups: Record<string, ActivityEntry[]> = {};
    paginatedActivities.forEach((activity) => {
      const date = activity.timestamp.split(' ')[0];
      if (!groups[date]) groups[date] = [];
      groups[date].push(activity);
    });
    return groups;
  }, [paginatedActivities]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Activity Log</h1>
        <p className="text-white/40 text-sm mt-1">Track all platform activity and audit trails</p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Search by user or action..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-teal-500/50 focus:ring-teal-500/20"
            />
          </div>
          <Select value={typeFilter} onValueChange={(v) => { setTypeFilter(v); setCurrentPage(1); }}>
            <SelectTrigger className="w-full sm:w-[160px] h-9 bg-white/[0.04] border-white/[0.08] text-white">
              <Filter className="w-3 h-3 mr-1 text-white/30" />
              <SelectValue placeholder="Activity Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
              <SelectItem value="all" className="text-white/70 focus:text-white focus:bg-white/[0.06]">All Types</SelectItem>
              {Object.entries(typeConfig).map(([key, config]) => (
                <SelectItem key={key} value={key} className="text-white/70 focus:text-white focus:bg-white/[0.06]">{config.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Activity Timeline */}
      <div className="space-y-6">
        {Object.entries(groupedActivities).map(([date, activities]) => (
          <div key={date}>
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px flex-1 bg-white/[0.06]" />
              <span className="text-white/30 text-xs font-medium px-3">{date}</span>
              <div className="h-px flex-1 bg-white/[0.06]" />
            </div>
            <div className="space-y-2">
              {activities.map((activity) => {
                const config = typeConfig[activity.type];
                const Icon = config.icon;
                const time = activity.timestamp.split(' ')[1];
                return (
                  <div key={activity.id} className="glass-card rounded-xl p-4 flex items-start gap-4 group hover:border-white/[0.12] transition-colors">
                    {/* Icon */}
                    <div className={`w-9 h-9 rounded-lg ${config.bgColor} flex items-center justify-center shrink-0`}>
                      <Icon className={`w-4 h-4 ${config.color}`} />
                    </div>
                    {/* Content */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Avatar className="h-5 w-5 border border-white/10">
                          <AvatarFallback className="bg-gradient-to-br from-teal-600/40 to-cyan-500/40 text-white text-[8px]">
                            {activity.userInitials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-white text-sm font-medium">{activity.user}</span>
                        <span className="text-white/50 text-sm">{activity.action}</span>
                      </div>
                      {activity.details && (
                        <p className="text-white/30 text-xs mt-1">{activity.details}</p>
                      )}
                      {activity.ip && activity.ip !== 'system' && (
                        <p className="text-white/20 text-[10px] mt-0.5">IP: {activity.ip}</p>
                      )}
                    </div>
                    {/* Meta */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge className={`${config.bgColor} ${config.color} border-0 text-[10px]`}>{config.label}</Badge>
                      <span className="text-white/20 text-xs hidden sm:block">{time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}

        {filteredActivities.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <Activity className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No activity found</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <p className="text-white/30 text-xs">
            Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, filteredActivities.length)} of {filteredActivities.length} activities
          </p>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => setCurrentPage(1)} disabled={currentPage === 1}>
              <ChevronsLeft className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="text-white/40 text-xs px-2">{currentPage} / {totalPages}</span>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}>
              <ChevronRight className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]" onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages}>
              <ChevronsRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
