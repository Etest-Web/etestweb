"use client";

import { useState } from "react";
import { useClerk } from "@clerk/nextjs";
import { Bell, Shield, Palette, Globe, Trash2, LogOut } from "lucide-react";

export default function SettingsPage() {
  const { signOut } = useClerk();
  const [activeTab, setActiveTab] = useState("notifications");

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
        <p className="text-white/60">Manage your account preferences and settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Tabs */}
        <div className="lg:col-span-1">
          <div className="bg-[#1a1610] border border-white/10 rounded-xl overflow-hidden">
            <button
              onClick={() => setActiveTab("notifications")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeTab === "notifications"
                  ? "bg-primary/10 text-primary"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              <Bell className="w-5 h-5" />
              Notifications
            </button>
            <button
              onClick={() => setActiveTab("privacy")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeTab === "privacy"
                  ? "bg-primary/10 text-primary"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              <Shield className="w-5 h-5" />
              Privacy & Security
            </button>
            <button
              onClick={() => setActiveTab("appearance")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeTab === "appearance"
                  ? "bg-primary/10 text-primary"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              <Palette className="w-5 h-5" />
              Appearance
            </button>
            <button
              onClick={() => setActiveTab("language")}
              className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
                activeTab === "language"
                  ? "bg-primary/10 text-primary"
                  : "text-white/70 hover:bg-white/5"
              }`}
            >
              <Globe className="w-5 h-5" />
              Language
            </button>
            <div className="border-t border-white/10 my-2" />
            <button
              onClick={() => void signOut()}
              className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-500/10 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          {activeTab === "notifications" && <NotificationsTab />}
          {activeTab === "privacy" && <PrivacyTab />}
          {activeTab === "appearance" && <AppearanceTab />}
          {activeTab === "language" && <LanguageTab />}
        </div>
      </div>
    </div>
  );
}

function NotificationsTab() {
  const [settings, setSettings] = useState({
    emailNotifications: true,
    proposalAlerts: true,
    contractUpdates: true,
    marketingEmails: false,
  });

  return (
    <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Notification Preferences</h2>
      <div className="space-y-4">
        <ToggleSetting
          label="Email Notifications"
          description="Receive email updates about your account activity"
          enabled={settings.emailNotifications}
          onChange={() => setSettings({ ...settings, emailNotifications: !settings.emailNotifications })}
        />
        <ToggleSetting
          label="Proposal Alerts"
          description="Get notified when someone submits a proposal to your job"
          enabled={settings.proposalAlerts}
          onChange={() => setSettings({ ...settings, proposalAlerts: !settings.proposalAlerts })}
        />
        <ToggleSetting
          label="Contract Updates"
          description="Receive notifications about contract status changes"
          enabled={settings.contractUpdates}
          onChange={() => setSettings({ ...settings, contractUpdates: !settings.contractUpdates })}
        />
        <ToggleSetting
          label="Marketing Emails"
          description="Receive promotional emails and platform updates"
          enabled={settings.marketingEmails}
          onChange={() => setSettings({ ...settings, marketingEmails: !settings.marketingEmails })}
        />
      </div>
    </div>
  );
}

function PrivacyTab() {
  return (
    <div className="space-y-6">
      <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Privacy Settings</h2>
        <div className="space-y-4">
          <ToggleSetting
            label="Profile Visibility"
            description="Make your profile visible to other users"
            enabled={true}
            onChange={() => {}}
          />
          <ToggleSetting
            label="Show Online Status"
            description="Let others see when you're online"
            enabled={true}
            onChange={() => {}}
          />
          <ToggleSetting
            label="Show Location"
            description="Display your location on your profile"
            enabled={true}
            onChange={() => {}}
          />
        </div>
      </div>

      <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
        <h2 className="text-xl font-bold text-white mb-4">Danger Zone</h2>
        <p className="text-white/60 text-sm mb-4">
          Once you delete your account, there is no going back. Please be certain.
        </p>
        <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 hover:bg-red-500/30 transition-colors">
          <Trash2 className="w-4 h-4" />
          Delete Account
        </button>
      </div>
    </div>
  );
}

function AppearanceTab() {
  return (
    <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Appearance Settings</h2>
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-3">
            Theme
          </label>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border-2 border-primary bg-[#1a1610] cursor-pointer">
              <p className="text-white font-medium">Dark</p>
              <p className="text-sm text-white/60">Default theme</p>
            </div>
            <div className="p-4 rounded-lg border border-white/10 bg-white cursor-not-allowed opacity-50">
              <p className="text-black font-medium">Light</p>
              <p className="text-sm text-black/60">Coming soon</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function LanguageTab() {
  return (
    <div className="bg-[#1a1610] border border-white/10 rounded-xl p-6">
      <h2 className="text-xl font-bold text-white mb-6">Language & Region</h2>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Language
          </label>
          <select className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-white/80 mb-2">
            Timezone
          </label>
          <select className="w-full h-12 rounded-lg border border-white/10 bg-white/5 px-4 text-white focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option value="utc">UTC (Coordinated Universal Time)</option>
            <option value="est">Eastern Time (ET)</option>
            <option value="pst">Pacific Time (PT)</option>
            <option value="gmt">Greenwich Mean Time (GMT)</option>
          </select>
        </div>
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  enabled,
  onChange,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between py-3">
      <div>
        <p className="text-white font-medium">{label}</p>
        <p className="text-sm text-white/60">{description}</p>
      </div>
      <button
        onClick={onChange}
        className={`relative w-12 h-6 rounded-full transition-colors ${
          enabled ? "bg-primary" : "bg-white/20"
        }`}
      >
        <span
          className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${
            enabled ? "left-7" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
