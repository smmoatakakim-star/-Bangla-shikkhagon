export type ClassId =
  | 'class-5'
  | 'class-6'
  | 'class-7'
  | 'class-8'
  | 'class-9'
  | 'class-10'
  | 'class-11'
  | 'class-12'
  | 'ssc'
  | 'hsc';

export type AcademicGroup = 'all' | 'science' | 'humanities' | 'business_studies' | 'general';

export type SubjectId =
  | 'bangla'
  | 'english'
  | 'math'
  | 'science'
  | 'bgs'
  | 'ict'
  | 'religion'
  | 'physics'
  | 'chemistry'
  | 'biology'
  | 'higher_math'
  | 'highermath'
  | 'general_science'
  | 'accounting'
  | 'finance'
  | 'business_ent'
  | 'history_bangladesh'
  | 'geography'
  | 'civics'
  | 'economics'
  | 'physics_1st'
  | 'physics_2nd'
  | 'chemistry_1st'
  | 'chemistry_2nd'
  | 'biology_1st'
  | 'biology_2nd'
  | 'higher_math_1st'
  | 'higher_math_2nd'
  | 'accounting_1st'
  | 'accounting_2nd'
  | 'finance_1st'
  | 'finance_2nd'
  | 'business_org_1st'
  | 'business_org_2nd'
  | 'production_mgmt'
  | 'civics_1st'
  | 'civics_2nd'
  | 'economics_1st'
  | 'economics_2nd'
  | 'social_work_1st'
  | 'social_work_2nd'
  | 'history_1st'
  | 'history_2nd'
  | 'logic_1st'
  | 'logic_2nd'
  | 'geography_1st'
  | 'geography_2nd'
  | (string & {});

export type UserRole = 'student' | 'teacher' | 'admin';

export type QuestionDifficulty = 'easy' | 'medium' | 'hard' | 'challenge';

export type QuestionCategory =
  | 'basic'
  | 'understanding'
  | 'conceptual'
  | 'concept'
  | 'core'
  | 'application'
  | 'exam_style'
  | 'important'
  | 'revision'
  | 'challenge'
  | (string & {});

export interface ClassInfo {
  id: ClassId;
  name: string; // e.g. '৬ষ্ঠ শ্রেণি'
  numericGrade: number;
  description: string;
  iconName: string;
  colorClass: string;
  totalChapters: number;
  totalQuizzes: number;
}

export interface SubjectInfo {
  id: SubjectId;
  name: string; // e.g. 'পদার্থবিজ্ঞান', 'হিসাববিজ্ঞান', 'পৌরনীতি'
  banglaName: string;
  classId: ClassId;
  iconName: string;
  badgeColor: string;
  description: string;
  code?: string; // e.g. '136', '146'
  group?: AcademicGroup; // 'science' | 'humanities' | 'business_studies' | 'general'
  paper?: string; // '১ম পত্র', '২য় পত্র', 'আবশ্যিক'
  learningObjectives?: string[];
  formulaCount?: number;
  cqCount?: number;
}

export interface ChapterKeyTerm {
  term: string;
  definition?: string;
}

export interface ShortQuestion {
  question: string;
  answer: string;
  mark?: number;
  type?: string;
}

export interface CQSubQuestion {
  level: 'ক' | 'খ' | 'গ' | 'ঘ';
  text: string;
  answer: string;
  mark: number;
}

export interface CQPart {
  question: string;
  answer: string;
}

export interface CreativeQuestion {
  id: string; // Unique Question ID
  classId?: ClassId;
  subjectId?: SubjectId;
  subjectName?: string;
  chapterId?: string;
  chapterTitle?: string;
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  stimulus?: string; // উদ্দীপক
  stem?: string; // উদ্দীপক alias
  questionKa?: string; // ক প্রশ্ন (জ্ঞানমূলক - ১ নম্বর)
  questionKha?: string; // খ প্রশ্ন (অনুধাবনমূলক - ২ নম্বর)
  questionGa?: string; // গ প্রশ্ন (প্রয়োগমূলক - ৩ নম্বর)
  questionGha?: string; // ঘ প্রশ্ন (উচ্চতর দক্ষতা - ৪ নম্বর)
  answerKa?: string;
  answerKha?: string;
  answerGa?: string;
  answerGha?: string;
  fullAnswer?: string; // সম্পূর্ণ উত্তর
  stepByStepExplanation?: string; // ধাপে ধাপে ব্যাখ্যা
  markingGuide?: string; // নম্বরভিত্তিক উত্তর লেখার নির্দেশনা (১+২+৩+৪=১০)
  tags?: string[];
  source?: string;
  group?: AcademicGroup;
  paper?: string;
  questions?: CQSubQuestion[];
  partA?: CQPart;
  partB?: CQPart;
  partC?: CQPart;
  partD?: CQPart;
}

