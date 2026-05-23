'use client';

import React, { useState } from 'react';
import {
  Music,
  Search,
  Play,
  Pause,
  Crown,
  Clock,
  Volume2,
  Filter,
  Grid3X3,
  List,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';

const categories = ['All', 'Corporate', 'Hospitality', 'Retail', 'Healthcare', 'Finance', 'Seasonal', 'Custom'];

const tones = [
  {
    id: 1,
    name: 'Corporate Welcome',
    category: 'Corporate',
    duration: '30s',
    premium: false,
    color: 'from-teal-500/20 to-cyan-500/10',
    description: 'Professional greeting for business calls',
  },
  {
    id: 2,
    name: 'Hotel Ambience',
    category: 'Hospitality',
    duration: '28s',
    premium: true,
    color: 'from-amber-500/20 to-orange-500/10',
    description: 'Warm and inviting hotel welcome tone',
  },
  {
    id: 3,
    name: 'Retail Jingle',
    category: 'Retail',
    duration: '22s',
    premium: false,
    color: 'from-violet-500/20 to-purple-500/10',
    description: 'Catchy retail brand melody',
  },
  {
    id: 4,
    name: 'Clinic Calm',
    category: 'Healthcare',
    duration: '35s',
    premium: true,
    color: 'from-emerald-500/20 to-green-500/10',
    description: 'Soothing tone for medical facilities',
  },
  {
    id: 5,
    name: 'Finance Professional',
    category: 'Finance',
    duration: '25s',
    premium: false,
    color: 'from-blue-500/20 to-indigo-500/10',
    description: 'Trust-inspiring financial services tone',
  },
  {
    id: 6,
    name: 'Holiday Greeting',
    category: 'Seasonal',
    duration: '32s',
    premium: true,
    color: 'from-red-500/20 to-rose-500/10',
    description: 'Festive seasonal greeting for callers',
  },
  {
    id: 7,
    name: 'Startup Vibes',
    category: 'Corporate',
    duration: '20s',
    premium: false,
    color: 'from-teal-500/20 to-emerald-500/10',
    description: 'Modern and energetic startup tone',
  },
  {
    id: 8,
    name: 'Resort Paradise',
    category: 'Hospitality',
    duration: '27s',
    premium: true,
    color: 'from-cyan-500/20 to-sky-500/10',
    description: 'Tropical resort ambient melody',
  },
  {
    id: 9,
    name: 'Shop & Save',
    category: 'Retail',
    duration: '18s',
    premium: false,
    color: 'from-pink-500/20 to-rose-500/10',
    description: 'Upbeat promotional retail tone',
  },
  {
    id: 10,
    name: 'Dental Harmony',
    category: 'Healthcare',
    duration: '30s',
    premium: false,
    color: 'from-emerald-500/20 to-teal-500/10',
    description: 'Gentle waiting room melody',
  },
  {
    id: 11,
    name: 'Bank Trust',
    category: 'Finance',
    duration: '24s',
    premium: true,
    color: 'from-yellow-500/20 to-amber-500/10',
    description: 'Premium banking experience tone',
  },
  {
    id: 12,
    name: 'New Year Celebration',
    category: 'Seasonal',
    duration: '26s',
    premium: false,
    color: 'from-violet-500/20 to-pink-500/10',
    description: 'Celebrate the new year with callers',
  },
];

function ToneCard({ tone }: { tone: typeof tones[0] }) {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="glass-card rounded-xl overflow-hidden group">
      {/* Cover Image Area */}
      <div className={cn('relative h-36 bg-gradient-to-br flex items-center justify-center', tone.color)}>
        {/* Waveform Visualization */}
        <div className="flex items-center gap-[3px]">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'w-[3px] rounded-full transition-all duration-300',
                isPlaying
                  ? 'bg-white/60 animate-pulse'
                  : 'bg-white/20'
              )}
              style={{
                height: `${Math.random() * 28 + 8}px`,
                animationDelay: isPlaying ? `${i * 0.05}s` : undefined,
              }}
            />
          ))}
        </div>

        {/* Play Button Overlay */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/30 transition-colors"
        >
          <div className={cn(
            'flex items-center justify-center size-12 rounded-full transition-all duration-300',
            isPlaying
              ? 'bg-teal-500 shadow-lg shadow-teal-500/30 scale-100'
              : 'bg-white/10 backdrop-blur-sm scale-0 group-hover:scale-100'
          )}>
            {isPlaying ? (
              <Pause className="size-5 text-white" />
            ) : (
              <Play className="size-5 text-white ml-0.5" />
            )}
          </div>
        </button>

        {/* Premium Badge */}
        {tone.premium && (
          <div className="absolute top-3 right-3">
            <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px] px-2">
              <Crown className="size-3 mr-1" />
              Premium
            </Badge>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h3 className="font-semibold text-white text-sm">{tone.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">{tone.description}</p>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4">
          <Badge
            variant="secondary"
            className="bg-white/5 text-slate-400 border-white/10 text-[10px]"
          >
            {tone.category}
          </Badge>
          <div className="flex items-center gap-1 text-xs text-slate-500">
            <Clock className="size-3" />
            {tone.duration}
          </div>
        </div>

        <Button
          size="sm"
          className="w-full bg-teal-500/10 text-teal-400 border border-teal-500/20 hover:bg-teal-500/20 hover:text-teal-300"
          variant="outline"
        >
          <Volume2 className="size-3.5 mr-1.5" />
          Assign to Line
        </Button>
      </div>
    </div>
  );
}

export default function MyTonesPage() {
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredTones = tones.filter((tone) => {
    const matchesSearch = tone.name.toLowerCase().includes(search.toLowerCase()) ||
      tone.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || tone.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">My Tones</h1>
          <p className="text-slate-400 mt-1">
            Browse and manage your ringback tone library
          </p>
        </div>
        <Button className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-500 hover:to-cyan-500 text-white shadow-lg shadow-teal-500/20">
          <Music className="size-4 mr-2" />
          Upload Custom Tone
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-500" />
          <Input
            placeholder="Search tones..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-white/5 border-white/10 text-slate-300 placeholder:text-slate-500 focus-visible:border-teal-500/50 pl-9"
          />
        </div>
      </div>

      {/* Category Tabs */}
      <Tabs value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="bg-white/5 border border-white/10 h-auto flex-wrap gap-1 p-1">
          {categories.map((cat) => (
            <TabsTrigger
              key={cat}
              value={cat}
              className="data-[state=active]:bg-teal-500/15 data-[state=active]:text-teal-400 text-slate-400 text-xs px-3 py-1.5"
            >
              {cat}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Tone Count */}
      <div className="flex items-center gap-2">
        <span className="text-sm text-slate-400">
          Showing <span className="text-white font-medium">{filteredTones.length}</span> tones
        </span>
        {activeCategory !== 'All' && (
          <Badge variant="secondary" className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-[10px]">
            {activeCategory}
          </Badge>
        )}
      </div>

      {/* Tones Grid */}
      {filteredTones.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredTones.map((tone) => (
            <ToneCard key={tone.id} tone={tone} />
          ))}
        </div>
      ) : (
        <div className="glass-card rounded-xl p-12 text-center">
          <Music className="size-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-300 mb-2">No tones found</h3>
          <p className="text-sm text-slate-500">
            Try adjusting your search or filter criteria
          </p>
        </div>
      )}
    </div>
  );
}
