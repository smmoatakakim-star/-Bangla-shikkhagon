import React from 'react';
import { Home, BookOpen, Award, Bot, User as UserIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageType } from '../types';

export const MobileBottomNav: React.FC = () => {
  const { currentPage, navigate, currentUser } = useApp();

  const navItems = [
    { label: 'হোম', page: 'home' as PageType, icon: Home },
    {
      label: 'AI সহায়ক',
      page: 'ai_chat' as PageType,
      icon: Bot,
      matchPages: ['ai_chat'],
    },
    {
      label: 'পড়াশোনা',
      page: 'classes' as PageType,
      icon: BookOpen,
      matchPages: ['classes', 'subjects', 'chapters', 'lesson', 'ssc_dashboard', 'hsc_dashboard', 'formula_bank'],
    },
    {
      label: 'কুইজ',
      page: 'quiz' as PageType,
      icon: Award,
      matchPages: [
        'quiz',
        'quiz_play',
        'quiz_result',
        'question_bank',
        'model_tests',
        'daily_quiz',
        'wrong_questions',
        'bookmarked_questions',
      ],
    },
    {
      label: 'প্রোফাইল',
      page: (currentUser ? 'profile' : 'login') as PageType,
      icon: UserIcon,
      params: currentUser ? { userId: currentUser.id } : {},
      matchPages: ['profile', 'edit_profile', 'login', 'register'],
    },
  ];

  return (
    <nav
      id="mobile-bottom-navigation"
      aria-label="মোবাইল ন্যাভিগেশন"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 pb-safe transition-colors shadow-lg"
    >
      <div className="grid grid-cols-5 h-14 max-w-md mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive =
            currentPage === item.page ||
            (item.matchPages && item.matchPages.includes(currentPage));

          return (
            <button
              key={item.label}
              id={`mobile-nav-${item.label}`}
              onClick={() => navigate(item.page, item.params || {})}
              className={`flex flex-col items-center justify-center gap-0.5 py-1 transition-all relative touch-manipulation select-none active:scale-95 ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {isActive && (
                <span className="absolute top-0 w-6 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
              )}
              <Icon className={`w-4.5 h-4.5 ${isActive ? 'scale-110' : ''} transition-transform`} />
              <span className="text-[10px] leading-tight tracking-tight">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};
