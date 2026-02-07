/**
 * LIS v3.5 - Student Settings Page
 * Enhanced to show students as active participants in the learning intelligence system
 * Focus: Trust, Agency, Transparency, Participation
 */

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  ChevronDown,
  Sparkles,
  Brain,
  Target,
  TrendingUp,
  Heart,
  Zap,
  Info,
  CheckCircle,
  BarChart3,
  BookOpen,
  Users,
  Lock,
  Lightbulb,
  HeartHandshake,
} from 'lucide-react';

// ==================== Types ====================

interface FeedbackPreferences {
  pacePreference: 'detailed' | 'balanced' | 'quick';
  anonymityLevel: 'fully-anonymous' | 'name-visible' | 'open';
  reminderFrequency: 'every-lecture' | 'daily-digest' | 'weekly-summary';
  feedbackStyle: 'structured' | 'freeform' | 'mixed';
  shareInsights: boolean;
  contributeToAI: boolean;
}

interface NotificationSettings {
  email: boolean;
  sms: boolean;
  whatsapp: boolean;
  inApp: boolean;
}

interface StudentSettings {
  name: string;
  email: string;
  rollNo: string;
  notifications: NotificationSettings;
  reminderTiming: string;
  sharePerformance: boolean;
  feedbackPreferences: FeedbackPreferences;
}

// ==================== Mock Hook (replace with real hook) ====================

const useStudentSettingsV3 = () => {
  const [settings, setSettings] = useState<StudentSettings>({
    name: 'Alex Johnson',
    email: 'alex.johnson@university.edu',
    rollNo: 'CS2024001',
    notifications: {
      email: true,
      sms: false,
      whatsapp: true,
      inApp: true,
    },
    reminderTiming: 'after-lecture',
    sharePerformance: true,
    feedbackPreferences: {
      pacePreference: 'balanced',
      anonymityLevel: 'fully-anonymous',
      reminderFrequency: 'every-lecture',
      feedbackStyle: 'mixed',
      shareInsights: true,
      contributeToAI: true,
    },
  });

  const updateSettings = (updates: Partial<StudentSettings>) => {
    setSettings(prev => ({ ...prev, ...updates }));
  };

  const updateFeedbackPreferences = (updates: Partial<FeedbackPreferences>) => {
    setSettings(prev => ({
      ...prev,
      feedbackPreferences: { ...prev.feedbackPreferences, ...updates },
    }));
  };

  return { settings, updateSettings, updateFeedbackPreferences };
};

// ==================== Sub Components ====================

// Section header with optional info tooltip
function SectionHeader({
  icon: Icon,
  title,
  description,
  accentColor = 'purple',
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  accentColor?: 'purple' | 'blue' | 'green' | 'orange';
}) {
  const colors = {
    purple: 'bg-purple-500/10 text-purple-400',
    blue: 'bg-blue-500/10 text-blue-400',
    green: 'bg-green-500/10 text-green-400',
    orange: 'bg-orange-500/10 text-orange-400',
  };

  return (
    <div className="flex items-start gap-3 mb-5">
      <div className={`p-2.5 rounded-xl ${colors[accentColor]}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        <p className="text-sm text-zinc-500 mt-0.5">{description}</p>
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

// Option card for selection groups
function OptionCard({
  selected,
  onClick,
  icon: Icon,
  title,
  description,
}: {
  selected: boolean;
  onClick: () => void;
  icon: React.ElementType;
  title: string;
  description: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`
        w-full p-4 rounded-xl border text-left transition-all
        ${selected
          ? 'bg-purple-500/10 border-purple-500/40 ring-1 ring-purple-500/20'
          : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.04] hover:border-white/10'
        }
      `}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-lg ${selected ? 'bg-purple-500/20 text-purple-400' : 'bg-white/5 text-zinc-400'}`}>
          <Icon className="w-4 h-4" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-zinc-300'}`}>
              {title}
            </span>
            {selected && (
              <CheckCircle className="w-4 h-4 text-purple-400" />
            )}
          </div>
          <p className="text-xs text-zinc-500 mt-0.5">{description}</p>
        </div>
      </div>
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

// Info banner for transparency
function TransparencyBanner({
  icon: Icon,
  title,
  description,
  color = 'purple',
}: {
  icon: React.ElementType;
  title: string;
  description: string;
  color?: 'purple' | 'blue' | 'green';
}) {
  const colors = {
    purple: 'from-purple-500/10 to-purple-600/5 border-purple-500/20 text-purple-400',
    blue: 'from-blue-500/10 to-blue-600/5 border-blue-500/20 text-blue-400',
    green: 'from-green-500/10 to-green-600/5 border-green-500/20 text-green-400',
  };

  return (
    <div className={`p-4 rounded-xl bg-gradient-to-r ${colors[color]} border flex items-start gap-3`}>
      <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
      <div>
        <p className="text-sm font-medium text-white">{title}</p>
        <p className="text-xs text-zinc-400 mt-1">{description}</p>
      </div>
    </div>
  );
}

// Contribution stat
function ContributionStat({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: React.ElementType;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02]">
      <div className={`p-2 rounded-lg ${color}`}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-lg font-semibold text-white">{value}</p>
        <p className="text-xs text-zinc-500">{label}</p>
      </div>
    </div>
  );
}

