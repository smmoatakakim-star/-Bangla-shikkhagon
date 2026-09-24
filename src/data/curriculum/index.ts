import { ChapterInfo, Lesson, Quiz } from '../../types';
import { CLASS_6_CHAPTERS, CLASS_6_LESSONS, CLASS_6_QUIZZES } from './class6Data';
import { CLASS_7_CHAPTERS, CLASS_7_LESSONS, CLASS_7_QUIZZES } from './class7Data';
import { CLASS_8_CHAPTERS, CLASS_8_LESSONS, CLASS_8_QUIZZES } from './class8Data';
import { CLASS_9_CHAPTERS, CLASS_9_LESSONS, CLASS_9_QUIZZES } from './class9Data';
import { CLASS_10_CHAPTERS, CLASS_10_LESSONS, CLASS_10_QUIZZES } from './class10Data';
import { SUPPLEMENTAL_LESSONS, SUPPLEMENTAL_QUIZZES } from './supplementalData';
import { SSC_CHAPTERS } from './sscChapters';
import { HSC_CHAPTERS } from './hscChapters';
import { SSC_LESSONS, SSC_QUIZZES } from './sscLessonsQuizzes';
import { HSC_LESSONS, HSC_QUIZZES } from './hscLessonsQuizzes';

export const ALL_NCTB_COMPLETE_CHAPTERS: ChapterInfo[] = [
  ...CLASS_6_CHAPTERS,
  ...CLASS_7_CHAPTERS,
  ...CLASS_8_CHAPTERS,
  ...CLASS_9_CHAPTERS,
  ...CLASS_10_CHAPTERS,
  ...SSC_CHAPTERS,
  ...HSC_CHAPTERS,
];

export const ALL_NCTB_COMPLETE_LESSONS: Lesson[] = [
  ...CLASS_6_LESSONS,
  ...CLASS_7_LESSONS,
  ...CLASS_8_LESSONS,
  ...CLASS_9_LESSONS,
  ...CLASS_10_LESSONS,
  ...SUPPLEMENTAL_LESSONS,
  ...SSC_LESSONS,
  ...HSC_LESSONS,
];

export const ALL_NCTB_COMPLETE_QUIZZES: Quiz[] = [
  ...CLASS_6_QUIZZES,
  ...CLASS_7_QUIZZES,
  ...CLASS_8_QUIZZES,
  ...CLASS_9_QUIZZES,
  ...CLASS_10_QUIZZES,
  ...SUPPLEMENTAL_QUIZZES,
  ...SSC_QUIZZES,
  ...HSC_QUIZZES,
];

export { SSC_CHAPTERS, HSC_CHAPTERS, SSC_LESSONS, SSC_QUIZZES, HSC_LESSONS, HSC_QUIZZES };

