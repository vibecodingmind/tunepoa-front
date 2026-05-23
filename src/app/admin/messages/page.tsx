'use client';

import React, { useState, useMemo } from 'react';
import {
  MessageSquare,
  Search,
  Mail,
  MailOpen,
  MailCheck,
  Archive,
  Reply,
  User,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

// ─── Types ────────────────────────────────────────────────────
type MessageStatus = 'New' | 'Read' | 'Replied' | 'Archived';

interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: MessageStatus;
  date: string;
  assignedTo?: string;
}

// ─── Mock Data ────────────────────────────────────────────────
const mockMessages: ContactMessage[] = [
  { id: '1', name: 'Amina Hassan', email: 'amina@vodacom.co.tz', subject: 'Enterprise Plan Inquiry', message: 'Hi, I am interested in the Enterprise plan for Vodacom Tanzania. We have about 200 phone lines that we would like to set up with custom ringback tones. Can you provide more details on pricing and onboarding?', status: 'New', date: '2025-05-22 14:30' },
  { id: '2', name: 'Joseph Mwangi', email: 'joseph@safaricom.ke', subject: 'Custom Tone Upload Issue', message: 'I have been trying to upload a custom tone for the past 2 days but the upload keeps failing. The file is an MP3, 3MB in size. Please help resolve this issue.', status: 'New', date: '2025-05-22 11:15' },
  { id: '3', name: 'Fatima Abubakar', email: 'fatima@airtel.co.tz', subject: 'Billing Question', message: 'I noticed a discrepancy in my latest invoice. The amount charged does not match my plan rate. Can someone look into this?', status: 'New', date: '2025-05-21 16:45' },
  { id: '4', name: 'David Okafor', email: 'david@mtn.ng', subject: 'Request for Account Reactivation', message: 'My account was deactivated due to a missed payment. I have now cleared the outstanding balance. Please reactivate my account.', status: 'Read', date: '2025-05-21 09:20', assignedTo: 'Admin User' },
  { id: '5', name: 'Grace Mrema', email: 'grace@tigo.co.tz', subject: 'Bulk Tone Assignment', message: 'Is there a way to assign the same tone to all my phone lines at once instead of doing it one by one? I have 8 lines and it takes forever.', status: 'Read', date: '2025-05-20 15:10', assignedTo: 'Admin User' },
  { id: '6', name: 'Samuel Ndegwa', email: 'samuel@safaricom.ke', subject: 'API Integration Support', message: 'We are looking to integrate TunePoa with our internal CRM system. Do you have API documentation available? We need to automate tone assignments based on caller groups.', status: 'Replied', date: '2025-05-19 10:30', assignedTo: 'Admin User' },
  { id: '7', name: 'Maria Kimaro', email: 'maria@vodacom.co.tz', subject: 'Tone Quality Issue', message: 'The tone we purchased sounds distorted when played on certain phone models. Can you look into the audio quality? It seems like the encoding might be off.', status: 'Replied', date: '2025-05-18 13:45', assignedTo: 'Admin User' },
  { id: '8', name: 'Ahmed Saleh', email: 'ahmed@airtel.co.tz', subject: 'Trial Extension Request', message: 'My 14-day trial is about to expire but I have not had enough time to evaluate the platform. Could you extend my trial by another week?', status: 'Read', date: '2025-05-17 08:55', assignedTo: 'Admin User' },
  { id: '9', name: 'Peter Odhiambo', email: 'peter@telkom.ke', subject: 'Partnership Opportunity', message: 'We are Telkom Kenya and interested in a strategic partnership for ringback tone services across our network. Let us discuss potential collaboration.', status: 'Archived', date: '2025-05-15 14:20', assignedTo: 'Admin User' },
  { id: '10', name: 'Lucy Mwanyika', email: 'lucy@vodacom.co.tz', subject: 'Schedule Tone Change', message: 'I want to schedule a different tone for business hours vs after hours. Is this possible with the Pro plan? If not, which plan supports this feature?', status: 'Replied', date: '2025-05-14 11:00', assignedTo: 'Admin User' },
  { id: '11', name: 'Hassan Juma', email: 'hassan@zantel.co.tz', subject: 'Feature Request: Analytics Dashboard', message: 'It would be great to see analytics on which tones are being played most often and how callers are responding. Any plans for an analytics dashboard?', status: 'New', date: '2025-05-22 09:00' },
  { id: '12', name: 'Esther Wambui', email: 'esther@safaricom.ke', subject: 'Multi-language Tone Support', message: 'Do you support tones in Swahili and other local languages? We would like to have bilingual tones for our customer base in Kenya.', status: 'Read', date: '2025-05-16 16:30', assignedTo: 'Admin User' },
];

const statusStyles: Record<MessageStatus, string> = {
  New: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  Read: 'bg-sky-500/20 text-sky-400 border-sky-500/30',
  Replied: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Archived: 'bg-white/10 text-white/40 border-white/10',
};

const statusIcons: Record<MessageStatus, React.ElementType> = {
  New: Mail,
  Read: MailOpen,
  Replied: MailCheck,
  Archived: Archive,
};