// ==================== Main Component ====================

export function StudentSettingsV3() {
  const { settings, updateSettings, updateFeedbackPreferences } = useStudentSettingsV3();
  const [saved, setSaved] = useState(false);
  const [showContribution, setShowContribution] = useState(false);

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
        <p className="text-zinc-400 mt-1">Manage your profile and learning preferences</p>
      </div>

      {/* ==================== YOUR CONTRIBUTION BANNER ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-5 rounded-2xl bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-transparent border border-purple-500/20"
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/20">
              <HeartHandshake className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">You're Making a Difference</h3>
              <p className="text-sm text-zinc-400 mt-1">
                Your feedback helps improve lecture quality and supports your classmates' learning.
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowContribution(!showContribution)}
            className="p-2 rounded-lg hover:bg-white/5 text-zinc-400 transition-colors"
          >
            <ChevronDown className={`w-5 h-5 transition-transform ${showContribution ? 'rotate-180' : ''}`} />
          </button>
        </div>

        <AnimatePresence>
          {showContribution && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-purple-500/10">
                <ContributionStat
                  icon={MessageSquare}
                  value="24"
                  label="Feedback given"
                  color="bg-purple-500/20 text-purple-400"
                />
                <ContributionStat
                  icon={TrendingUp}
                  value="3"
                  label="Topics improved"
                  color="bg-green-500/20 text-green-400"
                />
                <ContributionStat
                  icon={Users}
                  value="156"
                  label="Students helped"
                  color="bg-blue-500/20 text-blue-400"
                />
              </div>
              <p className="text-xs text-zinc-500 mt-3 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5" />
                Your feedback led to 3 revision sessions that helped 156 classmates
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* ==================== FEEDBACK PREFERENCES ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <SectionHeader
          icon={Sparkles}
          title="Learning Preferences"
          description="Customize how you give feedback and interact with the system"
          accentColor="purple"
        />

        {/* Feedback Style */}
        <div className="mb-6">
          <label className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            How do you prefer to give feedback?
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionCard
              selected={settings.feedbackPreferences.feedbackStyle === 'structured'}
              onClick={() => updateFeedbackPreferences({ feedbackStyle: 'structured' })}
              icon={Target}
              title="Structured"
              description="Quick ratings & checkboxes"
            />
            <OptionCard
              selected={settings.feedbackPreferences.feedbackStyle === 'freeform'}
              onClick={() => updateFeedbackPreferences({ feedbackStyle: 'freeform' })}
              icon={MessageSquare}
              title="Freeform"
              description="Open text responses"
            />
            <OptionCard
              selected={settings.feedbackPreferences.feedbackStyle === 'mixed'}
              onClick={() => updateFeedbackPreferences({ feedbackStyle: 'mixed' })}
              icon={Zap}
              title="Mixed"
              description="Both options available"
            />
          </div>
        </div>

        {/* Pace Preference */}
        <div className="mb-6">
          <label className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-400" />
            Feedback depth preference
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionCard
              selected={settings.feedbackPreferences.pacePreference === 'quick'}
              onClick={() => updateFeedbackPreferences({ pacePreference: 'quick' })}
              icon={Zap}
              title="Quick"
              description="30 seconds, essentials only"
            />
            <OptionCard
              selected={settings.feedbackPreferences.pacePreference === 'balanced'}
              onClick={() => updateFeedbackPreferences({ pacePreference: 'balanced' })}
              icon={BarChart3}
              title="Balanced"
              description="1-2 minutes, good detail"
            />
            <OptionCard
              selected={settings.feedbackPreferences.pacePreference === 'detailed'}
              onClick={() => updateFeedbackPreferences({ pacePreference: 'detailed' })}
              icon={BookOpen}
              title="Detailed"
              description="3+ minutes, thorough"
            />
          </div>
        </div>

        {/* Reminder Frequency */}
        <div className="mb-6">
          <label className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
            <Bell className="w-4 h-4 text-orange-400" />
            Feedback reminder frequency
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <OptionCard
              selected={settings.feedbackPreferences.reminderFrequency === 'every-lecture'}
              onClick={() => updateFeedbackPreferences({ reminderFrequency: 'every-lecture' })}
              icon={Bell}
              title="Every Lecture"
              description="Prompt after each class"
            />
            <OptionCard
              selected={settings.feedbackPreferences.reminderFrequency === 'daily-digest'}
              onClick={() => updateFeedbackPreferences({ reminderFrequency: 'daily-digest' })}
              icon={Clock}
              title="Daily Digest"
              description="One reminder per day"
            />
            <OptionCard
              selected={settings.feedbackPreferences.reminderFrequency === 'weekly-summary'}
              onClick={() => updateFeedbackPreferences({ reminderFrequency: 'weekly-summary' })}
              icon={BarChart3}
              title="Weekly"
              description="Batch feedback weekly"
            />
          </div>
        </div>

        {/* Transparency Info */}
        <TransparencyBanner
          icon={Lightbulb}
          title="How your preferences help"
          description="These settings help us show you the right feedback form at the right time, making it easier for you to share thoughts without disrupting your study flow."
          color="blue"
        />
      </motion.div>

      {/* ==================== ANONYMITY & PRIVACY ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <SectionHeader
          icon={Shield}
          title="Privacy & Anonymity"
          description="Control how your feedback is shared"
          accentColor="green"
        />

        {/* Anonymity Level */}
        <div className="mb-6">
          <label className="text-sm font-medium text-zinc-300 mb-3 flex items-center gap-2">
            <Lock className="w-4 h-4 text-green-400" />
            Feedback anonymity level
          </label>
          <div className="grid grid-cols-1 gap-3">
            <OptionCard
              selected={settings.feedbackPreferences.anonymityLevel === 'fully-anonymous'}
              onClick={() => updateFeedbackPreferences({ anonymityLevel: 'fully-anonymous' })}
              icon={EyeOff}
              title="Fully Anonymous"
              description="Professor sees feedback only, never your identity. Recommended for honest, comfortable feedback."
            />
            <OptionCard
              selected={settings.feedbackPreferences.anonymityLevel === 'name-visible'}
              onClick={() => updateFeedbackPreferences({ anonymityLevel: 'name-visible' })}
              icon={Eye}
              title="Name Visible to Professor"
              description="Professor can see who submitted feedback. Useful if you want direct follow-up."
            />
          </div>
        </div>

        {/* Performance Sharing */}
        <div className="flex items-center justify-between py-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-5 h-5 text-zinc-400" />
            <div>
              <span className="text-sm text-white">Share Performance Summary</span>
              <p className="text-xs text-zinc-500">
                Let professors see your overall understanding trends (not individual responses)
              </p>
            </div>
          </div>
          <Toggle
            enabled={settings.sharePerformance}
            onChange={(enabled) => updateSettings({ sharePerformance: enabled })}
          />
        </div>

        {/* Contribute to AI */}
        <div className="flex items-center justify-between py-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <Brain className="w-5 h-5 text-zinc-400" />
            <div>
              <span className="text-sm text-white">Contribute to Learning Insights</span>
              <p className="text-xs text-zinc-500">
                Help improve AI-generated study tips for everyone (fully anonymized)
              </p>
            </div>
          </div>
          <Toggle
            enabled={settings.feedbackPreferences.contributeToAI}
            onChange={(enabled) => updateFeedbackPreferences({ contributeToAI: enabled })}
          />
        </div>

        {/* Transparency Info */}
        <TransparencyBanner
          icon={Heart}
          title="Your privacy matters"
          description="Your individual feedback is never shared with other students. Professors only see anonymized, aggregated insights unless you choose otherwise."
          color="green"
        />
      </motion.div>

      {/* ==================== PROFILE INFORMATION ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
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
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-purple-500/20">
              {settings.name.charAt(0)}
            </div>
            <div>
              <h4 className="text-white font-medium">{settings.name}</h4>
              <p className="text-sm text-zinc-500">{settings.email}</p>
              <p className="text-xs text-purple-400 mt-1">🔥 12-day feedback streak</p>
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

      {/* ==================== NOTIFICATIONS ==================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.06]"
      >
        <SectionHeader
          icon={Bell}
          title="Notifications"
          description="How and when you receive updates"
          accentColor="orange"
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
      </motion.div>

      {/* ==================== ACTIONS ==================== */}
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

export default StudentSettingsV3;
