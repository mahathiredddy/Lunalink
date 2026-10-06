import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Avatar } from '../ui/Avatar';
import { Badge } from '../ui/Badge';
import {
  Camera,
  Calendar,
  Mail,
  User as UserIcon,
  Clock,
  Sparkles,
  RotateCcw,
  Upload,
} from 'lucide-react';

interface EditProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SAMPLE_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&auto=format&fit=crop&q=80',
];

export const EditProfileModal: React.FC<EditProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { user, updateProfile, showToast } = useApp();

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [dateOfBirth, setDateOfBirth] = useState(user.dateOfBirth || '');
  const [avatarUrl, setAvatarUrl] = useState(user.avatar);
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [statusMessage, setStatusMessage] = useState(user.statusMessage || '');
  const [timezone, setTimezone] = useState(user.timezone || 'UTC-5 (Eastern Time)');
  const [isSaving, setIsSaving] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  // Sync state when modal opens
  useEffect(() => {
    if (isOpen) {
      setName(user.name);
      setEmail(user.email);
      setDateOfBirth(user.dateOfBirth || '');
      setAvatarUrl(user.avatar);
      setStatusMessage(user.statusMessage || '');
      setTimezone(user.timezone || 'UTC-5 (Eastern Time)');
      setEmailError(null);
    }
  }, [isOpen, user]);

  const handleCustomAvatarApply = () => {
    if (customAvatarInput.trim()) {
      setAvatarUrl(customAvatarInput.trim());
      setCustomAvatarInput('');
      showToast('Profile photo updated from URL', 'info');
    }
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setAvatarUrl(uploadEvent.target.result as string);
          showToast('Image uploaded and preview updated', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError(null);

    // Basic email validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      setEmailError('Please provide a valid email address.');
      return;
    }

    if (!name.trim()) {
      showToast('Name cannot be empty', 'error');
      return;
    }

    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        dateOfBirth: dateOfBirth ? dateOfBirth : undefined,
        avatar: avatarUrl,
        statusMessage: statusMessage.trim(),
        timezone: timezone.trim(),
      });
      showToast('Profile updated successfully', 'success');
      onClose();
    } catch {
      showToast('Failed to save profile. Please retry.', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit Profile"
      subtitle="Update your personal details, profile picture, and optional birth date"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Profile Picture Section */}
        <div className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-white flex items-center gap-2">
              <Camera className="w-4 h-4 text-violet-400" />
              Profile Picture
            </span>
            <span className="text-[11px] text-slate-400">
              Visible on shared dashboard & notifications
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-5">
            <div className="relative group flex-shrink-0">
              <Avatar
                src={avatarUrl}
                name={name || 'User'}
                size="xl"
                className="ring-4 ring-violet-500/20"
              />
              <label
                htmlFor="avatar-file-input"
                className="absolute -bottom-1 -right-1 p-2 rounded-full bg-violet-600 hover:bg-violet-500 text-white shadow-lg border-2 border-[#090D16] cursor-pointer transition-colors"
                title="Upload photo from device"
              >
                <Upload className="w-3.5 h-3.5" />
                <input
                  id="avatar-file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleSimulateFileUpload}
                  className="hidden"
                />
              </label>
            </div>

            <div className="space-y-2 flex-1 w-full text-center sm:text-left">
              <span className="text-[11px] text-slate-400 block font-medium">
                Choose a portrait avatar preset:
              </span>
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                {SAMPLE_AVATARS.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setAvatarUrl(url)}
                    className={`rounded-full p-0.5 border-2 transition-all ${
                      avatarUrl === url
                        ? 'border-violet-500 scale-105 shadow-md shadow-violet-500/20'
                        : 'border-transparent hover:border-slate-600'
                    }`}
                  >
                    <img
                      src={url}
                      alt={`Avatar option ${i + 1}`}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                  </button>
                ))}
              </div>

              {/* Custom Image URL Option */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="url"
                  placeholder="Or paste image URL"
                  value={customAvatarInput}
                  onChange={(e) => setCustomAvatarInput(e.target.value)}
                  className="flex-1 px-2.5 py-1.5 bg-[#0D1322] border border-slate-700/70 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleCustomAvatarApply}
                  disabled={!customAvatarInput.trim()}
                >
                  Apply
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Basic Credentials: Name and Email */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Name / Display Name"
            leftIcon={<UserIcon className="w-4 h-4 text-slate-400" />}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your full or preferred name"
            required
          />

          <Input
            label="Email Address"
            leftIcon={<Mail className="w-4 h-4 text-slate-400" />}
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@example.com"
            error={emailError || undefined}
            required
          />
        </div>

        {/* Date of Birth (Optional) */}
        <div className="p-4 rounded-2xl bg-[#090E1A] border border-slate-800 space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="date-of-birth-input"
              className="text-xs font-semibold text-white flex items-center gap-2"
            >
              <Calendar className="w-4 h-4 text-violet-400" />
              Date of Birth
              <Badge variant="neutral" size="sm">
                Optional
              </Badge>
            </label>
            {dateOfBirth && (
              <button
                type="button"
                onClick={() => setDateOfBirth('')}
                className="text-[11px] text-slate-400 hover:text-rose-400 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                Clear Date
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <input
              id="date-of-birth-input"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              className="w-full px-3 py-2 bg-[#0D1322] border border-slate-700/70 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-violet-500 cursor-pointer"
            />
          </div>

          <p className="text-[11px] text-slate-400 leading-relaxed">
            Used only for life stage and cycle health age context if you choose to provide it. <strong className="text-slate-300">Never automatically shared with your partner or any third parties.</strong>
          </p>
        </div>

        {/* Additional Status & Timezone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Status / Current Note (Optional)"
            leftIcon={<Sparkles className="w-4 h-4 text-slate-400" />}
            value={statusMessage}
            onChange={(e) => setStatusMessage(e.target.value)}
            placeholder="e.g. Busy with work, Taking it easy"
          />

          <Input
            label="Timezone"
            leftIcon={<Clock className="w-4 h-4 text-slate-400" />}
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            placeholder="e.g. UTC-5 (Eastern Time)"
          />
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isSaving}
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </Modal>
  );
};
