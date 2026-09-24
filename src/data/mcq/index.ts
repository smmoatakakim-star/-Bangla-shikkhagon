import { QuizQuestion } from '../../types';
import { class6McqList } from './class6Mcq';
import { class7McqList } from './class7Mcq';
import { class8McqList } from './class8Mcq';
import { class9McqList } from './class9Mcq';
import { class10McqList } from './class10Mcq';

export { class6McqList, class7McqList, class8McqList, class9McqList, class10McqList };

/**
 * 1,060+ Authentic NCTB Curriculum MCQs covering Classes 6, 7, 8, 9, and 10
 */
export const allNctbMcqList: QuizQuestion[] = [
  ...class6McqList,
  ...class7McqList,
  ...class8McqList,
  ...class9McqList,
  ...class10McqList,
];

export const getMcqsByClass = (classId: string): QuizQuestion[] => {
  switch (classId) {
    case 'class-6':
      return class6McqList;
    case 'class-7':
      return class7McqList;
    case 'class-8':
      return class8McqList;
    case 'class-9':
      return class9McqList;
    case 'class-10':
      return class10McqList;
    default:
      return allNctbMcqList.filter(q => q.classId === classId);
  }
};
