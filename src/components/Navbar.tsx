import React, { useState } from 'react';
import {
  BookOpen,
  Search,
  Bell,
  Sun,
  Moon,
  Bookmark,
  Shield,
  User as UserIcon,
  LogOut,
  Layers,
  Award,
  MessageSquare,
  Sparkles,
  ChevronDown,
  Menu,
  X,
  CheckCircle2,
  HelpCircle,
  Zap,
  AlertCircle,
  Bot,
  Languages,
  ShieldCheck,
  GraduationCap,
  Volume2,
  VolumeX,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useVoiceGuide } from '../context/VoiceGuideContext';
import { PageType } from '../types';

export const Navbar: React.FC = () => {
  const {
    currentUser,
    users,
    theme,
    toggleTheme,
    currentPage,
    navigate,
    unreadNotificationsCount,
    notifications,
    markNotificationsAsRead,
    switchUser,
    logout,
  } = useApp();

  const { isVoiceEnabled, toggleVoice, isSpeaking } = useVoiceGuide();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showAccountSwitcher, setShowAccountSwitcher] = useState(false);

  const navLinks: { label: string; page: PageType; icon: any }[] = [
    { label: 'হোম', page: 'home', icon: BookOpen },
    { label: 'এসএসসি (SSC)', page: 'ssc_dashboard', icon: GraduationCap },
    { label: 'এইচএসসি (HSC)', page: 'hsc_dashboard', icon: Award },
    { label: 'সূত্রভাণ্ডার', page: 'formula_bank', icon: Sparkles },
    { label: '🤖 AI সহায়ক', page: 'ai_chat', icon: Bot },
    { label: 'পড়াশোনা', page: 'classes', icon: Layers },
    { label: 'ব্যাকরণ', page: 'grammar_master', icon: Languages },
    { label: 'প্রশ্নব্যাংক', page: 'question_bank', icon: HelpCircle },
    { label: 'মডেল টেস্ট', page: 'model_tests', icon: Award },
    { label: 'কমিউনিটি', page: 'posts', icon: MessageSquare },
  ];

  const handleNavClick = (page: PageType, params = {}) => {
    navigate(page, params);
    setShowMobileMenu(false);
  };

  const handleNotificationsClick = () => {
    setShowNotifications(!showNotifications);
    if (!showNotifications) {
      markNotificationsAsRead();
    }
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14 sm:h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5">
            <button
              id="brand-logo-button"
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 text-left focus:outline-none group"
            >
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-xs shadow-emerald-600/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              </div>
              <div>
                <span className="text-base sm:text-lg font-bold tracking-tight text-emerald-700 dark:text-emerald-400 block leading-tight">
                  বাংলা শিক্ষাগর
                </span>
                <span className="text-[10px] text-slate-700 dark:text-slate-300 block -mt-0.5">
                  সহজে শিখি, জ্ঞান বাড়াই
                </span>
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links */}
          <nav id="desktop-navigation" className="hidden md:flex items-center gap-1.5">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive =
                currentPage === link.page ||
                (link.page === 'classes' &&
                  ['classes', 'subjects', 'chapters', 'lesson'].includes(currentPage));
              return (
                <button
                  key={link.page}
                  id={`nav-link-${link.page}`}
                  onClick={() => handleNavClick(link.page)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-semibold'
                      : 'text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{link.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons & Controls */}
          <div className="flex items-center gap-2">
            {/* Search Button */}
            <button
              id="header-search-btn"
              onClick={() => handleNavClick('search')}
              title="সার্চ করুন"
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Saved Items Quick Link */}
            {currentUser && (
              <button
                id="header-saved-btn"
                onClick={() => handleNavClick('saved')}
                title="আমার সংরক্ষিত"
                className={`p-2 rounded-lg transition ${
                  currentPage === 'saved'
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60'
                    : 'text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Bookmark className="w-5 h-5" />
              </button>
            )}

            {/* Notifications Dropdown */}
            {currentUser && (
              <div className="relative">
                <button
                  id="header-notifications-btn"
                  onClick={handleNotificationsClick}
                  title="বিজ্ঞপ্তি"
                  className="p-2 relative rounded-lg text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotificationsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadNotificationsCount}
                    </span>
                  )}
                </button>

                {showNotifications && (
                  <div
                    id="notifications-dropdown-menu"
                    className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-2 z-50 animate-in fade-in zoom-in-95 duration-150"
                  >
                    <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <h4 className="font-semibold text-slate-800 dark:text-slate-100 text-sm">
                        বিজ্ঞপ্তিসমূহ ({notifications.filter((n) => n.userId === currentUser.id).length})
                      </h4>
                      <button
                        onClick={() => {
                          navigate('notifications');
                          setShowNotifications(false);
                        }}
                        className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline"
                      >
                        সবগুলো দেখুন
                      </button>
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/60">
                      {notifications
                        .filter((n) => n.userId === currentUser.id)
                        .slice(0, 5)
                        .map((notif) => (
                          <div
                            key={notif.id}
                            onClick={() => {
                              if (notif.targetPage) navigate(notif.targetPage, { id: notif.targetId });
                              setShowNotifications(false);
                            }}
                            className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer transition flex items-start gap-2.5"
                          >
                            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                            <div className="flex-1 text-xs">
                              <p className="font-medium text-slate-800 dark:text-slate-200">
                                {notif.title}
                              </p>
                              <p className="text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                                {notif.message}
                              </p>
                              <span className="text-[10px] text-slate-500 mt-1 block">
                                {notif.createdAt}
                              </span>
                            </div>
                          </div>
                        ))}
                      {notifications.filter((n) => n.userId === currentUser.id).length === 0 && (
                        <div className="p-4 text-center text-xs text-slate-500">
                          কোনো নতুন বিজ্ঞপ্তি নেই
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Voice Guide Toggle Button */}
            <button
              id="header-voice-toggle-btn"
              onClick={toggleVoice}
              title={isVoiceEnabled ? 'ভয়েস গাইড বন্ধ করুন (ভয়েস চালু আছে)' : 'ভয়েস গাইড চালু করুন (ভয়েস বন্ধ আছে)'}
              className={`p-2 rounded-lg transition flex items-center justify-center ${
                isVoiceEnabled
                  ? isSpeaking
                    ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 ring-1 ring-emerald-500 animate-pulse'
                    : 'text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50/60 dark:hover:bg-emerald-950/40'
                  : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {isVoiceEnabled ? (
                <Volume2 className="w-5 h-5 text-emerald-600" />
              ) : (
                <VolumeX className="w-5 h-5 text-slate-400" />
              )}
            </button>

            {/* Dark/Light Theme Toggle */}
            <button
              id="theme-toggle-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? 'লাইট মোড চালু করুন' : 'ডার্ক মোড চালু করুন'}
              className="p-2 rounded-lg text-slate-700 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-slate-600" />
              )}
            </button>

            {/* Quick Demo Role Switcher Badge */}
            <div className="relative hidden sm:block">
              <button
                id="role-switcher-btn"
                onClick={() => setShowAccountSwitcher(!showAccountSwitcher)}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/80 text-emerald-800 dark:text-emerald-300 font-medium hover:bg-emerald-100 transition"
                title="দ্রুত অ্যাকাউন্ট পরিবর্তন (টেস্টের জন্য)"
              >
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                <span>
                  {currentUser
                    ? currentUser.role === 'admin'
                      ? 'অ্যাডমিন মোড'
                      : currentUser.role === 'teacher'
                      ? 'শিক্ষক মোড'
                      : 'শিক্ষার্থী মোড'
                    : 'অতিথি'}
                </span>
                <ChevronDown className="w-3 h-3" />
              </button>

              {showAccountSwitcher && (
                <div
                  id="role-switcher-dropdown"
                  className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 p-2 z-50"
                >
                  <div className="text-[11px] font-semibold text-slate-500 uppercase px-2 py-1">
                    অ্যাকাউন্ট বাছাই করুন:
                  </div>
                  {users.map((u) => (
                    <button
                      key={u.id}
                      onClick={() => {
                        switchUser(u.id);
                        setShowAccountSwitcher(false);
                      }}
                      className={`w-full flex items-center justify-between p-2 rounded-lg text-left text-xs transition ${
                        currentUser?.id === u.id
                          ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={u.avatar}
                          alt={u.name}
                          className="w-6 h-6 rounded-full object-cover"
                        />
                        <div>
                          <div className="font-medium truncate max-w-[120px]">{u.name}</div>
                          <div className="text-[10px] text-slate-600 dark:text-slate-300">
                            {u.role === 'admin'
                              ? 'অ্যাডমিন'
                              : u.role === 'teacher'
                              ? 'শিক্ষক'
                              : u.classGrade === 'class-6'
                              ? '৬ষ্ঠ শ্রেণি'
                              : u.classGrade === 'class-7'
                              ? '৭ম শ্রেণি'
                              : u.classGrade === 'class-8'
                              ? '৮ম শ্রেণি'
                              : u.classGrade === 'class-9'
                              ? '৯ম শ্রেণি'
                              : u.classGrade === 'class-10'
                              ? '১০ম শ্রেণি'
                              : 'শিক্ষার্থী'}
                          </div>
                        </div>
                      </div>
                      {currentUser?.id === u.id && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Admin Dashboard Quick Link (if Admin) */}
            {currentUser?.role === 'admin' && (
              <button
                id="header-admin-btn"
                onClick={() => handleNavClick('admin')}
                className={`hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                  currentPage === 'admin'
                    ? 'bg-purple-600 text-white border-purple-600'
                    : 'bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800 hover:bg-purple-100'
                }`}
              >
                <Shield className="w-3.5 h-3.5" />
                <span>অ্যাডমিন প্যানেল</span>
              </button>
            )}

            {/* User Profile or Login */}
            {currentUser ? (
              <div className="relative">
                <button
                  id="user-profile-menu-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 pl-2 rounded-full border border-slate-200 dark:border-slate-700 hover:border-emerald-500 transition"
                >
                  <span className="hidden sm:inline-block text-xs font-medium text-slate-700 dark:text-slate-200 max-w-[90px] truncate">
                    {currentUser.name.split(' ')[0]}
                  </span>
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover border border-emerald-500"
                  />
                </button>

                {showUserMenu && (
                  <div
                    id="user-profile-dropdown"
                    className="absolute right-0 mt-2 w-52 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-slate-200 dark:border-slate-800 py-1.5 z-50"
                  >
                    <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-medium text-xs text-slate-900 dark:text-slate-100 truncate">
                        {currentUser.name}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        @{currentUser.username}
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        navigate('profile', { userId: currentUser.id });
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <UserIcon className="w-4 h-4" />
                      <span>প্রোফাইল</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('saved');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>সংরক্ষিত পাঠ</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('wrong_questions');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <AlertCircle className="w-4 h-4" />
                      <span>ভুল প্রশ্ন অনুশীলন</span>
                    </button>

                    <button
                      onClick={() => {
                        navigate('bookmarked_questions');
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30"
                    >
                      <Bookmark className="w-4 h-4" />
                      <span>বুকমার্ক করা প্রশ্ন</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          navigate('admin');
                          setShowUserMenu(false);
                        }}
                        className="w-full flex items-center gap-2 px-4 py-2 text-xs text-purple-700 dark:text-purple-300 hover:bg-purple-50 dark:hover:bg-purple-950/30"
                      >
                        <Shield className="w-4 h-4" />
                        <span>অ্যাডমিন ড্যাশবোর্ড</span>
                      </button>
                    )}

                    <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>লগআউট</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                id="header-login-btn"
                onClick={() => handleNavClick('login')}
                className="px-3.5 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition"
              >
                লগইন / রেজিস্টার
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              id="mobile-menu-toggle-btn"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="p-2 md:hidden rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {showMobileMenu ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {showMobileMenu && (
        <div
          id="mobile-drawer-menu"
          className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg"
        >
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.page}
                onClick={() => handleNavClick(link.page)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <Icon className="w-5 h-5 text-emerald-600" />
                <span className="font-medium">{link.label}</span>
              </button>
            );
          })}
          {currentUser?.role === 'admin' && (
            <button
              onClick={() => handleNavClick('admin')}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40"
            >
              <Shield className="w-5 h-5" />
              <span className="font-semibold">অ্যাডমিন ড্যাশবোর্ড</span>
            </button>
          )}

          {/* Mobile Voice Guide Item */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                toggleVoice();
              }}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-semibold transition ${
                isVoiceEnabled
                  ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/80'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
              }`}
            >
              <div className="flex items-center gap-2.5">
                {isVoiceEnabled ? (
                  <Volume2 className="w-5 h-5 text-emerald-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-slate-400" />
                )}
                <span>বাংলা ভয়েস গাইড</span>
              </div>
              <span
                className={`text-xs px-2.5 py-0.5 rounded-full font-bold ${
                  isVoiceEnabled
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                {isVoiceEnabled ? '🔊 চালু' : '🔇 বন্ধ'}
              </span>
            </button>
          </div>

          <button
            onClick={() => handleNavClick('about')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            আমাদের সম্পর্কে
          </button>
          <button
            onClick={() => handleNavClick('contact')}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            যোগাযোগ
          </button>
        </div>
      )}
    </header>
  );
};
