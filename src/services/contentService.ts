import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import {
  ManagedClass,
  ManagedSubject,
  ManagedChapter,
  ManagedQuestion,
  ManagedNote,
  ManagedNotice,
  SiteSeoConfig,
  AdminDraftItem,
  OfficialSyllabus,
  WritingGuideItem,
} from '../types';
import { OFFICIAL_SYLLABUS_INITIAL_DATA } from '../data/officialSyllabusData';
import { OFFICIAL_BANGLA_SECOND_SYLLABUSES } from '../data/officialBanglaSecondSyllabus';
import { INITIAL_WRITING_GUIDE_DATA } from '../data/writingGuideData';

// ==========================================
// Resilient Local Storage Cache Layer
// ==========================================
const LOCAL_STORAGE_PREFIX = 'bsh_content_';

function getLocalItems<T>(key: string): T[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + key);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function setLocalItems<T>(key: string, items: T[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_PREFIX + key, JSON.stringify(items));
  } catch {}
}

function saveLocalItem<T extends { id: string }>(key: string, item: T): void {
  const current = getLocalItems<T>(key);
  const index = current.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    current[index] = item;
  } else {
    current.unshift(item);
  }
  setLocalItems(key, current);
}

function removeLocalItem<T extends { id: string }>(key: string, id: string): void {
  const current = getLocalItems<T>(key);
  const filtered = current.filter((i) => i.id !== id);
  setLocalItems(key, filtered);
}

function mergeWithLocal<T extends { id: string }>(
  remoteItems: T[],
  localKey: string
): T[] {
  const localItems = getLocalItems<T>(localKey);
  const map = new Map<string, T>();
  remoteItems.forEach((item) => map.set(item.id, item));
  localItems.forEach((item) => map.set(item.id, item));
  return Array.from(map.values());
}

// ==========================================
// 1. Classes Management
// ==========================================
const classListeners = new Set<(classes: ManagedClass[]) => void>();
let latestRemoteClasses: ManagedClass[] = [];

function notifyClassListeners() {
  const merged = mergeWithLocal(latestRemoteClasses, 'classes');
  classListeners.forEach((cb) => cb(merged));
}

export const listenToManagedClasses = (
  callback: (classes: ManagedClass[]) => void
) => {
  classListeners.add(callback);
  callback(mergeWithLocal(latestRemoteClasses, 'classes'));

  const unsub = onSnapshot(
    collection(db, 'content_classes'),
    (snapshot) => {
      const items: ManagedClass[] = [];
      snapshot.forEach((snap) => {
        items.push({ id: snap.id, ...(snap.data() as any) });
      });
      latestRemoteClasses = items;
      notifyClassListeners();
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'content_classes');
      notifyClassListeners();
    }
  );

  return () => {
    classListeners.delete(callback);
    unsub();
  };
};

