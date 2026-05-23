'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Music,
  Phone,
  CreditCard,
  Receipt,
  Activity,
  Settings,
  LogOut,
  ChevronLeft,
  Menu,
  ArrowLeft,
  Bell,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
  { href: '/dashboard/tones', label: 'My Tones', icon: Music },
  { href: '/dashboard/lines', label: 'Phone Lines', icon: Phone },
  { href: '/dashboard/subscription', label: 'Subscription', icon: CreditCard },
  { href: '/dashboard/billing', label: 'Billing', icon: Receipt },
  { href: '/dashboard/activity', label: 'Activity Log', icon: Activity },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

function SidebarNav({ onNavClick }: { onNavClick?: () => void }) {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 px-3">
      {navItems.map((item) => {
        const isActive =
          item.href === '/dashboard'
            ? pathname === '/dashboard'
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavClick}
            className={cn(
              'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
              isActive
                ? 'bg-teal-500/15 text-teal-400 shadow-sm shadow-teal-500/5'
                : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            )}
          >
            <item.icon className={cn('size-4.5 shrink-0', isActive ? 'text-teal-400' : 'text-slate-500')} />
            <span>{item.label}</span>
            {isActive && (
              <div className="ml-auto size-1.5 rounded-full bg-teal-400" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarFooter() {
  return (
    <div className="mt-auto border-t border-white/5 px-3 pt-4">
      <div className="flex items-center gap-3 rounded-lg px-3 py-2">
        <Avatar className="size-9 border border-white/10">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-teal-500/20 text-teal-400 text-xs font-semibold">
            JM
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-slate-200 truncate">James Mwangi</p>
          <p className="text-xs text-slate-500 truncate">james@tunepoa.co.tz</p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 pb-2">
        <Badge
          variant="secondary"
          className="bg-teal-500/10 text-teal-400 border-teal-500/20 text-[10px] px-1.5 py-0"
        >
          Pro Plan
        </Badge>
      </div>
      <Separator className="bg-white/5 my-2" />
      <Link
        href="/"
        className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200 transition-colors"
      >
        <ArrowLeft className="size-4" />
        <span>Back to Site</span>
      </Link>
      <button className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-colors">
        <LogOut className="size-4" />
        <span>Logout</span>
      </button>
    </div>
  );
}

function SidebarContent({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5">
        <div className="flex items-center justify-center size-9 rounded-lg bg-gradient-to-br from-teal-500 to-cyan-500 shadow-lg shadow-teal-500/20">
          <Music className="size-5 text-white" />
        </div>
        <div>
          <h1 className="text-lg font-bold text-white tracking-tight">TunePoa</h1>
          <p className="text-[10px] text-teal-400/80 font-medium tracking-widest uppercase">
            Dashboard
          </p>
        </div>
      </div>

      <Separator className="bg-white/5" />

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <SidebarNav onNavClick={onNavClick} />
      </ScrollArea>

      {/* Footer */}
      <SidebarFooter />
    </div>
  );
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  const currentPage = navItems.find((item) =>
    item.href === '/dashboard'
      ? pathname === '/dashboard'
      : pathname.startsWith(item.href)
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#050c18]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex md:w-[280px] md:shrink-0 md:flex-col border-r border-white/5 bg-[#0a1628]/80 backdrop-blur-xl">
        <SidebarContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent
          side="left"
          className="w-[280px] bg-[#0a1628] border-white/5 p-0 [&>button]:hidden"
        >
          <SheetTitle className="sr-only">Navigation Menu</SheetTitle>
          <SidebarContent onNavClick={() => setMobileOpen(false)} />
        </SheetContent>
      </Sheet>

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="flex h-16 items-center gap-4 border-b border-white/5 bg-[#0a1628]/50 backdrop-blur-xl px-4 md:px-8">
          {/* Mobile Menu Trigger */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-slate-400 hover:text-white hover:bg-white/5"
              >
                <Menu className="size-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
          </Sheet>

          {/* Page Title */}
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-white">
              {currentPage?.label || 'Dashboard'}
            </h2>
          </div>

          {/* Search (desktop) */}
          <div className="hidden md:flex items-center relative">
            <Search className="absolute left-3 size-4 text-slate-500" />
            <Input
              placeholder="Search..."
              className="w-64 h-9 bg-white/5 border-white/10 text-sm text-slate-300 placeholder:text-slate-500 focus-visible:border-teal-500/50 focus-visible:ring-teal-500/20 pl-9"
            />
          </div>

          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="relative text-slate-400 hover:text-white hover:bg-white/5"
          >
            <Bell className="size-5" />
            <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-teal-500" />
            <span className="sr-only">Notifications</span>
          </Button>

          {/* User Avatar */}
          <Avatar className="size-9 border border-white/10 cursor-pointer">
            <AvatarImage src="" alt="User" />
            <AvatarFallback className="bg-teal-500/20 text-teal-400 text-xs font-semibold">
              JM
            </AvatarFallback>
          </Avatar>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 md:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
