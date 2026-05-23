'use client';

import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import {
  User,
  Shield,
  Bell,
  Mail,
  MessageSquare,
  Save,
  Eye,
  EyeOff,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

// Profile form schema
const profileSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  organization: z.string().min(2, 'Organization must be at least 2 characters'),
});

// Security form schema
const securitySchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileSchema>;
type SecurityFormValues = z.infer<typeof securitySchema>;

function ProfileTab() {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'James Mwangi',
      email: 'james@tunepoa.co.tz',
      phone: '+255 712 345 678',
      organization: 'TunePoa Solutions Ltd',
    },
  });

  function onSubmit(data: ProfileFormValues) {
    toast.success('Profile updated', {
      description: 'Your profile information has been saved successfully.',
    });
  }

  return (
    <div className="space-y-6">
      {/* Avatar Section */}
      <div className="flex items-center gap-6">
        <Avatar className="size-20 border-2 border-white/10">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-teal-600 to-cyan-500 text-white text-xl font-bold">
            JM
          </AvatarFallback>
        </Avatar>
        <div>
          <h3 className="text-lg font-semibold text-white">Profile Photo</h3>
          <p className="text-sm text-white/40 mt-1">Update your profile picture</p>
          <div className="flex gap-3 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="border-white/[0.08] bg-white/[0.04] text-white/70 hover:text-white hover:bg-white/[0.08] text-xs"
            >
              Upload
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
            >
              Remove
            </Button>
          </div>
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Profile Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-sm">Full Name</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:border-teal-500/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-sm">Email Address</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="email"
                      className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:border-teal-500/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-sm">Phone Number</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:border-teal-500/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="organization"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-sm">Organization</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:border-teal-500/50"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white"
            >
              <Save className="size-4 mr-2" />
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

function SecurityTab() {
  const [showCurrentPassword, setShowCurrentPassword] = React.useState(false);
  const [showNewPassword, setShowNewPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);

  const form = useForm<SecurityFormValues>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  function onSubmit(data: SecurityFormValues) {
    toast.success('Password updated', {
      description: 'Your password has been changed successfully.',
    });
    form.reset();
  }

  return (
    <div className="space-y-6">
      {/* Two-Factor Auth */}
      <div className="glass-card rounded-xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center size-10 rounded-lg bg-emerald-500/15">
              <Shield className="size-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Two-Factor Authentication</h3>
              <p className="text-xs text-white/40 mt-0.5">
                Add an extra layer of security to your account
              </p>
            </div>
          </div>
          <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 text-[10px]">
            Enabled
          </Badge>
        </div>
      </div>

      {/* Active Sessions */}
      <div className="glass-card rounded-xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Active Sessions</h3>
        <div className="space-y-3">
          {[
            { device: 'Chrome on macOS', location: 'Dar es Salaam, TZ', time: 'Current session', current: true },
            { device: 'iOS App', location: 'Dar es Salaam, TZ', time: '2 hours ago', current: false },
            { device: 'Firefox on Windows', location: 'Arusha, TZ', time: '1 week ago', current: false },
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <div>
                  <p className="text-sm text-white/70">{session.device}</p>
                  <p className="text-xs text-white/30">{session.location} &middot; {session.time}</p>
                </div>
              </div>
              {session.current ? (
                <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30 text-[10px]">
                  Current
                </Badge>
              ) : (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-400 hover:text-red-300 hover:bg-red-500/10 text-xs"
                  onClick={() => toast.success('Session revoked')}
                >
                  Revoke
                </Button>
              )}
            </div>
          ))}
        </div>
      </div>

      <Separator className="bg-white/[0.06]" />

      {/* Change Password Form */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-4">Change Password</h3>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 max-w-md">
            <FormField
              control={form.control}
              name="currentPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-sm">Current Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showCurrentPassword ? 'text' : 'password'}
                        className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:border-teal-500/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showCurrentPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="newPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-sm">New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showNewPassword ? 'text' : 'password'}
                        className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:border-teal-500/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showNewPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white/60 text-sm">Confirm New Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        {...field}
                        type={showConfirmPassword ? 'text' : 'password'}
                        className="bg-white/[0.04] border-white/[0.08] text-white focus-visible:border-teal-500/50 pr-10"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60"
                      >
                        {showConfirmPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                      </button>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white"
            >
              <Shield className="size-4 mr-2" />
              Update Password
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [notifications, setNotifications] = React.useState({
    emailBilling: true,
    emailActivity: true,
    emailMarketing: false,
    smsAlerts: true,
    smsBilling: false,
    pushNotifications: true,
  });

  const toggleNotification = (key: keyof typeof notifications) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preference updated');
  };

  const notificationGroups = [
    {
      title: 'Email Notifications',
      icon: Mail,
      items: [
        { key: 'emailBilling' as const, label: 'Billing & Invoices', description: 'Receive email notifications for invoices and payment updates' },
        { key: 'emailActivity' as const, label: 'Activity Alerts', description: 'Get notified about tone assignments, line changes, etc.' },
        { key: 'emailMarketing' as const, label: 'Marketing & Updates', description: 'Receive product updates, tips, and promotional offers' },
      ],
    },
    {
      title: 'SMS Alerts',
      icon: MessageSquare,
      items: [
        { key: 'smsAlerts' as const, label: 'Critical Alerts', description: 'SMS alerts for critical events like failed payments' },
        { key: 'smsBilling' as const, label: 'Billing Reminders', description: 'SMS reminders for upcoming payment due dates' },
      ],
    },
    {
      title: 'Push Notifications',
      icon: Bell,
      items: [
        { key: 'pushNotifications' as const, label: 'All Notifications', description: 'Receive push notifications for all account activities' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {notificationGroups.map((group) => (
        <div key={group.title}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center size-8 rounded-lg bg-white/[0.04]">
              <group.icon className="size-4 text-teal-400" />
            </div>
            <h3 className="text-sm font-semibold text-white">{group.title}</h3>
          </div>
          <div className="space-y-3">
            {group.items.map((item) => (
              <div
                key={item.key}
                className="glass-card rounded-lg p-4 flex items-center justify-between"
              >
                <div>
                  <p className="text-sm font-medium text-white/70">{item.label}</p>
                  <p className="text-xs text-white/30 mt-0.5">{item.description}</p>
                </div>
                <Switch
                  checked={notifications[item.key]}
                  onCheckedChange={() => toggleNotification(item.key)}
                  className="data-[state=checked]:bg-teal-500"
                />
              </div>
            ))}
          </div>
          <Separator className="bg-white/[0.06] my-6" />
        </div>
      ))}
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-white/40 text-sm mt-1">Manage your account preferences and security settings</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="bg-white/[0.04] border border-white/[0.06] h-auto p-1">
          <TabsTrigger
            value="profile"
            className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 text-white/50 text-sm px-4 py-2"
          >
            <User className="size-4 mr-2" />
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 text-white/50 text-sm px-4 py-2"
          >
            <Shield className="size-4 mr-2" />
            Security
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-teal-500/20 data-[state=active]:text-teal-400 text-white/50 text-sm px-4 py-2"
          >
            <Bell className="size-4 mr-2" />
            Notifications
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="glass-card rounded-xl p-6">
          <ProfileTab />
        </TabsContent>

        <TabsContent value="security" className="glass-card rounded-xl p-6">
          <SecurityTab />
        </TabsContent>

        <TabsContent value="notifications" className="glass-card rounded-xl p-6">
          <NotificationsTab />
        </TabsContent>
      </Tabs>
    </div>
  );
}
