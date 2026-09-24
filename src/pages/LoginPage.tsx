import React, { useState } from 'react';
import {
  LogIn,
  UserPlus,
  BookOpen,
  CheckCircle,
  Sparkles,
  Shield,
  School,
  GraduationCap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, UserRole } from '../types';

export const LoginPage: React.FC = () => {
  const { login, register, navigate, quickSwitchUser, signInWithGoogle, isFirebaseLoading } = useApp();

  const [mode, setMode] = useState<'login' | 'register'>('login');

  // Login form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Register form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regRole, setRegRole] = useState<UserRole>('student');
  const [regClass, setRegClass] = useState<ClassId>('class-7');
  const [regSchool, setRegSchool] = useState('');
  const [regBio, setRegBio] = useState('');

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');

    const success = login(email.trim(), password.trim());
    if (success) {
      navigate('home');
    } else {
      setLoginError('ইমেইল বা পাসওয়ার্ড সঠিক নয়। দয়া করে পুনরায় চেষ্টা করুন বা নিচের ডেমো বাটনে ক্লিক করুন।');
    }
  };

  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    const username = regEmail.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '') || `user_${Date.now()}`;
    const success = register(
      regName.trim(),
      username,
      regEmail.trim(),
      regClass,
      regRole === 'teacher' ? 'teacher' : 'student'
    );
    if (success) {
      navigate('home');
    }
  };

  return (
    <div id="auth-page" className="max-w-lg mx-auto py-8 space-y-6">
      {/* Brand Icon & Heading */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 text-white flex items-center justify-center mx-auto shadow-md">
          <BookOpen className="w-7 h-7" />
        </div>
        <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
          বাংলা শিক্ষাগরে স্বাগতম
        </h1>
        <p className="text-xs text-slate-600 dark:text-slate-300">
          তোমার শিক্ষণযাত্রা শুরু করতে অ্যাকাউন্ট পরিচালনা করো
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl flex items-center">
        <button
          onClick={() => {
            setMode('login');
            setLoginError('');
          }}
          className={`w-1/2 py-2.5 rounded-xl text-xs font-bold transition ${
            mode === 'login'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          লগইন (Sign In)
        </button>
        <button
          onClick={() => {
            setMode('register');
            setLoginError('');
          }}
          className={`w-1/2 py-2.5 rounded-xl text-xs font-bold transition ${
            mode === 'register'
              ? 'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 shadow-sm'
              : 'text-slate-600 dark:text-slate-400'
          }`}
        >
          নতুন নিবন্ধন (Register)
        </button>
      </div>

      {/* Quick Demo Switcher Card */}
      <div className="p-4 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            এক ক্লিকে ডেমো একাউন্টে প্রবেশ:
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2 text-xs">
          <button
            type="button"
            onClick={() => {
              quickSwitchUser('user-student-1');
              navigate('home');
            }}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-emerald-200 dark:border-emerald-900 text-slate-800 dark:text-slate-200 hover:border-emerald-500 font-semibold transition text-center"
          >
            <div className="font-bold text-emerald-700 dark:text-emerald-400">শিক্ষার্থী</div>
            <div className="text-[10px] text-slate-500">রাফি (৮ম শ্রেণি)</div>
          </button>

          <button
            type="button"
            onClick={() => {
              quickSwitchUser('user-teacher-1');
              navigate('home');
            }}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900 text-slate-800 dark:text-slate-200 hover:border-blue-500 font-semibold transition text-center"
          >
            <div className="font-bold text-blue-700 dark:text-blue-400">শিক্ষক</div>
            <div className="text-[10px] text-slate-500">মাহমুদুল হাসান স্যার</div>
          </button>

          <button
            type="button"
            onClick={() => {
              quickSwitchUser('user-admin-1');
              navigate('home');
            }}
            className="p-2 rounded-xl bg-white dark:bg-slate-800 border border-purple-200 dark:border-purple-900 text-slate-800 dark:text-slate-200 hover:border-purple-500 font-semibold transition text-center"
          >
            <div className="font-bold text-purple-700 dark:text-purple-400">অ্যাডমিন</div>
            <div className="text-[10px] text-slate-500">তারেক রহমান</div>
          </button>
        </div>
      </div>

      {/* Firebase Google Sign-In Option */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm text-center space-y-3">
        <button
          type="button"
          onClick={async () => {
            const success = await signInWithGoogle();
            if (success) {
              navigate('home');
            }
          }}
          disabled={isFirebaseLoading}
          className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 font-bold text-xs sm:text-sm transition shadow-sm disabled:opacity-60 cursor-pointer"
        >
          <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
            />
            <path
              fill="#34A853"
              d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
            />
            <path
              fill="#FBBC05"
              d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.16 0 9.98 0 12s.45 3.84 1.25 5.42l4.03-3.15z"
            />
            <path
              fill="#EA4335"
              d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
            />
          </svg>
          <span>{isFirebaseLoading ? 'সংযোগ করা হচ্ছে...' : 'গুগল দিয়ে লগইন করুন (Google Sign In)'}</span>
        </button>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
          <span className="text-[11px] font-semibold text-slate-400">অথবা ইমেইল দিয়ে</span>
          <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
        </div>
      </div>

      {/* Form Container */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-sm">
        {mode === 'login' ? (
          <form onSubmit={handleLoginSubmit} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
                {loginError}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ইমেইল এড্রেস:
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="যেমন: rafi@example.com"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                পাসওয়ার্ড:
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => {
                  setEmail('student@bsh.edu');
                  setPassword('123456');
                }}
                className="text-xs text-emerald-600 hover:underline"
              >
                ডেমো তথ্য স্বয়ংক্রিয়ভাবে পূরণ করুন
              </button>
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              <span>লগইন করুন</span>
            </button>
          </form>
        ) : (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                পুরো নাম:
              </label>
              <input
                type="text"
                required
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="যেমন: সাকিবুল ইসলাম"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ইমেইল:
              </label>
              <input
                type="email"
                required
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="sakibul@example.com"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                পাসওয়ার্ড তৈরি করুন:
              </label>
              <input
                type="password"
                required
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="কমপক্ষে ৬ সংখ্যার পাসওয়ার্ড"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ভূমিকা (Role):
                </label>
                <select
                  value={regRole}
                  onChange={(e) => setRegRole(e.target.value as UserRole)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="student">শিক্ষার্থী</option>
                  <option value="teacher">শিক্ষক</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  শ্রেণি (Class):
                </label>
                <select
                  value={regClass}
                  onChange={(e) => setRegClass(e.target.value as ClassId)}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100"
                >
                  <option value="class-6">৬ষ্ঠ শ্রেণি</option>
                  <option value="class-7">৭ম শ্রেণি</option>
                  <option value="class-8">৮ম শ্রেণি</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                বিদ্যালয়ের নাম (School Name):
              </label>
              <input
                type="text"
                value={regSchool}
                onChange={(e) => setRegSchool(e.target.value)}
                placeholder="যেমন: আইডিয়াল স্কুল অ্যান্ড কলেজ"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                নিজের সম্পর্কে কিছু কথা (Bio):
              </label>
              <textarea
                value={regBio}
                onChange={(e) => setRegBio(e.target.value)}
                rows={2}
                placeholder="যেমন: গণিত ও বিজ্ঞানের নতুন বিষয় শিখতে ভালোবাসি।"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md transition flex items-center justify-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              <span>নিবন্ধন সম্পন্ন করুন</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
