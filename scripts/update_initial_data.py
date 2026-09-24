#!/usr/bin/env python3
# -*- coding: utf-8 -*-

with open('src/data/initialData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add curriculum imports if not present
if "from './curriculum'" not in content:
    content = content.replace(
        "import { ALL_CLASSES, ALL_SUBJECTS, ALL_CHAPTERS } from './curriculumData';",
        "import { ALL_CLASSES, ALL_SUBJECTS, ALL_CHAPTERS } from './curriculumData';\nimport { ALL_NCTB_COMPLETE_LESSONS, ALL_NCTB_COMPLETE_QUIZZES } from './curriculum';"
    )

# 2. Replace INITIAL_SUBJECTS array with ALL_SUBJECTS
start_sub = content.find("export const INITIAL_SUBJECTS: SubjectInfo[] = [")
end_sub = content.find("export const INITIAL_CHAPTERS: ChapterInfo[] = [")

if start_sub != -1 and end_sub != -1:
    content = content[:start_sub] + "export const INITIAL_SUBJECTS: SubjectInfo[] = ALL_SUBJECTS;\n\n" + content[end_sub:]

# 3. Replace INITIAL_CHAPTERS array with ALL_CHAPTERS
start_ch = content.find("export const INITIAL_CHAPTERS: ChapterInfo[] = [")
end_ch = content.find("export const INITIAL_LESSONS: Lesson[] = [")

if start_ch != -1 and end_ch != -1:
    content = content[:start_ch] + "export const INITIAL_CHAPTERS: ChapterInfo[] = ALL_CHAPTERS;\n\n" + content[end_ch:]

# 4. Wrap INITIAL_LESSONS
if "RAW_INITIAL_LESSONS" not in content:
    content = content.replace(
        "export const INITIAL_LESSONS: Lesson[] = [",
        "const RAW_INITIAL_LESSONS: Lesson[] = ["
    )
    # Find where RAW_INITIAL_LESSONS ends (before export const INITIAL_QUIZZES)
    quiz_idx = content.find("export const INITIAL_QUIZZES: Quiz[] = [")
    if quiz_idx != -1:
        # Insert before quiz_idx
        lesson_merge = """const RAW_LESSON_CH_IDS = new Set(RAW_INITIAL_LESSONS.map(l => l.chapterId));
export const INITIAL_LESSONS: Lesson[] = [
  ...RAW_INITIAL_LESSONS,
  ...ALL_NCTB_COMPLETE_LESSONS.filter(l => !RAW_LESSON_CH_IDS.has(l.chapterId)),
];

"""
        content = content[:quiz_idx] + lesson_merge + content[quiz_idx:]

# 5. Wrap INITIAL_QUIZZES
if "RAW_INITIAL_QUIZZES" not in content:
    content = content.replace(
        "export const INITIAL_QUIZZES: Quiz[] = [",
        "const RAW_INITIAL_QUIZZES: Quiz[] = ["
    )
    post_idx = content.find("export const INITIAL_POSTS: Post[] = [")
    if post_idx != -1:
        quiz_merge = """const RAW_QUIZ_CH_IDS = new Set(RAW_INITIAL_QUIZZES.map(q => q.chapterId));
export const INITIAL_QUIZZES: Quiz[] = [
  ...RAW_INITIAL_QUIZZES,
  ...ALL_NCTB_COMPLETE_QUIZZES.filter(q => !RAW_QUIZ_CH_IDS.has(q.chapterId)),
];

"""
        content = content[:post_idx] + quiz_merge + content[post_idx:]

with open('src/data/initialData.ts', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated src/data/initialData.ts successfully.")
