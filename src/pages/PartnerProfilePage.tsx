import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Avatar } from '../components/ui/Avatar';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import {
  ShieldCheck,
  Calendar,
  Clock,
  Mail,
  AlertTriangle,
  Lock,
  ArrowRight,
  FileText,
  SlidersHorizontal,
  Link2,
  CheckCircle2,
  EyeOff,
  Lightbulb,
} from 'lucide-react';

export const PartnerProfilePage: React.FC = () => {
  const {
    partner,
    connection,
    disconnectPartner,
    privacySettings,
    navigateTo,
  } = useApp();

  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);

  // If no partner connected
  if (connection.status !== 'connected' || !partner) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center space-y-5 animate-in fade-in duration-200">
        <div className="w-16 h-16 mx-auto rounded-3xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-500">
          <Lock className="w-8 h-8" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white font-display">
            No Active Partner Connection
          </h2>
          <p className="text-xs text-slate-400 mt-2 max-w-sm mx-auto leading-relaxed">
            You are currently in Solo Mode. Pair with a partner via invite code or QR scan to view mutual connection parameters.
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => navigateTo('connect-partner')}
          leftIcon={<Link2 className="w-4 h-4" />}
        >
          Connect a Partner
        </Button>
      </div>
    );
  }

  const handleConfirmDisconnect = async () => {
    setIsDisconnecting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 600));
      await disconnectPartner();
      setShowDisconnectModal(false);
      navigateTo('dashboard');
    } finally {
      setIsDisconnecting(false);
    }
  };

  const mySharedSettings = privacySettings.filter((s) => s.isShared);
  const myPrivateSettings = privacySettings.filter((s) => !s.isShared);

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200">
      {/* Top Banner & Header */}
      <div className="pb-4 border-b border-slate-800/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold text-white font-display tracking-tight">
            Partner Profile
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Mutual connection parameters, active encryption, and sharing summary
          </p>
        </div>

        <Button
          variant="secondary"
          size="sm"
          onClick={() => navigateTo('privacy-sharing')}
          leftIcon={<ShieldCheck className="w-4 h-4 text-violet-400" />}
        >
          Manage Permissions
        </Button>
      </div>

      {/* Main Profile Summary Card */}
      <Card variant="glow" padding="lg">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <Avatar
            src={partner.avatar}
            name={partner.name}
            size="xl"
            statusIndicator="online"
            className="ring-4 ring-violet-500/20"
          />

          <div className="space-y-2 flex-1 min-w-0">
            <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
              <h3 className="text-2xl font-bold text-white font-display">
                {partner.name}
              </h3>
              <Badge variant="success" size="sm" icon={<CheckCircle2 className="w-3.5 h-3.5" />}>
                Encrypted Connection Active
              </Badge>
            </div>

            <p className="text-xs text-slate-300">
              {partner.statusMessage}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>{partner.email}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>{partner.timezone}</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Connected since {connection.connectedSince || partner.connectedAt}</span>
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Shared Information Summary Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Column 1: What I am currently sharing with Partner */}
        <Card variant="default" padding="lg">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-violet-400" />
              <h4 className="text-sm font-semibold text-white font-display">
                What you share with {partner.name.split(' ')[0]}
              </h4>
            </div>
            <Badge variant="shared" size="sm">
              {mySharedSettings.length} Active
            </Badge>
          </div>

          <div className="space-y-3">
            {mySharedSettings.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-xl bg-[#0A0E1A] border border-slate-800/80 flex items-start justify-between gap-3 text-xs"
              >
                <div>
                  <p className="font-semibold text-slate-200">{item.title}</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{item.description}</p>
                </div>
                <span className="text-[10px] text-emerald-400 font-medium whitespace-nowrap">
                  Live
                </span>
              </div>
            ))}

            {myPrivateSettings.length > 0 && (
              <div className="pt-2">
                <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Kept Private ({myPrivateSettings.length})
                </p>
                {myPrivateSettings.map((item) => (
                  <div
                    key={item.id}
                    className="p-2.5 rounded-xl bg-[#080C14] border border-slate-900 flex items-center justify-between text-xs text-slate-400"
                  >
                    <span>{item.title}</span>
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <EyeOff className="w-3 h-3" /> Not shared
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800 text-right">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateTo('privacy-sharing')}
              rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
            >
              Adjust permissions
            </Button>
          </div>
        </Card>

        {/* Column 2: What Partner is sharing with Me */}
        <Card variant="default" padding="lg">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-indigo-400" />
              <h4 className="text-sm font-semibold text-white font-display">
                What {partner.name.split(' ')[0]} shares with you
              </h4>
            </div>
            <Badge variant="neutral" size="sm">
              Partner Consent
            </Badge>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-xl bg-[#0A0E1A] border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Profile & Timezone</span>
                <span className="text-emerald-400 text-[10px] font-medium">Shared</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Elena has authorized you to view her status message, local time, and current availability.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0A0E1A] border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Shared Notes & Documents</span>
                <span className="text-emerald-400 text-[10px] font-medium">Shared</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Collaborative notes and travel logs in your mutual Shared Space.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#0A0E1A] border border-slate-800/80">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Preferences & Food Favorites</span>
                <span className="text-emerald-400 text-[10px] font-medium">Shared</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Dietary requirements, travel seating preferences, and emergency points of contact.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-[#080C14] border border-slate-900 text-slate-400">
              <div className="flex items-center justify-between">
                <span>Real-Time Activity Presence</span>
                <span className="text-slate-400 text-[10px]">Restricted by partner</span>
              </div>
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-800">
            <p className="text-[11px] text-slate-400 leading-relaxed">
              Elena manages her own permissions independently. LunaLink never grants automatic symmetry.
            </p>
          </div>
        </Card>
      </div>

      {/* Care Suggestions Partner Preview */}
      <Card
        variant="default"
        padding="md"
        className="border-slate-800 bg-gradient-to-r from-amber-950/20 via-slate-900 to-[#0A0E1A] hover:border-amber-500/40 transition-all cursor-pointer"
        onClick={() => navigateTo('care-suggestions')}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-300">
              <Lightbulb className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white font-display">
                Preview Partner Care Suggestions
              </h4>
              <p className="text-xs text-slate-300">
                Check exactly what guidance {partner.name.split(' ')[0]} sees under "How you can support her".
              </p>
            </div>
          </div>

          <Button
            variant="secondary"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigateTo('care-suggestions');
            }}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            Open Suggestions
          </Button>
        </div>
      </Card>

      {/* Danger Zone: Disconnect Option */}
      <Card variant="subtle" padding="lg" className="border-rose-900/30">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h4 className="text-sm font-semibold text-rose-300 font-display flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>Disconnect Partner Link</span>
            </h4>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              Severing this connection will immediately revoke access for both parties. All shared space permissions and visibility will be permanently unlinked.
            </p>
          </div>

          <Button
            variant="danger"
            size="md"
            onClick={() => setShowDisconnectModal(true)}
          >
            Disconnect Link
          </Button>
        </div>
      </Card>

      {/* Disconnect Confirmation Modal */}
      <Modal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        title="Disconnect from Partner?"
        subtitle="This action will terminate your private LunaLink connection immediately."
      >
        <div className="space-y-4 text-xs text-slate-300">
          <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/40 space-y-1 text-rose-200">
            <p className="font-semibold">Important consequences of disconnecting:</p>
            <ul className="list-disc list-inside space-y-1 text-[11px] text-rose-300/90 pt-1">
              <li>Elena Chen will no longer have access to any shared notes or profile details.</li>
              <li>Your shared space workspace will be moved to archived offline mode.</li>
              <li>Reconnecting will require generating a brand new invite code and mutual authorization.</li>
            </ul>
          </div>

          <p className="text-slate-400">
            Are you sure you want to proceed with disconnecting?
          </p>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDisconnectModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="sm"
              isLoading={isDisconnecting}
              onClick={handleConfirmDisconnect}
            >
              Yes, Disconnect Link
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
