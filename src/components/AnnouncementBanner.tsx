import React, { useState } from 'react';
import { Megaphone, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnnouncementBanner: React.FC = () => {
  const { settings } = useApp();
  const [dismissed, setDismissed] = useState(false);

  if (!settings.showAnnouncement || !settings.announcementText || dismissed) {
    return null;
  }

  return (
    <div
      id="announcement-top-banner"
      className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs sm:text-sm py-2 px-4 shadow-sm"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden">
          <Megaphone className="w-4 h-4 shrink-0 text-amber-300 animate-pulse" />
          <p className="truncate font-medium">{settings.announcementText}</p>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="p-1 hover:bg-white/20 rounded-md transition text-white/80 hover:text-white"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
