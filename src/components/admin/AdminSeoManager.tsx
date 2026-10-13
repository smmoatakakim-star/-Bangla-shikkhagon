import React, { useState, useEffect } from 'react';
import { Globe, Save, CheckCircle2, Search, Share2, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { SiteSeoConfig } from '../../types';

export const AdminSeoManager: React.FC = () => {
  const { siteSeo, saveSeo } = useApp();

  const [siteTitle, setSiteTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [keywords, setKeywords] = useState('');
  const [ogTitle, setOgTitle] = useState('');
  const [ogDescription, setOgDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (siteSeo) {
      setSiteTitle(siteSeo.siteTitle || '');
      setMetaDescription(siteSeo.metaDescription || '');
      setKeywords(siteSeo.keywords || '');
      setOgTitle(siteSeo.ogTitle || '');
      setOgDescription(siteSeo.ogDescription || '');
    } else {
      setSiteTitle('বাংলা শিক্ষাগর — ৬ষ্ঠ থেকে ১০ম শ্রেণির ডিজিটাল পাঠশালা ও AI প্ল্যাটফর্ম');
      setMetaDescription('৬ষ্ঠ থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য সম্পূর্ণ ফ্রি ও নির্ভরযোগ্য শিক্ষামূলক প্ল্যাটফর্ম। এনসিটিবি পাঠ্যক্রম, এমসিকিউ, সৃজনশীল প্রশ্ন এবং এআই শিক্ষকের সহায়তা।');
      setKeywords('বাংলা শিক্ষাগর, nctb, class 6, class 7, class 8, class 9, class 10, mcq, ssc, hsc');
      setOgTitle('বাংলা শিক্ষাগর — সকল বিষয়ের সহজ ডিজিটাল সমাধান');
      setOgDescription('আধুনিক সিলেবাস অনুযায়ী সম্পূর্ণ পাঠ্যক্রম, মডেল টেস্ট ও ফ্রি এআই শিক্ষকের গাইডলাইন।');
    }
  }, [siteSeo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await saveSeo({
        id: 'global_seo',
        siteTitle: siteTitle.trim(),
        metaDescription: metaDescription.trim(),
        keywords: keywords.trim(),
        ogTitle: ogTitle.trim(),
        ogDescription: ogDescription.trim(),
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Error saving SEO:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Globe className="w-4 h-4 text-purple-600" />
            <span>SEO Title এবং Meta Description Management</span>
          </h3>
          <p className="text-xs text-slate-500">
            গুগল সার্চ ও সোশ্যাল মিডিয়ায় ওয়েবসাইটটি যেভাবে দেখা যাবে তা কনফিগার করুন। Firebase-এ সেভ হওয়ামাত্রই লাইভ আপডেট হবে।
          </p>
        </div>

        {saveSuccess && (
          <span className="px-3 py-1 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-1.5 border border-emerald-200 dark:border-emerald-800">
            <CheckCircle2 className="w-4 h-4" />
            <span>সফলভাবে সেভ ও লাইভ প্রয়োগ হয়েছে!</span>
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SEO Configuration Form */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  ওয়েবসাইট টাইটেল (Page Title / &lt;title&gt;):
                </label>
                <span className="text-[10px] text-slate-400">{siteTitle.length} অক্ষর (সর্বোচ্চ ৬০-৭০ প্রস্তাবিত)</span>
              </div>
              <input
                type="text"
                value={siteTitle}
                onChange={(e) => setSiteTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="font-bold text-slate-700 dark:text-slate-300">
                  মেটা ডেসক্রিপশন (Meta Description):
                </label>
                <span className="text-[10px] text-slate-400">{metaDescription.length} অক্ষর (১৫০-১৬০ প্রস্তাবিত)</span>
              </div>
              <textarea
                rows={3}
                value={metaDescription}
                onChange={(e) => setMetaDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                এসইও কীওয়ার্ডস (Keywords - কমা দিয়ে পৃথক করুন):
              </label>
              <input
                type="text"
                value={keywords}
                onChange={(e) => setKeywords(e.target.value)}
                placeholder="বাংলা শিক্ষাগর, nctb, ssc, mcq"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <h5 className="font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <Share2 className="w-3.5 h-3.5 text-purple-600" />
                <span>OpenGraph সোশ্যাল শেয়ার মেটা ট্যাগ:</span>
              </h5>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  সোশ্যাল শেয়ার টাইটেল (og:title):
                </label>
                <input
                  type="text"
                  value={ogTitle}
                  onChange={(e) => setOgTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-medium text-slate-600 dark:text-slate-400 mb-1">
                  সোশ্যাল শেয়ার ডেসক্রিপশন (og:description):
                </label>
                <textarea
                  rows={2}
                  value={ogDescription}
                  onChange={(e) => setOgDescription(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'এসইও পরিবর্তনসমূহ সেভ করুন'}</span>
            </button>
          </form>
        </div>

        {/* Live Search Engine & Social Preview Cards */}
        <div className="space-y-4">
          {/* Google Search Results Preview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Search className="w-3.5 h-3.5 text-blue-600" />
              <span>গুগল সার্চ ফলাফল প্রিভিউ (Google SERP Preview):</span>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 space-y-1">
              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                <span className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                  ব
                </span>
                <span className="truncate">https://bangla-shikshagar.web.app</span>
              </div>

              <h4 className="text-sm font-semibold text-blue-600 hover:underline cursor-pointer leading-snug">
                {siteTitle || 'বাংলা শিক্ষাগর — ৬ষ্ঠ থেকে ১০ম শ্রেণির ডিজিটাল পাঠশালা'}
              </h4>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-2">
                {metaDescription ||
                  '৬ষ্ঠ থেকে ১০ম শ্রেণির শিক্ষার্থীদের জন্য সম্পূর্ণ ফ্রি ও নির্ভরযোগ্য শিক্ষামূলক প্ল্যাটফর্ম। এনসিটিবি পাঠ্যক্রম, এমসিকিউ, সৃজনশীল প্রশ্ন এবং এআই শিক্ষকের সহায়তা।'}
              </p>
            </div>
          </div>

          {/* Social Share Card Preview */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-sm space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
              <Share2 className="w-3.5 h-3.5 text-indigo-600" />
              <span>সোশ্যাল মিডিয়া শেয়ার কার্ড (Facebook & Twitter Card):</span>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden bg-slate-50 dark:bg-slate-800/60">
              <div className="h-28 bg-gradient-to-tr from-purple-700 via-indigo-600 to-emerald-600 flex items-center justify-center text-white font-black text-lg shadow-inner">
                বাংলা শিক্ষাগর • Bangladesh
              </div>
              <div className="p-3.5 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-400">
                  bangla-shikshagar.web.app
                </span>
                <h5 className="text-xs font-bold text-slate-900 dark:text-slate-100">
                  {ogTitle || siteTitle}
                </h5>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  {ogDescription || metaDescription}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
