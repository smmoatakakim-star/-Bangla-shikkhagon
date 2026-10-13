import React, { useState } from 'react';
import { Shield, Lock, Key, AlertCircle, CheckCircle2, LogOut, ArrowRight, Loader2, Eye, EyeOff } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export const AdminLoginGate: React.FC = () => {
  const {
    currentUser,
    isAdminFirebaseAuthenticated,
    isAuthLoading,
    signInWithGoogle,
    isFirebaseLoading,
    verifyAdminAccessCodeAction,
    adminLogout,
  } = useApp();

  const [accessCode, setAccessCode] = useState('');
  const [showCode, setShowCode] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);

  const handleAccessCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode.trim()) {
      setErrorMsg('অনুগ্রহ করে অ্যাডমিন অ্যাক্সেস কোড প্রবেশ করান');
      return;
    }

    setIsVerifyingCode(true);
    setErrorMsg('');

    try {
      const isValid = await verifyAdminAccessCodeAction(accessCode.trim());
      if (!isValid) {
        setErrorMsg('ভুল Admin Code');
      }
    } catch (err: any) {
      setErrorMsg('ভুল Admin Code');
    } finally {
      setIsVerifyingCode(false);
    }
  };

  const isAuthorizedEmail =
    currentUser?.email && currentUser.email.toLowerCase() === 'shakib2006k@gmail.com';

  return (
    <div className="max-w-md mx-auto my-12 p-6 sm:p-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-16 h-16 rounded-2xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center mx-auto shadow-inner">
          <Shield className="w-8 h-8" />
        </div>
        <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100">
          অ্যাডমিন সিকিউর প্রবেশদ্বার
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          অনুমোদিত অ্যাডমিনিস্ট্রেটর ব্যতীত এই প্যানেলটি সাধারণ দর্শকদের জন্য সম্পূর্ণরূপে সংরক্ষিত ও সুরক্ষিত।
        </p>
      </div>

      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-300 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2 font-bold animate-shake">
          <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* STEP 1: Firebase Authentication (Required first) */}
      {!isAdminFirebaseAuthenticated ? (
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-100 block mb-1">
              ধাপ ১: Firebase Authentication
            </span>
            প্রথমে আপনার অনুমোদিত Firebase Google Account (shakib2006k@gmail.com) দিয়ে সাইন ইন করুন।
          </div>

          <button
            type="button"
            disabled={isFirebaseLoading}
            onClick={async () => {
              setErrorMsg('');
              const success = await signInWithGoogle();
              if (!success) {
                setErrorMsg('গুগল লগইন সম্পন্ন করা যায়নি বা বাতিল করা হয়েছে।');
              }
            }}
            className="w-full py-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition flex items-center justify-center gap-3 shadow-sm active:scale-95 disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.66v3h3.86c2.26-2.09 3.68-5.17 3.68-9.1z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.37 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.37 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
              />
            </svg>
            <span>অফিসিয়াল অ্যাডমিন গুগলে লগইন (shakib2006k@gmail.com)</span>
          </button>
        </div>
      ) : (
        /* STEP 2: Admin Access Code Verification */
        <div className="space-y-4">
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-xs flex items-center justify-between">
            <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <div>
                <span className="font-bold block">ধাপ ১ সফল (Firebase Auth)</span>
                <span className="text-[11px] opacity-80">{currentUser?.email || 'shakib2006k@gmail.com'}</span>
              </div>
            </div>
            <button
              onClick={() => adminLogout()}
              className="p-1.5 hover:bg-emerald-100 dark:hover:bg-emerald-900 rounded-lg text-emerald-700 dark:text-emerald-300 transition"
              title="অন্য একাউন্টে সাইন ইন করুন"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleAccessCodeSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                ধাপ ২: সিক্রেট অ্যাডমিন অ্যাক্সেস কোড (Admin Access Code):
              </label>
              <div className="relative">
                <input
                  type={showCode ? 'text' : 'password'}
                  value={accessCode}
                  onChange={(e) => {
                    setAccessCode(e.target.value);
                    if (errorMsg) setErrorMsg('');
                  }}
                  placeholder="সিক্রেট অ্যাডমিন কোড লিখুন..."
                  autoFocus
                  className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-xs focus:ring-2 focus:ring-purple-500 focus:outline-none transition font-mono tracking-wider"
                />
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <button
                  type="button"
                  onClick={() => setShowCode(!showCode)}
                  className="absolute right-3 top-2.5 p-0.5 rounded text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition cursor-pointer"
                  title={showCode ? 'কোড লুকান' : 'কোড দেখুন'}
                >
                  {showCode ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isVerifyingCode || !accessCode.trim()}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
            >
              {isVerifyingCode ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>যাচাই হচ্ছে...</span>
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>কোড যাচাই ও অ্যাডমিন ড্যাশবোর্ডে প্রবেশ করুন</span>
                </>
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
