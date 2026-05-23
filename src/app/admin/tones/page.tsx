'use client';

import React, { useState, useMemo } from 'react';
import {
  Library,
  Search,
  Filter,
  Plus,
  Grid3X3,
  List,
  Play,
  MoreHorizontal,
  Pencil,
  Check,
  X,
  Trash2,
  Crown,
  Clock,
  Music,
} from 'lucide-react';
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

// ─── Types ────────────────────────────────────────────────────
type ToneStatus = 'Approved' | 'Pending' | 'Rejected' | 'Archived';
type ToneCategory = 'Corporate' | 'Holiday' | 'Music' | 'Voice' | 'Promo';

interface Tone {
  id: string;
  name: string;
  category: ToneCategory;
  duration: string;
  status: ToneStatus;
  playCount: number;
  isPremium: boolean;
  coverColor: string;
  uploadedBy: string;
  uploadedAt: string;
}

// ─── Mock Data ────────────────────────────────────────────────
const mockTones: Tone[] = [
  { id: '1', name: 'Serenade of Dar', category: 'Music', duration: '0:32', status: 'Approved', playCount: 14520, isPremium: true, coverColor: 'from-teal-500 to-cyan-400', uploadedBy: 'Admin', uploadedAt: '2025-05-10' },
  { id: '2', name: 'Karibu Sana', category: 'Corporate', duration: '0:28', status: 'Approved', playCount: 8930, isPremium: false, coverColor: 'from-violet-500 to-purple-400', uploadedBy: 'Admin', uploadedAt: '2025-05-08' },
  { id: '3', name: 'Festive Cheer', category: 'Holiday', duration: '0:35', status: 'Approved', playCount: 23100, isPremium: true, coverColor: 'from-rose-500 to-pink-400', uploadedBy: 'Joseph Mwangi', uploadedAt: '2025-04-20' },
  { id: '4', name: 'Welcome Message', category: 'Voice', duration: '0:20', status: 'Approved', playCount: 56200, isPremium: false, coverColor: 'from-emerald-500 to-green-400', uploadedBy: 'Admin', uploadedAt: '2025-04-15' },
  { id: '5', name: 'Sauti ya Pwani', category: 'Music', duration: '0:40', status: 'Pending', playCount: 0, isPremium: false, coverColor: 'from-amber-500 to-yellow-400', uploadedBy: 'Amina Hassan', uploadedAt: '2025-05-18' },
  { id: '6', name: 'Holiday Greetings', category: 'Holiday', duration: '0:25', status: 'Pending', playCount: 0, isPremium: false, coverColor: 'from-red-500 to-orange-400', uploadedBy: 'Fatima Abubakar', uploadedAt: '2025-05-17' },
  { id: '7', name: 'Promo Deal Alert', category: 'Promo', duration: '0:15', status: 'Approved', playCount: 34200, isPremium: true, coverColor: 'from-sky-500 to-blue-400', uploadedBy: 'Admin', uploadedAt: '2025-03-10' },
  { id: '8', name: 'Corporate Branding', category: 'Corporate', duration: '0:30', status: 'Approved', playCount: 19400, isPremium: true, coverColor: 'from-indigo-500 to-blue-400', uploadedBy: 'Admin', uploadedAt: '2025-02-28' },
  { id: '9', name: 'Loud Beats v2', category: 'Music', duration: '0:45', status: 'Rejected', playCount: 0, isPremium: false, coverColor: 'from-gray-500 to-gray-400', uploadedBy: 'David Okafor', uploadedAt: '2025-05-15' },
  { id: '10', name: 'Bongo Flava Mix', category: 'Music', duration: '0:38', status: 'Approved', playCount: 41300, isPremium: true, coverColor: 'from-pink-500 to-rose-400', uploadedBy: 'Admin', uploadedAt: '2025-01-20' },
  { id: '11', name: 'Thank You Message', category: 'Voice', duration: '0:12', status: 'Approved', playCount: 67800, isPremium: false, coverColor: 'from-emerald-500 to-teal-400', uploadedBy: 'Admin', uploadedAt: '2025-01-05' },
  { id: '12', name: 'Eid Mubarak', category: 'Holiday', duration: '0:30', status: 'Archived', playCount: 8900, isPremium: false, coverColor: 'from-teal-500 to-emerald-400', uploadedBy: 'Admin', uploadedAt: '2024-04-10' },
  { id: '13', name: 'Flash Sale Alert', category: 'Promo', duration: '0:18', status: 'Approved', playCount: 28500, isPremium: false, coverColor: 'from-orange-500 to-amber-400', uploadedBy: 'Admin', uploadedAt: '2025-04-01' },
  { id: '14', name: 'Afrobeat Ring', category: 'Music', duration: '0:33', status: 'Approved', playCount: 31200, isPremium: true, coverColor: 'from-fuchsia-500 to-pink-400', uploadedBy: 'Admin', uploadedAt: '2025-03-15' },
  { id: '15', name: 'On Hold Jazz', category: 'Music', duration: '0:50', status: 'Pending', playCount: 0, isPremium: false, coverColor: 'from-cyan-500 to-sky-400', uploadedBy: 'Grace Mrema', uploadedAt: '2025-05-19' },
  { id: '16', name: 'Please Wait Tone', category: 'Voice', duration: '0:10', status: 'Approved', playCount: 98100, isPremium: false, coverColor: 'from-green-500 to-emerald-400', uploadedBy: 'Admin', uploadedAt: '2024-12-01' },
];

