import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  ClassInfo,
  SubjectInfo,
  ChapterInfo,
  Lesson,
  Quiz,
  QuizQuestion,
  Post,
  Comment,
  Report,
  NotificationItem,
  AppSettings,
  PageType,
  ClassId,
  SubjectId,
  QuizResultRecord,
} from '../types';
import {
  ALL_CLASSES,
  ALL_SUBJECTS,
  ALL_CHAPTERS,
} from '../data/curriculumData';
import {
  getChapterQuestionBank,
  getPartQuiz,
  getRandomQuiz,
  getFullChapterTest,
  getModelTest,
  getDailyQuiz,
  getWrongQuestionsQuiz,
} from '../data/questionBankEngine';
import {
  INITIAL_CLASSES,
  INITIAL_SUBJECTS,
  INITIAL_CHAPTERS,
  INITIAL_LESSONS,
  INITIAL_QUIZZES,
  INITIAL_POSTS,
  INITIAL_COMMENTS,
  INITIAL_USERS,
  INITIAL_NOTIFICATIONS,
  INITIAL_SETTINGS,
  INITIAL_REPORTS,
} from '../data/initialData';
import {
  auth,
  db,
  googleProvider,
  handleFirestoreError,
  OperationType,
} from '../firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  collection,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';

interface AppContextType {
  // State
  currentUser: User | null;
  users: User[];
  classes: ClassInfo[];
  subjects: SubjectInfo[];
  chapters: ChapterInfo[];
  lessons: Lesson[];
  quizzes: Quiz[];
  posts: Post[];
  comments: Comment[];
  reports: Report[];
  notifications: NotificationItem[];
  settings: AppSettings;
  theme: 'light' | 'dark';
  currentPage: PageType;
  pageParams: Record<string, any>;
  searchQuery: string;

  // New Question Bank, Wrong Questions, & Custom Quizzes
  wrongQuestions: QuizQuestion[];
  recordWrongQuestion: (question: QuizQuestion) => void;
  removeWrongQuestion: (questionId: string) => void;
  clearAllWrongQuestions: () => void;

  bookmarkedQuestions: QuizQuestion[];
  toggleBookmarkQuestion: (question: QuizQuestion) => void;
  isQuestionBookmarked: (questionId: string) => boolean;

  completedChapters: string[];
  toggleCompleteChapter: (chapterId: string) => void;
  isChapterCompleted: (chapterId: string) => boolean;

  activeCustomQuiz: Quiz | null;
  setActiveCustomQuiz: (quiz: Quiz | null) => void;
  startCustomQuiz: (quiz: Quiz) => void;

  // Navigation
  navigate: (page: PageType, params?: Record<string, any>) => void;
  setSearchQuery: (query: string) => void;
  toggleTheme: () => void;

  // Auth & Profile
  login: (emailOrUsername: string, password?: string) => boolean;
  register: (name: string, username: string, email: string, classGrade: ClassId, role?: 'student' | 'teacher') => boolean;
  signInWithGoogle: () => Promise<boolean>;
  isFirebaseLoading: boolean;
  logout: () => void;
  switchUser: (userId: string) => void;
  updateProfile: (updated: Partial<User>) => void;

  // Social Posts & Comments
  createPost: (
    text: string,
    subjectId: SubjectId,
    classId: ClassId,
    media?: string | {
      imageUrl?: string;
      videoUrl?: string;
      videoThumbnail?: string;
      mediaType?: 'image' | 'video' | 'text';
    }
  ) => void;
  editPost: (postId: string, text: string) => void;
  deletePost: (postId: string) => void;
  toggleLikePost: (postId: string) => void;
  toggleSaveItem: (type: 'lesson' | 'post' | 'quiz', itemId: string) => void;
  isItemSaved: (type: 'lesson' | 'post' | 'quiz', itemId: string) => boolean;
  addComment: (postId: string, content: string) => void;
  addReply: (commentId: string, content: string) => void;
  toggleLikeComment: (commentId: string) => void;

  // Reports
  submitReport: (
    targetType: 'post' | 'comment' | 'user',
    targetId: string,
    targetPreview: string,
    reason: 'স্প্যাম' | 'অনুপযুক্ত বিষয়বস্তু' | 'ভুল বা বিভ্রান্তিকর তথ্য' | 'কটূক্তি বা হেনস্তা' | 'অন্যান্য',
    details?: string
  ) => void;
  resolveReport: (reportId: string, actionTaken: 'dismiss' | 'delete_target') => void;

  // Quiz & Education
  submitQuizResult: (
    quizId: string,
    quizTitle: string,
    classId: ClassId,
    subjectId: SubjectId,
    totalQuestions: number,
    correctAnswers: number,
    wrongAnswers: number,
    score: number,
    percentage: number
  ) => QuizResultRecord;

  // Admin Actions
  adminAddClass: (classData: Omit<ClassInfo, 'totalChapters' | 'totalQuizzes'>) => void;
  adminAddSubject: (subjectData: SubjectInfo) => void;
  adminAddChapter: (chapterData: Omit<ChapterInfo, 'id'>) => void;
  adminAddLesson: (lessonData: Omit<Lesson, 'id' | 'views'>) => void;
  adminUpdateLesson: (lessonId: string, updated: Partial<Lesson>) => void;
  adminDeleteLesson: (lessonId: string) => void;
  adminAddQuizQuestion: (quizId: string, question: Omit<Quiz['questions'][0], 'id'>) => void;
  adminCreateQuiz: (quizData: Omit<Quiz, 'id'>) => void;
  adminDeletePost: (postId: string) => void;
  adminUpdateSettings: (newSettings: Partial<AppSettings>) => void;
  adminToggleBanUser: (userId: string) => void;
  adminChangeUserRole: (userId: string, newRole: 'student' | 'teacher' | 'admin') => void;

