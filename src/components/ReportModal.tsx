import React, { useState } from 'react';
import { Flag, X, CheckCircle2, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  targetPreview: string;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  isOpen,
  onClose,
  targetType,
  targetId,
  targetPreview,
}) => {
  const { submitReport } = useApp();
  const [reason, setReason] = useState<
    'স্প্যাম' | 'অনুপযুক্ত বিষয়বস্তু' | 'ভুল বা বিভ্রান্তিকর তথ্য' | 'কটূক্তি বা হেনস্তা' | 'অন্যান্য'
  >('স্প্যাম');
  const [details, setDetails] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen) return null;

  const reasons: Array<
    'স্প্যাম' | 'অনুপযুক্ত বিষয়বস্তু' | 'ভুল বা বিভ্রান্তিকর তথ্য' | 'কটূক্তি বা হেনস্তা' | 'অন্যান্য'
  > = [
    'স্প্যাম',
    'অনুপযুক্ত বিষয়বস্তু',
    'ভুল বা বিভ্রান্তিকর তথ্য',
    'কটূক্তি বা হেনস্তা',
    'অন্যান্য',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitReport(targetType, targetId, targetPreview, reason, details);
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1500);
  };

  return (
    <div
      id="report-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in"
    >
      <div
        id="report-modal-card"
        className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full p-6 relative overflow-hidden"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="py-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              রিপোর্ট জমা হয়েছে
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              ধন্যবাদ! মডারেটর টিম বিষয়টি যাচাই করে দ্রুত প্রয়োজনীয় ব্যবস্থা গ্রহণ করবেন।
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2.5 text-rose-600">
              <Flag className="w-5 h-5" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">
                রিপোর্ট দাখিল করুন
              </h3>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-xs text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800">
              <span className="font-semibold text-slate-700 dark:text-slate-200 block mb-1">
                বিষয়বস্তুর নমুনা:
              </span>
              <p className="line-clamp-2 italic">"{targetPreview}"</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2">
                রিপোর্টের সুনির্দিষ্ট কারণ নির্বাচন করুন:
              </label>
              <div className="grid grid-cols-1 gap-2">
                {reasons.map((r) => (
                  <label
                    key={r}
                    className={`flex items-center gap-3 p-2.5 rounded-xl border text-xs cursor-pointer transition ${
                      reason === r
                        ? 'border-rose-500 bg-rose-50/60 dark:bg-rose-950/30 text-rose-700 dark:text-rose-300 font-medium'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="reportReason"
                      value={r}
                      checked={reason === r}
                      onChange={() => setReason(r)}
                      className="accent-rose-600"
                    />
                    <span>{r}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                অতিরিক্ত বিবরণ (ঐচ্ছিক):
              </label>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                rows={2}
                placeholder="সমস্যাটি স্পষ্টভাবে বুঝিয়ে লিখুন..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-rose-500 text-slate-800 dark:text-slate-100"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-semibold rounded-xl bg-rose-600 hover:bg-rose-700 text-white shadow-sm transition flex items-center gap-1.5"
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                <span>রিপোর্ট পাঠান</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
