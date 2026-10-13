import React, { useState } from 'react';
import { X, CheckCircle2, XCircle, Sparkles, BookOpen, Megaphone, HelpCircle } from 'lucide-react';
import { ManagedClass, ManagedSubject, ManagedChapter, ManagedQuestion, ManagedNote, ManagedNotice, AdminDraftItem } from '../../types';

interface AdminPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'class' | 'subject' | 'chapter' | 'question' | 'note' | 'notice' | 'draft' | 'writing';
  data: any;
}

export const AdminPreviewModal: React.FC<AdminPreviewModalProps> = ({
  isOpen,
  onClose,
  type,
  data,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  if (!isOpen || !data) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                শিক্ষার্থী প্রিভিউ মোড (Live Student View)
              </h3>
              <p className="text-[11px] text-slate-500">
                ওয়েবসাইটে এটি যেভাবে প্রদর্শিত হবে তার সরাসরি প্রিভিউ।
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setSelectedOption(null);
              onClose();
            }}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4">
          {/* MCQ Question Preview */}
          {type === 'question' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 dark:bg-purple-950 dark:text-purple-300">
                  {data.type === 'cq' ? 'সৃজনশীল প্রশ্ন (CQ)' : 'বহুনির্বাচনী প্রশ্ন (MCQ)'}
                </span>
                {data.source && (
                  <span className="text-[11px] text-slate-400 font-medium">{data.source}</span>
                )}
              </div>

              <h4 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-relaxed">
                {data.question}
              </h4>

              {data.options && data.options.length > 0 && (
                <div className="space-y-2 pt-2">
                  {data.options.map((opt: string, idx: number) => {
                    const isSelected = selectedOption === idx;
                    const isCorrect = data.correctAnswerIndex === idx;
                    let style = 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800/60';

                    if (selectedOption !== null) {
                      if (isCorrect) {
                        style = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200';
                      } else if (isSelected) {
                        style = 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-200';
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full p-3 rounded-xl border text-left text-xs font-medium flex items-center justify-between transition ${style}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-slate-200/60 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold">
                            {['ক', 'খ', 'গ', 'ঘ'][idx] || idx + 1}
                          </span>
                          <span>{opt}</span>
                        </span>
                        {selectedOption !== null && isCorrect && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        )}
                        {selectedOption !== null && isSelected && !isCorrect && (
                          <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}

              {selectedOption !== null && data.explanation && (
                <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-200 space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>সঠিক উত্তরের ব্যাখ্যা:</span>
                  </div>
                  <p className="leading-relaxed whitespace-pre-line">{data.explanation}</p>
                </div>
              )}
            </div>
          )}

          {/* Note / Study Content Preview */}
          {type === 'note' && (
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">{data.title}</h3>
              <div className="prose dark:prose-invert max-w-none text-xs text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {data.explanation}
              </div>

              {data.keyPoints && data.keyPoints.length > 0 && (
                <div className="p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs space-y-2">
                  <h5 className="font-bold text-emerald-900 dark:text-emerald-300">মূল পয়েন্টসমূহ:</h5>
                  <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
                    {data.keyPoints.map((pt: string, i: number) => (
                      <li key={i}>{pt}</li>
                    ))}
                  </ul>
                </div>
              )}

              {data.quickNotes && (
                <div className="p-3 rounded-xl bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-300">
                  <span className="font-bold">দ্রুত রিভিশন নোট: </span>
                  {data.quickNotes}
                </div>
              )}
            </div>
          )}

          {/* Notice Banner Preview */}
          {type === 'notice' && (
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-700 text-white shadow-md flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <Megaphone className="w-5 h-5 text-amber-300 shrink-0" />
                  <div>
                    <span className="font-bold text-xs uppercase tracking-wider block text-emerald-100">
                      {data.title}
                    </span>
                    <p className="text-xs text-white mt-0.5">{data.text}</p>
                  </div>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white shrink-0">
                  {data.type}
                </span>
              </div>
            </div>
          )}

          {/* Draft Preview */}
          {type === 'draft' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300">
                  AI ড্রাফট: {data.type}
                </span>
                <span className="text-xs text-slate-400">{data.topic}</span>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
                {data.content}
              </div>
            </div>
          )}

          {/* Writing Guide Preview */}
          {type === 'writing' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="px-2.5 py-1 rounded-xl bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-xs">
                  {data.categoryLabel || data.category}
                </span>
                <span className="text-xs text-slate-400">
                  {data.className || 'সকল শ্রেণি'} • {data.exam} ({data.academicYear || '২০২৬'})
                </span>
              </div>

              <h3 className="text-lg font-black text-slate-950 dark:text-slate-50">
                {data.title}
              </h3>

              {data.moolBhab && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-xs">
                  <div className="font-bold text-amber-900 dark:text-amber-200 mb-1">মূল ভাব:</div>
                  <p className="text-slate-800 dark:text-slate-200">{data.moolBhab}</p>
                </div>
              )}

              {data.sourceText && (
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs">
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">মূল পাঠ:</div>
                  <p className="italic text-slate-700 dark:text-slate-300 whitespace-pre-line">"{data.sourceText}"</p>
                </div>
              )}

              <div className="space-y-1">
                <div className="text-xs font-bold text-slate-600 dark:text-slate-400">আদর্শ নমুনা:</div>
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 text-xs leading-relaxed whitespace-pre-line text-slate-800 dark:text-slate-200">
                  {data.originalExample}
                </div>
              </div>

              {data.importantTips && data.importantTips.length > 0 && (
                <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 text-xs space-y-1">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200">পরীক্ষায় বেশি নম্বর পাওয়ার টিপস:</div>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300">
                    {data.importantTips.map((tip: string, i: number) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex justify-end bg-slate-50 dark:bg-slate-800/50">
          <button
            onClick={() => {
              setSelectedOption(null);
              onClose();
            }}
            className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs font-bold transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
