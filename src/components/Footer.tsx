import React from 'react';
import { BookOpen, Heart, Mail, Phone, Shield, FileText, HelpCircle, Sparkles, Download } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { PageType } from '../types';

export const Footer: React.FC = () => {
  const { navigate, settings, resetAllData } = useApp();

  const handleNav = (page: PageType, params = {}) => {
    navigate(page, params);
  };

  return (
    <footer
      id="main-footer"
      className="bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 pt-12 pb-24 md:pb-12 text-slate-600 dark:text-slate-400 transition-colors"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-sm">
                <BookOpen className="w-5 h-5" />
              </div>
              <span className="text-lg font-bold text-emerald-700 dark:text-emerald-400">
                বাংলা শিক্ষাগর
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              ৬ষ্ঠ থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য একটি সম্পূর্ণ ফ্রি ও আধুনিক ডিজিটাল শিক্ষামূলক ও AI প্ল্যাটফর্ম।
            </p>
            <div className="pt-1 flex items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Mail className="w-3.5 h-3.5 text-emerald-600" />
                {settings.contactEmail}
              </span>
            </div>
          </div>

          {/* Quick Links: Classes */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              শ্রেণিভিত্তিক পড়াশোনা
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => handleNav('chapters', { classId: 'class-6' })}
                  className="hover:text-emerald-600 transition"
                >
                  ৬ষ্ঠ শ্রেণির সকল বিষয়
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('chapters', { classId: 'class-7' })}
                  className="hover:text-emerald-600 transition"
                >
                  ৭ম শ্রেণির সকল বিষয়
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('chapters', { classId: 'class-8' })}
                  className="hover:text-emerald-600 transition"
                >
                  ৮ম শ্রেণির সকল বিষয়
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('chapters', { classId: 'class-9' })}
                  className="hover:text-emerald-600 transition"
                >
                  ৯ম ও ১০ম শ্রেণির সকল বিষয়
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('grammar_master')}
                  className="hover:text-emerald-600 font-semibold text-indigo-600 dark:text-indigo-400 transition"
                >
                  ব্যাকরণ ও Grammar মাস্টার
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('curriculum_audit')}
                  className="hover:text-emerald-600 font-semibold text-emerald-600 dark:text-emerald-400 transition"
                >
                  এনসিটিবি পাঠ্যক্রম অডিট
                </button>
              </li>
            </ul>
          </div>

          {/* Quick Links: Features & Community */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              কমিউনিটি ও সম্পদ
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('posts')} className="hover:text-emerald-600 transition">
                  শিক্ষামূলক পোস্ট ফিড
                </button>
              </li>
              <li>
                <button
                  onClick={() => handleNav('create_post')}
                  className="hover:text-emerald-600 transition"
                >
                  নতুন প্রশ্ন বা নোট পোস্ট করুন
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('saved')} className="hover:text-emerald-600 transition">
                  আমার সংরক্ষিত পাঠসমূহ
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('search')} className="hover:text-emerald-600 transition">
                  সার্চ ও অন্বেষণ
                </button>
              </li>
            </ul>
          </div>

          {/* Legal & System */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              সহায়তা ও নীতি
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => handleNav('about')} className="hover:text-emerald-600 transition">
                  আমাদের সম্পর্কে
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('contact')} className="hover:text-emerald-600 transition">
                  যোগাযোগ ও ফিডব্যাক
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('privacy')} className="hover:text-emerald-600 transition">
                  গোপনীয়তা নীতি
                </button>
              </li>
              <li>
                <button onClick={() => handleNav('terms')} className="hover:text-emerald-600 transition">
                  ব্যবহারের শর্তাবলী
                </button>
              </li>
              <li>
                <a
                  id="footer-download-zip-btn"
                  href="/api/download-project"
                  download="nctb-education-project.zip"
                  className="hover:text-emerald-600 font-semibold text-slate-700 dark:text-slate-200 transition flex items-center gap-1.5"
                  title="সম্পূর্ণ প্রজেক্ট সোর্স কোড ZIP ডাউনলোড করুন"
                >
                  <Download className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>Download Source Code (ZIP)</span>
                </a>
              </li>
              <li className="pt-2">
                <button
                  onClick={resetAllData}
                  className="text-[11px] text-slate-400 hover:text-rose-500 underline transition"
                  title="ডেমো ডেটা রিসেট করুন"
                >
                  প্রাথমিক ডেমো ডেটা রিসেট
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright line */}
        <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <p>© ২০২৬ বাংলা শিক্ষাগর। সর্বস্বত্ব সংরক্ষিত।</p>
          <p className="flex items-center gap-1">
            বাংলাদেশের সকল শিক্ষার্থীদের জন্য ভালোবাসায় তৈরি <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
          </p>
        </div>
      </div>
    </footer>
  );
};