export interface ChapterInfo {
  id: string;
  classId: ClassId;
  subjectId: SubjectId;
  title: string; // e.g. '১ম অধ্যায়: ভৌত রাশি ও পরিমাপ'
  banglaTitle?: string;
  order: number;
  description: string;
  lessonCount: number;
  isPopular?: boolean;
  group?: AcademicGroup;
  paper?: string;
  code?: string;
  overview?: string; // অধ্যায়ের পরিচিতি
  keyConcepts?: string[]; // মূল বিষয়
  formulaeOrFacts?: string[]; // গুরুত্বপূর্ণ তথ্য ও সূত্র
  easyExplanation?: string; // সহজ ব্যাখ্যা
  keyTerms?: (ChapterKeyTerm | string)[]; // গুরুত্বপূর্ণ শব্দ/সংজ্ঞা
  examFocus?: string[]; // Exam Preparation
  shortQuestions?: ShortQuestion[];
  creativeQuestions?: CreativeQuestion[];
  rules?: string[];
}

export interface LessonExample {
  title: string;
  explanation: string;
  solution?: string;
}

export interface LessonQA {
  question: string;
  answer: string;
}

export interface Lesson {
  id: string;
  chapterId: string;
  subjectId: SubjectId;
  classId: ClassId;
  title: string; // e.g. 'সালোকসংশ্লেষণ কী ও কীভাবে ঘটে'
  order: number;
  readTimeMinutes: number;
  explanation: string; // সহজ ভাষায় ব্যাখ্যা
  keyPoints: string[]; // গুরুত্বপূর্ণ তথ্য
  examples: LessonExample[]; // উদাহরণ
  qaList: LessonQA[]; // প্রশ্ন ও উত্তর
  examTips?: string[]; // পরীক্ষার প্রস্তুতি ও বিশেষ পরামর্শ
  quickNotes?: string[]; // সংক্ষিপ্ত নোট
  views?: number;
}

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  chapterId: string;
  subjectId: SubjectId;
  classId: ClassId;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  difficulty?: QuestionDifficulty;
  category?: QuestionCategory;
  topic?: string;
  group?: AcademicGroup;
  paper?: string;
  source?: string;
}

export interface FormulaSymbol {
  symbol: string;
  meaning: string;
}

export interface FormulaExample {
  problem: string;
  given: string;
  substitution: string;
  solution: string;
  answer: string;
}

export interface FormulaItem {
  id: string; // Unique Formula ID
  orderNumber?: number;
  name: string; // Formula Name
  formula: string; // Formula
  classId: ClassId;
  subjectId: SubjectId;
  subjectName?: string;
  group?: AcademicGroup;
  paper?: string;
  chapterTitle?: string;
  topic?: string;
  explanation?: string; // সহজ বাংলা ব্যাখ্যা
  whenToUse: string; // কখন ব্যবহার করতে হয়
  example: FormulaExample; // Example
  difficulty?: 'easy' | 'medium' | 'hard';
  searchKeywords?: string[];
  symbols?: FormulaSymbol[];
  unit?: string;
  warningOrMistake?: string;
  tags?: string[];
}

export type QuizMode =
  | 'full'
  | 'standard'
  | 'part'
  | 'random'
  | 'chapter_test'
  | 'subject_test'
  | 'class_full'
  | 'model_test'
  | 'daily'
  | 'mixed'
  | 'wrong_retry'
  | 'exam_mode';

export interface Quiz {
  id: string;
  title: string;
  classId: ClassId;
  subjectId: SubjectId;
  chapterId: string;
  chapterTitle: string;
  description: string;
  questions: QuizQuestion[];
  timeLimitMinutes?: number;
  isPopular?: boolean;
  quizMode?: QuizMode;
  partNumber?: number;
  totalParts?: number;
  totalBankCount?: number;
  difficulty?: QuestionDifficulty;
}

export interface QuizResultRecord {
  id: string;
  quizId: string;
  quizTitle: string;
  classId: ClassId;
  subjectId: SubjectId;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  score: number;
  percentage: number;
  completedAt: string;
}