export default function ContactMessagesPage() {
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [replyDialogOpen, setReplyDialogOpen] = useState(false);
  const [replyTo, setReplyTo] = useState<ContactMessage | null>(null);

  const filteredMessages = useMemo(() => {
    return mockMessages.filter((msg) => {
      const matchesStatus = statusFilter === 'all' || msg.status === statusFilter;
      const matchesSearch =
        msg.name.toLowerCase().includes(search.toLowerCase()) ||
        msg.subject.toLowerCase().includes(search.toLowerCase()) ||
        msg.email.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [statusFilter, search]);

  const statusCounts = useMemo(() => ({
    New: mockMessages.filter((m) => m.status === 'New').length,
    Read: mockMessages.filter((m) => m.status === 'Read').length,
    Replied: mockMessages.filter((m) => m.status === 'Replied').length,
    Archived: mockMessages.filter((m) => m.status === 'Archived').length,
  }), []);

  const handleReply = (msg: ContactMessage) => {
    setReplyTo(msg);
    setReplyDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Contact Messages</h1>
        <p className="text-white/40 text-sm mt-1">{mockMessages.length} messages · {statusCounts.New} unread</p>
      </div>

      {/* Status Tabs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {(['New', 'Read', 'Replied', 'Archived'] as MessageStatus[]).map((status) => {
          const Icon = statusIcons[status];
          return (
            <button
              key={status}
              onClick={() => setStatusFilter(statusFilter === status ? 'all' : status)}
              className={`glass-card rounded-xl p-4 flex items-center gap-3 transition-all ${
                statusFilter === status ? 'border-teal-500/40 ring-1 ring-teal-500/20' : ''
              }`}
            >
              <Icon className={`w-5 h-5 ${statusFilter === status ? 'text-teal-400' : 'text-white/30'}`} />
              <div className="text-left">
                <p className="text-white/40 text-xs">{status}</p>
                <p className="text-white font-bold text-lg">{statusCounts[status]}</p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="glass-card rounded-xl p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <Input
            placeholder="Search by name, subject, or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-teal-500/50 focus:ring-teal-500/20"
          />
        </div>
      </div>

      {/* Messages List */}
      <div className="space-y-2">
        {filteredMessages.map((msg) => {
          const isExpanded = expandedId === msg.id;
          const StatusIcon = statusIcons[msg.status];
          return (
            <div key={msg.id} className="glass-card rounded-xl overflow-hidden">
              {/* Message Header */}
              <button
                onClick={() => setExpandedId(isExpanded ? null : msg.id)}
                className="w-full flex items-center gap-4 p-4 hover:bg-white/[0.02] transition-colors text-left"
              >
                <Avatar className="h-10 w-10 border border-white/10 shrink-0">
                  <AvatarFallback className="bg-gradient-to-br from-teal-600/40 to-cyan-500/40 text-white text-xs">
                    {msg.name.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-white text-sm font-medium truncate">{msg.name}</p>
                    <Badge className={statusStyles[msg.status]}>{msg.status}</Badge>
                  </div>
                  <p className="text-white/60 text-sm truncate">{msg.subject}</p>
                  <p className="text-white/30 text-xs mt-0.5">{msg.email}</p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <div className="hidden sm:flex items-center gap-1 text-white/20 text-xs">
                    <Clock className="w-3 h-3" />
                    {msg.date}
                  </div>
                  {isExpanded ? (
                    <ChevronUp className="w-4 h-4 text-white/30" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-white/30" />
                  )}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div className="px-4 pb-4 border-t border-white/[0.06] pt-4">
                  <div className="bg-white/[0.03] rounded-lg p-4 mb-4">
                    <p className="text-white/70 text-sm leading-relaxed">{msg.message}</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-4 text-xs text-white/30">
                      <span>From: {msg.email}</span>
                      {msg.assignedTo && <span>Assigned to: {msg.assignedTo}</span>}
                    </div>
                    <div className="flex items-center gap-2">
                      {msg.status === 'New' && (
                        <Button variant="ghost" size="sm" className="text-sky-400 hover:text-sky-300 hover:bg-white/[0.06] h-8">
                          <MailOpen className="w-4 h-4 mr-1" /> Mark Read
                        </Button>
                      )}
                      {msg.status === 'Read' && (
                        <Button variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/[0.06] h-8">
                          <Mail className="w-4 h-4 mr-1" /> Mark Unread
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-amber-400 hover:text-amber-300 hover:bg-white/[0.06] h-8"
                        onClick={() => handleReply(msg)}
                      >
                        <Reply className="w-4 h-4 mr-1" /> Reply
                      </Button>
                      <Button variant="ghost" size="sm" className="text-white/40 hover:text-white hover:bg-white/[0.06] h-8">
                        <Archive className="w-4 h-4 mr-1" /> Archive
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filteredMessages.length === 0 && (
          <div className="glass-card rounded-xl p-12 text-center">
            <MessageSquare className="w-12 h-12 text-white/10 mx-auto mb-3" />
            <p className="text-white/30 text-sm">No messages found</p>
          </div>
        )}
      </div>

      {/* Reply Dialog */}
      <Dialog open={replyDialogOpen} onOpenChange={setReplyDialogOpen}>
        <DialogContent className="bg-[#0a1628] border-white/[0.08] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Reply to {replyTo?.name}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="bg-white/[0.03] rounded-lg p-3">
              <p className="text-white/30 text-xs mb-1">Original message:</p>
              <p className="text-white/60 text-sm">{replyTo?.subject}</p>
              <p className="text-white/40 text-xs mt-1">{replyTo?.message.substring(0, 150)}...</p>
            </div>
            <div className="space-y-2">
              <label className="text-white/60 text-sm">Reply</label>
              <Textarea
                placeholder="Type your reply..."
                className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 min-h-[120px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setReplyDialogOpen(false)} className="text-white/60 hover:text-white hover:bg-white/[0.06]">
              Cancel
            </Button>
            <Button onClick={() => setReplyDialogOpen(false)} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
              <Send className="w-4 h-4 mr-2" /> Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
