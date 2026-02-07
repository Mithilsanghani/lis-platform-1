/**
 * LIS v2.0 - Student Settings Page
 * User settings, notifications, and privacy preferences
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Settings,
  User,
  Bell,
  Shield,
  LogOut,
  Save,
  Check,
  Mail,
  Smartphone,
  MessageSquare,
  Clock,
  Eye,
  EyeOff,
  ChevronRight,
} from 'lucide-react';
import { useStudentSettings } from '../../hooks/useStudentData';

// Section header
function SectionHeader({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-4">
      <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        <p className="text-xs text-zinc-500">{description}</p>
      </div>
    </div>
  );
}

// Toggle switch
function Toggle({
  enabled,
  onChange,
}: {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className={`
        relative w-11 h-6 rounded-full transition-colors
        ${enabled ? 'bg-purple-500' : 'bg-zinc-700'}
      `}
    >
      <motion.div
        animate={{ x: enabled ? 20 : 2 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow"
      />
    </button>
  );
}

// Notification row
function NotificationRow({
  icon: Icon,
  title,
  description,
  enabled,
  onChange,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  enabled: boolean;
  onChange: (enabled: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div className="flex items-center gap-3">
        <Icon className="w-5 h-5 text-zinc-400" />
        <div>
          <span className="text-sm text-white">{title}</span>
          <p className="text-xs text-zinc-500">{description}</p>
        </div>
      </div>
      <Toggle enabled={enabled} onChange={onChange} />
    </div>
  );
}

// Time selector
function TimeSelector({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const options = [
    { value: 'before-lecture', label: 'Before each lecture' },
    { value: 'after-lecture', label: 'After each lecture' },
    { value: 'end-of-day', label: 'End of day summary' },
  ];

  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 cursor-pointer"
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-zinc-900">
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 rotate-90 pointer-events-none" />
    </div>
  );
}

export function StudentSettings() {
  const { settings, updateSettings } = useStudentSettings();
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <Settings className="w-6 h-6 text-purple-400" />
          Settings
        </h1>
        <p className="text-zinc-400 mt-1">Manage your profile and preferences</p>
      </div>

      {/* Profile section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <SectionHeader
          icon={User}
          title="Profile Information"
          description="Your personal details"
        />

        <div className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 text-xl font-bold">
              {settings.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-white font-medium">{settings.name}</h4>
              <p className="text-sm text-zinc-500">{settings.email}</p>
            </div>
          </div>

          {/* Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Full Name</label>
              <input
                type="text"
                value={settings.name}
                onChange={(e) => updateSettings({ name: e.target.value })}
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500/50 transition-colors"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Email</label>
              <input
                type="email"
                value={settings.email}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Roll Number</label>
              <input
                type="text"
                value={settings.rollNo}
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-sm cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400 mb-1.5 block">Department</label>
              <input
                type="text"
                value="Computer Science"
                disabled
                className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-zinc-500 text-sm cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Notifications section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <SectionHeader
          icon={Bell}
          title="Notifications"
          description="How and when you receive updates"
        />

        <div className="divide-y divide-white/5">
          <NotificationRow
            icon={Mail}
            title="Email Notifications"
            description="Receive lecture reminders via email"
            enabled={settings.notifications.email}
            onChange={(enabled) =>
              updateSettings({
                notifications: { ...settings.notifications, email: enabled },
              })
            }
          />
          <NotificationRow
            icon={Smartphone}
            title="SMS Notifications"
            description="Get text messages for urgent updates"
            enabled={settings.notifications.sms}
            onChange={(enabled) =>
              updateSettings({
                notifications: { ...settings.notifications, sms: enabled },
              })
            }
          />
          <NotificationRow
            icon={MessageSquare}
            title="WhatsApp Notifications"
            description="Receive updates on WhatsApp"
            enabled={settings.notifications.whatsapp}
            onChange={(enabled) =>
              updateSettings({
                notifications: { ...settings.notifications, whatsapp: enabled },
              })
            }
          />
          <NotificationRow
            icon={Bell}
            title="In-app Notifications"
            description="Show notifications in the app"
            enabled={settings.notifications.inApp}
            onChange={(enabled) =>
              updateSettings({
                notifications: { ...settings.notifications, inApp: enabled },
              })
            }
          />
        </div>

        {/* Reminder timing */}
        <div className="mt-4 pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-2">
            <Clock className="w-4 h-4 text-zinc-400" />
            <label className="text-sm text-white">Lecture Reminder Timing</label>
          </div>
          <TimeSelector
            value={settings.reminderTiming}
            onChange={(value) => updateSettings({ reminderTiming: value as 'before-lecture' | 'after-lecture' | 'end-of-day' })}
          />
        </div>
      </motion.div>

      {/* Privacy section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <SectionHeader
          icon={Shield}
          title="Privacy"
          description="Control who can see your data"
        />

        <div className="space-y-3">
          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              {settings.sharePerformance ? (
                <Eye className="w-5 h-5 text-zinc-400" />
              ) : (
                <EyeOff className="w-5 h-5 text-zinc-400" />
              )}
              <div>
                <span className="text-sm text-white">Share Performance with Professors</span>
                <p className="text-xs text-zinc-500">
                  Allow professors to see your detailed performance data
                </p>
              </div>
            </div>
            <Toggle
              enabled={settings.sharePerformance}
              onChange={(enabled) => updateSettings({ sharePerformance: enabled })}
            />
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-4">
        <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-rose-400 hover:bg-rose-500/10 transition-colors text-sm">
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>

        <motion.button
          onClick={handleSave}
          disabled={saved}
          className={`
            flex items-center gap-2 px-6 py-2.5 rounded-xl font-medium text-sm transition-all
            ${saved
              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
              : 'bg-purple-500 hover:bg-purple-400 text-white'
            }
          `}
          whileHover={!saved ? { scale: 1.02 } : {}}
          whileTap={!saved ? { scale: 0.98 } : {}}
        >
          {saved ? (
            <>
              <Check className="w-4 h-4" />
              Saved!
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              Save Changes
            </>
          )}
        </motion.button>
      </div>
    </div>
  );
}
