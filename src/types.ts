export type ClassId =
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
  id: string;
  stimulus?: string; // উদ্দীপক
  stem?: string; // উদ্দীপক alias
  questions?: CQSubQuestion[];
  partA?: CQPart;
  partB?: CQPart;
  partC?: CQPart;
  partD?: CQPart;
  chapterId?: string;
  subjectId?: SubjectId;
  classId?: ClassId;
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
  id: string;
  orderNumber: number;
  name: string;
  formula: string;
  classId: ClassId;
  subjectId: SubjectId;
  subjectName?: string;
  group?: AcademicGroup;
  paper?: string;
  chapterTitle?: string;
  symbols: FormulaSymbol[];
  unit?: string;
  whenToUse: string;
  example: FormulaExample;
  warningOrMistake?: string;
  tags: string[];
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
  | 'ssc_dashboard'
  | 'hsc_dashboard'
  | 'formula_bank'
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
  | 'settings'
  | 'privacy'
  | 'terms'
  | 'contact'
  | 'grammar_master'
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
}

export interface AIGeneratedQuizItem {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