export interface Reply {
  id: string;
  commentId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: 'student' | 'teacher' | 'admin';
  content: string;
  createdAt: string;
  likes: number;
  likedByUserIds: string[];
}

export interface Comment {
  id: string;
  postId: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorClass?: string;
  authorRole: 'student' | 'teacher' | 'admin';
  content: string;
  createdAt: string;
  likes: number;
  likedByUserIds: string[];
  replies: Reply[];
}

export interface Post {
  id: string;
  authorId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  authorRole: 'student' | 'teacher' | 'admin';
  authorClass?: string;
  text: string;
  imageUrl?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  mediaType?: 'image' | 'video' | 'text';
  subjectId: SubjectId;
  subjectName: string;
  classId: ClassId;
  createdAt: string;
  likes: number;
  likedByUserIds: string[];
  commentCount: number;
  savedByUserIds: string[];
  isPinned?: boolean;
}

export interface Report {
  id: string;
  targetType: 'post' | 'comment' | 'user';
  targetId: string;
  targetPreview: string;
  reporterId: string;
  reporterName: string;
  reason: 'স্প্যাম' | 'অনুপযুক্ত বিষয়বস্তু' | 'ভুল বা বিভ্রান্তিকর তথ্য' | 'কটূক্তি বা হেনস্তা' | 'অন্যান্য';
  details?: string;
  status: 'pending' | 'resolved' | 'dismissed';
  createdAt: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'reply' | 'announcement' | 'quiz_score';
  title: string;
  message: string;
  targetPage?: PageType;
  targetId?: string;
  isRead: boolean;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  password?: string;
  role: 'student' | 'teacher' | 'admin';
  classGrade?: ClassId;
  bio: string;
  avatar: string;
  schoolName?: string;
  totalPosts: number;
  totalLikesReceived: number;
  quizResults: QuizResultRecord[];
  savedLessonIds: string[];
  savedPostIds: string[];
  savedQuizIds: string[];
  completedChapterIds?: string[];
  wrongQuestions?: QuizQuestion[];
  bookmarkedQuestionIds?: string[];
  savedFormulaIds?: string[];
  savedCqIds?: string[];
  studyStreakDays?: number;
  targetExam?: 'ssc' | 'hsc' | 'general';
  academicGroup?: AcademicGroup;
  achievements?: string[];
  createdAt: string;
  isBanned?: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
}

export interface AppSettings {
  siteName: string;
  tagline: string;
  announcementText: string;
  showAnnouncement: boolean;
  allowStudentPosts: boolean;
  contactEmail: string;
  contactPhone: string;
}

export type PageType =
  | 'home'
  | 'class_dashboard'
  | 'ssc_dashboard'
  | 'hsc_dashboard'
  | 'formula_bank'
  | 'creative_questions'
  | 'exam_prep'
  | 'daily_practice'
  | 'my_study'
  | 'ai_chat'
  | 'about'
  | 'classes'
  | 'subjects'
  | 'chapters'
  | 'lesson'
  | 'quiz'
  | 'quiz_play'
  | 'quiz_result'
  | 'question_bank'
  | 'model_tests'
  | 'daily_quiz'
  | 'mixed_quiz'
  | 'wrong_questions'
  | 'bookmarked_questions'
  | 'posts'
  | 'create_post'
  | 'post_detail'
  | 'search'
  | 'profile'
  | 'edit_profile'
  | 'saved'
  | 'notifications'
  | 'login'
  | 'register'
  | 'admin'
  | 'notices'
  | 'syllabus'
  | 'settings'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'grammar_master'
  | 'english_corner'
  | 'writing_guide'
  | 'curriculum_audit';

export type AIChatMode = 'general' | 'notes' | 'mcq' | 'math_steps' | 'exam_tips' | 'image_solver';

export interface AIChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  imageUrl?: string;
  imageBase64?: string;
  imageMimeType?: string;
  contextInfo?: {
    classId?: ClassId;
    subjectId?: SubjectId;
    chapterTitle?: string;
    mode?: AIChatMode;
  };
  suggestedFollowups?: string[];
  isBookmarked?: boolean;
  isError?: boolean;
  retryPrompt?: string;
  errorDetail?: string;
}

