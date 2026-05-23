'use client';

import React, { useState, useMemo } from 'react';
import {
  Music,
  Search,
  Play,
  Pause,
  Crown,
  Clock,
  Volume2,
  Plus,
  Grid3X3,
  List,
  Upload,
  Phone,
  MoreHorizontal,
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

// ─── Types ────────────────────────────────────────────────────
type ToneCategory = 'Corporate' | 'Hospitality' | 'Retail' | 'Healthcare' | 'Finance' | 'Seasonal' | 'Custom';

interface Tone {
  id: string;
  name: string;
  category: ToneCategory;
  duration: string;
  durationSec: number;
  isPremium: boolean;
  color: string;
  description: string;
  assignedTo: string | null;
  playCount: number;
}

// ─── Mock Data ────────────────────────────────────────────────
const categories: ToneCategory[] = ['Corporate', 'Hospitality', 'Retail', 'Healthcare', 'Finance', 'Seasonal', 'Custom'];

const tones: Tone[] = [
  { id: '1', name: 'Corporate Welcome', category: 'Corporate', duration: '0:30', durationSec: 30, isPremium: false, color: 'from-teal-500 to-cyan-400', description: 'Professional greeting for business calls', assignedTo: '+255 712 345 678', playCount: 3420 },
  { id: '2', name: 'Hotel Ambience', category: 'Hospitality', duration: '0:28', durationSec: 28, isPremium: true, color: 'from-amber-500 to-orange-400', description: 'Warm and inviting hotel welcome tone', assignedTo: '+255 789 012 345', playCount: 2890 },
  { id: '3', name: 'Retail Jingle', category: 'Retail', duration: '0:22', durationSec: 22, isPremium: false, color: 'from-violet-500 to-purple-400', description: 'Catchy retail brand melody', assignedTo: '+254 722 456 789', playCount: 1540 },
  { id: '4', name: 'Clinic Calm', category: 'Healthcare', duration: '0:35', durationSec: 35, isPremium: true, color: 'from-emerald-500 to-green-400', description: 'Soothing tone for medical facilities', assignedTo: null, playCount: 980 },
  { id: '5', name: 'Finance Professional', category: 'Finance', duration: '0:25', durationSec: 25, isPremium: false, color: 'from-blue-500 to-indigo-400', description: 'Trust-inspiring financial services tone', assignedTo: null, playCount: 2100 },
  { id: '6', name: 'Holiday Greeting', category: 'Seasonal', duration: '0:32', durationSec: 32, isPremium: true, color: 'from-red-500 to-rose-400', description: 'Festive seasonal greeting for callers', assignedTo: null, playCount: 4500 },
  { id: '7', name: 'Startup Vibes', category: 'Corporate', duration: '0:20', durationSec: 20, isPremium: false, color: 'from-teal-500 to-emerald-400', description: 'Modern and energetic startup tone', assignedTo: null, playCount: 1200 },
  { id: '8', name: 'Resort Paradise', category: 'Hospitality', duration: '0:27', durationSec: 27, isPremium: true, color: 'from-cyan-500 to-sky-400', description: 'Tropical resort ambient melody', assignedTo: null, playCount: 890 },
  { id: '9', name: 'Shop & Save', category: 'Retail', duration: '0:18', durationSec: 18, isPremium: false, color: 'from-pink-500 to-rose-400', description: 'Upbeat promotional retail tone', assignedTo: null, playCount: 670 },
  { id: '10', name: 'Dental Harmony', category: 'Healthcare', duration: '0:30', durationSec: 30, isPremium: false, color: 'from-emerald-500 to-teal-400', description: 'Gentle waiting room melody', assignedTo: null, playCount: 430 },
  { id: '11', name: 'Bank Trust', category: 'Finance', duration: '0:24', durationSec: 24, isPremium: true, color: 'from-yellow-500 to-amber-400', description: 'Premium banking experience tone', assignedTo: null, playCount: 3200 },
  { id: '12', name: 'New Year Celebration', category: 'Seasonal', duration: '0:26', durationSec: 26, isPremium: false, color: 'from-violet-500 to-pink-400', description: 'Celebrate the new year with callers', assignedTo: null, playCount: 5600 },
];

const phoneLines = [
  '+255 712 345 678',
  '+255 789 012 345',
  '+254 722 456 789',
  '+255 689 234 567',
  '+255 654 789 012',
];

export default function MyTonesPage() {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [premiumFilter, setPremiumFilter] = useState<string>('all');
  const [activeTab, setActiveTab] = useState('all');
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const [assignDialogOpen, setAssignDialogOpen] = useState(false);
  const [selectedTone, setSelectedTone] = useState<Tone | null>(null);
  const [selectedLine, setSelectedLine] = useState<string>('');
  const [isPremium, setIsPremium] = useState(false);
  const [playingId, setPlayingId] = useState<string | null>(null);

  const filteredTones = useMemo(() => {
    return tones.filter((tone) => {
      const matchesSearch = tone.name.toLowerCase().includes(search.toLowerCase()) ||
        tone.description.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = categoryFilter === 'all' || tone.category === categoryFilter;
      const matchesPremium = premiumFilter === 'all' ||
        (premiumFilter === 'premium' && tone.isPremium) ||
        (premiumFilter === 'standard' && !tone.isPremium);
      const matchesTab = activeTab === 'all' || tone.category === activeTab;
      return matchesSearch && matchesCategory && matchesPremium && matchesTab;
    });
  }, [search, categoryFilter, premiumFilter, activeTab]);

  const openAssignDialog = (tone: Tone) => {
    setSelectedTone(tone);
    setSelectedLine('');
    setAssignDialogOpen(true);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Tones</h1>
          <p className="text-white/40 text-sm mt-1">
            {tones.length} tones · {tones.filter(t => t.assignedTo).length} assigned · {tones.filter(t => t.isPremium).length} premium
          </p>
        </div>
        <Button onClick={() => setUploadDialogOpen(true)} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
          <Plus className="w-4 h-4 mr-2" /> Upload Custom Tone
        </Button>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-white/[0.04] border border-white/[0.06] h-10">
          <TabsTrigger value="all" className="text-white/50 data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 data-[state=active]:shadow-none">All</TabsTrigger>
          {categories.slice(0, 5).map((cat) => (
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
          <Select value={premiumFilter} onValueChange={setPremiumFilter}>
            <SelectTrigger className="w-full sm:w-[130px] h-9 bg-white/[0.04] border-white/[0.08] text-white">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
              <SelectItem value="all" className="text-white/70 focus:text-white focus:bg-white/[0.06]">All Types</SelectItem>
              <SelectItem value="premium" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Premium</SelectItem>
              <SelectItem value="standard" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Standard</SelectItem>
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
        filteredTones.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredTones.map((tone) => (
              <div key={tone.id} className="glass-card rounded-xl overflow-hidden group">
                {/* Cover */}
                <div className={`h-28 bg-gradient-to-br ${tone.color} relative flex items-center justify-center`}>
                  {/* Waveform Visualization */}
                  <div className="flex items-center gap-[2px]">
                    {Array.from({ length: 20 }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          'w-[2px] rounded-full transition-all duration-300',
                          playingId === tone.id
                            ? 'bg-white/60 animate-pulse'
                            : 'bg-white/20'
                        )}
                        style={{
                          height: `${Math.random() * 24 + 6}px`,
                          animationDelay: playingId === tone.id ? `${i * 0.05}s` : undefined,
                        }}
                      />
                    ))}
                  </div>
                  {/* Play Button Overlay */}
                  <button
                    onClick={() => setPlayingId(playingId === tone.id ? null : tone.id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors"
                  >
                    <div className={cn(
                      'flex items-center justify-center size-10 rounded-full transition-all duration-300',
                      playingId === tone.id
                        ? 'bg-teal-500 shadow-lg shadow-teal-500/30 scale-100'
                        : 'bg-white/10 backdrop-blur-sm scale-0 group-hover:scale-100'
                    )}>
                      {playingId === tone.id ? (
                        <Pause className="size-4 text-white" />
                      ) : (
                        <Play className="size-4 text-white ml-0.5" />
                      )}
                    </div>
                  </button>
                  {/* Badges */}
                  {tone.isPremium && (
                    <Badge className="absolute top-2 right-2 bg-amber-500/80 text-white border-0 text-[10px]">
                      <Crown className="w-3 h-3 mr-0.5" /> Premium
                    </Badge>
                  )}
                  {tone.assignedTo && (
                    <Badge className="absolute top-2 left-2 bg-teal-500/80 text-white border-0 text-[10px]">
                      <Volume2 className="w-3 h-3 mr-0.5" /> Active
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
                        <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06] cursor-pointer" onClick={() => openAssignDialog(tone)}>
                          <Volume2 className="w-4 h-4 mr-2" /> Assign to Line
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/[0.06]" />
                        <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-white/[0.06] cursor-pointer">
                          Remove Tone
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                  {tone.assignedTo && (
                    <p className="text-teal-400/60 text-xs mt-1">→ {tone.assignedTo}</p>
                  )}
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-1 text-white/30 text-xs">
                      <Play className="w-3 h-3" /> {tone.playCount.toLocaleString()} plays
                    </div>
                    <Button
                      size="sm"
                      className="bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 hover:text-teal-300 h-7 text-xs"
                      variant="outline"
                      onClick={() => openAssignDialog(tone)}
                    >
                      {tone.assignedTo ? 'Reassign' : 'Assign'}
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-card rounded-xl p-12 text-center">
            <Music className="w-12 h-12 text-white/20 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white/70 mb-2">No tones found</h3>
            <p className="text-sm text-white/30">Try adjusting your search or filter criteria</p>
          </div>
        )
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
                  <th className="h-11 px-4 text-left text-xs font-medium text-white/40">Assigned To</th>
                  <th className="h-11 px-4 text-right text-xs font-medium text-white/40">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTones.map((tone) => (
                  <tr key={tone.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${tone.color} flex items-center justify-center shrink-0`}>
                          <Music className="w-4 h-4 text-white/40" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{tone.name}</p>
                          <div className="flex items-center gap-2 mt-0.5">
                            {tone.isPremium && (
                              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] h-4 px-1"><Crown className="w-2.5 h-2.5 mr-0.5" />Pro</Badge>
                            )}
                            <span className="text-white/30 text-xs">{tone.description.slice(0, 30)}...</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-white/60 text-sm">{tone.category}</td>
                    <td className="px-4 py-3 text-white/40 text-sm">{tone.duration}</td>
                    <td className="px-4 py-3">
                      <Badge className={tone.assignedTo ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-white/40 border-white/10'}>
                        {tone.assignedTo ? 'Active' : 'Unassigned'}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-white/40 text-sm">{tone.playCount.toLocaleString()}</td>
                    <td className="px-4 py-3 text-white/50 text-sm">{tone.assignedTo || '—'}</td>
                    <td className="px-4 py-3 text-right">
                      <Button
                        size="sm"
                        className="bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 hover:text-teal-300 h-7 text-xs"
                        variant="outline"
                        onClick={() => openAssignDialog(tone)}
                      >
                        {tone.assignedTo ? 'Reassign' : 'Assign'}
                      </Button>
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
            <DialogTitle className="text-white">Upload Custom Tone</DialogTitle>
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
                <Upload className="w-8 h-8 text-white/20 mx-auto mb-2" />
                <p className="text-white/40 text-sm">Click to upload or drag and drop</p>
                <p className="text-white/20 text-xs mt-1">MP3, WAV up to 10MB</p>
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

      {/* Assign to Line Dialog */}
      <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
        <DialogContent className="bg-[#0a1628] border-white/[0.08] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Assign Tone to Phone Line</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Tone</Label>
              <div className="glass-card rounded-lg p-3 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${selectedTone?.color || 'from-teal-500 to-cyan-400'} flex items-center justify-center`}>
                  <Music className="w-4 h-4 text-white/40" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{selectedTone?.name}</p>
                  <p className="text-white/30 text-xs">{selectedTone?.category} · {selectedTone?.duration}</p>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Phone Line</Label>
              <Select value={selectedLine} onValueChange={setSelectedLine}>
                <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white">
                  <SelectValue placeholder="Select a phone line" />
                </SelectTrigger>
                <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
                  {phoneLines.map((line) => (
                    <SelectItem key={line} value={line} className="text-white/70 focus:text-white focus:bg-white/[0.06]">
                      <div className="flex items-center gap-2">
                        <Phone className="w-3 h-3" />
                        {line}
                      </div>
                    </SelectItem>
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