const categories: ToneCategory[] = ['Corporate', 'Holiday', 'Music', 'Voice', 'Promo'];

const statusStyles: Record<ToneStatus, string> = {
  Approved: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  Pending: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  Rejected: 'bg-red-500/20 text-red-400 border-red-500/30',
  Archived: 'bg-white/10 text-white/40 border-white/10',
};

export default function ToneLibraryPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  const filteredTones = useMemo(() => {
    return mockTones.filter((tone) => {
      const matchesSearch = tone.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || tone.category === categoryFilter;
      const matchesStatus = statusFilter === 'all' || tone.status === statusFilter;
      const matchesTab = activeTab === 'all' || tone.category === activeTab;
      return matchesSearch && matchesCategory && matchesStatus && matchesTab;
    });
  }, [search, categoryFilter, statusFilter, activeTab]);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Tone Library</h1>
          <p className="text-white/40 text-sm mt-1">{mockTones.length} tones · {mockTones.filter(t => t.status === 'Approved').length} approved</p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
          <Plus className="w-4 h-4 mr-2" /> Upload Tone
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/[0.04] border border-white/[0.06] h-10">
          <TabsTrigger value="all" className="text-white/50 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 data-[state=active]:shadow-none">All</TabsTrigger>
          {categories.map((cat) => (
            <TabsTrigger key={cat} value={cat} className="text-white/50 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 data-[state=active]:shadow-none">
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Filters & View Toggle */}
      <div className="glass-card rounded-xl p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <Input
              placeholder="Search tones..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-teal-500/50 focus:ring-teal-500/20"
            />
          </div>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-full sm:w-[140px] h-9 bg-white/[0.04] border-white/[0.08] text-white">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
              <SelectItem value="all" className="text-white/70 focus:text-white focus:bg-white/[0.06]">All Categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="text-white/70 focus:text-white focus:bg-white/[0.06]">{c}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[140px] h-9 bg-white/[0.04] border-white/[0.08] text-white">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
              <SelectItem value="all" className="text-white/70 focus:text-white focus:bg-white/[0.06]">All Status</SelectItem>
              <SelectItem value="Approved" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Approved</SelectItem>
              <SelectItem value="Pending" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Pending</SelectItem>
              <SelectItem value="Rejected" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Rejected</SelectItem>
              <SelectItem value="Archived" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Archived</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex border border-white/[0.08] rounded-lg overflow-hidden">
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none ${viewMode === 'grid' ? 'bg-teal-500/20 text-teal-400' : 'text-white/40 hover:text-white hover:bg-white/[0.06]'}`}
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={`h-9 w-9 rounded-none ${viewMode === 'list' ? 'bg-teal-500/20 text-teal-400' : 'text-white/40 hover:text-white hover:bg-white/[0.06]'}`}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTones.map((tone) => (
            <div key={tone.id} className="glass-card rounded-xl overflow-hidden group">
              {/* Cover */}
              <div className={`h-28 bg-gradient-to-br ${tone.coverColor} relative flex items-center justify-center`}>
                <Music className="w-10 h-10 text-white/30" />
                <button className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white" />
                </button>
                {tone.isPremium && (
                  <Badge className="absolute top-2 right-2 bg-amber-500/80 text-white border-0 text-[10px]">
                    <Crown className="w-3 h-3 mr-0.5" /> Premium
                  </Badge>
                )}
              </div>
              {/* Info */}
              <div className="p-4">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <p className="text-white text-sm font-medium truncate">{tone.name}</p>
                    <p className="text-white/30 text-xs mt-0.5">{tone.category} · {tone.duration}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7 shrink-0 text-white/40 hover:text-white hover:bg-white/[0.06]">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-40 bg-[#0f1d32] border-white/[0.08]" align="end">
                      <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06]">
                        <Pencil className="w-4 h-4 mr-2" /> Edit
                      </DropdownMenuItem>
                      {tone.status === 'Pending' && (
                        <>
                          <DropdownMenuItem className="text-emerald-400 focus:text-emerald-300 focus:bg-white/[0.06]">
                            <Check className="w-4 h-4 mr-2" /> Approve
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-white/[0.06]">
                            <X className="w-4 h-4 mr-2" /> Reject
                          </DropdownMenuItem>
                        </>
                      )}
                      <DropdownMenuSeparator className="bg-white/[0.06]" />
                      <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-white/[0.06]">
                        <Trash2 className="w-4 h-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="flex items-center justify-between mt-3">
                  <Badge className={statusStyles[tone.status]}>{tone.status}</Badge>
                  <div className="flex items-center gap-1 text-white/30 text-xs">
                    <Play className="w-3 h-3" /> {tone.playCount > 0 ? tone.playCount.toLocaleString() : '—'}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="glass-card rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/[0.06]">
                  <th className="h-11 px-4 text-left text-xs font-medium text-white/40">Tone</th>
                  <th className="h-11 px-4 text-left text-xs font-medium text-white/40">Category</th>
                  <th className="h-11 px-4 text-left text-xs font-medium text-white/40">Duration</th>
                  <th className="h-11 px-4 text-left text-xs font-medium text-white/40">Status</th>
                  <th className="h-11 px-4 text-left text-xs font-medium text-white/40">Plays</th>
                  <th className="h-11 px-4 text-left text-xs font-medium text-white/40">Premium</th>
                  <th className="h-11 px-4 text-right text-xs font-medium text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTones.map((tone) => (
                  <tr key={tone.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tone.coverColor} flex items-center justify-center shrink-0`}>
                          <Music className="w-4 h-4 text-white/40" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{tone.name}</p>
                          <p className="text-white/30 text-xs">by {tone.uploadedBy} · {tone.uploadedAt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm">{tone.category}</td>
                    <td className="px-4 py-3 text-white/40 text-sm">{tone.duration}</td>
                    <td className="px-4 py-3"><Badge className={statusStyles[tone.status]}>{tone.status}</Badge></td>
                    <td className="px-4 py-3 text-white/40 text-sm">{tone.playCount > 0 ? tone.playCount.toLocaleString() : '—'}</td>
                    <td className="px-4 py-3">
                      {tone.isPremium ? (
                        <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30"><Crown className="w-3 h-3 mr-0.5" /> Yes</Badge>
                      ) : (
                        <span className="text-white/20 text-sm">No</span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-white/40 hover:text-white hover:bg-white/[0.06]">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 bg-[#0f1d32] border-white/[0.08]" align="end">
                          <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06]"><Pencil className="w-4 h-4 mr-2" /> Edit</DropdownMenuItem>
                          {tone.status === 'Pending' && (
                            <>
                              <DropdownMenuItem className="text-emerald-400 focus:text-emerald-300 focus:bg-white/[0.06]"><Check className="w-4 h-4 mr-2" /> Approve</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-white/[0.06]"><X className="w-4 h-4 mr-2" /> Reject</DropdownMenuItem>
                            </>
                          )}
                          <DropdownMenuSeparator className="bg-white/[0.06]" />
                          <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-white/[0.06]"><Trash2 className="w-4 h-4 mr-2" /> Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={uploadDialogOpen} onOpenChange={setUploadDialogOpen}>
        <DialogContent className="bg-[#0a1628] border-white/[0.08] text-white sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Upload New Tone</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Tone Name</Label>
              <Input placeholder="Enter tone name" className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30" />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Category</Label>
              <Select>
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="text-white/70 focus:text-white focus:bg-white/[0.06]">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Audio File</Label>
              <div className="border-2 border-dashed border-white/[0.1] rounded-lg p-6 text-center hover:border-teal-500/30 transition-colors cursor-pointer">
                <Music className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">Click to upload or drag and drop</p>
                <p className="text-white/20 text-xs mt-1">MP3, WAV up to 10MB</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Cover Image</Label>
              <div className="border-2 border-dashed border-white/[0.1] rounded-lg p-4 text-center hover:border-teal-500/30 transition-colors cursor-pointer">
                <p className="text-white/40 text-xs">Click to upload cover image (optional)</p>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Description</Label>
              <Textarea placeholder="Describe this tone..." className="bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 min-h-[80px]" />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-white/60 text-sm">Premium Tone</Label>
                <p className="text-white/30 text-xs">Premium tones are only available to Pro and Enterprise plans</p>
              </div>
              <Switch checked={isPremium} onCheckedChange={setIsPremium} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setUploadDialogOpen(false)} className="text-white/60 hover:text-white hover:bg-white/[0.06]">Cancel</Button>
            <Button onClick={() => setUploadDialogOpen(false)} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
              Upload Tone
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