export interface AIGeneratedQuizItem {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ManagedClass {
  id: string;
  name: string;
  numericGrade: number;
  description: string;
  iconName: string;
  status: 'draft' | 'published';
  totalChapters?: number;
  totalQuizzes?: number;
  updatedAt?: string;
  createdAt?: string;
}

export interface ManagedSubject {
  id: string;
  name: string;
  banglaName?: string;
  classId: string;
  iconName?: string;
  description?: string;
  status: 'draft' | 'published';
  updatedAt?: string;
  createdAt?: string;
}

export interface ManagedChapter {
  id: string;
  classId: string;
  subjectId: string;
  title: string;
  chapterNumber?: number;
  description?: string;
  isPopular?: boolean;
  status: 'draft' | 'published';
  updatedAt?: string;
  createdAt?: string;
}

export interface ManagedQuestion {
  id: string;
  classId: string;
  subjectId: string;
  chapterId?: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
  source?: string;
  type: 'mcq' | 'cq';
  status: 'draft' | 'published';
  updatedAt?: string;
  createdAt?: string;
}

export interface ManagedNote {
  id: string;
  classId: string;
  subjectId: string;
  chapterId?: string;
  title: string;
  explanation: string;
  keyPoints?: string[];
  quickNotes?: string;
  status: 'draft' | 'published';
  updatedAt?: string;
  createdAt?: string;
}

export interface ManagedNotice {
  id: string;
  title: string;
  text: string;
  type: 'urgent' | 'info' | 'festive' | 'exam';
  showOnBanner: boolean;
  status: 'draft' | 'published';
  updatedAt?: string;
  createdAt?: string;
}

export interface SiteSeoConfig {
  id?: string;
  siteTitle: string;
  metaDescription: string;
  keywords: string;
  ogTitle: string;
  ogDescription: string;
  updatedAt?: string;
}

export interface AdminDraftItem {
  id: string;
  type: 'mcq' | 'lesson' | 'chapter' | 'notice';
  topic: string;
  targetClass: string;
  targetSubject: string;
  content: string;
  status: 'draft' | 'published' | 'discarded';
  parsedData?: any;
  createdAt: string;
}

export interface AICommandHistoryItem {
  id: string;
  command: string;
  timestamp: string;
  actionType: 'mcq' | 'lesson' | 'chapter' | 'notice' | 'seo' | 'class' | 'subject' | 'general' | 'syllabus';
  targetEntity?: string;
  status: 'draft_ready' | 'published' | 'cancelled' | 'failed';
  summary: string;
  draftData?: any;
}

// ==========================================
// OFFICIAL SYLLABUS & CURRICULUM INTERFACES
// ==========================================

export type OfficialSyllabusOrg =
  | 'NCTB'
  | 'শিক্ষা মন্ত্রণালয়'
  | 'মাধ্যমিক ও উচ্চশিক্ষা অধিদপ্তর (DSHE)'
  | 'ঢাকা শিক্ষা বোর্ড'
  | 'চট্টগ্রাম শিক্ষা বোর্ড'
  | 'রাজশাহী শিক্ষা বোর্ড'
  | 'যশোর শিক্ষা বোর্ড'
  | 'বরিশাল শিক্ষা বোর্ড'
  | 'সিলেট শিক্ষা বোর্ড'
  | 'দিনাজপুর শিক্ষা বোর্ড'
  | 'ময়মনসিংহ শিক্ষা বোর্ড'
  | 'কুমিল্লা শিক্ষা বোর্ড'
  | 'মাদ্রাসা শিক্ষা বোর্ড'
  | 'কারিগরি শিক্ষা বোর্ড'
  | 'প্রাথমিক শিক্ষা অধিদপ্তর'
  | (string & {});

export type SyllabusExamType =
  | 'annual' // বার্ষিক পরীক্ষা / মূল্যায়ন
  | 'half_yearly' // অর্ধবার্ষিক পরীক্ষা / মূল্যায়ন
  | 'pre_test' // প্রাক-নির্বাচনী পরীক্ষা
  | 'test' // নির্বাচনী / টেস্ট পরীক্ষা
  | 'board_final' // এসএসসি / এইচএসসি বোর্ড পরীক্ষা
  | 'term_1' // ১ম প্রান্তিক / সামষ্টিক মূল্যায়ন
  | 'term_2'; // ২য় প্রান্তিক / সামষ্টিক মূল্যায়ন

export interface OfficialSyllabusSource {
  sourceTitle: string;
  sourceUrl: string;
  sourceOrganization: OfficialSyllabusOrg;
  publicationYear: number;
  academicYear: string; // e.g. '২০২৬'
  publicationDate?: string;
  verificationStatus: 'verified' | 'official_pending';
  verifiedBy?: string;
  importedAt: string;
  lastVerifiedAt: string;
}

export interface SyllabusMarksDistribution {
  totalMarks: number; // e.g. 100
  writtenMarks?: number; // e.g. 70
  mcqMarks?: number; // e.g. 30
  creativeMarks?: number; // e.g. 70
  practicalMarks?: number; // e.g. 25
  continuousAssessment?: number; // ধারাবাহিক মূল্যায়ন e.g. 30
  summativeAssessment?: number; // সামষ্টিক মূল্যায়ন e.g. 70
  questionPattern?: string; // প্রশ্নের ধারা ও মানবণ্টন
  structureBreakdown?: {
    section: string; // 'সৃজনশীল অংশ' / 'বহুনির্বাচনী'
    marks: number;
    description: string;
  }[];
  examInstructions?: string[];
  specialNotes?: string[];
}

export interface SyllabusShortQuestion {
  question: string;
  answer: string;
  mark?: number;
  type?: 'জ্ঞানমূলক (ক)' | 'অনুধাবনমূলক (খ)' | 'সংক্ষিপ্ত';
}

export interface SyllabusCreativeQuestion {
  stimulus: string; // উদ্দীপক
  questions: {
    level: 'ক' | 'খ' | 'গ' | 'ঘ';
    q: string;
    a: string;
    mark: number;
  }[];
}

export interface SyllabusMCQ {
  question: string;
  options: string[];
  answerIndex: number;
  explanation?: string;
}

export interface SyllabusLessonItem {
  id: string;
  lessonTitle: string; // e.g. 'অতিথির স্মৃতি'
  author?: string; // e.g. 'শরৎচন্দ্র চট্টোপাধ্যায়'
  genre?: 'prose' | 'poetry' | 'grammar' | 'composition' | 'chapter';
  genreLabel?: string; // e.g. 'গদ্য / গল্প', 'কবিতা', 'ব্যাকরণ'
  pageRange?: string; // e.g. 'পৃষ্ঠা ১-১২'
  selectedTopics?: string[]; // নির্ধারিত পাঠ / বিষয়সমূহ
  chapterId?: string; // Link to existing chapter if any
  lessonId?: string; // Link to existing lesson if any
  learningDetails: {
    introduction: string; // 📖 পাঠ পরিচিতি
    objectives: string[]; // 🎯 শেখার উদ্দেশ্য
    easyExplanation: string; // 📝 সহজ ভাষায় বিষয়টি বোঝানো
    keyThemes: string[]; // 📌 গুরুত্বপূর্ণ বিষয়
    vocabulary: { word: string; meaning: string }[]; // 📚 কঠিন শব্দ/শব্দার্থ
    coreConcepts: string[]; // 💡 মূল ধারণা
    shortQuestions: SyllabusShortQuestion[]; // ❓ Original short questions
    creativeQuestions: SyllabusCreativeQuestion[]; // ✍️ Original descriptive/creative questions
    mcqs: SyllabusMCQ[]; // ✅ Original MCQ
    quizId?: string; // 🧠 Quiz
  };
}

export interface OfficialSyllabus {
  id: string;
  academicYear: string; // '২০২৬', '২০২৫'
  classId: ClassId; // 'class-5', 'class-6', 'class-7', 'class-8', 'class-9', 'class-10', 'ssc', 'hsc'
  className: string; // 'অষ্টম শ্রেণি', 'এসএসসি (১০ম)', 'এইচএসসি'
  examType: SyllabusExamType;
  examName: string; // 'বার্ষিক পরীক্ষা', 'অর্ধবার্ষিক পরীক্ষা', 'এসএসসি বোর্ড পরীক্ষা ২০২৬'
  subjectId: SubjectId;
  subjectName: string; // 'বাংলা প্রথম পত্র', 'বাংলা দ্বিতীয় পত্র'
  paper?: string; // '১ম পত্র', '২য় পত্র', 'আবশ্যিক'
  title: string; // '২০২৬ শিক্ষাবর্ষ — অষ্টম শ্রেণি — বাংলা প্রথম পত্র — বার্ষিক পরীক্ষা সিলেবাস'
  source: OfficialSyllabusSource;
  marksDistribution: SyllabusMarksDistribution;
  items: SyllabusLessonItem[];
  status: 'draft' | 'under_review' | 'verified' | 'approved' | 'published';
  importedAt: string;
  updatedAt: string;
  hash?: string;
}

export type WritingCategory =
  | 'probondho' // প্রবন্ধ
  | 'rochona' // রচনা
  | 'paragraph' // অনুচ্ছেদ
  | 'bhabshomprosharon' // ভাবসম্প্রসারণ
  | 'sarongsho' // সারাংশ
  | 'sarmormo' // সারমর্ম
  | 'letter' // চিঠি
  | 'personal_letter' // ব্যক্তিগত চিঠি
  | 'application' // আবেদনপত্র
  | 'report' // প্রতিবেদন
  | 'dialogue' // সংলাপ
  | 'story' // গল্প লেখা
  | 'completing_story' // গল্প সম্পূর্ণকরণ
  | 'essay_writing' // রচনামূলক লেখা
  | 'exam_writing_topics' // পরীক্ষার গুরুত্বপূর্ণ লেখার বিষয়
  | 'english_paragraph' // English Paragraph
  | 'english_composition' // English Composition
  | 'english_application' // English Application
  | 'english_letter' // English Letter
  | 'english_email' // English Email
  | 'english_dialogue' // English Dialogue
  | 'english_story' // English Story
  | 'english_completing_story'; // English Completing Story

export type ContentLifecycleStatus = 'draft' | 'review' | 'approved' | 'published';

export interface WritingGuideItem {
  id: string;
  title: string;
  classId: ClassId | string;
  className?: string;
  subjectId: string;
  exam: string; // e.g. '২০২৬ বার্ষিক পরীক্ষা', 'এসএসসি বোর্ড পরীক্ষা', 'এইচএসসি বোর্ড পরীক্ষা'
  academicYear: string; // '২০২৬'
  category: WritingCategory;
  categoryLabel: string; // e.g. 'প্রবন্ধ', 'রচনা', 'ভাবসম্প্রসারণ', etc.
  language: 'bn' | 'en';
  status: ContentLifecycleStatus;

