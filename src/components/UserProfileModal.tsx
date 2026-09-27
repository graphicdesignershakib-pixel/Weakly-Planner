import React, { useState } from 'react';
import { User, Sparkles, Check, Edit2, X, Briefcase } from 'lucide-react';
import { UserProfile } from '../types/planner';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [name, setName] = useState(profile.name || 'Shakib');
  const [tagline, setTagline] = useState(profile.tagline || 'Creator & Architect');

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      name: name.trim() || 'Achiever',
      tagline: tagline.trim() || 'Focused on Excellence',
    });
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs"
    >
      <div className="bg-white dark:bg-[#18181B] border border-[#E5E7EB] dark:border-[#27272A] rounded-2xl max-w-md w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white rounded-lg cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white text-lg font-black shadow-md">
            {name.slice(0, 1).toUpperCase() || 'U'}
          </div>
          <div>
            <h3 className="text-base font-bold text-[#111111] dark:text-white">
              Personalize Your Profile
            </h3>
            <p className="text-xs text-[#71717A] dark:text-[#A1A1AA]">
              Set your name & identity to feel at home in your workspace
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] mb-1.5">
              Your Name / Nickname
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Shakib, Sarah, Alex..."
              className="w-full text-sm font-semibold text-[#111111] dark:text-white bg-[#F8F9FA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] focus:border-[#111111] dark:focus:border-white rounded-xl px-3.5 py-2.5 outline-none transition-colors"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#71717A] dark:text-[#A1A1AA] mb-1.5">
              Your Profession / Life Tagline
            </label>
            <input
              type="text"
              value={tagline}
              onChange={(e) => setTagline(e.target.value)}
              placeholder="e.g. Creative Designer, Software Engineer, Student..."
              className="w-full text-xs text-[#111111] dark:text-white bg-[#F8F9FA] dark:bg-[#121214] border border-[#E5E7EB] dark:border-[#27272A] focus:border-[#111111] dark:focus:border-white rounded-xl px-3.5 py-2.5 outline-none transition-colors"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-[#71717A] dark:text-[#A1A1AA] hover:text-[#111111] dark:hover:text-white rounded-xl cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#111111] dark:bg-white text-white dark:text-[#111111] hover:bg-[#27272A] dark:hover:bg-zinc-200 rounded-xl text-xs font-bold cursor-pointer shadow-xs transition-colors"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
