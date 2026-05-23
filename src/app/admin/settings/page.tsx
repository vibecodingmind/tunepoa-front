'use client';

import React, { useState } from 'react';
import {
  Settings,
  Globe,
  DollarSign,
  Radio,
  Bell,
  Save,
  Check,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

export default function PlatformSettingsPage() {
  const [saved, setSaved] = useState<string | null>(null);

  // General settings
  const [platformName, setPlatformName] = useState('TunePoa');
  const [supportEmail, setSupportEmail] = useState('support@tunepoa.com');
  const [defaultTimezone, setDefaultTimezone] = useState('Africa/Dar_es_Salaam');

  // Pricing settings
  const [starterMonthly, setStarterMonthly] = useState('49000');
  const [starterAnnual, setStarterAnnual] = useState('470000');
  const [proMonthly, setProMonthly] = useState('149000');
  const [proAnnual, setProAnnual] = useState('1428000');
  const [enterpriseMonthly, setEnterpriseMonthly] = useState('399000');
  const [enterpriseAnnual, setEnterpriseAnnual] = useState('3800000');

  // Telecom settings
  const [vodacomEnabled, setVodacomEnabled] = useState(true);
  const [safaricomEnabled, setSafaricomEnabled] = useState(true);
  const [airtelEnabled, setAirtelEnabled] = useState(true);
  const [tigoEnabled, setTigoEnabled] = useState(true);
  const [mtnEnabled, setMtnEnabled] = useState(true);
  const [telkomEnabled, setTelkomEnabled] = useState(false);
  const [zantelEnabled, setZantelEnabled] = useState(true);

  // Notification settings
  const [notifyNewSignup, setNotifyNewSignup] = useState(true);
  const [notifyPayment, setNotifyPayment] = useState(true);
  const [notifySupportTicket, setNotifySupportTicket] = useState(true);
  const [notifyFailedPayment, setNotifyFailedPayment] = useState(true);
  const [notifyToneUpload, setNotifyToneUpload] = useState(false);
  const [notifyWeeklyReport, setNotifyWeeklyReport] = useState(true);

  const handleSave = (section: string) => {
    setSaved(section);
    toast.success(`${section} settings saved successfully`);
    setTimeout(() => setSaved(null), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Platform Settings</h1>
        <p className="text-white/40 text-sm mt-1">Configure platform-wide settings and preferences</p>
      </div>

      {/* General Settings */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-teal-500/15 flex items-center justify-center">
            <Globe className="w-5 h-5 text-teal-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">General</h2>
            <p className="text-white/30 text-xs">Basic platform configuration</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Platform Name</Label>
              <Input
                value={platformName}
                onChange={(e) => setPlatformName(e.target.value)}
                className="bg-white/[0.04] border-white/[0.08] text-white focus:border-teal-500/50 focus:ring-teal-500/20"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-white/60 text-sm">Support Email</Label>
              <Input
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                type="email"
                className="bg-white/[0.04] border-white/[0.08] text-white focus:border-teal-500/50 focus:ring-teal-500/20"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label className="text-white/60 text-sm">Default Timezone</Label>
            <Select value={defaultTimezone} onValueChange={setDefaultTimezone}>
              <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white w-full sm:w-[300px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#0f1d32] border-white/[0.08]">
                <SelectItem value="Africa/Dar_es_Salaam" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Africa/Dar_es_Salaam (EAT)</SelectItem>
                <SelectItem value="Africa/Nairobi" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Africa/Nairobi (EAT)</SelectItem>
                <SelectItem value="Africa/Lagos" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Africa/Lagos (WAT)</SelectItem>
                <SelectItem value="Africa/Johannesburg" className="text-white/70 focus:text-white focus:bg-white/[0.06]">Africa/Johannesburg (SAST)</SelectItem>
                <SelectItem value="UTC" className="text-white/70 focus:text-white focus:bg-white/[0.06]">UTC</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => handleSave('General')} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
            {saved === 'General' ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved === 'General' ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Pricing Settings */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Pricing</h2>
            <p className="text-white/30 text-xs">Configure subscription plan pricing (TZS)</p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Starter */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-teal-500/20 text-teal-400 border-teal-500/30">Starter</Badge>
              <span className="text-white/30 text-xs">Basic plan for small businesses</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/60 text-sm">Monthly Price (TZS)</Label>
                <Input
                  value={starterMonthly}
                  onChange={(e) => setStarterMonthly(e.target.value)}
                  type="number"
                  className="bg-white/[0.04] border-white/[0.08] text-white focus:border-teal-500/50 focus:ring-teal-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60 text-sm">Annual Price (TZS)</Label>
                <Input
                  value={starterAnnual}
                  onChange={(e) => setStarterAnnual(e.target.value)}
                  type="number"
                  className="bg-white/[0.04] border-white/[0.08] text-white focus:border-teal-500/50 focus:ring-teal-500/20"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Pro */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/30">Pro</Badge>
              <span className="text-white/30 text-xs">Advanced features for growing businesses</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/60 text-sm">Monthly Price (TZS)</Label>
                <Input
                  value={proMonthly}
                  onChange={(e) => setProMonthly(e.target.value)}
                  type="number"
                  className="bg-white/[0.04] border-white/[0.08] text-white focus:border-teal-500/50 focus:ring-teal-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60 text-sm">Annual Price (TZS)</Label>
                <Input
                  value={proAnnual}
                  onChange={(e) => setProAnnual(e.target.value)}
                  type="number"
                  className="bg-white/[0.04] border-white/[0.08] text-white focus:border-teal-500/50 focus:ring-teal-500/20"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-white/[0.06]" />

          {/* Enterprise */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Badge className="bg-violet-500/20 text-violet-400 border-violet-500/30">Enterprise</Badge>
              <span className="text-white/30 text-xs">Full platform access for large organizations</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-white/60 text-sm">Monthly Price (TZS)</Label>
                <Input
                  value={enterpriseMonthly}
                  onChange={(e) => setEnterpriseMonthly(e.target.value)}
                  type="number"
                  className="bg-white/[0.04] border-white/[0.08] text-white focus:border-teal-500/50 focus:ring-teal-500/20"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-white/60 text-sm">Annual Price (TZS)</Label>
                <Input
                  value={enterpriseAnnual}
                  onChange={(e) => setEnterpriseAnnual(e.target.value)}
                  type="number"
                  className="bg-white/[0.04] border-white/[0.08] text-white focus:border-teal-500/50 focus:ring-teal-500/20"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => handleSave('Pricing')} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
            {saved === 'Pricing' ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved === 'Pricing' ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Telecom Settings */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-violet-500/15 flex items-center justify-center">
            <Radio className="w-5 h-5 text-violet-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Telecom Providers</h2>
            <p className="text-white/30 text-xs">Toggle provider integrations on/off</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { name: 'Vodacom', region: 'Tanzania', enabled: vodacomEnabled, setEnabled: setVodacomEnabled },
            { name: 'Safaricom', region: 'Kenya', enabled: safaricomEnabled, setEnabled: setSafaricomEnabled },
            { name: 'Airtel', region: 'Tanzania / Nigeria', enabled: airtelEnabled, setEnabled: setAirtelEnabled },
            { name: 'Tigo', region: 'Tanzania', enabled: tigoEnabled, setEnabled: setTigoEnabled },
            { name: 'MTN', region: 'Nigeria / Uganda', enabled: mtnEnabled, setEnabled: setMtnEnabled },
            { name: 'Telkom', region: 'Kenya', enabled: telkomEnabled, setEnabled: setTelkomEnabled },
            { name: 'Zantel', region: 'Tanzania', enabled: zantelEnabled, setEnabled: setZantelEnabled },
          ].map((provider) => (
            <div key={provider.name} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                  provider.enabled ? 'bg-teal-500/15 text-teal-400' : 'bg-white/5 text-white/30'
                }`}>
                  {provider.name.substring(0, 2)}
                </div>
                <div>
                  <p className="text-white text-sm font-medium">{provider.name}</p>
                  <p className="text-white/30 text-xs">{provider.region}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge className={provider.enabled ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-white/10 text-white/40 border-white/10'}>
                  {provider.enabled ? 'Active' : 'Inactive'}
                </Badge>
                <Switch checked={provider.enabled} onCheckedChange={provider.setEnabled} />
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => handleSave('Telecom')} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
            {saved === 'Telecom' ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved === 'Telecom' ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>

      {/* Notification Settings */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 rounded-lg bg-amber-500/15 flex items-center justify-center">
            <Bell className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h2 className="text-white font-semibold">Notifications</h2>
            <p className="text-white/30 text-xs">Admin notification preferences</p>
          </div>
        </div>

        <div className="space-y-4">
          {[
            { label: 'New User Signups', desc: 'Get notified when a new user registers', enabled: notifyNewSignup, setEnabled: setNotifyNewSignup },
            { label: 'Payment Received', desc: 'Get notified for successful payments', enabled: notifyPayment, setEnabled: setNotifyPayment },
            { label: 'Support Tickets', desc: 'Get notified for new support messages', enabled: notifySupportTicket, setEnabled: setNotifySupportTicket },
            { label: 'Failed Payments', desc: 'Get notified when a payment fails', enabled: notifyFailedPayment, setEnabled: setNotifyFailedPayment },
            { label: 'Tone Uploads', desc: 'Get notified when users upload new tones', enabled: notifyToneUpload, setEnabled: setNotifyToneUpload },
            { label: 'Weekly Report', desc: 'Receive a weekly summary via email', enabled: notifyWeeklyReport, setEnabled: setNotifyWeeklyReport },
          ].map((notification) => (
            <div key={notification.label} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0">
              <div>
                <p className="text-white text-sm font-medium">{notification.label}</p>
                <p className="text-white/30 text-xs">{notification.desc}</p>
              </div>
              <Switch checked={notification.enabled} onCheckedChange={notification.setEnabled} />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={() => handleSave('Notification')} className="bg-gradient-to-r from-teal-600 to-cyan-500 hover:from-teal-500 hover:to-cyan-400 text-white">
            {saved === 'Notification' ? <Check className="w-4 h-4 mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            {saved === 'Notification' ? 'Saved!' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
