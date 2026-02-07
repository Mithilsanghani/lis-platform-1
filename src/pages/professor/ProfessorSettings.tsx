/**
 * LIS v2.0 - Professor Settings Page
 * Account, notifications, and course settings
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Bell,
  Palette,
  Save,
  Mail,
  Phone,
  Building,
  Check,
  Camera,
} from 'lucide-react';

interface NotificationSettings {
  emailNotifications: boolean;
  feedbackAlerts: boolean;
  silentStudentAlerts: boolean;
  weeklyDigest: boolean;
  insightNotifications: boolean;
}

export default function ProfessorSettings() {
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'appearance'>('profile');
  const [isSaving, setIsSaving] = useState(false);
  const [showSaved, setShowSaved] = useState(false);

  // Profile state
  const [profile, setProfile] = useState({
    name: 'Dr. Raghav Sharma',
    email: 'raghav.sharma@university.edu',
    phone: '+91 98765 43210',
    department: 'Computer Science',
    designation: 'Associate Professor',
    bio: 'Teaching Data Structures and Algorithms for 8 years. Research interests include algorithmic complexity and educational technology.',
  });

  // Notification settings
  const [notifications, setNotifications] = useState<NotificationSettings>({
    emailNotifications: true,
    feedbackAlerts: true,
    silentStudentAlerts: true,
    weeklyDigest: true,
    insightNotifications: false,
  });

  const handleSave = async () => {
    setIsSaving(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    setShowSaved(true);
    setTimeout(() => setShowSaved(false), 2000);
  };

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'appearance', label: 'Appearance', icon: Palette },
  ] as const;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your profile and preferences</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 rounded-xl bg-slate-800/50 border border-slate-700/50 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? 'bg-indigo-500/20 text-indigo-400'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl bg-slate-800/50 border border-slate-700/50"
      >
        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="p-6 space-y-6">
            {/* Avatar Section */}
            <div className="flex items-center gap-6">
              <div className="relative">
                <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold">
                  RS
                </div>
                <button className="absolute -bottom-2 -right-2 p-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">{profile.name}</h3>
                <p className="text-slate-400">{profile.designation}</p>
                <p className="text-sm text-slate-500">{profile.department}</p>
              </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-slate-400 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Phone</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-slate-400 mb-2">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <select
                    value={profile.department}
                    onChange={(e) => setProfile({ ...profile, department: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50"
                  >
                    <option>Computer Science</option>
                    <option>Mathematics</option>
                    <option>Physics</option>
                    <option>Electronics</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm text-slate-400 mb-2">Bio</label>
              <textarea
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                rows={3}
                className="w-full px-4 py-3 rounded-xl bg-slate-900/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50 resize-none"
              />
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="p-6 space-y-4">
            <p className="text-slate-400 mb-6">Choose how you want to be notified about activity in your courses.</p>

            {[
              {
                key: 'emailNotifications',
                title: 'Email Notifications',
                description: 'Receive notifications via email',
              },
              {
                key: 'feedbackAlerts',
                title: 'Feedback Alerts',
                description: 'Get notified when students submit feedback',
              },
              {
                key: 'silentStudentAlerts',
                title: 'Silent Student Alerts',
                description: 'Alert when students show low engagement patterns',
              },
              {
                key: 'weeklyDigest',
                title: 'Weekly Digest',
                description: 'Receive a weekly summary of course activity',
              },
              {
                key: 'insightNotifications',
                title: 'AI Insight Notifications',
                description: 'Get notified when new insights are generated',
              },
            ].map((setting) => (
              <div
                key={setting.key}
                className="flex items-center justify-between p-4 rounded-xl bg-slate-900/50 border border-slate-700/50"
              >
                <div>
                  <h4 className="font-medium text-white">{setting.title}</h4>
                  <p className="text-sm text-slate-400">{setting.description}</p>
                </div>
                <button
                  onClick={() => setNotifications({
                    ...notifications,
                    [setting.key]: !notifications[setting.key as keyof NotificationSettings],
                  })}
                  className={`relative w-12 h-6 rounded-full transition-colors ${
                    notifications[setting.key as keyof NotificationSettings]
                      ? 'bg-indigo-600'
                      : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
                      notifications[setting.key as keyof NotificationSettings]
                        ? 'translate-x-7'
                        : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Appearance Tab */}
        {activeTab === 'appearance' && (
          <div className="p-6 space-y-6">
            <p className="text-slate-400 mb-6">Customize how LIS looks and feels.</p>

            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <h4 className="font-medium text-white mb-3">Theme</h4>
                <div className="flex gap-3">
                  <button className="flex-1 p-4 rounded-xl bg-slate-800 border-2 border-indigo-500 text-center">
                    <div className="w-8 h-8 rounded-lg bg-slate-950 mx-auto mb-2" />
                    <p className="text-sm text-white">Dark</p>
                  </button>
                  <button className="flex-1 p-4 rounded-xl bg-slate-800 border border-slate-700 text-center opacity-50 cursor-not-allowed">
                    <div className="w-8 h-8 rounded-lg bg-white mx-auto mb-2" />
                    <p className="text-sm text-slate-400">Light (Coming Soon)</p>
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <h4 className="font-medium text-white mb-3">Accent Color</h4>
                <div className="flex gap-3">
                  {['indigo', 'purple', 'cyan', 'emerald', 'amber'].map((color) => (
                    <button
                      key={color}
                      className={`w-10 h-10 rounded-xl ${
                        color === 'indigo' ? 'ring-2 ring-white ring-offset-2 ring-offset-slate-900' : ''
                      }`}
                      style={{
                        background: color === 'indigo' ? '#6366f1' :
                                   color === 'purple' ? '#8b5cf6' :
                                   color === 'cyan' ? '#06b6d4' :
                                   color === 'emerald' ? '#10b981' : '#f59e0b',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-700/50">
                <h4 className="font-medium text-white mb-3">Dashboard Density</h4>
                <select className="w-full px-4 py-2.5 rounded-xl bg-slate-800 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/50">
                  <option>Comfortable (Default)</option>
                  <option>Compact</option>
                  <option>Spacious</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex items-center justify-between p-6 border-t border-slate-700/50">
          <div>
            {showSaved && (
              <motion.div
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 text-emerald-400"
              >
                <Check className="w-5 h-5" />
                <span>Settings saved!</span>
              </motion.div>
            )}
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium transition-colors"
          >
            {isSaving ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
