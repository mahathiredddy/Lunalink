import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { EditProfileModal } from '../components/profile/EditProfileModal';
import {
  User as UserIcon,
  Mail,
  Calendar,
  Lock,
  Camera,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Shield,
  Bell,
  Sliders,
  Sparkles,
  Link2,
  ArrowRight,
  Edit3,
} from 'lucide-react';

export const UserProfilePage: React.FC = () => {
  const { user, connection, navigateTo } = useApp();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Format date of birth if available
  const formattedDob = user.dateOfBirth
    ? new Date(user.dateOfBirth + 'T00:00:00').toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Header */}
      <div className="pb-4 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Badge variant="shared" size="sm">
              Account Hub
            </Badge>
            <span className="text-xs text-slate-400 font-mono">ID: {user.id}</span>
          </div>
          <h2 className="text-2xl font-semibold text-white font-display tracking-tight">
            My Profile
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Personal identity, profile picture, contact details, and account settings
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsEditModalOpen(true)}
            leftIcon={<Edit3 className="w-4 h-4" />}
          >
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Main Profile Card */}
      <Card variant="glow" padding="lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Profile Picture with Edit Overlay */}
          <div className="relative group flex-shrink-0">
            <Avatar
              src={user.avatar}
              name={user.name}
              size="xl"
              className="ring-4 ring-violet-500/20 shadow-xl"
            />
            <button
              type="button"
              onClick={() => setIsEditModalOpen(true)}
              className="absolute -bottom-1 -right-1 p-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg border-2 border-[#090D16] transition-all transform group-hover:scale-110 cursor-pointer"
              title="Change profile picture"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Profile Information */}
          <div className="space-y-2 flex-1 text-center sm:text-left min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-3 flex-wrap">
              <h3 className="text-2xl font-bold text-white font-display tracking-tight truncate">
                {user.name}
              </h3>
              <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3 h-3" />}>
                Active Vault
              </Badge>
            </div>

            {user.statusMessage ? (
              <p className="text-xs text-slate-300 italic">
                "{user.statusMessage}"
              </p>
            ) : (
              <p className="text-xs text-slate-400">
                No personal status set
              </p>
            )}

            {/* Credential items list */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-3 text-xs">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0A0E1A]/80 border border-slate-800/80">
                <Mail className="w-4 h-4 text-violet-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Email Address
                  </span>
                  <span className="text-slate-200 font-medium truncate block">
                    {user.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0A0E1A]/80 border border-slate-800/80">
                <Calendar className="w-4 h-4 text-pink-400 flex-shrink-0" />
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                      Date of Birth
                    </span>
                    <Badge variant="neutral" size="sm">
                      Optional
                    </Badge>
                  </div>
                  <span className="text-slate-200 font-medium truncate block">
                    {formattedDob || 'Not specified'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0A0E1A]/80 border border-slate-800/80">
                <Clock className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Timezone
                  </span>
                  <span className="text-slate-200 font-medium truncate block">
                    {user.timezone || 'Not set'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0A0E1A]/80 border border-slate-800/80">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-500 uppercase font-semibold block">
                    Member Since
                  </span>
                  <span className="text-slate-200 font-medium truncate block">
                    {user.createdAt}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Connected Partner Summary Card */}
      <Card variant="default" padding="lg">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Link2 className="w-4 h-4 text-violet-400" />
            <h4 className="text-sm font-semibold text-white font-display">
              Partner Connection Status
            </h4>
          </div>
          <Badge
            variant={connection.status === 'connected' ? 'success' : 'neutral'}
            size="sm"
          >
            {connection.status === 'connected' ? 'Connected' : 'Not Connected'}
          </Badge>
        </div>

        <div className="mt-3 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          {connection.partner ? (
            <div className="flex items-center gap-3">
              <Avatar
                src={connection.partner.avatar}
                name={connection.partner.name}
                size="md"
              />
              <div>
                <p className="font-semibold text-white">{connection.partner.name}</p>
                <p className="text-[11px] text-slate-400">
                  Connected since {connection.connectedSince || 'Recently'} • {connection.partner.email}
                </p>
              </div>
            </div>
          ) : (
            <p className="text-slate-400">
              No partner connected. Health data and cycle tracking are stored in your private vault only.
            </p>
          )}

          <Button
            variant="outline"
            size="sm"
            onClick={() => navigateTo('connect-partner')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            {connection.partner ? 'Manage Partner' : 'Connect Partner'}
          </Button>
        </div>
      </Card>

      {/* Quick Navigation to Account Settings Sections */}
      <div>
        <h3 className="text-base font-semibold text-white font-display mb-3">
          Account Experience & Preferences
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Account Settings */}
          <div
            onClick={() => navigateTo('settings')}
            className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 hover:border-violet-500/50 hover:bg-slate-800/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-violet-500/10 text-violet-400 w-fit group-hover:scale-105 transition-transform">
                <UserIcon className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-violet-300 transition-colors">
                Account Settings
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Profile edits, password changes, partner connection, and vault deletion.
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-violet-400 font-medium">
              <span>Open Settings</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 2: Privacy */}
          <div
            onClick={() => navigateTo('privacy-sharing')}
            className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 hover:border-emerald-500/50 hover:bg-slate-800/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-emerald-500/10 text-emerald-400 w-fit group-hover:scale-105 transition-transform">
                <Shield className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                Privacy & Sharing
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Care profile sharing, zero-auto health sharing policy, partner permissions, and data visibility.
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-emerald-400 font-medium">
              <span>View Privacy</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 3: Notifications */}
          <div
            onClick={() => navigateTo('notifications')}
            className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 hover:border-amber-500/50 hover:bg-slate-800/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-400 w-fit group-hover:scale-105 transition-transform">
                <Bell className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-amber-300 transition-colors">
                Notifications
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Support notifications, partner alerts, reminder nudges, and system digests.
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-amber-400 font-medium">
              <span>Manage Alerts</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 4: Security */}
          <div
            onClick={() => navigateTo('settings')}
            className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 hover:border-rose-500/50 hover:bg-slate-800/30 transition-all cursor-pointer group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="p-2.5 rounded-xl bg-rose-500/10 text-rose-400 w-fit group-hover:scale-105 transition-transform">
                <Lock className="w-5 h-5" />
              </div>
              <h4 className="text-sm font-semibold text-white group-hover:text-rose-300 transition-colors">
                Security & Sessions
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Password credentials, active browser/mobile sessions, and sign out controls.
              </p>
            </div>
            <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-rose-400 font-medium">
              <span>Security Hub</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  );
};
