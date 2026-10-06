import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Badge } from '../components/ui/Badge';
import { Avatar } from '../components/ui/Avatar';
import { Toggle } from '../components/ui/Toggle';
import { Modal } from '../components/ui/Modal';
import { PartnerConnectionState, HealthSharingPermissions } from '../types';
import { SAMPLE_RECEIVED_INVITE } from '../services/partnerConnectionService';
import {
  Link2,
  Copy,
  Check,
  RefreshCw,
  QrCode,
  Share2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Camera,
  HeartHandshake,
  UserX,
  Calendar,
  HeartPulse,
  Sparkles,
  Bell,
  Clock,
  Lock,
  Unlock,
  Sliders,
  AlertTriangle,
  Database,
  Code2,
  Info,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

export const ConnectPartnerPage: React.FC = () => {
  const {
    connection,
    partner,
    connectionState,
    setConnectionState,
    generateNewCode,
    connectWithCode,
    disconnectPartner,
    acceptReceivedInvite,
    declineReceivedInvite,
    healthPermissions,
    toggleHealthPermission,
    saveHealthPermissions,
    showToast,
    navigateTo,
  } = useApp();

  // Local input state
  const [enteredCode, setEnteredCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showDisconnectModal, setShowDisconnectModal] = useState(false);
  const [showPermissionsModal, setShowPermissionsModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [showSupabaseDocs, setShowSupabaseDocs] = useState(false);
  const [lastErrorMsg, setLastErrorMsg] = useState<string | null>(null);

  // Derived active state
  const isConnected = connection.status === 'connected' && Boolean(partner);

  // Handle Copy Code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(connection.inviteCode);
    setCopiedCode(true);
    showToast(`Invite code ${connection.inviteCode} copied to clipboard`, 'success');
    setTimeout(() => setCopiedCode(false), 2500);
  };

  // Handle Share Code
  const handleShareInvite = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Connect with me on LunaLink',
        text: `Let's connect privately on LunaLink. My invitation code is: ${connection.inviteCode}`,
        url: window.location.origin,
      }).catch(() => {});
    } else {
      handleCopyCode();
    }
  };

  // Handle Generate / Regenerate Code
  const handleGenerateCode = async () => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 350));
      const newCode = await generateNewCode();
      setConnectionState('invitation_sent');
      setLastErrorMsg(null);
      showToast(`New code generated: ${newCode}`, 'success');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle Connect Submit
  const handleConnectSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLastErrorMsg(null);

    const clean = enteredCode.trim().toUpperCase();
    if (!clean) {
      setLastErrorMsg('Please enter an invitation code.');
      setConnectionState('invalid_code');
      return;
    }

    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      const result = await connectWithCode(clean);

      if (result.success) {
        setEnteredCode('');
        setLastErrorMsg(null);
      } else {
        setLastErrorMsg(result.error || 'Connection failed.');
        if (result.state) {
          setConnectionState(result.state);
        }
      }
    } catch {
      setLastErrorMsg('An unexpected error occurred while connecting.');
      setConnectionState('invalid_code');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Disconnect Confirm
  const handleConfirmDisconnect = async () => {
    await disconnectPartner();
    setShowDisconnectModal(false);
  };

  // Permission Items definition
  const permissionConfigs: Array<{
    key: keyof Omit<HealthSharingPermissions, 'updatedAt'>;
    title: string;
    description: string;
    icon: React.ReactNode;
    color: string;
  }> = [
    {
      key: 'cycleInformation',
      title: 'Cycle information',
      description: 'Estimated phase, current cycle day, and period timing predictions. Private daily journal entries are never shared.',
      icon: <Calendar className="w-4 h-4 text-rose-400" />,
      color: 'border-rose-500/20 bg-rose-500/10 text-rose-300',
    },
    {
      key: 'painTrends',
      title: 'Pain trends',
      description: 'Aggregated symptom frequencies and average pain ratings so your partner knows when your body is under physical strain.',
      icon: <HeartPulse className="w-4 h-4 text-amber-400" />,
      color: 'border-amber-500/20 bg-amber-500/10 text-amber-300',
    },
    {
      key: 'careProfile',
      title: 'Care Profile',
      description: 'Your Care DNA preferences (communication style, comfort essentials, physical proximity, and emotional posture).',
      icon: <HeartHandshake className="w-4 h-4 text-violet-400" />,
      color: 'border-violet-500/20 bg-violet-500/10 text-violet-300',
    },
    {
      key: 'careMode',
      title: 'Care Mode',
      description: 'Real-time gentle alerts when you activate Care Mode, requesting a quieter atmosphere or comfort measures.',
      icon: <Sparkles className="w-4 h-4 text-indigo-400" />,
      color: 'border-indigo-500/20 bg-indigo-500/10 text-indigo-300',
    },
    {
      key: 'sharedReminders',
      title: 'Shared reminders',
      description: 'Gentle nudges for rest, hydration, heating pad replacements, or medications that your partner can help facilitate.',
      icon: <Bell className="w-4 h-4 text-emerald-400" />,
      color: 'border-emerald-500/20 bg-emerald-500/10 text-emerald-300',
    },
  ];

  // Helper for direct simulator state switching
  const handleSimulateState = (targetState: PartnerConnectionState) => {
    setConnectionState(targetState);
    if (targetState === 'connected') {
      if (!isConnected) {
        connectWithCode('LUNA-7734-ELN');
      }
    } else if (targetState === 'no_connection') {
      if (isConnected) {
        disconnectPartner();
      }
    }
  };

  return (
    <div className="space-y-8 max-w-4xl mx-auto animate-in fade-in duration-200 pb-16">
      {/* =========================================================================
          PAGE HEADER
          Title: "Connect someone you trust"
          Subtitle: "LunaLink only shares what you choose."
          ========================================================================= */}
      <div className="pb-5 border-b border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-violet-500/15 text-violet-300 border border-violet-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              1-to-1 Trusted Connection
            </span>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-slate-800 text-slate-300 border border-slate-700/60">
              Permission-Based
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-white font-display tracking-tight">
            Connect someone you trust
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            LunaLink only shares what you choose.
          </p>
        </div>

        {isConnected && partner && (
          <div className="flex items-center gap-2.5">
            <Badge variant="success" size="md" icon={<span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />}>
              Connected with {partner.name}
            </Badge>
          </div>
        )}
      </div>

      {/* =========================================================================
          CONNECTION STATES SIMULATOR BAR
          Enables instant review of all 7 required states:
          - No connection
          - Invitation sent
          - Invitation received
          - Connected
          - Invalid code
          - Expired invitation
          - Already connected
          ========================================================================= */}
      <Card variant="default" padding="sm" className="bg-[#090D18]/90 border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Sliders className="w-3.5 h-3.5 text-violet-400 flex-shrink-0" />
            <span className="font-medium text-slate-300">Connection State View:</span>
            <span className="font-mono text-[11px] text-violet-300 px-1.5 py-0.5 bg-violet-500/20 rounded">
              {connectionState}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto py-1 text-xs">
            <button
              type="button"
              onClick={() => handleSimulateState('no_connection')}
              className={`px-2 py-1 rounded-md text-[11px] transition-colors whitespace-nowrap ${
                connectionState === 'no_connection'
                  ? 'bg-violet-600 text-white font-medium'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              No connection
            </button>
            <button
              type="button"
              onClick={() => handleSimulateState('invitation_sent')}
              className={`px-2 py-1 rounded-md text-[11px] transition-colors whitespace-nowrap ${
                connectionState === 'invitation_sent'
                  ? 'bg-violet-600 text-white font-medium'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Invitation sent
            </button>
            <button
              type="button"
              onClick={() => handleSimulateState('invitation_received')}
              className={`px-2 py-1 rounded-md text-[11px] transition-colors whitespace-nowrap ${
                connectionState === 'invitation_received'
                  ? 'bg-violet-600 text-white font-medium'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Invitation received
            </button>
            <button
              type="button"
              onClick={() => handleSimulateState('connected')}
              className={`px-2 py-1 rounded-md text-[11px] transition-colors whitespace-nowrap ${
                connectionState === 'connected'
                  ? 'bg-violet-600 text-white font-medium'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Connected
            </button>
            <button
              type="button"
              onClick={() => handleSimulateState('invalid_code')}
              className={`px-2 py-1 rounded-md text-[11px] transition-colors whitespace-nowrap ${
                connectionState === 'invalid_code'
                  ? 'bg-rose-600 text-white font-medium'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Invalid code
            </button>
            <button
              type="button"
              onClick={() => handleSimulateState('expired_invitation')}
              className={`px-2 py-1 rounded-md text-[11px] transition-colors whitespace-nowrap ${
                connectionState === 'expired_invitation'
                  ? 'bg-amber-600 text-white font-medium'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Expired invitation
            </button>
            <button
              type="button"
              onClick={() => handleSimulateState('already_connected')}
              className={`px-2 py-1 rounded-md text-[11px] transition-colors whitespace-nowrap ${
                connectionState === 'already_connected'
                  ? 'bg-indigo-600 text-white font-medium'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
            >
              Already connected
            </button>
          </div>
        </div>
      </Card>

      {/* =========================================================================
          STATE FEEDBACK BANNERS (Invalid code, Expired invitation, Already connected)
          ========================================================================= */}
      {connectionState === 'invalid_code' && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/50 flex items-start gap-3.5 animate-in fade-in duration-150">
          <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-rose-200">
              Invalid Invitation Code
            </h4>
            <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed">
              {lastErrorMsg ||
                'The invitation code entered does not match an active LunaLink invite format. Valid codes begin with "LUNA-" followed by 4 digits and 3 letters (e.g. LUNA-7734-ELN).'}
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEnteredCode('LUNA-7734-ELN');
                  setLastErrorMsg(null);
                  setConnectionState('no_connection');
                }}
              >
                Try sample valid code (LUNA-7734-ELN)
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConnectionState('no_connection')}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {connectionState === 'expired_invitation' && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-500/50 flex items-start gap-3.5 animate-in fade-in duration-150">
          <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-amber-200">
              Expired Invitation
            </h4>
            <p className="text-xs text-amber-300/90 mt-0.5 leading-relaxed">
              This invitation code has passed its 48-hour security window and is no longer valid. To connect safely, please generate a new code or request a fresh invite from your partner.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={handleGenerateCode}
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
              >
                Generate Fresh Code
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setConnectionState('no_connection')}
              >
                Dismiss
              </Button>
            </div>
          </div>
        </div>
      )}

      {connectionState === 'already_connected' && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/50 flex items-start gap-3.5 animate-in fade-in duration-150">
          <Info className="w-5 h-5 text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-semibold text-indigo-200">
              Already Connected
            </h4>
            <p className="text-xs text-indigo-300/90 mt-0.5 leading-relaxed">
              You are already paired with {partner?.name || 'Elena Chen'}. To preserve intimate privacy and trust, LunaLink restricts connection to exactly one person at a time. If you wish to pair with someone else, disconnect your existing partner first.
            </p>
            <div className="mt-3 flex items-center gap-2">
              <Button
                variant="primary"
                size="sm"
                onClick={() => setConnectionState('connected')}
              >
                View Active Connection
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowDisconnectModal(true)}
              >
                Disconnect Current Partner
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          STATE: INVITATION RECEIVED
          When an invitation is incoming from a partner
          ========================================================================= */}
      {connectionState === 'invitation_received' && (
        <Card variant="elevated" padding="lg" className="border-violet-500/50 bg-gradient-to-br from-[#0F162A] to-[#12102A]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3.5">
              <Avatar
                src={SAMPLE_RECEIVED_INVITE.avatar}
                name={SAMPLE_RECEIVED_INVITE.partnerName}
                size="lg"
                statusIndicator="sharing"
              />
              <div>
                <span className="text-[11px] font-medium text-violet-400 uppercase tracking-wider block">
                  Invitation Received
                </span>
                <h3 className="text-lg font-bold text-white font-display">
                  {SAMPLE_RECEIVED_INVITE.partnerName} wants to connect
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Sent {SAMPLE_RECEIVED_INVITE.sentAt} • Invite code:{' '}
                  <span className="font-mono text-violet-300 font-semibold">
                    {SAMPLE_RECEIVED_INVITE.inviteCode}
                  </span>
                </p>
              </div>
            </div>

            <Badge variant="warning" size="sm" icon={<Clock className="w-3.5 h-3.5" />}>
              {SAMPLE_RECEIVED_INVITE.expiresIn}
            </Badge>
          </div>

          <div className="py-4">
            <div className="p-3.5 rounded-xl bg-[#090D18] border border-slate-800/80 text-xs text-slate-300 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span>
                Accepting this connection will pair your vaults. <strong>No health data</strong> (cycle details, pain logs, or Care Profile) will be shared automatically. You will configure your permissions after accepting.
              </span>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={declineReceivedInvite}
            >
              Decline
            </Button>
            <Button
              variant="primary"
              size="md"
              onClick={acceptReceivedInvite}
              leftIcon={<Check className="w-4 h-4" />}
            >
              Accept Invitation
            </Button>
          </div>
        </Card>
      )}

      {/* =========================================================================
          CONNECTED STATE
          Show:
          - Partner name
          - Profile image
          - Connected status
          - Connection date
          - IMPORTANT: Being connected must NOT automatically provide access to health information.
          - Section: "Sharing permissions"
            - Cycle information (toggle)
            - Pain trends (toggle)
            - Care Profile (toggle)
            - Care Mode (toggle)
            - Shared reminders (toggle)
            - "Manage permissions"
          - "Disconnect" with confirmation modal
          ========================================================================= */}
      {isConnected && partner ? (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 1. Connected Partner Card */}
          <Card variant="elevated" padding="lg" className="border-slate-700/80 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-violet-600/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div className="flex items-center gap-4">
                <Avatar
                  src={partner.avatar}
                  name={partner.name}
                  size="xl"
                  statusIndicator="online"
                />
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl sm:text-2xl font-bold text-white font-display">
                      {partner.name}
                    </h2>
                    <Badge
                      variant="success"
                      size="sm"
                      icon={<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
                    >
                      Connected
                    </Badge>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">
                    {partner.email} • {partner.timezone}
                  </p>
                  <div className="mt-2 flex items-center gap-2 text-xs text-slate-300">
                    <Calendar className="w-3.5 h-3.5 text-violet-400" />
                    <span>Connection date: <strong>{connection.connectedSince || 'Feb 14, 2024'}</strong></span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2.5 sm:self-start">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateTo('shared-space')}
                >
                  Open Shared Space
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => setShowDisconnectModal(true)}
                  leftIcon={<UserX className="w-4 h-4" />}
                >
                  Disconnect
                </Button>
              </div>
            </div>

            {/* Connection Corridor Info */}
            <div className="pt-4 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded-xl bg-[#090D18] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Corridor Type</span>
                <span className="text-slate-200 font-medium mt-0.5 block">1-to-1 Private Tunnel</span>
              </div>
              <div className="p-3 rounded-xl bg-[#090D18] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Encryption</span>
                <span className="text-emerald-400 font-medium mt-0.5 flex items-center gap-1">
                  <Lock className="w-3 h-3" /> Active Vault
                </span>
              </div>
              <div className="p-3 rounded-xl bg-[#090D18] border border-slate-800/80">
                <span className="text-[10px] text-slate-400 uppercase font-mono block">Active Partner Code</span>
                <span className="text-violet-300 font-mono font-medium mt-0.5 block">{partner.inviteCode}</span>
              </div>
            </div>
          </Card>

          {/* 2. CRITICAL NOTICE: Being connected must NOT automatically provide access to health information */}
          <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-violet-950/40 via-indigo-950/30 to-[#0F162A] border border-violet-500/40 flex items-start gap-3.5">
            <div className="p-2 rounded-xl bg-violet-600/20 border border-violet-500/40 text-violet-300 flex-shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-bold text-white tracking-tight flex items-center gap-2">
                IMPORTANT: Being connected does not grant automatic access to health information
              </h3>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                Your private health data—including cycle forecasts, daily symptoms, pain severity, and your Care Profile—is strictly locked by default. Your partner can only view information for items where you explicitly activate a sharing permission toggle below.
              </p>
            </div>
          </div>

          {/* 3. Section: "Sharing permissions" */}
          <Card variant="default" padding="lg" className="border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div>
                <h3 className="text-lg font-bold text-white font-display">
                  Sharing permissions
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Control precisely what health information {partner.name} can see.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowPermissionsModal(true)}
                  leftIcon={<Sliders className="w-3.5 h-3.5" />}
                >
                  Manage permissions
                </Button>
              </div>
            </div>

            {/* Permission Toggles List */}
            <div className="divide-y divide-slate-800/80 mt-2">
              {permissionConfigs.map((item) => {
                const isShared = healthPermissions[item.key];
                return (
                  <div
                    key={item.key}
                    className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors rounded-xl px-2 hover:bg-slate-850/40"
                  >
                    <div className="flex items-start gap-3 flex-1 pr-4">
                      <div className={`p-2 rounded-xl border flex-shrink-0 mt-0.5 ${item.color}`}>
                        {item.icon}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-semibold text-white">
                            {item.title}
                          </h4>
                          <Badge
                            variant={isShared ? 'shared' : 'private'}
                            size="sm"
                            icon={isShared ? <Unlock className="w-3 h-3 text-violet-300" /> : <Lock className="w-3 h-3 text-slate-400" />}
                          >
                            {isShared ? 'Shared' : 'Private'}
                          </Badge>
                        </div>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pl-11 sm:pl-0">
                      <span className="text-[11px] text-slate-400 sm:hidden">
                        {isShared ? 'Shared with partner' : 'Private'}
                      </span>
                      <Toggle
                        checked={isShared}
                        onChange={() => toggleHealthPermission(item.key)}
                        ariaLabel={`Toggle sharing for ${item.title}`}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-400">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Changes take effect immediately across all connected views.
              </span>
              <span>
                Last updated: {healthPermissions.updatedAt ? new Date(healthPermissions.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}
              </span>
            </div>
          </Card>
        </div>
      ) : (
        /* =========================================================================
           DISCONNECTED / UNCONNECTED STATE
           Show 3 Options:
           - Option 1: "Invite with Code"
             Buttons: Generate Code, Copy, Share
           - Option 2: "Connect with QR"
             Display QR code placeholder
           - Option 3: "Enter Invite Code"
             Input: "Enter code"
             Button: "Connect"
           ========================================================================= */
        <div className="space-y-8 animate-in fade-in duration-200">
          {/* Invitation Sent Banner if in invitation_sent state */}
          {connectionState === 'invitation_sent' && (
            <div className="p-4 rounded-2xl bg-violet-950/40 border border-violet-500/50 flex items-start gap-3.5">
              <CheckCircle2 className="w-5 h-5 text-violet-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-sm font-semibold text-violet-200">
                    Invitation Sent & Active
                  </h4>
                  <Badge variant="warning" size="sm">
                    Expires in 48 hours
                  </Badge>
                </div>
                <p className="text-xs text-slate-300 mt-1">
                  Share code <strong className="font-mono text-white text-sm">{connection.inviteCode}</strong> with your trusted person. Once they enter it or scan your QR, your 1-to-1 space will activate.
                </p>
                <div className="mt-3 flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleShareInvite}
                    leftIcon={<Share2 className="w-3.5 h-3.5" />}
                  >
                    Share Invitation
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCopyCode}
                    leftIcon={copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  >
                    {copiedCode ? 'Copied!' : 'Copy Code'}
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* 2-Column Grid for Option 1 & Option 2 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* -------------------------------------------------------------
                OPTION 1: "Invite with Code"
                Generate a unique invitation code.
                Buttons:
                - Generate Code
                - Copy
                - Share
                ------------------------------------------------------------- */}
            <Card variant="default" padding="lg" className="flex flex-col justify-between border-slate-800">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-violet-600/15 border border-violet-500/30 text-violet-400">
                    <Link2 className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">Option 1</Badge>
                </div>

                <h3 className="text-lg font-bold text-white font-display">
                  Invite with Code
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Generate a unique invitation code to send to your trusted person via text, email, or message.
                </p>

                {/* Unique Invitation Code Box */}
                <div className="my-6 p-4 rounded-xl bg-[#090D18] border border-slate-700/80">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider block">
                        Unique Invitation Code
                      </span>
                      <span className="text-xl sm:text-2xl font-mono font-bold text-white tracking-widest block mt-0.5">
                        {connection.inviteCode}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        title="Copy code"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        {copiedCode ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>

                      <button
                        type="button"
                        onClick={handleGenerateCode}
                        disabled={isGenerating}
                        title="Generate Code"
                        className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                      >
                        <RefreshCw className={`w-4 h-4 ${isGenerating ? 'animate-spin text-violet-400' : ''}`} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <span>Valid for 48 hours</span>
                    <span className="text-emerald-400">Single-use secure token</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons: Generate Code, Copy, Share */}
              <div className="space-y-2 pt-3 border-t border-slate-800">
                <div className="grid grid-cols-3 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleGenerateCode}
                    isLoading={isGenerating}
                    leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Generate Code
                  </Button>

                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleCopyCode}
                    leftIcon={copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    {copiedCode ? 'Copied' : 'Copy'}
                  </Button>

                  <Button
                    variant="primary"
                    size="sm"
                    onClick={handleShareInvite}
                    leftIcon={<Share2 className="w-3.5 h-3.5" />}
                    className="text-xs"
                  >
                    Share
                  </Button>
                </div>

                <p className="text-[11px] text-slate-400 text-center pt-1">
                  Your partner enters this code on their LunaLink device.
                </p>
              </div>
            </Card>

            {/* -------------------------------------------------------------
                OPTION 2: "Connect with QR"
                Display a QR code placeholder.
                ------------------------------------------------------------- */}
            <Card variant="default" padding="lg" className="flex flex-col justify-between border-slate-800">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-indigo-600/15 border border-indigo-500/30 text-indigo-400">
                    <QrCode className="w-5 h-5" />
                  </div>
                  <Badge variant="neutral" size="sm">Option 2</Badge>
                </div>

                <h3 className="text-lg font-bold text-white font-display">
                  Connect with QR
                </h3>
                <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                  Display this QR code for your partner to scan with their device camera in person.
                </p>

                {/* QR Code Placeholder Graphic */}
                <div className="my-5 flex flex-col items-center justify-center p-4 rounded-xl bg-[#090D18] border border-slate-800">
                  <div className="relative p-3 bg-white rounded-xl shadow-xl">
                    <svg
                      className="w-32 h-32 sm:w-36 sm:h-36"
                      viewBox="0 0 100 100"
                      fill="#090D16"
                      role="img"
                      aria-label="QR Code placeholder for LunaLink connection"
                    >
                      {/* Top-left position marker */}
                      <rect x="5" y="5" width="24" height="24" rx="3" fill="#0D1424" />
                      <rect x="9" y="9" width="16" height="16" rx="2" fill="#FFFFFF" />
                      <rect x="13" y="13" width="8" height="8" rx="1" fill="#6366F1" />

                      {/* Top-right position marker */}
                      <rect x="71" y="5" width="24" height="24" rx="3" fill="#0D1424" />
                      <rect x="75" y="9" width="16" height="16" rx="2" fill="#FFFFFF" />
                      <rect x="79" y="13" width="8" height="8" rx="1" fill="#6366F1" />

                      {/* Bottom-left position marker */}
                      <rect x="5" y="71" width="24" height="24" rx="3" fill="#0D1424" />
                      <rect x="9" y="75" width="16" height="16" rx="2" fill="#FFFFFF" />
                      <rect x="13" y="79" width="8" height="8" rx="1" fill="#6366F1" />

                      {/* Grid patterns / data blocks */}
                      <rect x="36" y="8" width="8" height="8" rx="1" fill="#0D1424" />
                      <rect x="50" y="8" width="12" height="6" rx="1" fill="#0D1424" />
                      <rect x="36" y="22" width="6" height="12" rx="1" fill="#0D1424" />
                      <rect x="48" y="24" width="8" height="8" rx="1" fill="#7C3AED" />

                      <rect x="8" y="38" width="18" height="6" rx="1" fill="#0D1424" />
                      <rect x="8" y="48" width="8" height="14" rx="1" fill="#0D1424" />
                      <rect x="22" y="52" width="10" height="8" rx="1" fill="#0D1424" />

                      {/* Center emblem representing LunaLink */}
                      <rect x="38" y="38" width="24" height="24" rx="6" fill="#1E1B4B" />
                      <circle cx="50" cy="50" r="6" fill="#A78BFA" />

                      <rect x="70" y="38" width="12" height="8" rx="1" fill="#0D1424" />
                      <rect x="86" y="40" width="8" height="16" rx="1" fill="#0D1424" />
                      <rect x="74" y="56" width="18" height="8" rx="1" fill="#0D1424" />

                      <rect x="38" y="72" width="10" height="10" rx="1" fill="#0D1424" />
                      <rect x="54" y="74" width="18" height="6" rx="1" fill="#0D1424" />
                      <rect x="42" y="86" width="24" height="6" rx="1" fill="#0D1424" />
                      <rect x="74" y="74" width="20" height="20" rx="2" fill="#0D1424" />
                    </svg>
                  </div>

                  <span className="text-[11px] text-slate-400 mt-2.5 font-mono">
                    QR Code Placeholder • {connection.inviteCode}
                  </span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full"
                  onClick={() => setShowScannerModal(true)}
                  leftIcon={<Camera className="w-4 h-4 text-indigo-400" />}
                >
                  Simulate QR Scanner
                </Button>
              </div>
            </Card>
          </div>

          {/* -------------------------------------------------------------
              OPTION 3: "Enter Invite Code"
              Input: "Enter code"
              Button: "Connect"
              ------------------------------------------------------------- */}
          <Card variant="elevated" padding="lg" className="border-slate-700/80">
            <div className="max-w-2xl mx-auto text-center mb-6">
              <div className="w-10 h-10 mx-auto rounded-xl bg-violet-600/20 border border-violet-500/30 flex items-center justify-center text-violet-300 mb-3">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <div className="inline-block mb-1">
                <Badge variant="neutral" size="sm">Option 3</Badge>
              </div>
              <h3 className="text-xl font-bold text-white font-display">
                Enter Invite Code
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
                Did your trusted person share their invitation code with you? Enter it below to establish your 1-to-1 connection.
              </p>
            </div>

            <form onSubmit={handleConnectSubmit} className="max-w-xl mx-auto space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch gap-3">
                <Input
                  placeholder="Enter code"
                  value={enteredCode}
                  onChange={(e) => setEnteredCode(e.target.value)}
                  className="font-mono uppercase tracking-wider text-base"
                  required
                />
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  isLoading={isSubmitting}
                  rightIcon={<ArrowRight className="w-4 h-4" />}
                >
                  Connect
                </Button>
              </div>

              {/* Sample Code Quick Fillers for Testing & Convenience */}
              <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs text-slate-400">
                <span>Test presets:</span>
                <button
                  type="button"
                  onClick={() => setEnteredCode('LUNA-7734-ELN')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 font-mono text-violet-300 text-[11px] transition-colors"
                >
                  LUNA-7734-ELN (Valid)
                </button>
                <button
                  type="button"
                  onClick={() => setEnteredCode('LUNA-EXPIRED-99')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 font-mono text-amber-300 text-[11px] transition-colors"
                >
                  LUNA-EXPIRED-99 (Expired)
                </button>
                <button
                  type="button"
                  onClick={() => setEnteredCode('INVALID-FORMAT')}
                  className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 font-mono text-rose-300 text-[11px] transition-colors"
                >
                  INVALID-FORMAT (Invalid)
                </button>
              </div>
            </form>

            <div className="mt-8 pt-6 border-t border-slate-800 text-center">
              <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>
                  Being connected does <strong>not</strong> grant access to health data automatically. You configure permissions explicitly.
                </span>
              </p>
            </div>
          </Card>
        </div>
      )}

      {/* =========================================================================
          FUTURE SUPABASE INTEGRATION ARCHITECTURE CARD
          ========================================================================= */}
      <Card variant="default" padding="md" className="border-slate-800 bg-[#080C14]">
        <button
          type="button"
          onClick={() => setShowSupabaseDocs(!showSupabaseDocs)}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Database className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-semibold text-slate-200 flex items-center gap-2">
                <span>Supabase Database Schema & Architecture Prepared</span>
                <Badge variant="success" size="sm">Ready for Supabase</Badge>
              </h4>
              <p className="text-[11px] text-slate-400 mt-0.5">
                PostgreSQL schema, Row Level Security (RLS) policies, and RPC procedures for partner connection & health permissions.
              </p>
            </div>
          </div>
          {showSupabaseDocs ? (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          )}
        </button>

        {showSupabaseDocs && (
          <div className="mt-4 pt-4 border-t border-slate-800 space-y-3 text-xs text-slate-300 animate-in fade-in duration-150">
            <p className="leading-relaxed">
              The connection logic is fully prepared for Supabase PostgreSQL integration. Below is the mapped schema enforcing strict permission-based isolation:
            </p>

            <div className="p-3.5 rounded-xl bg-[#04060B] border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto">
              <pre>{`-- 1. PARTNER CONNECTIONS (1-to-1 Pairing)
CREATE TABLE public.partner_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  partner_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  invite_code VARCHAR(32) UNIQUE NOT NULL,
  status VARCHAR(24) NOT NULL DEFAULT 'invitation_sent',
  expires_at TIMESTAMPTZ NOT NULL DEFAULT (now() + interval '48 hours'),
  connected_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. SHARING PERMISSIONS (Strictly Permission-Based Health Data)
CREATE TABLE public.sharing_permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  connection_id UUID REFERENCES public.partner_connections(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  cycle_information BOOLEAN NOT NULL DEFAULT false,  -- Zero access by default!
  pain_trends BOOLEAN NOT NULL DEFAULT false,
  care_profile BOOLEAN NOT NULL DEFAULT false,
  care_mode BOOLEAN NOT NULL DEFAULT false,
  shared_reminders BOOLEAN NOT NULL DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(connection_id, user_id)
);`}</pre>
            </div>

            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <Code2 className="w-3.5 h-3.5 text-violet-400" />
              <span>
                Documented in <code>/src/services/partnerConnectionService.ts</code> with RLS policies ensuring partners can only query tables when explicitly granted.
              </span>
            </div>
          </div>
        )}
      </Card>

      {/* =========================================================================
          DISCONNECT CONFIRMATION MODAL
          ========================================================================= */}
      <Modal
        isOpen={showDisconnectModal}
        onClose={() => setShowDisconnectModal(false)}
        title="Disconnect partner?"
        subtitle="This action will break your 1-to-1 connection and immediately revoke all shared data."
        maxWidth="md"
      >
        <div className="space-y-4 text-left">
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-200 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1.5">
              <p className="font-semibold text-rose-100">
                Are you sure you want to disconnect from {partner?.name || 'your partner'}?
              </p>
              <ul className="list-disc pl-4 space-y-1 text-rose-300/90 text-[11px]">
                <li>All health sharing permissions will be immediately revoked.</li>
                <li>Your partner will no longer have access to your cycle, symptoms, or Care Profile.</li>
                <li>Your shared corridor will be unlinked.</li>
                <li>To reconnect in the future, a new invitation code will be required.</li>
              </ul>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button
              variant="outline"
              size="md"
              onClick={() => setShowDisconnectModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              size="md"
              onClick={handleConfirmDisconnect}
              leftIcon={<UserX className="w-4 h-4" />}
            >
              Confirm Disconnect
            </Button>
          </div>
        </div>
      </Modal>

      {/* =========================================================================
          MANAGE PERMISSIONS MODAL
          ========================================================================= */}
      <Modal
        isOpen={showPermissionsModal}
        onClose={() => setShowPermissionsModal(false)}
        title="Manage Sharing Permissions"
        subtitle="Configure all health sharing permissions for your connected partner."
        maxWidth="lg"
      >
        <div className="space-y-5 text-left">
          <div className="p-3 rounded-xl bg-[#090D18] border border-slate-800 text-xs text-slate-300 flex items-center justify-between">
            <span>Quick Presets:</span>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  saveHealthPermissions({
                    cycleInformation: false,
                    painTrends: false,
                    careProfile: false,
                    careMode: false,
                    sharedReminders: false,
                  });
                }}
              >
                Make All Private
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => {
                  saveHealthPermissions({
                    cycleInformation: true,
                    painTrends: true,
                    careProfile: true,
                    careMode: true,
                    sharedReminders: true,
                  });
                }}
              >
                Share All
              </Button>
            </div>
          </div>

          <div className="divide-y divide-slate-800/80 max-h-[50vh] overflow-y-auto pr-1">
            {permissionConfigs.map((item) => {
              const isShared = healthPermissions[item.key];
              return (
                <div key={item.key} className="py-3.5 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl border flex-shrink-0 ${item.color}`}>
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-white">
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  <Toggle
                    checked={isShared}
                    onChange={() => toggleHealthPermission(item.key)}
                    ariaLabel={`Toggle ${item.title}`}
                  />
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-end pt-2 border-t border-slate-800">
            <Button
              variant="primary"
              size="md"
              onClick={() => setShowPermissionsModal(false)}
            >
              Done
            </Button>
          </div>
        </div>
      </Modal>

      {/* =========================================================================
          SIMULATED QR SCANNER MODAL
          ========================================================================= */}
      <Modal
        isOpen={showScannerModal}
        onClose={() => setShowScannerModal(false)}
        title="Connect with QR Scanner"
        subtitle="Point your device camera at your partner's LunaLink QR code."
        maxWidth="sm"
      >
        <div className="text-center space-y-4">
          <div className="relative w-48 h-48 mx-auto rounded-2xl bg-slate-950 border-2 border-dashed border-violet-500/60 flex items-center justify-center overflow-hidden">
            <Camera className="w-10 h-10 text-violet-400 animate-pulse" />
            <div className="absolute inset-x-0 top-0 h-1 bg-violet-400/80 shadow-[0_0_12px_rgba(167,139,250,0.8)] animate-bounce" />
          </div>
          <p className="text-xs text-slate-400">
            Scanning for valid LunaLink QR tokens in live camera feed...
          </p>
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => setShowScannerModal(false)}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              size="sm"
              className="flex-1"
              onClick={() => {
                setShowScannerModal(false);
                setEnteredCode('LUNA-7734-ELN');
                connectWithCode('LUNA-7734-ELN');
              }}
            >
              Scan Sample QR
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