  // General & Essay/Paragraph fields
  introduction?: string;
  structure?: string;
  mainPoints?: string[];
  originalExample: string;
  importantTips?: string[];
  commonMistakes?: string[];
  practice?: string[];
  examWritingTips?: string[];

  // ভাবসম্প্রসারণ specific fields
  moolBhab?: string; // মূল ভাব
  somprosharithoBhab?: string; // সম্প্রসারিত ভাব
  shikkhonioBishoy?: string; // শিক্ষণীয় বিষয়
  examStructure?: string; // পরীক্ষায় লেখার কাঠামো

  // সারাংশ & সারমর্ম specific fields
  sourceText?: string; // মূল গদ্যাংশ বা পদ্যাংশ / উৎস
  originalAnswer?: string; // সারাংশ বা সারমর্মের উত্তর
  explanation?: string; // বিশ্লেষণ ও নিয়ম

  // চিঠি & আবেদনপত্র specific fields
  letterType?: string; // e.g. 'ব্যক্তিগত চিঠি', 'আবেদনপত্র'
  applicationType?: string; // আবেদনের ধরন
  situation?: string; // প্রেক্ষাপট

  // প্রতিবেদন specific fields
  reportStructure?: string; // কাঠামোগত বিন্যাস
  keyPoints?: string[];

  // সংলাপ specific fields
  topic?: string;
  dialogueSpeakers?: string[];

  // গল্প specific fields
  storyStructure?: string;
  mainIdea?: string;
  moral?: string; // নীতিশিক্ষা

  createdAt?: string;
  updatedAt?: string;
}

export interface PlatformContentCounts {
  totalLessons: number;
  totalQuestions: number;
  totalMcqs: number;
  totalQuizzes: number;
  totalNotes: number;
  totalProbondho: number;
  totalRochona: number;
  totalParagraph: number;
  totalBhabshomprosharon: number;
  totalSarongsho: number;
  totalSarmormo: number;
  totalLetters: number;
  totalPersonalLetters?: number;
  totalApplications: number;
  totalReports: number;
  totalDialogues: number;
  totalStories: number;
  totalCompletingStories?: number;
  totalEssayWriting?: number;
  totalExamWritingTopics?: number;
  totalEnglishWriting: number;
}

