import React, { useState } from 'react';
import { Megaphone, X, ChevronRight, ChevronLeft, Bell } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AnnouncementBanner: React.FC = () => {
  const { managedNotices, settings, navigate, currentPage } = useApp();
  const [dismissed, setDismissed] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  // Active banners directly derived from Firebase managed notices with status === 'published' and showOnBanner === true
  const activeBanners = managedNotices.filter(
    (n) => n.status === 'published' && n.showOnBanner
  );

  // If no active banners in Firestore, check settings announcement as fallback
  const fallbackText = settings.showAnnouncement ? settings.announcementText : '';
  const hasContent = activeBanners.length > 0 || Boolean(fallbackText);

  if (!hasContent || dismissed) {
    return null;
  }

  const currentNotice = activeBanners[currentIndex % (activeBanners.length || 1)];
  const bannerText = currentNotice ? currentNotice.text : fallbackText;
  const bannerTitle = currentNotice ? currentNotice.title : 'জরুরি ঘোষণা';

  const getTypeStyle = (type?: string) => {
    switch (type) {
      case 'urgent':
        return 'from-rose-600 via-red-600 to-rose-700';
      case 'exam':
        return 'from-purple-600 via-indigo-600 to-purple-700';
      case 'festive':
        return 'from-amber-600 via-orange-600 to-amber-700';
      case 'info':
      default:
        return 'from-emerald-600 via-teal-600 to-emerald-700';
    }
  };

  const handleGoToNotices = () => {
    if (currentPage !== 'home') {
      navigate('home');
    }
    setTimeout(() => {
      const el = document.getElementById('site-notice-board');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }, 150);
  };

  return (
    <div
      id="announcement-top-banner"
      className={`bg-gradient-to-r ${getTypeStyle(
        currentNotice?.type
      )} text-white text-xs sm:text-sm py-2 px-3 sm:px-4 shadow-sm relative z-50`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          <div className="p-1 rounded-md bg-white/20 shrink-0">
            <Megaphone className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          </div>

          <div className="flex items-center gap-2 overflow-hidden">
            <span className="font-extrabold px-1.5 py-0.5 rounded bg-black/25 text-[10px] tracking-wide uppercase shrink-0">
              {bannerTitle}
            </span>
            <p className="truncate font-medium text-xs sm:text-sm text-white/95">
              {bannerText}
            </p>
          </div>
        </div>

        {/* Action & Controls */}
        <div className="flex items-center gap-2 shrink-0">
          {activeBanners.length > 1 && (
            <div className="flex items-center gap-1 bg-black/20 rounded-lg px-1.5 py-0.5 text-[10px]">
              <button
                onClick={() =>
                  setCurrentIndex((prev) => (prev > 0 ? prev - 1 : activeBanners.length - 1))
                }
                className="hover:text-amber-300 transition"
                title="পূর্ববর্তী ব্যানার"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span>
                {currentIndex + 1}/{activeBanners.length}
              </span>
              <button
                onClick={() => setCurrentIndex((prev) => (prev + 1) % activeBanners.length)}
                className="hover:text-amber-300 transition"
                title="পরবর্তী ব্যানার"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          <button
            onClick={handleGoToNotices}
            className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-white/20 hover:bg-white/30 text-[11px] font-bold text-white transition"
          >
            <Bell className="w-3 h-3" />
            <span>নোটিশ বোর্ড</span>
          </button>

          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-white/20 rounded-md transition text-white/80 hover:text-white"
            title="ব্যানার বন্ধ করুন"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