  // Notifications
  markNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // GitHub Repository Manager (Admin & Developer)
  isGitHubModalOpen: boolean;
  setIsGitHubModalOpen: (open: boolean) => void;
  openGitHubChecker: () => void;

  // Helper getters
  getClassById: (id: ClassId) => ClassInfo | undefined;
  getSubjectById: (id: SubjectId) => SubjectInfo | undefined;
  getChapterById: (id: string) => ChapterInfo | undefined;
  getLessonById: (id: string) => Lesson | undefined;
  getQuizById: (id: string) => Quiz | undefined;
  getUserById: (id: string) => User | undefined;
  getCommentsByPostId: (postId: string) => Comment[];

  resetAllData: () => void;

  // Convenience aliases for pages
  quickSwitchUser: (userId: string) => void;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  updateUserRole: (userId: string, newRole: 'student' | 'teacher' | 'admin') => void;
  deleteLesson: (lessonId: string) => void;
  deleteQuiz: (quizId: string) => void;
  addLesson: (lessonData: Omit<Lesson, 'id' | 'views'>) => void;
  addQuiz: (quizData: Omit<Quiz, 'id'>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_PREFIX = 'bsh_v1_';

function getStorageItem<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    return item ? JSON.parse(item) : fallback;
  } catch (e) {
    console.error('Storage error for ' + key, e);
    return fallback;
  }
}

