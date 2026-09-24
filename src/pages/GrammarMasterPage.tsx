import React, { useState } from 'react';
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
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { GRAMMAR_TOPICS, GrammarTopic } from '../data/grammarMasterData';
import { BANGLA_SECOND_PAPER_TOPICS, BanglaGrammarTopic } from '../data/banglaSecondPaperData';

export const GrammarMasterPage: React.FC = () => {
  const { navigate } = useApp();

  const [activeTab, setActiveTab] = useState<'english' | 'bangla'>('english');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLevel, setSelectedLevel] = useState<string>('all');
  const [selectedEnglishTopic, setSelectedEnglishTopic] = useState<GrammarTopic | null>(GRAMMAR_TOPICS[0]);
  const [selectedBanglaTopic, setSelectedBanglaTopic] = useState<BanglaGrammarTopic | null>(
    BANGLA_SECOND_PAPER_TOPICS[0]
  );

  // Quiz interactive state
  const [quizAnswers, setQuizAnswers] = useState<Record<string, number>>({});
  const [showExplanation, setShowExplanation] = useState<Record<string, boolean>>({});

  const handleAnswerSelect = (qId: string, optIndex: number) => {
    setQuizAnswers((prev) => ({ ...prev, [qId]: optIndex }));
    setShowExplanation((prev) => ({ ...prev, [qId]: true }));
  };

  const handleResetQuiz = () => {
    setQuizAnswers({});
    setShowExplanation({});
  };

  // Filtering
  const filteredEnglishTopics = GRAMMAR_TOPICS.filter((t) => {
    const matchQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.banglaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel =
      selectedLevel === 'all' ||
      (selectedLevel === 'junior' && (t.level === 'Class 6-8' || t.level.includes('All Classes'))) ||
      (selectedLevel === 'senior' && (t.level === 'Class 9-10' || t.level.includes('All Classes')));
    return matchQuery && matchLevel;
  });

  const filteredBanglaTopics = BANGLA_SECOND_PAPER_TOPICS.filter((t) => {
    const matchQuery =
      t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.overview.toLowerCase().includes(searchQuery.toLowerCase());
    const matchLevel =
      selectedLevel === 'all' ||
      (selectedLevel === 'junior' && (t.level === '৬ষ্ঠ-৮ম শ্রেণি' || t.level === 'সর্বজনীন')) ||
      (selectedLevel === 'senior' && (t.level === '৯ম-১০ম শ্রেণি (এসএসসি)' || t.level === 'সর্বজনীন'));
    return matchQuery && matchLevel;
  });

  return (
    <div id="grammar-master-page-root" className="pb-16 max-w-7xl mx-auto">
      {/* Hero Header */}
      <div
        id="grammar-header-banner"
        className="bg-gradient-to-r from-indigo-700 via-purple-700 to-indigo-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl mb-8 relative overflow-hidden"
      >
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white shadow-inner">
                <Languages className="w-7 h-7" />
              </div>
              <div>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-400/30 border border-white/20 text-white inline-block mb-1">
                  NCTB Class 6-10 • English & Bangla Grammar Master
                </span>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                  ব্যাকরণ ও Grammar মাস্টার
                </h1>
              </div>
            </div>
            <p className="text-indigo-100 text-sm sm:text-base max-w-2xl leading-relaxed">
              ইংরেজি ও বাংলা ২য় পত্রের সকল মৌলিক ও জটিল নিয়মাবলী, ছকে সাজানো উদাহরণ, শর্টকাট সূত্র এবং তাৎক্ষণিক
              কুইজ অনুশীলন।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() =>
                navigate('ai_chat', {
                  query: 'ইংরেজি Grammar এবং বাংলা ব্যাকরণ মনে রাখার কিছু জাদুকরী শর্টকাট কৌশল বুঝিয়ে বলো',
                })
              }
              className="px-4 py-2.5 rounded-xl bg-white text-indigo-900 hover:bg-indigo-50 font-bold text-sm flex items-center gap-2 shadow-lg transition"
            >
              <Sparkles className="w-4 h-4 text-purple-600" />
              <span>AI শিক্ষককে প্রশ্ন করুন</span>
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="mt-6 pt-4 border-t border-white/15 flex items-center gap-3">
          <button
            onClick={() => {
              setActiveTab('english');
              setSearchQuery('');
            }}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
              activeTab === 'english'
                ? 'bg-white text-indigo-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <BookA className="w-4 h-4" />
            <span>🇬🇧 English Grammar ({GRAMMAR_TOPICS.length})</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('bangla');
              setSearchQuery('');
            }}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition flex items-center gap-2 ${
              activeTab === 'bangla'
                ? 'bg-white text-indigo-900 shadow-md'
                : 'bg-white/10 hover:bg-white/20 text-white'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            <span>🇧🇩 বাংলা ২য় পত্র ব্যাকরণ ({BANGLA_SECOND_PAPER_TOPICS.length})</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Topic Selector on Left, Interactive Rules & Quiz on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Topics Navigation */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm">
            {/* Search Input */}
            <div className="relative mb-3">
              <Search className="w-4 h-4 text-slate-700 dark:text-slate-300 absolute left-3 top-3" />
              <input
                type="text"
                placeholder={activeTab === 'english' ? 'টপিক খুঁজুন (Tense, Voice...)' : 'টপিক খুঁজুন (কারক, সমাস...)'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            {/* Level Filter */}
            <div className="flex items-center gap-1.5 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <Filter className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
              <span className="text-slate-700 dark:text-slate-300 font-medium">শ্রেণি:</span>
              <button
                onClick={() => setSelectedLevel('all')}
                className={`px-2 py-0.5 rounded-md font-medium transition ${
                  selectedLevel === 'all'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                সব
              </button>
              <button
                onClick={() => setSelectedLevel('junior')}
                className={`px-2 py-0.5 rounded-md font-medium transition ${
                  selectedLevel === 'junior'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                ৬ষ্ঠ-৮ম
              </button>
              <button
                onClick={() => setSelectedLevel('senior')}
                className={`px-2 py-0.5 rounded-md font-medium transition ${
                  selectedLevel === 'senior'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                ৯ম-১০ম
              </button>
            </div>

            {/* List of Topics */}
            <div className="mt-3 space-y-1.5 max-h-[600px] overflow-y-auto pr-1">
              {activeTab === 'english' ? (
                filteredEnglishTopics.map((topic) => {
                  const isSelected = selectedEnglishTopic?.id === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedEnglishTopic(topic);
                        handleResetQuiz();
                      }}
                      className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-indigo-50 dark:bg-indigo-950/70 border border-indigo-200 dark:border-indigo-800 text-indigo-950 dark:text-indigo-200'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm line-clamp-1">{topic.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                          {topic.level}
                        </span>
                      </div>
                      <span className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1">
                        {topic.banglaTitle}
                      </span>
                    </button>
                  );
                })
              ) : (
                filteredBanglaTopics.map((topic) => {
                  const isSelected = selectedBanglaTopic?.id === topic.id;
                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedBanglaTopic(topic);
                        handleResetQuiz();
                      }}
                      className={`w-full text-left p-3 rounded-xl transition flex flex-col gap-1 ${
                        isSelected
                          ? 'bg-purple-50 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800 text-purple-950 dark:text-purple-200'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300 border border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm line-clamp-1">{topic.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                          {topic.category}
                        </span>
                      </div>
                      <span className="text-xs text-slate-700 dark:text-slate-300 line-clamp-1">
                        {topic.overview}
                      </span>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </aside>

        {/* Right Column: Active Topic Content & Quiz */}
        <div className="lg:col-span-8 space-y-6">
          {activeTab === 'english' && selectedEnglishTopic && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Topic Header Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-900/60 text-indigo-800 dark:text-indigo-300 inline-block mb-1.5">
                      {selectedEnglishTopic.category} • {selectedEnglishTopic.level}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedEnglishTopic.title}
                    </h2>
                    <h3 className="text-sm font-semibold text-indigo-700 dark:text-indigo-400 mt-0.5">
                      {selectedEnglishTopic.banglaTitle}
                    </h3>
                  </div>
                  <button
                    onClick={() =>
                      navigate('ai_chat', {
                        query: `আমাকে "${selectedEnglishTopic.title}" বিষয়ে আরও ৫টি বাস্তব উদাহরণসহ সহজে বুঝিয়ে দাও।`,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI শিক্ষককে জিজ্ঞেস করুন</span>
                  </button>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedEnglishTopic.summary}
                </p>
              </div>

              {/* Rules Cards */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  গুরুত্বপূর্ণ নিয়ম ও সূত্রসমূহ ({selectedEnglishTopic.rules.length}টি নিয়ম)
                </h3>
                {selectedEnglishTopic.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {rule.ruleNo || idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {rule.ruleTitle}
                      </h4>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
                      {rule.explanation}
                    </p>

                    {rule.formula && (
                      <div className="ml-8 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs font-mono text-amber-900 dark:text-amber-200">
                        <span className="font-bold uppercase tracking-wider block text-[10px] text-amber-800 dark:text-amber-300 mb-1">
                          Structure / Formula:
                        </span>
                        {rule.formula}
                      </div>
                    )}

                    {/* Examples */}
                    {rule.examples.length > 0 && (
                      <div className="ml-8 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          বাস্তব উদাহরণ (Examples):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {rule.examples.map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 border border-slate-100 dark:border-slate-700 text-xs"
                            >
                              <div className="font-semibold text-indigo-700 dark:text-indigo-400">
                                {ex.sentence}
                              </div>
                              <div className="text-slate-700 dark:text-slate-300 mt-1">{ex.explanation}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Interactive MCQs Practice */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-indigo-600" />
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                      তাৎক্ষণিক MCQ অনুশীলন ({selectedEnglishTopic.mcqs.length}টি প্রশ্ন)
                    </h3>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="text-xs text-slate-700 dark:text-slate-300 hover:text-indigo-600 flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>পুনরায় শুরু</span>
                  </button>
                </div>

                <div className="space-y-5">
                  {selectedEnglishTopic.mcqs.map((q, qIndex) => {
                    const selectedOpt = quizAnswers[q.id];
                    const isAnswered = selectedOpt !== undefined;
                    const isCorrect = isAnswered && selectedOpt === q.correctAnswerIndex;

                    return (
                      <div
                        key={q.id}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            Q{qIndex + 1}
                          </span>
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {q.question}
                          </h4>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            let btnStyle =
                              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-indigo-300';
                            if (isAnswered) {
                              if (optIdx === q.correctAnswerIndex) {
                                btnStyle =
                                  'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                              } else if (optIdx === selectedOpt) {
                                btnStyle =
                                  'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleAnswerSelect(q.id, optIdx)}
                                className={`text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {isAnswered && optIdx === q.correctAnswerIndex && (
                                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-1" />
                                )}
                                {isAnswered && optIdx === selectedOpt && optIdx !== q.correctAnswerIndex && (
                                  <X className="w-4 h-4 text-rose-600 flex-shrink-0 ml-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {showExplanation[q.id] && (
                          <div
                            className={`p-3 rounded-xl text-xs border ${
                              isCorrect
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                                : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                            }`}
                          >
                            <span className="font-bold block mb-1">
                              {isCorrect ? '✓ সঠিক উত্তর!' : '✗ ভুল হয়েছে!'}
                            </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bangla' && selectedBanglaTopic && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* Bangla Topic Header Card */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 dark:bg-purple-900/60 text-purple-800 dark:text-purple-300 inline-block mb-1.5">
                      {selectedBanglaTopic.category} • {selectedBanglaTopic.level}
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
                      {selectedBanglaTopic.title}
                    </h2>
                  </div>
                  <button
                    onClick={() =>
                      navigate('ai_chat', {
                        query: `বাংলা ২য় পত্র "${selectedBanglaTopic.title}" অধ্যায়ের নিয়মনীতি ও শর্টকাট কৌশল বিস্তারিত বুঝিয়ে বলো।`,
                      })
                    }
                    className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 hover:bg-purple-100 text-xs font-bold flex items-center gap-1.5 transition"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>AI শিক্ষককে জিজ্ঞেস করুন</span>
                  </button>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-100 dark:border-slate-800">
                  {selectedBanglaTopic.overview}
                </p>
              </div>

              {/* Bangla Rules */}
              <div className="space-y-4">
                <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  ব্যাকরণিক সূত্র ও বিশ্লেষণ ({selectedBanglaTopic.rules.length}টি নিয়ম)
                </h3>
                {selectedBanglaTopic.rules.map((rule, idx) => (
                  <div
                    key={idx}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-purple-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0">
                        {idx + 1}
                      </span>
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm sm:text-base">
                        {rule.ruleTitle}
                      </h4>
                    </div>

                    <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed pl-8">
                      {rule.explanation}
                    </p>

                    {rule.formula && (
                      <div className="ml-8 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs font-mono text-amber-900 dark:text-amber-200">
                        <span className="font-bold uppercase tracking-wider block text-[10px] text-amber-800 dark:text-amber-300 mb-1">
                          শর্টকাট নির্ণয় কৌশল / সূত্র:
                        </span>
                        {rule.formula}
                      </div>
                    )}

                    {/* Examples */}
                    {rule.examples.length > 0 && (
                      <div className="ml-8 space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                          পরীক্ষার জন্য গুরুত্বপূর্ণ দৃষ্টান্ত (Examples):
                        </span>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {rule.examples.map((ex, exIdx) => (
                            <div
                              key={exIdx}
                              className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 border border-slate-100 dark:border-slate-700 text-xs"
                            >
                              <div className="font-semibold text-purple-700 dark:text-purple-400">
                                {ex.item}
                              </div>
                              <div className="text-slate-700 dark:text-slate-300 mt-1">{ex.meaning}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Bangla MCQs */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-2">
                    <HelpCircle className="w-5 h-5 text-purple-600" />
                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-base">
                      বোর্ড প্রশ্ন ও বহুনির্বাচনী অনুশীলন ({selectedBanglaTopic.mcqs.length}টি প্রশ্ন)
                    </h3>
                  </div>
                  <button
                    onClick={handleResetQuiz}
                    className="text-xs text-slate-700 dark:text-slate-300 hover:text-purple-600 flex items-center gap-1 font-medium"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>পুনরায় শুরু</span>
                  </button>
                </div>

                <div className="space-y-5">
                  {selectedBanglaTopic.mcqs.map((q, qIndex) => {
                    const qId = `bangla-mcq-${qIndex}`;
                    const selectedOpt = quizAnswers[qId];
                    const isAnswered = selectedOpt !== undefined;
                    const isCorrect = isAnswered && selectedOpt === q.correctAnswerIndex;

                    return (
                      <div
                        key={qId}
                        className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-3"
                      >
                        <div className="flex items-start gap-2">
                          <span className="font-bold text-xs px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                            প্রশ্ন {qIndex + 1}
                          </span>
                          <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                            {q.question}
                          </h4>
                        </div>

                        {/* Options */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {q.options.map((opt, optIdx) => {
                            let btnStyle =
                              'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:border-purple-300';
                            if (isAnswered) {
                              if (optIdx === q.correctAnswerIndex) {
                                btnStyle =
                                  'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 text-emerald-800 dark:text-emerald-200 font-bold';
                              } else if (optIdx === selectedOpt) {
                                btnStyle =
                                  'bg-rose-50 dark:bg-rose-950/60 border-rose-500 text-rose-800 dark:text-rose-200';
                              }
                            }

                            return (
                              <button
                                key={optIdx}
                                onClick={() => handleAnswerSelect(qId, optIdx)}
                                className={`text-left p-2.5 rounded-xl border text-xs transition flex items-center justify-between ${btnStyle}`}
                              >
                                <span>{opt}</span>
                                {isAnswered && optIdx === q.correctAnswerIndex && (
                                  <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 ml-1" />
                                )}
                                {isAnswered && optIdx === selectedOpt && optIdx !== q.correctAnswerIndex && (
                                  <X className="w-4 h-4 text-rose-600 flex-shrink-0 ml-1" />
                                )}
                              </button>
                            );
                          })}
                        </div>

                        {/* Explanation */}
                        {showExplanation[qId] && (
                          <div
                            className={`p-3 rounded-xl text-xs border ${
                              isCorrect
                                ? 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-900 dark:text-emerald-200'
                                : 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-800/60 text-rose-900 dark:text-rose-200'
                            }`}
                          >
                            <span className="font-bold block mb-1">
                              {isCorrect ? '✓ সঠিক উত্তর!' : '✗ ভুল হয়েছে!'}
                            </span>
                            {q.explanation}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
