import React, { useState, useMemo } from 'react';
import {
  BookOpen,
  CheckCircle2,
  HelpCircle,
  Sparkles,
  ArrowRight,
  Search,
  Check,
  X,
  RotateCcw,
  BookA,
  Languages,
  Filter,
  GraduationCap,
  Award,
  Volume2,
  ChevronDown,
  ChevronUp,
  Bookmark,
  Share2,
  Compass,
  FileText,
  Lightbulb,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  DAILY_VOCABULARY_LIST,
  ENGLISH_TRANSLATION_PRACTICES,
  ENGLISH_SPELLING_LIST,
  ENGLISH_QUIZZES_DATA,
  EnglishWord,
  EnglishSentencePractice,
  EnglishSpellingPractice,
  EnglishQuizItem,
} from '../data/englishCornerData';

export const EnglishCornerPage: React.FC = () => {
  const { navigate } = useApp();

  // Tab State: 'vocab' | 'daily' | 'grammar_quiz' | 'tense' | 'sentence' | 'spelling'
  const [activeTab, setActiveTab] = useState<
    'vocab' | 'daily' | 'grammar_quiz' | 'tense' | 'sentence' | 'spelling'
  >('vocab');

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'all' | 'easy' | 'medium' | 'hard'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Quiz Interaction State
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  // Spelling Interactive State
  const [spellingAnswers, setSpellingAnswers] = useState<Record<string, number>>({});
  const [showSpellingExplanation, setShowSpellingExplanation] = useState<Record<string, boolean>>({});

  // Sentence / Translation Revealed hints
  const [revealedSentences, setRevealedSentences] = useState<Record<string, boolean>>({});

  // Pronunciation Audio
  const speakWord = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'en-US';
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
    }
  };

  // Filtered Vocabulary
  const filteredWords = useMemo(() => {
    return DAILY_VOCABULARY_LIST.filter((w) => {
      const matchSearch =
        w.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        w.banglaMeaning.includes(searchQuery) ||
        w.englishMeaning.toLowerCase().includes(searchQuery.toLowerCase());
      const matchDiff = difficultyFilter === 'all' || w.difficulty === difficultyFilter;
      const matchCat = categoryFilter === 'all' || w.category === categoryFilter;
      return matchSearch && matchDiff && matchCat;
    });
  }, [searchQuery, difficultyFilter, categoryFilter]);

  // Filtered Quizzes
  const filteredQuizzes = useMemo(() => {
    return ENGLISH_QUIZZES_DATA.filter((q) => {
      const matchSearch =
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        q.explanation.includes(searchQuery);
      const matchDiff = difficultyFilter === 'all' || q.difficulty === difficultyFilter;
      const matchCat =
        categoryFilter === 'all' ||
        (categoryFilter === 'tense' && q.category === 'tense') ||
        (categoryFilter === 'grammar' && q.category === 'grammar') ||
        (categoryFilter === 'synonym_antonym' && q.category === 'synonym_antonym');
      return matchSearch && matchDiff && matchCat;
    });
  }, [searchQuery, difficultyFilter, categoryFilter]);

  // Filtered Translations
  const filteredTranslations = useMemo(() => {
    return ENGLISH_TRANSLATION_PRACTICES.filter((t) => {
      const matchSearch =
        t.banglaSentence.includes(searchQuery) ||
        t.englishAnswer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.grammarPattern.includes(searchQuery);
      const matchDiff = difficultyFilter === 'all' || t.difficulty === difficultyFilter;
      return matchSearch && matchDiff;
    });
  }, [searchQuery, difficultyFilter]);

  // Filtered Spelling
  const filteredSpelling = useMemo(() => {
    return ENGLISH_SPELLING_LIST.filter((s) => {
      const matchSearch =
        s.word.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.banglaMeaning.includes(searchQuery);
      const matchDiff = difficultyFilter === 'all' || s.difficulty === difficultyFilter;
      return matchSearch && matchDiff;
    });
  }, [searchQuery, difficultyFilter]);

  return (
    <div id="english-corner-page-root" className="max-w-6xl mx-auto px-2 sm:px-4 py-4 sm:py-6 space-y-6">
      {/* Top Academic Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-sky-800 via-indigo-900 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-sky-700/40">
        <div className="absolute inset-0 opacity-[0.08] pointer-events-none bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]" />
        <div className="absolute -top-24 -right-24 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex items-center gap-2.5">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-sky-500 to-indigo-500 p-0.5 shadow-lg flex items-center justify-center">
                <div className="w-full h-full bg-slate-900/40 backdrop-blur-xs rounded-[14px] flex items-center justify-center text-white">
                  <Languages className="w-6 h-6 text-sky-300" />
                </div>
              </div>
              <div>
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-sky-300 tracking-wide uppercase">
                  <Sparkles className="w-3.5 h-3.5" /> Class 5-10, SSC ও HSC স্পেশাল
                </span>
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                  <span>ইংলিশ কর্নার</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-sky-400/20 border border-sky-300/30 text-sky-200 font-semibold">
                    English Practice Hub
                  </span>
                </h1>
              </div>
            </div>
            <p className="text-slate-200 text-xs sm:text-sm max-w-2xl leading-relaxed">
              ইংরেজি শব্দভাণ্ডার (Vocabulary), ব্যাকরণ (Grammar), Tense, বাক্য গঠন, সঠিক বানান ও বাংলা ব্যাখ্যাসহ কুইজ চর্চার পূর্ণাঙ্গ ডিজিটাল একাডেমি।
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => navigate('ai_chat', { query: 'আমাকে ইংরেজি Tense এবং গ্রামারের গুরুত্বপূর্ণ কিছু নিয়ম বুঝিয়ে দাও' })}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs sm:text-sm font-semibold flex items-center gap-2 transition backdrop-blur-sm shadow-sm"
            >
              <Lightbulb className="w-4 h-4 text-amber-300" />
              <span>AI শিক্ষক দিয়ে শিখুন</span>
            </button>
            <button
              onClick={() => navigate('grammar_master')}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-500 hover:from-sky-400 hover:to-indigo-400 text-white font-bold text-xs sm:text-sm flex items-center gap-2 shadow-md transition"
            >
              <BookOpen className="w-4 h-4 text-white" />
              <span>গ্রামার মাস্টার</span>
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-2 overflow-x-auto scrollbar-none pb-1">
          {[
            { id: 'vocab', label: '📖 ভোকাবুলারি ও অর্থ', icon: BookA },
            { id: 'daily', label: '🌟 ডেইলি ওয়ার্ডস ও উদাহরণ', icon: Sparkles },
            { id: 'grammar_quiz', label: '🎯 গ্রামার ও MCQ কুইজ', icon: CheckCircle2 },
            { id: 'sentence', label: '✍️ অনুবাদ ও বাক্য গঠন', icon: FileText },
            { id: 'spelling', label: '🔤 বানান প্র্যাকটিস (Spelling)', icon: HelpCircle },
          ].map((tab) => {
            const isActive = activeTab === tab.id;
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id as any);
                  setSearchQuery('');
                }}
                className={`px-3.5 sm:px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-white text-sky-950 shadow-md ring-2 ring-sky-300/50'
                    : 'bg-white/10 hover:bg-white/20 text-white'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-sky-600' : 'text-sky-300'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ইংরেজি শব্দ, অর্থ বা ব্যাকরণের বিষয় দিয়ে খুঁজুন..."
              className="w-full pl-9 pr-4 py-2 rounded-xl text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 text-slate-900 dark:text-slate-100 placeholder-slate-400"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-slate-500 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> কাঠিন্য:
            </span>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              {[
                { id: 'all', label: 'সব' },
                { id: 'easy', label: 'সহজ' },
                { id: 'medium', label: 'মাঝারি' },
                { id: 'hard', label: 'উন্নত' },
              ].map((diff) => (
                <button
                  key={diff.id}
                  onClick={() => setDifficultyFilter(diff.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                    difficultyFilter === diff.id
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {diff.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* TAB 1: Vocabulary & Meanings */}
      {activeTab === 'vocab' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookA className="w-5 h-5 text-sky-600" />
              <span>ইংরেজি শব্দভাণ্ডার (Vocabulary & Synonyms)</span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300 font-bold">
                {filteredWords.length}টি শব্দ
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredWords.map((item) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs hover:shadow-md transition-all space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-lg font-extrabold text-sky-700 dark:text-sky-400">
                        {item.word}
                      </h3>
                      <button
                        onClick={() => speakWord(item.word)}
                        className="p-1 rounded-lg bg-sky-50 dark:bg-sky-950 text-sky-600 dark:text-sky-300 hover:bg-sky-100 transition"
                        title="উচ্চারণ শুনুন"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>
                      <span className="text-xs px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
                        {item.partOfSpeech}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5">{item.pronunciation}</p>
                  </div>

                  <span
                    className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                      item.difficulty === 'easy'
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                        : item.difficulty === 'medium'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                        : 'bg-rose-100 text-rose-800 dark:bg-rose-950/60 dark:text-rose-300'
                    }`}
                  >
                    {item.difficulty}
                  </span>
                </div>

                {/* Bangla Meaning Box */}
                <div className="p-2.5 rounded-xl bg-sky-50/70 dark:bg-sky-950/40 border border-sky-200/60 dark:border-sky-900/40">
                  <div className="text-xs font-semibold text-slate-500 dark:text-slate-400">বাংলা অর্থ:</div>
                  <div className="text-sm font-bold text-slate-900 dark:text-slate-100">
                    {item.banglaMeaning}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 mt-0.5">
                    {item.englishMeaning}
                  </div>
                </div>

                {/* Example sentence */}
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-slate-700 dark:text-slate-300">বাক্যে প্রয়োগ (Example):</div>
                  <p className="italic text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                    "{item.exampleSentence}"
                  </p>
                  <p className="text-slate-500 pl-1">{item.banglaExample}</p>
                </div>

                {/* Synonyms & Antonyms */}
                <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap gap-2 text-xs">
                  <div className="w-full">
                    <span className="font-bold text-emerald-700 dark:text-emerald-400">সমার্থক শব্দ (Synonyms): </span>
                    <span className="text-slate-600 dark:text-slate-300">{item.synonyms.join(', ')}</span>
                  </div>
                  <div className="w-full">
                    <span className="font-bold text-rose-700 dark:text-rose-400">বিপরীত শব্দ (Antonyms): </span>
                    <span className="text-slate-600 dark:text-slate-300">{item.antonyms.join(', ')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Daily Words */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-amber-500/10 border border-amber-300 dark:border-amber-800/60 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-amber-500" />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-slate-100">
                  দৈনিক নতুন ইংরেজি শব্দ (Daily Words Challenge)
                </h2>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  প্রতিদিন অন্তত ৩টি নতুন শব্দ শিখলে বছরে ১,০০০+ শব্দভাণ্ডার গড়ে ওঠে।
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DAILY_VOCABULARY_LIST.slice(0, 6).map((item, index) => (
              <div
                key={item.id}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                    Day #{index + 1}
                  </span>
                  <button
                    onClick={() => speakWord(item.word)}
                    className="flex items-center gap-1 text-xs text-sky-600 hover:underline font-semibold"
                  >
                    <Volume2 className="w-3.5 h-3.5" /> উচ্চারণ শুনুন
                  </button>
                </div>

                <div>
                  <h3 className="text-xl font-black text-slate-900 dark:text-slate-100">
                    {item.word}{' '}
                    <span className="text-xs font-normal text-slate-400">({item.partOfSpeech})</span>
                  </h3>
                  <p className="text-sm font-bold text-sky-600 dark:text-sky-400 mt-1">
                    {item.banglaMeaning}
                  </p>
                </div>

                <div className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl space-y-1">
                  <div className="font-semibold text-slate-700 dark:text-slate-200">Sentence:</div>
                  <div className="italic">{item.exampleSentence}</div>
                  <div className="text-slate-500">{item.banglaExample}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Grammar & Tense Quiz */}
      {activeTab === 'grammar_quiz' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>ইংরেজি ব্যাকরণ ও MCQ প্র্যাকটিস টেস্ট</span>
              </h2>
              <p className="text-xs text-slate-500">
                অপশনে ক্লিক করে উত্তর যাচাই করুন এবং সহজ বাংলা ব্যাকরণগত ব্যাখ্যা পড়ুন।
              </p>
            </div>
            <button
              onClick={() => {
                setQuizAnswers({});
                setShowExplanation({});
              }}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 flex items-center gap-1.5 transition"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>রিসেট কুইজ</span>
            </button>
          </div>

          <div className="space-y-4">
            {filteredQuizzes.map((quiz, qIdx) => {
              const selectedOpt = quizAnswers[quiz.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === quiz.correctIndex;
              const bengaliOptions = ['A', 'B', 'C', 'D'];

              return (
                <div
                  key={quiz.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs gap-2">
                    <span className="font-bold text-sky-700 dark:text-sky-400 bg-sky-50 dark:bg-sky-950 px-2 py-0.5 rounded-md">
                      প্রশ্ন #{qIdx + 1} • {quiz.classScope}
                    </span>
                    <span className="text-[11px] text-slate-400 uppercase font-bold">{quiz.category}</span>
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 leading-snug">
                    {quiz.question}
                  </h3>

                  {/* Options */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                    {quiz.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let btnStyle =
                        'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-sky-400';

                      if (isAnswered) {
                        if (optIdx === quiz.correctIndex) {
                          btnStyle =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold ring-2 ring-emerald-500/20';
                        } else if (isOptionSelected) {
                          btnStyle =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold ring-2 ring-rose-500/20';
                        } else {
                          btnStyle = 'opacity-50 border-slate-200 dark:border-slate-800';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            if (!isAnswered) {
                              setQuizAnswers((prev) => ({ ...prev, [quiz.id]: optIdx }));
                              setShowExplanation((prev) => ({ ...prev, [quiz.id]: true }));
                            }
                          }}
                          className={`p-3 rounded-xl border text-left text-xs sm:text-sm transition flex items-center justify-between gap-2 cursor-pointer ${btnStyle}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="w-5 h-5 rounded-md bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs flex items-center justify-center shrink-0">
                              {bengaliOptions[optIdx]}
                            </span>
                            <span>{opt}</span>
                          </div>
                          {isAnswered && optIdx === quiz.correctIndex && (
                            <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                          )}
                          {isAnswered && isOptionSelected && !isCorrect && (
                            <X className="w-4 h-4 text-rose-600 shrink-0" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation with easy Bangla notes */}
                  {isAnswered && (
                    <div className="mt-3 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm space-y-1.5 animate-in fade-in">
                      <div className="font-bold flex items-center gap-1.5">
                        {isCorrect ? (
                          <span className="text-emerald-600 flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4" /> চমৎকার! সঠিক উত্তর দিয়েছেন।
                          </span>
                        ) : (
                          <span className="text-rose-600 flex items-center gap-1">
                            <X className="w-4 h-4" /> সঠিক উত্তর: {bengaliOptions[quiz.correctIndex]}.{' '}
                            {quiz.options[quiz.correctIndex]}
                          </span>
                        )}
                      </div>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed font-sans">
                        <strong className="text-sky-700 dark:text-sky-400">সহজ বাংলা ব্যাখ্যা: </strong>
                        {quiz.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: Translation & Sentence Making */}
      {activeTab === 'sentence' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-600" />
                <span>অনুবাদ ও বাক্য গঠন (Translation & Sentence Making)</span>
              </h2>
              <p className="text-xs text-slate-500">
                বাংলা বাক্যটির ইংরেজি মনে মনে বলুন, তারপর উত্তর মিলিয়ে ব্যাকরণের নিয়মটি শিখুন।
              </p>
            </div>
          </div>

          <div className="space-y-3.5">
            {filteredTranslations.map((item, idx) => {
              const isRevealed = revealedSentences[item.id];
              return (
                <div
                  key={item.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-indigo-700 dark:text-indigo-400">
                      বাক্য #{idx + 1} • {item.classScope}
                    </span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-semibold text-slate-500">
                      {item.difficulty}
                    </span>
                  </div>

                  <div className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100">
                    বাংলা: <span className="text-indigo-700 dark:text-indigo-300">{item.banglaSentence}</span>
                  </div>

                  {/* Hints */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
                    <span className="font-semibold">সহায়ক শব্দ:</span>
                    {item.hints.map((h, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {h}
                      </span>
                    ))}
                  </div>

                  {/* Toggle Answer Button */}
                  <div className="pt-1">
                    <button
                      onClick={() =>
                        setRevealedSentences((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                      }
                      className="px-3.5 py-1.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 hover:bg-indigo-100 text-indigo-800 dark:text-indigo-300 font-bold text-xs transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{isRevealed ? 'উত্তর লুকান' : 'সঠিক ইংরেজি উত্তর ও নিয়ম দেখুন'}</span>
                      {isRevealed ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                    </button>
                  </div>

                  {/* Revealed Answer Box */}
                  {isRevealed && (
                    <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 space-y-1.5 text-xs sm:text-sm animate-in fade-in">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-emerald-800 dark:text-emerald-300">
                          English: {item.englishAnswer}
                        </span>
                        <button
                          onClick={() => speakWord(item.englishAnswer)}
                          className="p-1 rounded bg-white dark:bg-slate-800 text-emerald-700 hover:text-emerald-900"
                          title="শুনুন"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <div className="text-slate-600 dark:text-slate-300 text-xs">
                        <strong>ব্যাকরণিক নিয়ম: </strong> {item.grammarPattern}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 5: Spelling Practice */}
      {activeTab === 'spelling' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-teal-600" />
                <span>সঠিক বানান বাছাই প্র্যাকটিস (Spelling Test)</span>
              </h2>
              <p className="text-xs text-slate-500">
                বোর্ড পরীক্ষা ও ভর্তি পরীক্ষায় বারবার আসা বিভ্রান্তিকর বানানসমূহ সঠিক চিহ্নিত করো।
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSpelling.map((sp, idx) => {
              const selectedOpt = spellingAnswers[sp.id];
              const isAnswered = selectedOpt !== undefined;
              const isCorrect = selectedOpt === sp.correctIndex;

              return (
                <div
                  key={sp.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-teal-700 dark:text-teal-400">
                      বানান টেস্ট #{idx + 1}
                    </span>
                    <span className="text-[10px] text-slate-400 font-semibold">অর্থ: {sp.banglaMeaning}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    কোন বানানটি সঠিক? (Which one is correct?)
                  </h3>

                  <div className="grid grid-cols-2 gap-2">
                    {sp.options.map((opt, optIdx) => {
                      const isOptionSelected = selectedOpt === optIdx;
                      let btnStyle =
                        'border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 hover:border-teal-400';

                      if (isAnswered) {
                        if (optIdx === sp.correctIndex) {
                          btnStyle =
                            'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-bold';
                        } else if (isOptionSelected) {
                          btnStyle =
                            'border-rose-500 bg-rose-50 dark:bg-rose-950/60 text-rose-900 dark:text-rose-200 font-bold';
                        } else {
                          btnStyle = 'opacity-40 border-slate-200 dark:border-slate-800';
                        }
                      }

                      return (
                        <button
                          key={optIdx}
                          onClick={() => {
                            if (!isAnswered) {
                              setSpellingAnswers((prev) => ({ ...prev, [sp.id]: optIdx }));
                              setShowSpellingExplanation((prev) => ({ ...prev, [sp.id]: true }));
                            }
                          }}
                          className={`p-2.5 rounded-xl border text-center text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${btnStyle}`}
                        >
                          <span>{opt}</span>
                          {isAnswered && optIdx === sp.correctIndex && (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          )}
                          {isAnswered && isOptionSelected && !isCorrect && (
                            <X className="w-3.5 h-3.5 text-rose-600" />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {isAnswered && (
                    <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 text-xs space-y-1 animate-in fade-in">
                      <div className="font-bold text-emerald-600 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> সঠিক বানান: {sp.options[sp.correctIndex]}
                      </div>
                      <p className="text-slate-600 dark:text-slate-300 leading-snug">{sp.explanation}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