function setStorageItem<T>(key: string, value: T): void {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(value));
  } catch (e) {
    console.error('Failed to set storage for ' + key, e);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem(STORAGE_PREFIX + 'theme');
    if (saved === 'dark' || saved === 'light') return saved;
    return 'light';
  });

  // Navigation
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [pageParams, setPageParams] = useState<Record<string, any>>({});
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Primary states with local storage caching
  const [users, setUsers] = useState<User[]>(() => getStorageItem('users', INITIAL_USERS));
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUserId = localStorage.getItem(STORAGE_PREFIX + 'current_user_id');
    const allUsers = getStorageItem('users', INITIAL_USERS);
    if (savedUserId) {
      const match = allUsers.find((u: User) => u.id === savedUserId);
      if (match) return match;
    }
    // Default to the first student for instant interactive experience
    return allUsers[0] || null;
  });

  const [classes, setClasses] = useState<ClassInfo[]>(() => {
    const saved = getStorageItem<ClassInfo[]>('classes', ALL_CLASSES);
    if (!saved || saved.length < ALL_CLASSES.length) return ALL_CLASSES;
    return saved;
  });
  const [subjects, setSubjects] = useState<SubjectInfo[]>(() => {
    const saved = getStorageItem<SubjectInfo[]>('subjects', ALL_SUBJECTS);
    if (!saved || saved.length < ALL_SUBJECTS.length) return ALL_SUBJECTS;
    return saved;
  });
  const [chapters, setChapters] = useState<ChapterInfo[]>(() => {
    const saved = getStorageItem<ChapterInfo[]>('chapters', ALL_CHAPTERS);
    if (!saved || saved.length < ALL_CHAPTERS.length) return ALL_CHAPTERS;
    return saved;
  });
  const [lessons, setLessons] = useState<Lesson[]>(() => {
    const saved = getStorageItem<Lesson[]>('lessons', INITIAL_LESSONS);
    if (!saved || saved.length < INITIAL_LESSONS.length) return INITIAL_LESSONS;
    return saved;
  });
  const [quizzes, setQuizzes] = useState<Quiz[]>(() => {
    const saved = getStorageItem<Quiz[]>('quizzes', INITIAL_QUIZZES);
    if (!saved || saved.length < INITIAL_QUIZZES.length) return INITIAL_QUIZZES;
    return saved;
  });
  const [posts, setPosts] = useState<Post[]>(() => getStorageItem('posts', INITIAL_POSTS));
  const [comments, setComments] = useState<Comment[]>(() => getStorageItem('comments', INITIAL_COMMENTS));
  const [reports, setReports] = useState<Report[]>(() => getStorageItem('reports', INITIAL_REPORTS));
  const [notifications, setNotifications] = useState<NotificationItem[]>(() =>
    getStorageItem('notifications', INITIAL_NOTIFICATIONS)
  );
  const [settings, setSettings] = useState<AppSettings>(() => getStorageItem('settings', INITIAL_SETTINGS));

  // New persistent states for Question Bank & Practice Modes
  const [wrongQuestions, setWrongQuestions] = useState<QuizQuestion[]>(() =>
    getStorageItem('wrong_questions', [])
  );
  const [bookmarkedQuestions, setBookmarkedQuestions] = useState<QuizQuestion[]>(() =>
    getStorageItem('bookmarked_questions', [])
  );
  const [completedChapters, setCompletedChapters] = useState<string[]>(() =>
    getStorageItem('completed_chapters', [])
  );
  const [activeCustomQuiz, setActiveCustomQuiz] = useState<Quiz | null>(null);
  const [isFirebaseLoading, setIsFirebaseLoading] = useState<boolean>(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState<boolean>(false);

  const openGitHubChecker = () => setIsGitHubModalOpen(true);

  // Sync Firebase Auth & listen to onAuthStateChanged
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, async (fbUser) => {
      if (fbUser) {
        const userEmail = fbUser.email || '';
        const isAdminUser = userEmail.toLowerCase() === 'shakib2006k@gmail.com';
        const uid = fbUser.uid;

        try {
          const userDoc = await getDoc(doc(db, 'users', uid));
          if (userDoc.exists()) {
            const profile = userDoc.data() as User;
            if (isAdminUser && profile.role !== 'admin') {
              profile.role = 'admin';
            }
            setCurrentUser(profile);
            setUsers((prev) => {
              const exists = prev.some((u) => u.id === uid);
              return exists ? prev.map((u) => (u.id === uid ? profile : u)) : [profile, ...prev];
            });
            return;
          }
        } catch (e) {
          console.warn('Error fetching user profile from Firestore:', e);
        }

        const newUser: User = {
          id: uid,
          name: fbUser.displayName || userEmail.split('@')[0] || 'শিক্ষার্থী',
          username: (userEmail.split('@')[0] || `user_${uid.slice(0, 5)}`).replace(/[^a-zA-Z0-9_]/g, ''),
          email: userEmail,
          role: isAdminUser ? 'admin' : 'student',
          classGrade: 'class-8',
          bio: `${isAdminUser ? 'সিস্টেম অ্যাডমিনিস্ট্রেটর' : '৮ম শ্রেণির শিক্ষার্থী'}। বাংলা শিক্ষাগরে পড়াশোনা করি।`,
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
          totalPosts: 0,
          totalLikesReceived: 0,
          quizResults: [],
          savedLessonIds: [],
          savedPostIds: [],
          savedQuizIds: [],
          createdAt: 'এখন',
        };

        if (isAdminUser) {
          try {
            await setDoc(doc(db, 'admins', uid), {
              id: uid,
              email: userEmail,
              updatedAt: new Date().toISOString(),
            }, { merge: true });
          } catch (err) {
            console.warn('Admin record sync note:', err);
          }
        }

        try {
          await setDoc(doc(db, 'users', uid), newUser, { merge: true });
        } catch (e) {
          console.warn('Firestore set user note:', e);
        }

        setCurrentUser(newUser);
        setUsers((prev) => {
          const exists = prev.some((u) => u.id === uid);
          return exists ? prev.map((u) => (u.id === uid ? newUser : u)) : [newUser, ...prev];
        });
      }
    });

    return () => unsubscribeAuth();
  }, []);

  // Listen to Firestore real-time updates for posts and comments
  useEffect(() => {
    const unsubscribePosts = onSnapshot(
      collection(db, 'posts'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remotePosts: Post[] = [];
          snapshot.forEach((snap) => {
            remotePosts.push(snap.data() as Post);
          });
          setPosts((prev) => {
            const map = new Map<string, Post>();
            INITIAL_POSTS.forEach((p) => map.set(p.id, p));
            prev.forEach((p) => map.set(p.id, p));
            remotePosts.forEach((p) => map.set(p.id, p));
            return Array.from(map.values()).sort((a, b) => (b.id > a.id ? 1 : -1));
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'posts');
      }
    );

    const unsubscribeComments = onSnapshot(
      collection(db, 'comments'),
      (snapshot) => {
        if (!snapshot.empty) {
          const remoteComments: Comment[] = [];
          snapshot.forEach((snap) => {
            remoteComments.push(snap.data() as Comment);
          });
          setComments((prev) => {
            const map = new Map<string, Comment>();
            INITIAL_COMMENTS.forEach((c) => map.set(c.id, c));
            prev.forEach((c) => map.set(c.id, c));
            remoteComments.forEach((c) => map.set(c.id, c));
            return Array.from(map.values());
          });
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.LIST, 'comments');
      }
    );

    return () => {
      unsubscribePosts();
      unsubscribeComments();
    };
  }, []);

  // Sync dark theme to DOM
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_PREFIX + 'theme', theme);
  }, [theme]);

  // Sync primary collections to local storage
  useEffect(() => setStorageItem('users', users), [users]);
  useEffect(() => setStorageItem('classes', classes), [classes]);
  useEffect(() => setStorageItem('subjects', subjects), [subjects]);
  useEffect(() => setStorageItem('chapters', chapters), [chapters]);
  useEffect(() => setStorageItem('lessons', lessons), [lessons]);
  useEffect(() => setStorageItem('quizzes', quizzes), [quizzes]);
  useEffect(() => setStorageItem('posts', posts), [posts]);
  useEffect(() => setStorageItem('comments', comments), [comments]);
  useEffect(() => setStorageItem('reports', reports), [reports]);
  useEffect(() => setStorageItem('notifications', notifications), [notifications]);
  useEffect(() => setStorageItem('settings', settings), [settings]);
  useEffect(() => setStorageItem('wrong_questions', wrongQuestions), [wrongQuestions]);
  useEffect(() => setStorageItem('bookmarked_questions', bookmarkedQuestions), [bookmarkedQuestions]);
  useEffect(() => setStorageItem('completed_chapters', completedChapters), [completedChapters]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_PREFIX + 'current_user_id', currentUser.id);
    } else {
      localStorage.removeItem(STORAGE_PREFIX + 'current_user_id');
    }
  }, [currentUser]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const navigate = (page: PageType, params: Record<string, any> = {}) => {
    setCurrentPage(page);
    setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Auth functions
  const login = (emailOrUsername: string, _password?: string): boolean => {
    const clean = emailOrUsername.trim().toLowerCase();
    const found = users.find(
      (u) => u.email.toLowerCase() === clean || u.username.toLowerCase() === clean
    );
    if (found) {
      if (found.isBanned) {
        alert('আপনার অ্যাকাউন্টটি সাময়িকভাবে স্থগিত করা হয়েছে। মডারেটরের সাথে যোগাযোগ করুন।');
        return false;
      }
      setCurrentUser(found);
      return true;
    }
    return false;
  };

  const register = (
    name: string,
    username: string,
    email: string,
    classGrade: ClassId,
    role: 'student' | 'teacher' = 'student'
  ): boolean => {
    const cleanUser = username.trim().toLowerCase();
    const cleanEmail = email.trim().toLowerCase();
    if (users.some((u) => u.username.toLowerCase() === cleanUser || u.email.toLowerCase() === cleanEmail)) {
      return false;
    }
    const newUser: User = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      username: cleanUser,
      email: cleanEmail,
      role,
      classGrade,
      bio: `${classGrade === 'class-6' ? '৬ষ্ঠ' : classGrade === 'class-7' ? '৭ম' : '৮ম'} শ্রেণির নিয়মিত শিক্ষার্থী। বাংলা শিক্ষাগরে পড়াশোনা করি।`,
      avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUser}`,
      totalPosts: 0,
      totalLikesReceived: 0,
      quizResults: [],
      savedLessonIds: [],
      savedPostIds: [],
      savedQuizIds: [],
      createdAt: 'এখন',
    };
    setUsers((prev) => [newUser, ...prev]);
    setCurrentUser(newUser);
    return true;
  };

  const signInWithGoogle = async (): Promise<boolean> => {
    try {
      setIsFirebaseLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const fbUser = result.user;
      if (!fbUser) return false;

      const userEmail = fbUser.email || '';
      const isAdminUser = userEmail.toLowerCase() === 'shakib2006k@gmail.com';
      const uid = fbUser.uid;

      const userDocRef = doc(db, 'users', uid);
      let existingProfile: User | null = null;
      try {
        const snap = await getDoc(userDocRef);
        if (snap.exists()) {
          existingProfile = snap.data() as User;
        }
      } catch (e) {
        console.warn('Could not fetch existing remote user profile', e);
      }

      const resolvedUser: User = existingProfile || {
        id: uid,
        name: fbUser.displayName || userEmail.split('@')[0] || 'শিক্ষার্থী',
        username: (userEmail.split('@')[0] || `user_${uid.slice(0, 5)}`).replace(/[^a-zA-Z0-9_]/g, ''),
        email: userEmail,
        role: isAdminUser ? 'admin' : 'student',
        classGrade: 'class-8',
        bio: `${isAdminUser ? 'সিস্টেম অ্যাডমিনিস্ট্রেটর' : '৮ম শ্রেণির শিক্ষার্থী'}। বাংলা শিক্ষাগরে পড়াশোনা করি।`,
        avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/bottts/svg?seed=${uid}`,
        totalPosts: 0,
        totalLikesReceived: 0,
        quizResults: [],
        savedLessonIds: [],
        savedPostIds: [],
        savedQuizIds: [],
        createdAt: 'এখন',
      };

      if (isAdminUser) {
        resolvedUser.role = 'admin';
        try {
          await setDoc(doc(db, 'admins', uid), {
            id: uid,
            email: userEmail,
            updatedAt: new Date().toISOString(),
          }, { merge: true });
        } catch (err) {
          console.warn('Admin doc record sync note:', err);
        }
      }

      try {
        await setDoc(userDocRef, resolvedUser, { merge: true });
      } catch (e) {
        console.warn('User profile sync note:', e);
      }

      setUsers((prev) => {
        const filtered = prev.filter((u) => u.id !== uid);
        return [resolvedUser, ...filtered];
      });
      setCurrentUser(resolvedUser);
      return true;
    } catch (err) {
      console.error('Firebase Google sign-in failed:', err);
      return false;
    } finally {
      setIsFirebaseLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase sign out note:', e);
    }
    setCurrentUser(null);
  };

  const switchUser = (userId: string) => {
    const target = users.find((u) => u.id === userId);
    if (target) {
      setCurrentUser(target);
    }
  };

  const updateProfile = (updated: Partial<User>) => {
    if (!currentUser) return;
    const updatedUser = { ...currentUser, ...updated };
    setCurrentUser(updatedUser);
    setUsers((prev) => prev.map((u) => (u.id === currentUser.id ? updatedUser : u)));

    // Synchronize avatar and name updates to author's posts
    if (updated.avatar !== undefined || updated.name !== undefined) {
      setPosts((prev) =>
        prev.map((p) =>
          p.authorId === currentUser.id
            ? {
                ...p,
                ...(updated.avatar !== undefined ? { authorAvatar: updated.avatar } : {}),
                ...(updated.name !== undefined ? { authorName: updated.name } : {}),
              }
            : p
        )
      );
    }
  };

  // Posts & Social
  const createPost = (
    text: string,
    subjectId: SubjectId,
    classId: ClassId,
    media?: string | {
      imageUrl?: string;
      videoUrl?: string;
      videoThumbnail?: string;
      mediaType?: 'image' | 'video' | 'text';
    }
  ) => {
    if (!currentUser) return;
    const subject = subjects.find((s) => s.id === subjectId);

    let imageUrl: string | undefined = undefined;
    let videoUrl: string | undefined = undefined;
    let videoThumbnail: string | undefined = undefined;
    let mediaType: 'image' | 'video' | 'text' = 'text';

    if (typeof media === 'string') {
      imageUrl = media;
      mediaType = 'image';
    } else if (media && typeof media === 'object') {
      imageUrl = media.imageUrl;
      videoUrl = media.videoUrl;
      videoThumbnail = media.videoThumbnail;
      mediaType = media.mediaType || (videoUrl ? 'video' : imageUrl ? 'image' : 'text');
    }

    const classLabel =
      currentUser.classGrade === 'class-6' ? '৬ষ্ঠ শ্রেণি' :
      currentUser.classGrade === 'class-7' ? '৭ম শ্রেণি' :
      currentUser.classGrade === 'class-8' ? '৮ম শ্রেণি' :
      currentUser.classGrade === 'class-9' ? '৯ম শ্রেণি' :
      currentUser.classGrade === 'class-10' ? '১০ম শ্রেণি' : 'শিক্ষার্থী';

    const newPost: Post = {
      id: 'post-' + Date.now(),
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorRole: currentUser.role,
      authorClass: currentUser.role === 'teacher' ? 'শিক্ষক' : classLabel,
      text,
      imageUrl,
      videoUrl,
      videoThumbnail,
      mediaType,
      subjectId,
      subjectName: subject ? subject.name : 'সাধারণ',
      classId,
      createdAt: 'এইমাত্র',
      likes: 0,
      likedByUserIds: [],
      commentCount: 0,
      savedByUserIds: [],
      isPinned: false,
    };
    setPosts((prev) => [newPost, ...prev]);
    updateProfile({ totalPosts: (currentUser.totalPosts || 0) + 1 });

    // Sync to Firestore
    setDoc(doc(db, 'posts', newPost.id), newPost).catch((err) => {
      console.warn('Firestore setDoc post error:', err);
    });
  };

  const editPost = (postId: string, text: string) => {
    setPosts((prev) => prev.map((p) => (p.id === postId ? { ...p, text } : p)));
    updateDoc(doc(db, 'posts', postId), { text }).catch((err) => {
      console.warn('Firestore editPost error:', err);
    });
  };

  const deletePost = (postId: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== postId));
    setComments((prev) => prev.filter((c) => c.postId !== postId));
    deleteDoc(doc(db, 'posts', postId)).catch((err) => {
      console.warn('Firestore deletePost error:', err);
    });
  };

  const toggleLikePost = (postId: string) => {
    if (!currentUser) return;
    const userId = currentUser.id;
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const alreadyLiked = post.likedByUserIds.includes(userId);
        const newLikedList = alreadyLiked
          ? post.likedByUserIds.filter((id) => id !== userId)
          : [...post.likedByUserIds, userId];
        const newLikesCount = alreadyLiked ? Math.max(0, post.likes - 1) : post.likes + 1;

        // Sync like to Firestore
        updateDoc(doc(db, 'posts', postId), {
          likes: newLikesCount,
          likedByUserIds: newLikedList,
        }).catch((err) => {
          console.warn('Firestore toggleLikePost error:', err);
        });

        // Create notification if liked by someone else
        if (!alreadyLiked && post.authorId !== userId) {
          const newNotif: NotificationItem = {
            id: 'notif-' + Date.now(),
            userId: post.authorId,
            type: 'like',
            title: 'নতুন লাইক',
            message: `${currentUser.name} আপনার শিক্ষামূলক পোস্টে লাইক দিয়েছেন।`,
            targetPage: 'post_detail',
            targetId: post.id,
            isRead: false,
            createdAt: 'এইমাত্র',
          };
          setNotifications((n) => [newNotif, ...n]);
        }

        return {
          ...post,
          likes: newLikesCount,
          likedByUserIds: newLikedList,
        };
      })
    );
  };

  const toggleSaveItem = (type: 'lesson' | 'post' | 'quiz', itemId: string) => {
    if (!currentUser) return;
    let newSavedLessons = [...currentUser.savedLessonIds];
    let newSavedPosts = [...currentUser.savedPostIds];
    let newSavedQuizzes = [...currentUser.savedQuizIds];

    if (type === 'lesson') {
      newSavedLessons = newSavedLessons.includes(itemId)
        ? newSavedLessons.filter((id) => id !== itemId)
        : [...newSavedLessons, itemId];
    } else if (type === 'post') {
      newSavedPosts = newSavedPosts.includes(itemId)
        ? newSavedPosts.filter((id) => id !== itemId)
        : [...newSavedPosts, itemId];
    } else if (type === 'quiz') {
      newSavedQuizzes = newSavedQuizzes.includes(itemId)
        ? newSavedQuizzes.filter((id) => id !== itemId)
        : [...newSavedQuizzes, itemId];
    }

    updateProfile({
      savedLessonIds: newSavedLessons,
      savedPostIds: newSavedPosts,
      savedQuizIds: newSavedQuizzes,
    });
  };

  const isItemSaved = (type: 'lesson' | 'post' | 'quiz', itemId: string): boolean => {
    if (!currentUser) return false;
    if (type === 'lesson') return currentUser.savedLessonIds?.includes(itemId) || false;
    if (type === 'post') return currentUser.savedPostIds?.includes(itemId) || false;
    if (type === 'quiz') return currentUser.savedQuizIds?.includes(itemId) || false;
    return false;
  };

  const addComment = (postId: string, content: string) => {
    if (!currentUser) return;
    const post = posts.find((p) => p.id === postId);
    const newComment: Comment = {
      id: 'com-' + Date.now(),
      postId,
      authorId: currentUser.id,
      authorName: currentUser.name,
      authorUsername: currentUser.username,
      authorAvatar: currentUser.avatar,
      authorClass: currentUser.classGrade === 'class-6' ? '৬ষ্ঠ শ্রেণি' : currentUser.classGrade === 'class-7' ? '৭ম শ্রেণি' : '৮ম শ্রেণি',
      authorRole: currentUser.role,
      content,
      createdAt: 'এইমাত্র',
      likes: 0,
      likedByUserIds: [],
      replies: [],
    };
    setComments((prev) => [...prev, newComment]);
    setPosts((prev) =>
      prev.map((p) => (p.id === postId ? { ...p, commentCount: p.commentCount + 1 } : p))
    );

    // Sync comment to Firestore
    setDoc(doc(db, 'comments', newComment.id), newComment).catch((err) => {
      console.warn('Firestore setDoc comment error:', err);
    });
    if (post) {
      updateDoc(doc(db, 'posts', postId), {
        commentCount: (post.commentCount || 0) + 1,
      }).catch((err) => {
        console.warn('Firestore update commentCount error:', err);
      });
    }

    // Notification to post author
    if (post && post.authorId !== currentUser.id) {
      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        userId: post.authorId,
        type: 'comment',
        title: 'নতুন মন্তব্য',
        message: `${currentUser.name} আপনার পোস্টে মন্তব্য করেছেন: "${content.slice(0, 30)}..."`,
        targetPage: 'post_detail',
        targetId: post.id,
        isRead: false,
        createdAt: 'এইমাত্র',
      };
      setNotifications((n) => [newNotif, ...n]);
    }
  };

  const addReply = (commentId: string, content: string) => {
    if (!currentUser) return;
    let targetComment: Comment | undefined;
    setComments((prev) =>
      prev.map((com) => {
        if (com.id !== commentId) return com;
        targetComment = com;
        const newReply = {
          id: 'rep-' + Date.now(),
          commentId,
          authorId: currentUser.id,
          authorName: currentUser.name,
          authorUsername: currentUser.username,
          authorAvatar: currentUser.avatar,
          authorRole: currentUser.role,
          content,
          createdAt: 'এইমাত্র',
          likes: 0,
          likedByUserIds: [],
        };
        return {
          ...com,
          replies: [...com.replies, newReply],
        };
      })
    );

    if (targetComment && targetComment.authorId !== currentUser.id) {
      const newNotif: NotificationItem = {
        id: 'notif-' + Date.now(),
        userId: targetComment.authorId,
        type: 'reply',
        title: 'মন্তব্যের প্রতিউত্তর',
        message: `${currentUser.name} আপনার মন্তব্যে উত্তর দিয়েছেন।`,
        targetPage: 'post_detail',
        targetId: targetComment.postId,
        isRead: false,
        createdAt: 'এইমাত্র',
      };
      setNotifications((n) => [newNotif, ...n]);
    }
  };

  const toggleLikeComment = (commentId: string) => {
    if (!currentUser) return;
    const userId = currentUser.id;
    setComments((prev) =>
      prev.map((com) => {
        if (com.id !== commentId) return com;
        const alreadyLiked = com.likedByUserIds.includes(userId);
        return {
          ...com,
          likes: alreadyLiked ? Math.max(0, com.likes - 1) : com.likes + 1,
          likedByUserIds: alreadyLiked
            ? com.likedByUserIds.filter((id) => id !== userId)
            : [...com.likedByUserIds, userId],
        };
      })
    );
  };

  const submitReport = (
    targetType: 'post' | 'comment' | 'user',
    targetId: string,
    targetPreview: string,
    reason: 'স্প্যাম' | 'অনুপযুক্ত বিষয়বস্তু' | 'ভুল বা বিভ্রান্তিকর তথ্য' | 'কটূক্তি বা হেনস্তা' | 'অন্যান্য',
    details?: string
  ) => {
    const newReport: Report = {
      id: 'rep-' + Date.now(),
      targetType,
      targetId,
      targetPreview,
      reporterId: currentUser ? currentUser.id : 'guest',
      reporterName: currentUser ? currentUser.name : 'অতিথি শিক্ষার্থী',
      reason,
      details,
      status: 'pending',
      createdAt: 'এইমাত্র',
    };
    setReports((prev) => [newReport, ...prev]);

    // Sync report to Firestore
    setDoc(doc(db, 'reports', newReport.id), newReport).catch((err) => {
      console.warn('Firestore submitReport error:', err);
    });
  };

  const resolveReport = (reportId: string, actionTaken: 'dismiss' | 'delete_target') => {
    const targetReport = reports.find((r) => r.id === reportId);
    if (!targetReport) return;

    if (actionTaken === 'delete_target') {
      if (targetReport.targetType === 'post') {
        deletePost(targetReport.targetId);
      } else if (targetReport.targetType === 'comment') {
        setComments((prev) => prev.filter((c) => c.id !== targetReport.targetId));
      } else if (targetReport.targetType === 'user') {
        adminToggleBanUser(targetReport.targetId);
      }
    }

    setReports((prev) =>
      prev.map((r) =>
        r.id === reportId
          ? { ...r, status: actionTaken === 'dismiss' ? 'dismissed' : 'resolved' }
          : r
      )
    );
  };

  const submitQuizResult = (
    quizId: string,
    quizTitle: string,
    classId: ClassId,
    subjectId: SubjectId,
    totalQuestions: number,
    correctAnswers: number,
    wrongAnswers: number,
    score: number,
    percentage: number
  ): QuizResultRecord => {
    const record: QuizResultRecord = {
      id: 'res-' + Date.now(),
      quizId,
      quizTitle,
      classId,
      subjectId,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      score,
      percentage,
      completedAt: 'এইমাত্র',
    };

    if (currentUser) {
      const updatedResults = [record, ...currentUser.quizResults];
      updateProfile({ quizResults: updatedResults });

      // Add notification for high score
      if (percentage >= 80) {
        const cheerNotif: NotificationItem = {
          id: 'notif-' + Date.now(),
          userId: currentUser.id,
          type: 'quiz_score',
          title: 'অভিনন্দন! চমৎকার ফলাফল!',
          message: `আপনি "${quizTitle}" কুইজে ${percentage}% নম্বর পেয়ে অসাধারণ দক্ষতা দেখিয়েছেন!`,
          targetPage: 'quiz_result',
          isRead: false,
          createdAt: 'এইমাত্র',
        };
        setNotifications((prev) => [cheerNotif, ...prev]);
      }
    }
    return record;
  };

  // Admin Actions
  const adminAddClass = (classData: Omit<ClassInfo, 'totalChapters' | 'totalQuizzes'>) => {
    const newClass: ClassInfo = {
      ...classData,
      totalChapters: 0,
      totalQuizzes: 0,
    };
    setClasses((prev) => [...prev, newClass]);
  };

  const adminAddSubject = (subjectData: SubjectInfo) => {
    setSubjects((prev) => [...prev, subjectData]);
  };

  const adminAddChapter = (chapterData: Omit<ChapterInfo, 'id'>) => {
    const newChapter: ChapterInfo = {
      ...chapterData,
      id: 'ch-' + Date.now(),
    };
    setChapters((prev) => [...prev, newChapter]);
  };

  const adminAddLesson = (lessonData: Omit<Lesson, 'id' | 'views'>) => {
    const newLesson: Lesson = {
      ...lessonData,
      id: 'les-' + Date.now(),
      views: 0,
    };
    setLessons((prev) => [...prev, newLesson]);
    // update chapter lesson count
    setChapters((prev) =>
      prev.map((ch) =>
        ch.id === lessonData.chapterId ? { ...ch, lessonCount: ch.lessonCount + 1 } : ch
      )
    );
  };

  const adminUpdateLesson = (lessonId: string, updated: Partial<Lesson>) => {
    setLessons((prev) => prev.map((l) => (l.id === lessonId ? { ...l, ...updated } : l)));
  };

  const adminDeleteLesson = (lessonId: string) => {
    setLessons((prev) => prev.filter((l) => l.id !== lessonId));
  };

  const adminAddQuizQuestion = (quizId: string, question: Omit<Quiz['questions'][0], 'id'>) => {
    const newQ = {
      ...question,
      id: 'q-' + Date.now(),
    };
    setQuizzes((prev) =>
      prev.map((qz) => (qz.id === quizId ? { ...qz, questions: [...qz.questions, newQ] } : qz))
    );
  };

  const adminCreateQuiz = (quizData: Omit<Quiz, 'id'>) => {
    const newQuiz: Quiz = {
      ...quizData,
      id: 'quiz-' + Date.now(),
    };
    setQuizzes((prev) => [...prev, newQuiz]);
  };

  const adminDeletePost = (postId: string) => {
    deletePost(postId);
  };

  const adminUpdateSettings = (newSettings: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const adminToggleBanUser = (userId: string) => {
    setUsers((prev) =>
      prev.map((u) => (u.id === userId ? { ...u, isBanned: !u.isBanned } : u))
    );
    if (currentUser && currentUser.id === userId) {
      logout();
    }
  };

  const adminChangeUserRole = (userId: string, newRole: 'student' | 'teacher' | 'admin') => {
    setUsers((prev) => prev.map((u) => (u.id === userId ? { ...u, role: newRole } : u)));
    if (currentUser && currentUser.id === userId) {
      setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    }
  };

  const markNotificationsAsRead = () => {
    if (!currentUser) return;
    setNotifications((prev) =>
      prev.map((n) => (n.userId === currentUser.id ? { ...n, isRead: true } : n))
    );
  };

  const unreadNotificationsCount = currentUser
    ? notifications.filter((n) => n.userId === currentUser.id && !n.isRead).length
    : 0;

  // Question Bank, Bookmarking, & Wrong Answer Trackers
  const recordWrongQuestion = (q: QuizQuestion) => {
    setWrongQuestions((prev) => {
      if (prev.some((item) => item.id === q.id || item.question === q.question)) return prev;
      return [q, ...prev];
    });
  };

  const removeWrongQuestion = (questionId: string) => {
    setWrongQuestions((prev) => prev.filter((q) => q.id !== questionId));
  };

  const clearAllWrongQuestions = () => {
    setWrongQuestions([]);
  };

  const toggleBookmarkQuestion = (q: QuizQuestion) => {
    setBookmarkedQuestions((prev) => {
      const exists = prev.some((item) => item.id === q.id || item.question === q.question);
      if (exists) {
        return prev.filter((item) => item.id !== q.id && item.question !== q.question);
      }
      return [q, ...prev];
    });
  };

  const isQuestionBookmarked = (questionId: string) => {
    return bookmarkedQuestions.some((q) => q.id === questionId);
  };

  const toggleCompleteChapter = (chapterId: string) => {
    setCompletedChapters((prev) =>
      prev.includes(chapterId) ? prev.filter((id) => id !== chapterId) : [...prev, chapterId]
    );
  };

  const isChapterCompleted = (chapterId: string) => {
    return completedChapters.includes(chapterId);
  };

  const startCustomQuiz = (quiz: Quiz) => {
    setActiveCustomQuiz(quiz);
    navigate('quiz_play', { quizId: quiz.id });
  };

  // Getters
  const getClassById = (id: ClassId) => classes.find((c) => c.id === id);
  const getSubjectById = (id: SubjectId) => subjects.find((s) => s.id === id);
  const getChapterById = (id: string) => chapters.find((ch) => ch.id === id);
  const getLessonById = (id: string) => lessons.find((l) => l.id === id);
  
  const getQuizById = (id: string): Quiz | undefined => {
    if (activeCustomQuiz && activeCustomQuiz.id === id) {
      return activeCustomQuiz;
    }
    const found = quizzes.find((q) => q.id === id);
    if (found) return found;

    // Dynamic generation if ID matches pattern
    if (id.startsWith('quiz-full-')) {
      const chId = id.replace('quiz-full-', '');
      return getFullChapterTest(chId);
    }
    if (id.startsWith('quiz-daily-')) {
      const parts = id.split('-');
      const cId = (parts[2] && parts[3] ? `${parts[2]}-${parts[3]}` : 'class-6') as ClassId;
      return getDailyQuiz(cId);
    }
    return undefined;
  };

  const getUserById = (id: string) => users.find((u) => u.id === id);
  const getCommentsByPostId = (postId: string) => comments.filter((c) => c.postId === postId);

  const resetAllData = () => {
    localStorage.clear();
    setClasses(INITIAL_CLASSES);
    setSubjects(INITIAL_SUBJECTS);
    setChapters(INITIAL_CHAPTERS);
    setLessons(INITIAL_LESSONS);
    setQuizzes(INITIAL_QUIZZES);
    setPosts(INITIAL_POSTS);
    setComments(INITIAL_COMMENTS);
    setUsers(INITIAL_USERS);
    setCurrentUser(INITIAL_USERS[0]);
    setNotifications(INITIAL_NOTIFICATIONS);
    setReports(INITIAL_REPORTS);
    setSettings(INITIAL_SETTINGS);
    alert('ডেটা সফলভাবে প্রাথমিক অবস্থায় রিসেট করা হয়েছে!');
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        users,
        classes,
        subjects,
        chapters,
        lessons,
        quizzes,
        posts,
        comments,
        reports,
        notifications,
        settings,
        theme,
        currentPage,
        pageParams,
        searchQuery,

        // Question Bank & Practice Modes
        wrongQuestions,
        recordWrongQuestion,
        removeWrongQuestion,
        clearAllWrongQuestions,
        bookmarkedQuestions,
        toggleBookmarkQuestion,
        isQuestionBookmarked,
        completedChapters,
        toggleCompleteChapter,
        isChapterCompleted,
        activeCustomQuiz,
        setActiveCustomQuiz,
        startCustomQuiz,

        navigate,
        setSearchQuery,
        toggleTheme,

        login,
        register,
        signInWithGoogle,
        isFirebaseLoading,
        logout,
        switchUser,
        updateProfile,

        createPost,
        editPost,
        deletePost,
        toggleLikePost,
        toggleSaveItem,
        isItemSaved,
        addComment,
        addReply,
        toggleLikeComment,

        submitReport,
        resolveReport,

        submitQuizResult,

        adminAddClass,
        adminAddSubject,
        adminAddChapter,
        adminAddLesson,
        adminUpdateLesson,
        adminDeleteLesson,
        adminAddQuizQuestion,
        adminCreateQuiz,
        adminDeletePost,
        adminUpdateSettings,
        adminToggleBanUser,
        adminChangeUserRole,

        markNotificationsAsRead,
        unreadNotificationsCount,

        isGitHubModalOpen,
        setIsGitHubModalOpen,
        openGitHubChecker,

        getClassById,
        getSubjectById,
        getChapterById,
        getLessonById,
        getQuizById,
        getUserById,
        getCommentsByPostId,

        resetAllData,

        quickSwitchUser: switchUser,
        updateSettings: adminUpdateSettings,
        updateUserRole: adminChangeUserRole,
        deleteLesson: adminDeleteLesson,
        deleteQuiz: (quizId: string) => {
          setQuizzes((prev) => prev.filter((q) => q.id !== quizId));
        },
        addLesson: adminAddLesson,
        addQuiz: adminCreateQuiz,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
