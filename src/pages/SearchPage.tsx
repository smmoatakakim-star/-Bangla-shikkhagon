import React, { useState, useMemo } from 'react';
import {
  Search,
  BookOpen,
  FileText,
  MessageSquare,
  User as UserIcon,
  Award,
  Layers,
  ArrowRight,
  Sparkles,
  PenTool,
  HelpCircle,
  Lightbulb,
  Mail,
  BookMarked,
  X,
  CheckCircle2,
  ChevronRight,
  Filter,
  Zap,
  SlidersHorizontal,
  Bookmark,
  Check,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { WritingGuideItem } from '../types';
import { ALL_SYLLABUS_POEMS_DATA, PoemAnalysisItem } from '../data/allSyllabusPoemsData';
import { GRAMMAR_TOPICS, GrammarTopic } from '../data/grammarMasterData';
import { BANGLA_SECOND_PAPER_TOPICS, BanglaGrammarTopic } from '../data/banglaSecondPaperData';

export const SearchPage: React.FC = () => {
  const {
    classes,
    subjects,
    chapters,
    lessons,
    posts,
    quizzes,
    users,
    writingGuideList,
    syllabusList,
    managedQuestions,
    searchQuery,
    setSearchQuery,
    navigate,
  } = useApp();

  const [inputVal, setInputVal] = useState(searchQuery);
  const [highSearchMode, setHighSearchMode] = useState<boolean>(true);
  const [filterClass, setFilterClass] = useState<string>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTab, setFilterTab] = useState<
    'all' | 'poems' | 'writing' | 'syllabus' | 'grammar' | 'questions' | 'lessons' | 'quizzes' | 'posts'
  >('all');

  // Preview modals
  const [selectedWritingItem, setSelectedWritingItem] = useState<WritingGuideItem | null>(null);
  const [selectedPoemItem, setSelectedPoemItem] = useState<PoemAnalysisItem | null>(null);
  const [selectedGrammarTopic, setSelectedGrammarTopic] = useState<GrammarTopic | null>(null);
  const [selectedBanglaGrammar, setSelectedBanglaGrammar] = useState<BanglaGrammarTopic | null>(null);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(inputVal.trim());
  };

  const query = (inputVal || searchQuery || '').toLowerCase().trim();

  // Search results calculation directly querying actual database records & syllabus datasets
  const results = useMemo(() => {
    if (!query && filterClass === 'all' && filterCategory === 'all') {
      return {
        matchedPoems: [],
        matchedWritingGuides: [],
        matchedSyllabusItems: [],
        matchedGrammar: [],
        matchedBanglaGrammar: [],
        matchedQuestions: [],
        matchedLessons: [],
        matchedChapters: [],
        matchedQuizzes: [],
        matchedPosts: [],
        total: 0,
      };
    }

    const q = query;

    // 1. All Syllabus Poems & Core Literature (Class 6-10, SSC, HSC)
    const matchedPoems = ALL_SYLLABUS_POEMS_DATA.filter((poem) => {
      // Class filter
      if (filterClass !== 'all' && poem.classId !== filterClass) return false;

      // Category filter
      if (filterCategory === 'poems' && poem.type !== 'poem') return false;
      if (filterCategory === 'stories_novels' && poem.type !== 'story' && poem.type !== 'novel') return false;
      if (filterCategory === 'dramas' && poem.type !== 'drama') return false;
      if (filterCategory === 'english_lit' && poem.type !== 'english_lit') return false;
      if (filterCategory === 'bgs' && poem.type !== 'bgs') return false;
      if (filterCategory === 'science' && poem.type !== 'science') return false;
      if (filterCategory === 'grammar' && poem.type !== 'grammar') return false;

      if (!q) return true; // match based on category/class filter

      const inTitle = poem.title.toLowerCase().includes(q) || poem.banglaTitle.toLowerCase().includes(q);
      const inPoet = poem.poet.toLowerCase().includes(q);
      const inTheme = poem.coreTheme.toLowerCase().includes(q);
      const inMool = poem.moolBhab.toLowerCase().includes(q);
      const inType = poem.typeLabel.toLowerCase().includes(q);
      const inGlossary = poem.keyWordsGlossary.some((g) => g.word.toLowerCase().includes(q) || g.meaning.toLowerCase().includes(q));

      // Shortcuts
      if (q === 'কবিতা' && poem.type === 'poem') return true;
      if (q === 'উপন্যাস' && poem.type === 'novel') return true;
      if (q === 'নাটক' && poem.type === 'drama') return true;
      if (q === 'গল্প' && poem.type === 'story') return true;

      return inTitle || inPoet || inTheme || inMool || inType || inGlossary;
    });

    // 2. Writing Guides (প্রবন্ধ, রচনা, অনুচ্ছেদ, ভাবসম্প্রসারণ, সারাংশ, সারমর্ম, চিঠি, ইত্যাদি)
    const matchedWritingGuides = writingGuideList.filter((item) => {
      if (item.status !== 'published') return false;

      // Class filter
      if (filterClass !== 'all') {
        if (filterClass === 'ssc' && item.classId !== 'ssc' && item.classId !== 'class-9' && item.classId !== 'class-10') return false;
        if (filterClass === 'hsc' && item.classId !== 'hsc' && item.classId !== 'class-11' && item.classId !== 'class-12') return false;
        if (filterClass.startsWith('class-') && item.classId && item.classId !== filterClass && item.classId !== 'all') return false;
      }

      if (filterCategory === 'writing' && !item.category) return false;

      if (!q) return filterCategory === 'writing' || filterCategory === 'all';

      const inTitle = item.title.toLowerCase().includes(q);
      const inCat = item.categoryLabel.toLowerCase().includes(q);
      const inCategoryCode = item.category.toLowerCase().includes(q);
      const inExample = item.originalExample.toLowerCase().includes(q);
      const inIntro = item.introduction?.toLowerCase().includes(q) || false;
      const inMool = item.moolBhab?.toLowerCase().includes(q) || false;
      const inSompro = item.somprosharithoBhab?.toLowerCase().includes(q) || false;
      const inSource = item.sourceText?.toLowerCase().includes(q) || false;

      // Special Bangla keyword shortcuts
      if (q === 'ভাবসম্প্রসারণ' && item.category === 'bhabshomprosharon') return true;
      if (q === 'সারমর্ম' && item.category === 'sarmormo') return true;
      if (q === 'সারাংশ' && item.category === 'sarongsho') return true;
      if (q === 'প্রবন্ধ' && item.category === 'probondho') return true;
      if (q === 'রচনা' && item.category === 'rochona') return true;
      if (q === 'অনুচ্ছেদ' && item.category === 'paragraph') return true;
      if ((q === 'চিঠি' || q === 'ব্যক্তিগত চিঠি') && (item.category === 'letter' || item.category === 'personal_letter')) return true;
      if (q === 'আবেদনপত্র' && item.category === 'application') return true;
      if (q === 'প্রতিবেদন' && item.category === 'report') return true;
      if (q === 'সংলাপ' && item.category === 'dialogue') return true;
      if (q === 'গল্প' && (item.category === 'story' || item.category === 'completing_story')) return true;

      return inTitle || inCat || inCategoryCode || inExample || inIntro || inMool || inSompro || inSource;
    });

    // 3. Official Syllabus Items (কবিতা, গল্প, ব্যাকরণ, BGS, বিজ্ঞান, English)
    const matchedSyllabusItems: {
      syllabusId: string;
      syllabusTitle: string;
      className: string;
      item: any;
    }[] = [];

    syllabusList.forEach((syl) => {
      if (filterClass !== 'all' && syl.classId !== filterClass) return;

      if (filterCategory === 'bgs' && syl.subjectId !== 'bgs') return;
      if (filterCategory === 'science' && syl.subjectId !== 'general_science' && syl.subjectId !== 'science' && syl.subjectId !== 'physics' && syl.subjectId !== 'chemistry' && syl.subjectId !== 'biology') return;
      if (filterCategory === 'grammar' && syl.subjectId !== 'english' && !syl.subjectName.includes('ব্যাকরণ')) return;

      syl.items.forEach((item) => {
        if (!q) {
          if (filterCategory !== 'all' || filterClass !== 'all') {
            matchedSyllabusItems.push({
              syllabusId: syl.id,
              syllabusTitle: `${syl.className} • ${syl.subjectName}`,
              className: syl.className,
              item,
            });
          }
          return;
        }

        const inTitle = item.lessonTitle.toLowerCase().includes(q);
        const inAuthor = (item as any).authorOrTopic?.toLowerCase().includes(q) || item.author?.toLowerCase().includes(q) || false;
        const inThemes = item.learningDetails?.keyThemes?.some((t: string) => t.toLowerCase().includes(q)) || false;
        const inCore = (item.learningDetails as any)?.coreConceptExplanation?.toLowerCase().includes(q) || false;
        const inMool = (item.learningDetails as any)?.moolBhab?.toLowerCase().includes(q) || false;
        const inSyl = syl.subjectName.toLowerCase().includes(q);

        if (inTitle || inAuthor || inThemes || inCore || inMool || inSyl) {
          matchedSyllabusItems.push({
            syllabusId: syl.id,
            syllabusTitle: `${syl.className} • ${syl.subjectName}`,
            className: syl.className,
            item,
          });
        }
      });
    });

    // 4. English Grammar Topics
    const matchedGrammar = GRAMMAR_TOPICS.filter((topic) => {
      if (!q && filterCategory !== 'grammar') return false;
      if (!q && filterCategory === 'grammar') return true;
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.banglaTitle.toLowerCase().includes(q) ||
        topic.summary.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q)
      );
    });

    // 5. Bangla Second Paper Grammar Topics
    const matchedBanglaGrammar = BANGLA_SECOND_PAPER_TOPICS.filter((topic) => {
      if (!q && filterCategory !== 'grammar') return false;
      if (!q && filterCategory === 'grammar') return true;
      return (
        topic.title.toLowerCase().includes(q) ||
        topic.overview.toLowerCase().includes(q) ||
        topic.category.toLowerCase().includes(q)
      );
    });

    // 6. Managed Questions (MCQ & CQ)
    const matchedQuestions = managedQuestions.filter((qItem) => {
      if (filterClass !== 'all' && qItem.classId && qItem.classId !== filterClass) return false;

      if (!q) return filterCategory === 'questions';

      const inQuestion = qItem.question.toLowerCase().includes(q);
      const inExplanation = qItem.explanation?.toLowerCase().includes(q) || false;
      const inOptions = qItem.options?.some((opt) => opt.toLowerCase().includes(q)) || false;
      const inSource = qItem.source?.toLowerCase().includes(q) || false;
      const isMcqMatch = (q === 'mcq' || q === 'বহুনির্বাচনী') && qItem.type === 'mcq';
      const isCqMatch = (q === 'সৃজনশীল' || q === 'গুরুত্বপূর্ণ প্রশ্ন' || q === 'cq') && qItem.type === 'cq';

      return inQuestion || inExplanation || inOptions || inSource || isMcqMatch || isCqMatch;
    });

    // 7. Lessons
    const matchedLessons = lessons.filter((l) => {
      if (!q) return false;
      return (
        l.title.toLowerCase().includes(q) ||
        l.explanation.toLowerCase().includes(q) ||
        l.keyPoints.some((p) => p.toLowerCase().includes(q)) ||
        (l.quickNotes?.some((n) => n.toLowerCase().includes(q)) ?? false)
      );
    });

    // 8. Chapters
    const matchedChapters = chapters.filter((c) => {
      if (!q) return false;
      return c.title.toLowerCase().includes(q) || c.description.toLowerCase().includes(q);
    });

    // 9. Quizzes
    const matchedQuizzes = quizzes.filter((quiz) => {
      if (!q) return false;
      return (
        quiz.title.toLowerCase().includes(q) ||
        quiz.description.toLowerCase().includes(q) ||
        quiz.questions.some((qu) => qu.question.toLowerCase().includes(q))
      );
    });

    // 10. Posts
    const matchedPosts = posts.filter((p) => {
      if (!q) return false;
      return (
        p.text.toLowerCase().includes(q) ||
        p.subjectName.toLowerCase().includes(q) ||
        p.authorName.toLowerCase().includes(q)
      );
    });

    const total =
      matchedPoems.length +
      matchedWritingGuides.length +
      matchedSyllabusItems.length +
      matchedGrammar.length +
      matchedBanglaGrammar.length +
      matchedQuestions.length +
      matchedLessons.length +
      matchedChapters.length +
      matchedQuizzes.length +
      matchedPosts.length;

    return {
      matchedPoems,
      matchedWritingGuides,
      matchedSyllabusItems,
      matchedGrammar,
      matchedBanglaGrammar,
      matchedQuestions,
      matchedLessons,
      matchedChapters,
      matchedQuizzes,
      matchedPosts,
      total,
    };
  }, [
    query,
    filterClass,
    filterCategory,
    writingGuideList,
    syllabusList,
    managedQuestions,
    lessons,
    chapters,
    quizzes,
    posts,
  ]);

  // Verified popular query keywords
  const popularKeywords = [
    'সকল কবিতা',
    'কপোতাক্ষ নদ',
    'সোনার তরী',
    'বিদ্রোহী',
    'মানবধর্ম',
    'দুই বিঘা জমি',
    'কাকতাড়ুয়া',
    'লালসালু',
    'বহিপীর',
    'সিরাজউদ্দৌলা',
    'ভাবসম্প্রসারণ',
    'সারমর্ম',
    'সারাংশ',
    'চিঠি',
    'আবেদনপত্র',
    'প্রবন্ধ রচনা',
    'কারক ও বিভক্তি',
    'Tense & Voice',
    'বাংলাদেশ ও বিশ্বপরিচয়',
    'উন্নততর জীবনধারা (বিজ্ঞান)',
    'MCQ',
  ];

  return (
    <div id="search-results-page" className="max-w-6xl mx-auto space-y-6 pb-20">
      {/* Search Header and High-Power Engine Banner */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600">
                <Search className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <span>সমন্বিত অনুসন্ধান ও হাই সার্চ ইঞ্জিন</span>
              </h1>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              সিলেবাসের সকল কবিতা, গল্প, উপন্যাস, নাটক, ব্যাকরণ, লেখার গাইড, বিজ্ঞান, বাংলাদেশ ও বিশ্বপরিচয় এবং প্রশ্নব্যাংক খুঁজুন।
            </p>
          </div>

          {/* High Search Mode Toggle */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={() => setHighSearchMode(!highSearchMode)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition cursor-pointer border ${
                highSearchMode
                  ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300 dark:border-amber-700'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              <Zap className={`w-3.5 h-3.5 ${highSearchMode ? 'text-amber-500 fill-amber-500' : ''}`} />
              <span>হাই সার্চ মোড {highSearchMode ? 'সক্রিয়' : 'বন্ধ'}</span>
            </button>
          </div>
        </div>

        {/* Search Input Bar */}
        <form onSubmit={handleSearch} className="pt-1">
          <div className="relative flex items-center">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => {
                setInputVal(e.target.value);
                setSearchQuery(e.target.value);
              }}
              placeholder="যেমন: কপোতাক্ষ নদ, সোনার তরী, লালসালু, ভাবসম্প্রসারণ, সারমর্ম, চিঠি, সমাস, Tense..."
              className="w-full pl-5 pr-28 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
            <button
              type="submit"
              className="absolute right-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Search className="w-3.5 h-3.5" />
              <span>খুঁজুন</span>
            </button>
          </div>
        </form>

        {/* High Search Deep Filter Bar */}
        {highSearchMode && (
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-3">
            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold text-[11px] flex items-center gap-1">
                <SlidersHorizontal className="w-3 h-3" /> বিভাগ:
              </span>
              {[
                { id: 'all', label: 'সব বিষয়' },
                { id: 'poems', label: '📜 সকল কবিতা' },
                { id: 'stories_novels', label: '📖 গল্প ও উপন্যাস' },
                { id: 'dramas', label: '🎭 নাটক' },
                { id: 'english_lit', label: '🇬🇧 English Lit. & Prose' },
                { id: 'writing', label: '✍️ লেখার গাইড' },
                { id: 'grammar', label: '🔤 ব্যাকরণ (বাংলা ও English)' },
                { id: 'bgs', label: '🇧🇩 বাংলাদেশ ও বিশ্বপরিচয়' },
                { id: 'science', label: '🔬 বিজ্ঞান' },
                { id: 'questions', label: '❓ প্রশ্নব্যাংক ও MCQ' },
              ].map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setFilterCategory(c.id);
                    if (c.id === 'poems' && !inputVal) {
                      setInputVal('');
                    }
                  }}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition cursor-pointer ${
                    filterCategory === c.id
                      ? 'bg-emerald-600 text-white shadow-2xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              ))}
            </div>

            {/* Class Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-slate-400 font-semibold text-[11px]">শ্রেণি:</span>
              {[
                { id: 'all', label: 'সকল শ্রেণি' },
                { id: 'class-6', label: '৬ষ্ঠ শ্রেণি' },
                { id: 'class-7', label: '৭ম শ্রেণি' },
                { id: 'class-8', label: '৮ম শ্রেণি' },
                { id: 'ssc', label: '৯ম-১০ম / SSC' },
                { id: 'hsc', label: 'একাদশ-দ্বাদশ / HSC' },
              ].map((cls) => (
                <button
                  key={cls.id}
                  onClick={() => setFilterClass(cls.id)}
                  className={`px-2.5 py-1 rounded-xl text-[11px] font-medium transition cursor-pointer ${
                    filterClass === cls.id
                      ? 'bg-teal-600 text-white font-bold'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cls.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Popular query chips */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 font-semibold text-[11px]">জনপ্রিয় অনুসন্ধান:</span>
          {popularKeywords.map((kw) => (
            <button
              key={kw}
              onClick={() => {
                if (kw === 'সকল কবিতা') {
                  setFilterCategory('poems');
                  setInputVal('');
                  setSearchQuery('');
                } else {
                  setInputVal(kw);
                  setSearchQuery(kw);
                }
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950 dark:hover:text-emerald-300 text-[11px] font-medium transition cursor-pointer"
            >
              {kw}
            </button>
          ))}
        </div>
      </div>

      {/* Filter Tabs */}
      {(query || filterCategory !== 'all' || filterClass !== 'all') && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs scrollbar-none">
          <button
            onClick={() => setFilterTab('all')}
            className={`px-3.5 py-2 rounded-2xl font-bold transition shrink-0 cursor-pointer ${
              filterTab === 'all'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
            }`}
          >
            সকল ফলাফল ({results.total})
          </button>

          {results.matchedPoems.length > 0 && (
            <button
              onClick={() => setFilterTab('poems')}
              className={`px-3.5 py-2 rounded-2xl font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'poems'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-rose-700 dark:text-rose-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>সিলেবাসের কবিতা ও সাহিত্য ({results.matchedPoems.length})</span>
            </button>
          )}

          {results.matchedWritingGuides.length > 0 && (
            <button
              onClick={() => setFilterTab('writing')}
              className={`px-3.5 py-2 rounded-2xl font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'writing'
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-teal-700 dark:text-teal-300'
              }`}
            >
              <PenTool className="w-3.5 h-3.5" />
              <span>লেখার গাইড ({results.matchedWritingGuides.length})</span>
            </button>
          )}

          {results.matchedSyllabusItems.length > 0 && (
            <button
              onClick={() => setFilterTab('syllabus')}
              className={`px-3.5 py-2 rounded-2xl font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'syllabus'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-blue-700 dark:text-blue-300'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>সিলেবাসের পাঠ ({results.matchedSyllabusItems.length})</span>
            </button>
          )}

          {(results.matchedGrammar.length > 0 || results.matchedBanglaGrammar.length > 0) && (
            <button
              onClick={() => setFilterTab('grammar')}
              className={`px-3.5 py-2 rounded-2xl font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'grammar'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-indigo-700 dark:text-indigo-300'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>ব্যাকরণ ও Grammar ({results.matchedGrammar.length + results.matchedBanglaGrammar.length})</span>
            </button>
          )}

          {results.matchedQuestions.length > 0 && (
            <button
              onClick={() => setFilterTab('questions')}
              className={`px-3.5 py-2 rounded-2xl font-bold transition shrink-0 cursor-pointer flex items-center gap-1.5 ${
                filterTab === 'questions'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-amber-700 dark:text-amber-300'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>প্রশ্নব্যাংক ও MCQ ({results.matchedQuestions.length})</span>
            </button>
          )}

          {(results.matchedLessons.length > 0 || results.matchedChapters.length > 0) && (
            <button
              onClick={() => setFilterTab('lessons')}
              className={`px-3.5 py-2 rounded-2xl font-bold transition shrink-0 cursor-pointer ${
                filterTab === 'lessons'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
              }`}
            >
              নোট ও অধ্যায় ({results.matchedLessons.length + results.matchedChapters.length})
            </button>
          )}
        </div>
      )}

      {/* Results View */}
      {!query && filterCategory === 'all' && filterClass === 'all' ? (
        <div className="py-12 text-center text-slate-400 space-y-2">
          <Search className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-700" />
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">
            উপরে যেকোনো কবিতা, গল্প, উপন্যাস, ব্যাকরণ বা প্রশ্ন অনুসন্ধান করুন।
          </p>
          <p className="text-xs text-slate-400">
            বা উপরের ‘জনপ্রিয় অনুসন্ধান’ অথবা ফিল্টার বাটনগুলোতে ক্লিক করে দ্রুত ব্রাউজ করুন।
          </p>
        </div>
      ) : results.total === 0 ? (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-10 text-center text-slate-500 space-y-2">
          <p className="text-base font-bold text-slate-800 dark:text-slate-200">
            "{query || 'নির্বাচিত ফিল্টার'}" এর জন্য কোনো ফলাফল পাওয়া যায়নি।
          </p>
          <p className="text-xs text-slate-400">
            ফিল্টার রিসেট করে বা সাধারণ শব্দ দিয়ে আবার চেষ্টা করুন।
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* 1. Syllabus Poems, Novels & Dramas Results */}
          {(filterTab === 'all' || filterTab === 'poems') && results.matchedPoems.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-rose-600" />
                  <span>সিলেবাসের সকল কবিতা, উপন্যাস ও নাটক ({results.matchedPoems.length})</span>
                </h3>
                <span className="text-xs text-slate-400 font-medium">পঙ্‌ক্তি বিশ্লেষণ ও প্রশ্নসহ</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {results.matchedPoems.map((poem) => (
                  <div
                    key={poem.id}
                    onClick={() => setSelectedPoemItem(poem)}
                    className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-rose-500 transition cursor-pointer flex flex-col justify-between group shadow-2xs"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-rose-50 dark:bg-rose-950 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800">
                          {poem.typeLabel} • {poem.className}
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">
                          {poem.exam}
                        </span>
                      </div>

                      <div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-rose-600 transition">
                          {poem.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                          রচয়িতা: {poem.poet}
                        </p>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {poem.coreTheme || poem.moolBhab}
                      </p>
                    </div>

                    <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-rose-600 dark:text-rose-400 font-bold">
                      <span>বিশ্লেষণ ও সৃজনশীল দেখুন</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. Writing Guide Results */}
          {(filterTab === 'all' || filterTab === 'writing') &&
            results.matchedWritingGuides.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <PenTool className="w-4 h-4 text-teal-600" />
                    <span>বাংলা ও ইংরেজি লেখার গাইড ({results.matchedWritingGuides.length})</span>
                  </h3>
                  <button
                    onClick={() => navigate('writing_guide')}
                    className="text-xs text-emerald-600 hover:underline font-bold flex items-center gap-1"
                  >
                    <span>সম্পূর্ণ গাইড পেজে যান</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.matchedWritingGuides.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setSelectedWritingItem(item)}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500 transition cursor-pointer flex flex-col justify-between group shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-lg bg-teal-50 dark:bg-teal-950 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800">
                            {item.categoryLabel}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {item.className || 'সকল শ্রেণি'} • {item.exam}
                          </span>
                        </div>

                        <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-teal-600 transition">
                          {item.title}
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {item.introduction || item.moolBhab || item.originalExample.slice(0, 110)}...
                        </p>
                      </div>

                      <div className="pt-2.5 mt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                        <span className="text-slate-400 text-[11px] font-medium">আদর্শ নমুনা উত্তর</span>
                        <span className="text-teal-600 dark:text-teal-400 font-bold flex items-center gap-0.5">
                          <span>পড়ুন</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* 3. Official Syllabus Items (BGS, বিজ্ঞান, বাংলা, English) */}
          {(filterTab === 'all' || filterTab === 'syllabus') &&
            results.matchedSyllabusItems.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>সিলেবাসের পাঠ (বিজ্ঞান, BGS, বাংলা ও English) ({results.matchedSyllabusItems.length})</span>
                  </h3>
                  <button
                    onClick={() => navigate('syllabus')}
                    className="text-xs text-blue-600 hover:underline font-bold flex items-center gap-1"
                  >
                    <span>সিলেবাস পেজে যান</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.matchedSyllabusItems.map((entry, idx) => (
                    <div
                      key={entry.item.id || idx}
                      onClick={() => navigate('syllabus')}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-blue-500 transition cursor-pointer flex flex-col justify-between group shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                            {entry.syllabusTitle}
                          </span>
                          {entry.item.authorOrTopic && (
                            <span className="text-[10px] text-slate-400 font-medium truncate max-w-[150px]">
                              {entry.item.authorOrTopic}
                            </span>
                          )}
                        </div>

                        <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-blue-600 transition">
                          {entry.item.lessonTitle}
                        </h4>

                        <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                          {entry.item.learningDetails?.moolBhab ||
                            entry.item.learningDetails?.coreConceptExplanation ||
                            entry.item.learningDetails?.easyExplanation ||
                            'NCTB পাঠ্যবই ও বার্ষিক পরীক্ষার সিলেবাসের অন্তর্ভুক্ত পাঠ।'}
                        </p>
                      </div>

                      <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-blue-600 font-bold">
                        <span>সম্পূর্ণ পাঠ ও MCQ দেখুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* 4. English & Bangla Grammar Master */}
          {(filterTab === 'all' || filterTab === 'grammar') &&
            (results.matchedGrammar.length > 0 || results.matchedBanglaGrammar.length > 0) && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                    <FileText className="w-4 h-4 text-indigo-600" />
                    <span>বাংলা ও ইংরেজি ব্যাকরণ Master ({results.matchedGrammar.length + results.matchedBanglaGrammar.length})</span>
                  </h3>
                  <button
                    onClick={() => navigate('grammar_master')}
                    className="text-xs text-indigo-600 hover:underline font-bold flex items-center gap-1"
                  >
                    <span>Grammar Master পেজে যান</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.matchedGrammar.map((g) => (
                    <div
                      key={g.id}
                      onClick={() => setSelectedGrammarTopic(g)}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 transition cursor-pointer flex flex-col justify-between group shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            English Grammar • {g.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{g.level}</span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-indigo-600 transition">
                          {g.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{g.summary}</p>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-indigo-600 font-bold">
                        <span>নিয়ম ও উদাহরণ দেখুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}

                  {results.matchedBanglaGrammar.map((bg) => (
                    <div
                      key={bg.id}
                      onClick={() => setSelectedBanglaGrammar(bg)}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-indigo-500 transition cursor-pointer flex flex-col justify-between group shadow-2xs"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-lg bg-violet-50 dark:bg-violet-950 text-violet-700 dark:text-violet-300">
                            বাংলা ব্যাকরণ • {bg.category}
                          </span>
                          <span className="text-[10px] text-slate-400">{bg.level}</span>
                        </div>
                        <h4 className="font-black text-sm text-slate-900 dark:text-slate-100 group-hover:text-violet-600 transition">
                          {bg.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{bg.overview}</p>
                      </div>
                      <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs text-violet-600 font-bold">
                        <span>কারক/সমাস নিয়ম দেখুন</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* 5. Managed Questions (MCQ & CQ) */}
          {(filterTab === 'all' || filterTab === 'questions') &&
            results.matchedQuestions.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <HelpCircle className="w-4 h-4 text-amber-600" />
                  <span>প্রশ্নব্যাংক ও বহুনির্বাচনী প্রশ্ন ({results.matchedQuestions.length})</span>
                </h3>

                <div className="grid grid-cols-1 gap-2.5">
                  {results.matchedQuestions.map((q) => (
                    <div
                      key={q.id}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2 shadow-2xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          {q.type === 'cq' ? 'সৃজনশীল প্রশ্ন' : 'MCQ'}
                        </span>
                        {q.source && (
                          <span className="text-[10px] text-slate-400">{q.source}</span>
                        )}
                      </div>

                      <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                        {q.question}
                      </h4>

                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pt-1">
                          {q.options.map((opt, i) => (
                            <div
                              key={i}
                              className={`p-2 rounded-xl border text-xs flex items-center gap-2 ${
                                q.correctAnswerIndex === i
                                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-200 font-semibold'
                                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                              }`}
                            >
                              <span className="w-4 h-4 rounded-full bg-slate-200/60 dark:bg-slate-800 flex items-center justify-center text-[10px] font-bold shrink-0">
                                {['ক', 'খ', 'গ', 'ঘ'][i] || i + 1}
                              </span>
                              <span>{opt}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {q.explanation && (
                        <p className="text-[11.5px] text-emerald-700 dark:text-emerald-300 bg-emerald-50/50 dark:bg-emerald-950/30 p-2.5 rounded-xl border border-emerald-100 dark:border-emerald-900">
                          <strong>ব্যাখ্যা: </strong>
                          {q.explanation}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

          {/* 6. Lessons & Chapters */}
          {(filterTab === 'all' || filterTab === 'lessons') &&
            (results.matchedLessons.length > 0 || results.matchedChapters.length > 0) && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>পাঠ ও অধ্যায়সমূহ ({results.matchedLessons.length + results.matchedChapters.length})</span>
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {results.matchedLessons.map((l) => (
                    <div
                      key={l.id}
                      onClick={() => navigate('lesson', { lessonId: l.id })}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                          সহজ পাঠ
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors mt-2">
                          {l.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {l.explanation}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>{l.views} বার পড়া হয়েছে</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}

                  {results.matchedChapters.map((c) => (
                    <div
                      key={c.id}
                      onClick={() => navigate('chapters', { subjectId: c.subjectId, classId: c.classId })}
                      className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500 transition cursor-pointer flex flex-col justify-between group"
                    >
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300">
                          অধ্যায়
                        </span>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 transition-colors mt-2">
                          {c.title}
                        </h4>
                        <p className="text-xs text-slate-500 line-clamp-2 mt-1">
                          {c.description}
                        </p>
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mt-3 pt-2 border-t border-slate-100 dark:border-slate-800">
                        <span>অধ্যায়ের পাঠসমূহ</span>
                        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Selected Poem Preview Modal */}
      {selectedPoemItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-rose-50/50 dark:bg-rose-950/30">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-rose-100 dark:bg-rose-900/60 text-rose-800 dark:text-rose-200 font-bold text-xs">
                    {selectedPoemItem.typeLabel}
                  </span>
                  <span className="text-xs text-slate-500">
                    {selectedPoemItem.className} • {selectedPoemItem.exam}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {selectedPoemItem.title}
                </h3>
                <p className="text-xs text-slate-500 font-medium">
                  {selectedPoemItem.poet} {selectedPoemItem.poetBio && `• ${selectedPoemItem.poetBio}`}
                </p>
              </div>
              <button
                onClick={() => setSelectedPoemItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed">
              {/* Core Theme & Mool Bhab */}
              <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-2">
                <div className="font-bold text-amber-900 dark:text-amber-200 flex items-center gap-1.5">
                  <Lightbulb className="w-4 h-4 text-amber-600" />
                  <span>মূলভাব ও সারসংক্ষেপ:</span>
                </div>
                <p className="text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {selectedPoemItem.moolBhab}
                </p>
              </div>

              {/* Stanza Explanations */}
              {selectedPoemItem.stanzasOrExcerpts && selectedPoemItem.stanzasOrExcerpts.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <BookOpen className="w-4 h-4 text-rose-600" />
                    <span>প্রধান পঙ্‌ক্তি ও স্তবক বিশ্লেষণ:</span>
                  </div>
                  <div className="space-y-2.5">
                    {selectedPoemItem.stanzasOrExcerpts.map((st, i) => (
                      <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5">
                        <div className="font-serif italic text-rose-800 dark:text-rose-300 font-semibold whitespace-pre-line text-xs sm:text-[13px]">
                          "{st.lines}"
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs">
                          {st.explanation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Glossary */}
              {selectedPoemItem.keyWordsGlossary && selectedPoemItem.keyWordsGlossary.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 space-y-1.5">
                  <div className="font-bold text-slate-800 dark:text-slate-200">📖 গুরুত্বপূর্ণ শব্দার্থ ও টীকা:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                    {selectedPoemItem.keyWordsGlossary.map((g, i) => (
                      <div key={i} className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                        <strong className="text-slate-900 dark:text-slate-100">{g.word}:</strong>{' '}
                        <span className="text-slate-600 dark:text-slate-400">{g.meaning}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Short Questions */}
              {selectedPoemItem.shortQuestions && selectedPoemItem.shortQuestions.length > 0 && (
                <div className="space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <HelpCircle className="w-4 h-4 text-emerald-600" />
                    <span>পরীক্ষার গুরুত্বপূর্ণ জ্ঞানমূলক ও অনুধাবনমূলক প্রশ্ন:</span>
                  </div>
                  <div className="space-y-2">
                    {selectedPoemItem.shortQuestions.map((sq, i) => (
                      <div key={i} className="p-3 rounded-xl bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900 space-y-1">
                        <div className="font-bold text-slate-900 dark:text-slate-100 text-xs">
                          {sq.question} <span className="text-[10px] font-normal text-emerald-700">({sq.type})</span>
                        </div>
                        <p className="text-slate-700 dark:text-slate-300 text-xs">{sq.answer}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => {
                  setSelectedPoemItem(null);
                  navigate('syllabus');
                }}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition cursor-pointer"
              >
                সিলেবাসে আরও বিস্তারিত পড়ুন
              </button>
              <button
                onClick={() => setSelectedPoemItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Writing Item Modal */}
      {selectedWritingItem && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-teal-50/50 dark:bg-teal-950/30">
              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-lg bg-teal-100 dark:bg-teal-950 text-teal-800 dark:text-teal-300 font-bold text-xs">
                    {selectedWritingItem.categoryLabel}
                  </span>
                  <span className="text-xs text-slate-400">
                    {selectedWritingItem.className || 'সকল শ্রেণি'} • {selectedWritingItem.exam}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100">
                  {selectedWritingItem.title}
                </h3>
              </div>
              <button
                onClick={() => setSelectedWritingItem(null)}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed">
              {selectedWritingItem.moolBhab && (
                <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60">
                  <div className="font-bold text-amber-900 dark:text-amber-200 mb-1">💡 মূল ভাব:</div>
                  <p className="text-slate-800 dark:text-slate-200">{selectedWritingItem.moolBhab}</p>
                </div>
              )}

              {selectedWritingItem.sourceText && (
                <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                  <div className="font-bold text-slate-700 dark:text-slate-300 mb-1">📜 মূল পাঠ:</div>
                  <p className="italic text-slate-700 dark:text-slate-300 whitespace-pre-line">
                    "{selectedWritingItem.sourceText}"
                  </p>
                </div>
              )}

              <div className="space-y-1.5">
                <div className="font-black text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-teal-600" />
                  <span>আদর্শ নমুনা উত্তর:</span>
                </div>
                <div className="p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 whitespace-pre-line text-slate-800 dark:text-slate-200 leading-relaxed font-sans">
                  {selectedWritingItem.originalExample}
                </div>
              </div>

              {selectedWritingItem.importantTips && selectedWritingItem.importantTips.length > 0 && (
                <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 space-y-1">
                  <div className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    <span>পরীক্ষায় বেশি নম্বর পাওয়ার টিপস:</span>
                  </div>
                  <ul className="list-disc list-inside text-slate-700 dark:text-slate-300 pl-2">
                    {selectedWritingItem.importantTips.map((tip, i) => (
                      <li key={i}>{tip}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => {
                  setSelectedWritingItem(null);
                  navigate('writing_guide');
                }}
                className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs transition cursor-pointer"
              >
                লেখার গাইড পেজে এটি খুলুন
              </button>
              <button
                onClick={() => setSelectedWritingItem(null)}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Grammar Topic Modal */}
      {(selectedGrammarTopic || selectedBanglaGrammar) && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in duration-200">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between gap-4 bg-indigo-50/50 dark:bg-indigo-950/30">
              <div>
                <span className="px-2.5 py-0.5 rounded-lg bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200 font-bold text-xs">
                  {selectedGrammarTopic ? 'English Grammar' : 'বাংলা ব্যাকরণ'}
                </span>
                <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 mt-1">
                  {selectedGrammarTopic?.title || selectedBanglaGrammar?.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setSelectedGrammarTopic(null);
                  setSelectedBanglaGrammar(null);
                }}
                className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto space-y-4 text-xs sm:text-sm leading-relaxed">
              <p className="text-slate-700 dark:text-slate-300">
                {selectedGrammarTopic?.summary || selectedBanglaGrammar?.overview}
              </p>

              {selectedGrammarTopic?.rules && selectedGrammarTopic.rules.map((r, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{r.ruleTitle}</div>
                  <p className="text-slate-700 dark:text-slate-300 text-xs">{r.explanation}</p>
                  {r.formula && (
                    <div className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 font-mono text-xs font-bold">
                      সূত্র: {r.formula}
                    </div>
                  )}
                </div>
              ))}

              {selectedBanglaGrammar?.rules && selectedBanglaGrammar.rules.map((r, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="font-bold text-slate-900 dark:text-slate-100">{r.ruleTitle}</div>
                  <p className="text-slate-700 dark:text-slate-300 text-xs">{r.explanation}</p>
                  {r.formula && (
                    <div className="p-2 rounded-lg bg-violet-50 dark:bg-violet-950/40 text-violet-700 dark:text-violet-300 font-mono text-xs font-bold">
                      ফর্মুলা: {r.formula}
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/40">
              <button
                onClick={() => {
                  setSelectedGrammarTopic(null);
                  setSelectedBanglaGrammar(null);
                  navigate('grammar_master');
                }}
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition cursor-pointer"
              >
                Grammar Master এ বিস্তারিত দেখুন
              </button>
              <button
                onClick={() => {
                  setSelectedGrammarTopic(null);
                  setSelectedBanglaGrammar(null);
                }}
                className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs cursor-pointer"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
