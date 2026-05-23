'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  Users,
  Library,
  CreditCard,
  DollarSign,
  MessageSquare,
  Activity,
  Settings,
  Menu,
  X,
  ChevronLeft,
  Shield,
  Bell,
  Search,
  LogOut,
  User,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';

const navItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'User Management', icon: Users },
  { href: '/admin/tones', label: 'Tone Library', icon: Library },
  { href: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { href: '/admin/revenue', label: 'Revenue', icon: DollarSign },
  { href: '/admin/messages', label: 'Contact Messages', icon: MessageSquare, badge: 3 },
  { href: '/admin/activity', label: 'Activity Log', icon: Activity },
  { href: '/admin/settings', label: 'Platform Settings', icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const isActive = (href: string) => {
    if (href === '/admin') return pathname === '/admin';
    return pathname.startsWith(href);
  };

  return (
    <div className="min-h-screen bg-[#050c18] text-white flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed lg:static inset-y-0 left-0 z-50 flex flex-col bg-[#0a1628] border-r border-white/[0.06] transition-all duration-300',
          collapsed ? 'w-[72px]' : 'w-64',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Sidebar Header */}
        <div className="flex items-center gap-3 px-4 h-16 border-b border-white/[0.06] shrink-0">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-400 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-white" />
          </div>
          {!collapsed && (
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm text-white truncate">TunePoa</span>
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-[10px] px-1.5 py-0 w-fit">
                ADMIN
              </Badge>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto hidden lg:flex h-7 w-7 text-white/50 hover:text-white hover:bg-white/[0.06]"
            onClick={() => setCollapsed(!collapsed)}
          >
            <ChevronLeft className={cn('w-4 h-4 transition-transform', collapsed && 'rotate-180')} />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="ml-auto lg:hidden h-7 w-7 text-white/50 hover:text-white hover:bg-white/[0.06]"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative group',
                  active
                    ? 'bg-gradient-to-r from-teal-500/15 to-cyan-500/5 text-teal-400'
                    : 'text-white/50 hover:text-white hover:bg-white/[0.04]'
                )}
              >
                {active && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 rounded-r-full bg-gradient-to-b from-teal-400 to-cyan-400" />
                )}
                <Icon className={cn('w-5 h-5 shrink-0', active && 'text-teal-400')} />
                {!collapsed && (
                  <>
                    <span className="truncate">{item.label}</span>
                    {item.badge && (
                      <Badge className="ml-auto bg-red-500/20 text-red-400 border-red-500/30 text-[10px] px-1.5 h-5 min-w-[20px] flex items-center justify-center">
                        {item.badge}
                      </Badge>
                    )}
                  </>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        {!collapsed && (
          <div className="p-4 border-t border-white/[0.06]">
            <div className="glass-card rounded-lg p-3">
              <p className="text-xs text-white/40 mb-1">System Status</p>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-xs text-emerald-400 font-medium">All Systems Operational</span>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 border-b border-white/[0.06] bg-[#0a1628]/80 backdrop-blur-xl flex items-center px-4 lg:px-6 gap-4 shrink-0">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white/60 hover:text-white hover:bg-white/[0.06]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </Button>

          {/* Search */}
          <div className="flex-1 max-w-md hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
              <Input
                placeholder="Search admin..."
                className="pl-9 h-9 bg-white/[0.04] border-white/[0.08] text-white placeholder:text-white/30 focus:border-teal-500/50 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative text-white/60 hover:text-white hover:bg-white/[0.06]">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 rounded-full text-[10px] font-bold flex items-center justify-center">
                3
              </span>
            </Button>

            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-white/[0.06] px-2">
                  <Avatar className="h-8 w-8 border border-teal-500/30">
                    <AvatarFallback className="bg-gradient-to-br from-teal-600 to-cyan-500 text-white text-xs font-bold">
                      AD
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-white">Admin User</span>
                    <span className="text-[10px] text-white/40">Super Admin</span>
                  </div>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-48 bg-[#0f1d32] border-white/[0.08]" align="end">
                <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06]">
                  <User className="w-4 h-4 mr-2" /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="text-white/70 focus:text-white focus:bg-white/[0.06]">
                  <Settings className="w-4 h-4 mr-2" /> Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/[0.06]" />
                <DropdownMenuItem className="text-red-400 focus:text-red-300 focus:bg-white/[0.06]">
                  <LogOut className="w-4 h-4 mr-2" /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-[1600px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