export const saveManagedClass = async (classData: ManagedClass): Promise<void> => {
  const path = `content_classes/${classData.id}`;
  const payload: ManagedClass = {
    ...classData,
    updatedAt: new Date().toISOString(),
    createdAt: classData.createdAt || new Date().toISOString(),
  };

  saveLocalItem('classes', payload);
  notifyClassListeners();

  try {
    await setDoc(doc(db, 'content_classes', classData.id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteManagedClass = async (classId: string): Promise<void> => {
  const path = `content_classes/${classId}`;
  removeLocalItem('classes', classId);
  notifyClassListeners();

  try {
    await deleteDoc(doc(db, 'content_classes', classId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// ==========================================
// 2. Subjects Management
// ==========================================
const subjectListeners = new Set<(subjects: ManagedSubject[]) => void>();
let latestRemoteSubjects: ManagedSubject[] = [];

function notifySubjectListeners() {
  const merged = mergeWithLocal(latestRemoteSubjects, 'subjects');
  subjectListeners.forEach((cb) => cb(merged));
}

export const listenToManagedSubjects = (
  callback: (subjects: ManagedSubject[]) => void
) => {
  subjectListeners.add(callback);
  callback(mergeWithLocal(latestRemoteSubjects, 'subjects'));

  const unsub = onSnapshot(
    collection(db, 'content_subjects'),
    (snapshot) => {
      const items: ManagedSubject[] = [];
      snapshot.forEach((snap) => {
        items.push({ id: snap.id, ...(snap.data() as any) });
      });
      latestRemoteSubjects = items;
      notifySubjectListeners();
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'content_subjects');
      notifySubjectListeners();
    }
  );

  return () => {
    subjectListeners.delete(callback);
    unsub();
  };
};

export const saveManagedSubject = async (subjectData: ManagedSubject): Promise<void> => {
  const path = `content_subjects/${subjectData.id}`;
  const payload: ManagedSubject = {
    ...subjectData,
    updatedAt: new Date().toISOString(),
    createdAt: subjectData.createdAt || new Date().toISOString(),
  };

  saveLocalItem('subjects', payload);
  notifySubjectListeners();

  try {
    await setDoc(doc(db, 'content_subjects', subjectData.id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteManagedSubject = async (subjectId: string): Promise<void> => {
  const path = `content_subjects/${subjectId}`;
  removeLocalItem('subjects', subjectId);
  notifySubjectListeners();

  try {
    await deleteDoc(doc(db, 'content_subjects', subjectId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// ==========================================
// 3. Chapters Management
// ==========================================
const chapterListeners = new Set<(chapters: ManagedChapter[]) => void>();
let latestRemoteChapters: ManagedChapter[] = [];

function notifyChapterListeners() {
  const merged = mergeWithLocal(latestRemoteChapters, 'chapters');
  chapterListeners.forEach((cb) => cb(merged));
}

export const listenToManagedChapters = (
  callback: (chapters: ManagedChapter[]) => void
) => {
  chapterListeners.add(callback);
  callback(mergeWithLocal(latestRemoteChapters, 'chapters'));

  const unsub = onSnapshot(
    collection(db, 'content_chapters'),
    (snapshot) => {
      const items: ManagedChapter[] = [];
      snapshot.forEach((snap) => {
        items.push({ id: snap.id, ...(snap.data() as any) });
      });
      latestRemoteChapters = items;
      notifyChapterListeners();
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'content_chapters');
      notifyChapterListeners();
    }
  );

  return () => {
    chapterListeners.delete(callback);
    unsub();
  };
};

export const saveManagedChapter = async (chapterData: ManagedChapter): Promise<void> => {
  const path = `content_chapters/${chapterData.id}`;
  const payload: ManagedChapter = {
    ...chapterData,
    updatedAt: new Date().toISOString(),
    createdAt: chapterData.createdAt || new Date().toISOString(),
  };

  saveLocalItem('chapters', payload);
  notifyChapterListeners();

  try {
    await setDoc(doc(db, 'content_chapters', chapterData.id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteManagedChapter = async (chapterId: string): Promise<void> => {
  const path = `content_chapters/${chapterId}`;
  removeLocalItem('chapters', chapterId);
  notifyChapterListeners();

  try {
    await deleteDoc(doc(db, 'content_chapters', chapterId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// ==========================================
// 4. Questions & Answers (MCQ & CQ) Management
// ==========================================
const questionListeners = new Set<(questions: ManagedQuestion[]) => void>();
let latestRemoteQuestions: ManagedQuestion[] = [];

function notifyQuestionListeners() {
  const merged = mergeWithLocal(latestRemoteQuestions, 'questions');
  questionListeners.forEach((cb) => cb(merged));
}

export const listenToManagedQuestions = (
  callback: (questions: ManagedQuestion[]) => void
) => {
  questionListeners.add(callback);
  callback(mergeWithLocal(latestRemoteQuestions, 'questions'));

  const unsub = onSnapshot(
    collection(db, 'content_questions'),
    (snapshot) => {
      const items: ManagedQuestion[] = [];
      snapshot.forEach((snap) => {
        items.push({ id: snap.id, ...(snap.data() as any) });
      });
      latestRemoteQuestions = items;
      notifyQuestionListeners();
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'content_questions');
      notifyQuestionListeners();
    }
  );

  return () => {
    questionListeners.delete(callback);
    unsub();
  };
};

export const saveManagedQuestion = async (qData: ManagedQuestion): Promise<void> => {
  const path = `content_questions/${qData.id}`;
  const payload: ManagedQuestion = {
    ...qData,
    updatedAt: new Date().toISOString(),
    createdAt: qData.createdAt || new Date().toISOString(),
  };

  saveLocalItem('questions', payload);
  notifyQuestionListeners();

  try {
    await setDoc(doc(db, 'content_questions', qData.id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteManagedQuestion = async (questionId: string): Promise<void> => {
  const path = `content_questions/${questionId}`;
  removeLocalItem('questions', questionId);
  notifyQuestionListeners();

  try {
    await deleteDoc(doc(db, 'content_questions', questionId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// ==========================================
// 5. Notes & Study Materials Management
// ==========================================
const noteListeners = new Set<(notes: ManagedNote[]) => void>();
let latestRemoteNotes: ManagedNote[] = [];

function notifyNoteListeners() {
  const merged = mergeWithLocal(latestRemoteNotes, 'notes');
  noteListeners.forEach((cb) => cb(merged));
}

export const listenToManagedNotes = (
  callback: (notes: ManagedNote[]) => void
) => {
  noteListeners.add(callback);
  callback(mergeWithLocal(latestRemoteNotes, 'notes'));

  const unsub = onSnapshot(
    collection(db, 'content_notes'),
    (snapshot) => {
      const items: ManagedNote[] = [];
      snapshot.forEach((snap) => {
        items.push({ id: snap.id, ...(snap.data() as any) });
      });
      latestRemoteNotes = items;
      notifyNoteListeners();
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'content_notes');
      notifyNoteListeners();
    }
  );

  return () => {
    noteListeners.delete(callback);
    unsub();
  };
};

export const saveManagedNote = async (noteData: ManagedNote): Promise<void> => {
  const path = `content_notes/${noteData.id}`;
  const payload: ManagedNote = {
    ...noteData,
    updatedAt: new Date().toISOString(),
    createdAt: noteData.createdAt || new Date().toISOString(),
  };

  saveLocalItem('notes', payload);
  notifyNoteListeners();

  try {
    await setDoc(doc(db, 'content_notes', noteData.id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteManagedNote = async (noteId: string): Promise<void> => {
  const path = `content_notes/${noteId}`;
  removeLocalItem('notes', noteId);
  notifyNoteListeners();

  try {
    await deleteDoc(doc(db, 'content_notes', noteId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// ==========================================
// 6. Notices & Announcements Management
// ==========================================
const noticeListeners = new Set<(notices: ManagedNotice[]) => void>();
let latestRemoteNotices: ManagedNotice[] = [];

function notifyNoticeListeners() {
  const merged = mergeWithLocal(latestRemoteNotices, 'notices');
  noticeListeners.forEach((cb) => cb(merged));
}

export const listenToManagedNotices = (
  callback: (notices: ManagedNotice[]) => void
) => {
  noticeListeners.add(callback);
  callback(mergeWithLocal(latestRemoteNotices, 'notices'));

  const unsub = onSnapshot(
    collection(db, 'content_notices'),
    (snapshot) => {
      const items: ManagedNotice[] = [];
      snapshot.forEach((snap) => {
        items.push({ id: snap.id, ...(snap.data() as any) });
      });
      latestRemoteNotices = items;
      notifyNoticeListeners();
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'content_notices');
      notifyNoticeListeners();
    }
  );

  return () => {
    noticeListeners.delete(callback);
    unsub();
  };
};

export const saveManagedNotice = async (noticeData: ManagedNotice): Promise<void> => {
  const path = `content_notices/${noticeData.id}`;
  const payload: ManagedNotice = {
    ...noticeData,
    updatedAt: new Date().toISOString(),
    createdAt: noticeData.createdAt || new Date().toISOString(),
  };

  saveLocalItem('notices', payload);
  notifyNoticeListeners();

  try {
    await setDoc(doc(db, 'content_notices', noticeData.id), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteManagedNotice = async (noticeId: string): Promise<void> => {
  const path = `content_notices/${noticeId}`;
  removeLocalItem('notices', noticeId);
  notifyNoticeListeners();

  try {
    await deleteDoc(doc(db, 'content_notices', noticeId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// ==========================================
// 7. Site SEO & Meta Description Management
// ==========================================
export const listenToSiteSeo = (
  callback: (seo: SiteSeoConfig | null) => void
) => {
  const localSeo = (() => {
    if (typeof window === 'undefined') return null;
    try {
      const raw = localStorage.getItem(LOCAL_STORAGE_PREFIX + 'seo');
      return raw ? (JSON.parse(raw) as SiteSeoConfig) : null;
    } catch {
      return null;
    }
  })();
  if (localSeo) callback(localSeo);

  return onSnapshot(
    doc(db, 'site_config', 'global_seo'),
    (snap) => {
      if (snap.exists()) {
        callback({ id: snap.id, ...(snap.data() as any) });
      } else if (localSeo) {
        callback(localSeo);
      } else {
        callback(null);
      }
    },
    (err) => {
      handleFirestoreError(err, OperationType.GET, 'site_config/global_seo');
      if (localSeo) callback(localSeo);
    }
  );
};

export const saveSiteSeo = async (seoData: SiteSeoConfig): Promise<void> => {
  const path = 'site_config/global_seo';
  const payload = {
    ...seoData,
    updatedAt: new Date().toISOString(),
  };

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(LOCAL_STORAGE_PREFIX + 'seo', JSON.stringify(payload));
    } catch {}
  }

  // Instantly apply to document head if running in browser
  if (typeof document !== 'undefined') {
    if (seoData.siteTitle) {
      document.title = seoData.siteTitle;
    }
    if (seoData.metaDescription) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (!metaDesc) {
        metaDesc = document.createElement('meta');
        metaDesc.setAttribute('name', 'description');
        document.head.appendChild(metaDesc);
      }
      metaDesc.setAttribute('content', seoData.metaDescription);
    }
  }

  try {
    await setDoc(doc(db, 'site_config', 'global_seo'), payload, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

// ==========================================
// 8. Admin Drafts (AI-Generated Staging)
// ==========================================
const draftListeners = new Set<(drafts: AdminDraftItem[]) => void>();
let latestRemoteDrafts: AdminDraftItem[] = [];

function notifyDraftListeners() {
  const merged = mergeWithLocal(latestRemoteDrafts, 'drafts');
  merged.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''));
  draftListeners.forEach((cb) => cb(merged));
}

export const listenToAdminDrafts = (
  callback: (drafts: AdminDraftItem[]) => void
) => {
  draftListeners.add(callback);
  callback(mergeWithLocal(latestRemoteDrafts, 'drafts'));

  return onSnapshot(
    collection(db, 'admin_drafts'),
    (snapshot) => {
      const items: AdminDraftItem[] = [];
      snapshot.forEach((snap) => {
        items.push({ id: snap.id, ...(snap.data() as any) });
      });
      latestRemoteDrafts = items;
      notifyDraftListeners();
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'admin_drafts');
      notifyDraftListeners();
    }
  );
};

export const saveAdminDraft = async (draft: AdminDraftItem): Promise<void> => {
  const path = `admin_drafts/${draft.id}`;
  saveLocalItem('drafts', draft);
  notifyDraftListeners();

  try {
    await setDoc(doc(db, 'admin_drafts', draft.id), draft, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteAdminDraft = async (draftId: string): Promise<void> => {
  const path = `admin_drafts/${draftId}`;
  removeLocalItem('drafts', draftId);
  notifyDraftListeners();

  try {
    await deleteDoc(doc(db, 'admin_drafts', draftId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// ==========================================
// 9. Official Syllabus & Curriculum Management
// ==========================================
const syllabusListeners = new Set<(items: OfficialSyllabus[]) => void>();
let latestRemoteSyllabus: OfficialSyllabus[] = [];

export function is2026HalfYearlySyllabus(s: {
  academicYear?: string;
  examType?: string;
  examName?: string;
  title?: string;
  id?: string;
}): boolean {
  if (s.academicYear === '২০২৬') {
    if (
      s.examType === 'half_yearly' ||
      s.examName?.includes('অর্ধবার্ষিক') ||
      s.title?.includes('অর্ধবার্ষিক') ||
      s.id?.toLowerCase().includes('half_yearly') ||
      s.id?.toLowerCase().includes('half-yearly')
    ) {
      return true;
    }
  }
  return false;
}

function getSyllabusInitialMerged(): OfficialSyllabus[] {
  let local = getLocalItems<OfficialSyllabus>('syllabuses');
  // Purge any 2026 half-yearly items from localStorage
  const cleanedLocal = local.filter((s) => !is2026HalfYearlySyllabus(s));
  if (cleanedLocal.length !== local.length) {
    setLocalItems('syllabuses', cleanedLocal);
    local = cleanedLocal;
  }

  const map = new Map<string, OfficialSyllabus>();
  // Seed with rich official dataset (excluding 2026 half-yearly)
  OFFICIAL_SYLLABUS_INITIAL_DATA.filter((s) => !is2026HalfYearlySyllabus(s)).forEach((s) => map.set(s.id, s));
  OFFICIAL_BANGLA_SECOND_SYLLABUSES.filter((s) => !is2026HalfYearlySyllabus(s)).forEach((s) => map.set(s.id, s));
  latestRemoteSyllabus.filter((s) => !is2026HalfYearlySyllabus(s)).forEach((s) => map.set(s.id, s));
  local.filter((s) => !is2026HalfYearlySyllabus(s)).forEach((s) => map.set(s.id, s));
  return Array.from(map.values());
}

function notifySyllabusListeners() {
  const merged = getSyllabusInitialMerged();
  syllabusListeners.forEach((cb) => cb(merged));
}

export const listenToOfficialSyllabus = (
  callback: (items: OfficialSyllabus[]) => void
) => {
  syllabusListeners.add(callback);
  callback(getSyllabusInitialMerged());

  return onSnapshot(
    collection(db, 'content_syllabuses'),
    (snapshot) => {
      const items: OfficialSyllabus[] = [];
      snapshot.forEach((snap) => {
        const item = { id: snap.id, ...(snap.data() as any) };
        if (is2026HalfYearlySyllabus(item)) {
          // Asynchronously purge 2026 half-yearly from database
          deleteDoc(doc(db, 'content_syllabuses', snap.id)).catch(() => {});
        } else {
          items.push(item);
        }
      });
      latestRemoteSyllabus = items;
      notifySyllabusListeners();
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'content_syllabuses');
      notifySyllabusListeners();
    }
  );
};

export const saveOfficialSyllabus = async (
  syllabus: OfficialSyllabus
): Promise<void> => {
  if (is2026HalfYearlySyllabus(syllabus)) {
    throw new Error('২০২৬ সালের অর্ধবার্ষিক পরীক্ষা ইতিমধ্যে সমাপ্ত হয়েছে, তাই এই কন্টেন্ট আর প্রযোজ্য নয়।');
  }

  const path = `content_syllabuses/${syllabus.id}`;
  saveLocalItem('syllabuses', syllabus);
  notifySyllabusListeners();

  try {
    await setDoc(doc(db, 'content_syllabuses', syllabus.id), syllabus, {
      merge: true,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteOfficialSyllabus = async (
  syllabusId: string
): Promise<void> => {
  const path = `content_syllabuses/${syllabusId}`;
  removeLocalItem('syllabuses', syllabusId);
  notifySyllabusListeners();

  try {
    await deleteDoc(doc(db, 'content_syllabuses', syllabusId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};

// ==========================================
// 10. Bangla & English Writing Guides (লেখার গাইড)
// ==========================================
const writingListeners = new Set<(items: WritingGuideItem[]) => void>();
let latestRemoteWriting: WritingGuideItem[] = [];

function getWritingInitialMerged(): WritingGuideItem[] {
  let local = getLocalItems<WritingGuideItem>('writing_guides');
  const map = new Map<string, WritingGuideItem>();

  // Seed with initial comprehensive items
  INITIAL_WRITING_GUIDE_DATA.forEach((item) => map.set(item.id, item));
  latestRemoteWriting.forEach((item) => map.set(item.id, item));
  local.forEach((item) => map.set(item.id, item));

  return Array.from(map.values());
}

function notifyWritingListeners() {
  const merged = getWritingInitialMerged();
  writingListeners.forEach((cb) => cb(merged));
}

export const listenToWritingGuides = (
  callback: (items: WritingGuideItem[]) => void
) => {
  writingListeners.add(callback);
  callback(getWritingInitialMerged());

  return onSnapshot(
    collection(db, 'content_writing_guides'),
    (snapshot) => {
      const items: WritingGuideItem[] = [];
      snapshot.forEach((snap) => {
        items.push({ id: snap.id, ...(snap.data() as any) });
      });
      latestRemoteWriting = items;
      notifyWritingListeners();
    },
    (err) => {
      handleFirestoreError(err, OperationType.LIST, 'content_writing_guides');
      notifyWritingListeners();
    }
  );
};

export const saveWritingGuide = async (
  item: WritingGuideItem
): Promise<void> => {
  const path = `content_writing_guides/${item.id}`;
  saveLocalItem('writing_guides', item);
  notifyWritingListeners();

  try {
    await setDoc(doc(db, 'content_writing_guides', item.id), item, {
      merge: true,
    });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
};

export const deleteWritingGuide = async (
  itemId: string
): Promise<void> => {
  const path = `content_writing_guides/${itemId}`;
  removeLocalItem('writing_guides', itemId);
  notifyWritingListeners();

  try {
    await deleteDoc(doc(db, 'content_writing_guides', itemId));
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, path);
  }
};


