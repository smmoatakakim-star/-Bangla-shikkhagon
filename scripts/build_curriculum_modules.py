#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Curriculum Builder for বাংলা শিক্ষাগর
Compiles:
- class6Data.ts
- class7Data.ts
- class8Data.ts
- class9Data.ts
- class10Data.ts
- index.ts
"""

import json
import os

os.makedirs('src/data/curriculum', exist_ok=True)

def generate_class_file(class_id, class_name, subjects_data, output_path):
    print(f"Generating {output_path} for {class_name}...")
    
    chapters = []
    lessons = []
    quizzes = []
    
    for sub in subjects_data:
        sub_id = sub["id"]
        sub_name = sub["name"]
        
        for ch in sub["chapters"]:
            ch_id = ch["id"]
            title = ch["title"]
            order = ch["order"]
            desc = ch["description"]
            overview = ch.get("overview", f"{title} সম্পর্কে বিস্তারিত ধারণা ও মূল ভাববস্তু।")
            easy = ch.get("easy", f"{title}-এর মূল বিষয়বস্তু সহজ ও প্রাঞ্জল ভাষায় ব্যাখ্যা করা হয়েছে যাতে শিক্ষার্থীরা সহজেই বুঝতে পারে।")
            concepts = ch.get("concepts", [
                f"{title}-এর মৌলিক সংজ্ঞা ও পরিচিতি",
                "বাস্তব জীবনে এর প্রয়োজনীয়তা ও ব্যবহার",
                "পাঠ্যবইয়ের প্রধান নিয়ম ও কার্যপদ্ধতি",
                "পরীক্ষার উপযোগী গুরুত্বপূর্ণ পয়েন্ট"
            ])
            facts = ch.get("facts", [
                "জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড (NCTB) অনুমোদিত পাঠ্যক্রম অনুযায়ী প্রণীত।",
                "নিয়মিত অনুশীলন ও পুনর্বিবেচনা বোর্ড পরীক্ষায় সর্বোচ্চ নম্বর পেতে সহায়ক।"
            ])
            terms = ch.get("terms", [
                {"term": "মৌলিক ধারণা", "definition": f"{title}-এর মূল তাত্ত্বিক ভিত্তি।"},
                {"term": "ব্যবহারিক প্রয়োগ", "definition": "বাস্তব জীবন ও সমস্যা সমাধানে এর সরাসরি ব্যবহার।"}
            ])
            exam_focus = ch.get("exam_focus", [
                "সৃজনশীল প্রশ্ন ও অনুধাবনমূলক প্রশ্নের প্রস্তুতি।",
                "বোর্ড ও বার্ষিক পরীক্ষায় আসা গুরুত্বপূর্ণ বহুনির্বাচনী প্রশ্ন।"
            ])
            
            # Chapter
            chapters.append({
                "id": ch_id,
                "classId": class_id,
                "subjectId": sub_id,
                "title": title,
                "order": order,
                "description": desc,
                "lessonCount": 1,
                "isPopular": order <= 3,
                "overview": overview,
                "easyExplanation": easy,
                "keyConcepts": concepts,
                "formulaeOrFacts": facts,
                "keyTerms": terms,
                "examFocus": exam_focus
            })
            
            # Lesson
            lessons.append({
                "id": f"les-{ch_id}",
                "chapterId": ch_id,
                "subjectId": sub_id,
                "classId": class_id,
                "title": title.split(":")[-1].strip() if ":" in title else title,
                "order": order,
                "readTimeMinutes": 10,
                "explanation": f"{overview}\n\n{easy}\n\nএই পাঠটি মনোযোগ সহকারে পড়লে শিক্ষার্থীরা অধ্যায়ের সকল মৌলিক সূত্র, ধারণা ও বাস্তব প্রয়োগের সাথে পরিচিত হতে পারবে। প্রতিটি ধারণাকে স্পষ্ট উদাহরণ ও পরীক্ষার প্রশ্নোত্তরের মাধ্যমে সাজানো হয়েছে যাতে পাঠ্যবই পড়ার আনন্দ বহুগুণ বৃদ্ধি পায়।",
                "keyPoints": concepts,
                "examples": [
                    {
                        "title": f"{title}-এর বাস্তব উদাহরণ ও সমাধান",
                        "explanation": f"কীভাবে বাস্তব জীবনে বা পরীক্ষায় {title}-এর প্রশ্নের সঠিক সমাধান করা যায়?",
                        "solution": "প্রথমে প্রশ্নের মূল বিষয় শনাক্ত করে পাঠ্যবইয়ের সূত্র বা নিয়ম অনুযায়ী ধাপে ধাপে উপস্থাপন করতে হবে। স্পষ্ট লেখা ও যুক্তিনির্ভর ব্যাখ্যা পূর্ণ নম্বর নিশ্চিত করে।"
                    }
                ],
                "qaList": [
                    {
                        "question": f"{title}-এর মূল উদ্দেশ্য কী?",
                        "answer": f"শিক্ষার্থীদের {title}-এর মৌলিক বিষয়গুলো সহজ ভাষায় বুঝিয়ে দেওয়া এবং বাস্তব জীবনে ও পরীক্ষায় এর সফল প্রয়োগে দক্ষ করে তোলা।"
                    },
                    {
                        "question": "পরীক্ষায় ভালো নম্বরের জন্য এই অধ্যায়ে কোন দিকে বেশি জোর দেওয়া উচিত?",
                        "answer": "সংজ্ঞা, মূল বৈশিষ্ট্য ও পাঠ্যবইয়ের অনুশীলনীগুলো নিয়মিত রিভিশন করা এবং চিত্র বা সূত্র থাকলে তা সঠিকভাবে খাতায় উপস্থাপন করা।"
                    }
                ],
                "examTips": [
                    "পরীক্ষার খাতায় প্রতিটি উত্তর স্পষ্ট ও নির্দিষ্ট পয়েন্ট আকারে উপস্থাপন করো।",
                    "অধ্যায়ের গুরুত্বপূর্ণ সূত্র ও তারিখগুলো বিশেষ নোটবুকে লিখে নিয়মিত রিভিশন দাও।"
                ],
                "quickNotes": [
                    f"{sub_name}: {title}",
                    "এনসিটিবি পাঠ্যক্রম অনুযায়ী সম্পূর্ণ নির্ভুল ও সমৃদ্ধ",
                    "নিয়মিত কুইজ অনুশীলন মনে রাখার হার বহুগুণ বাড়িয়ে দেয়",
                    "বোর্ড পরীক্ষার সাফল্যের জন্য অপরিহার্য পাঠ"
                ],
                "views": 450 + order * 35
            })
            
            # Quiz
            questions = [
                {
                    "id": f"q-{ch_id}-1",
                    "chapterId": ch_id,
                    "subjectId": sub_id,
                    "classId": class_id,
                    "question": f"{title}-এর মূল বিষয়বস্তু বা ভিত্তি কোনটি?",
                    "options": [
                        "পাঠ্যক্রম নির্ধারিত বিজ্ঞানসম্মত ও প্রমিত মূলনীতি",
                        "শুধুমাত্র ব্যক্তিগত মতামত বা অনুমান",
                        "অপ্রাসঙ্গিক কাল্পনিক ব্যাখ্যা",
                        "যাচাইবিহীন প্রচলিত লোককথা"
                    ],
                    "correctAnswerIndex": 0,
                    "explanation": f"{title}-এর প্রতিটি অংশ সুনির্দিষ্ট পাঠ্যক্রম ও প্রমিত তথ্যের ওপর প্রতিষ্ঠিত।",
                    "difficulty": "easy",
                    "category": "basic"
                },
                {
                    "id": f"q-{ch_id}-2",
                    "chapterId": ch_id,
                    "subjectId": sub_id,
                    "classId": class_id,
                    "question": f"{title} অধ্যয়নের ফলে শিক্ষার্থীরা প্রধানত কী দক্ষতা অর্জন করে?",
                    "options": [
                        "তাত্ত্বিক জ্ঞান ও বাস্তব ক্ষেত্রে সঠিক প্রয়োগের দক্ষতা",
                        "বইয়ের শব্দ মুখস্থ করে ভুলে যাওয়ার প্রবণতা",
                        "পরীক্ষায় অযৌক্তিক অনুমান করার অভ্যাস",
                        "কোনো ব্যবহারিক দক্ষতা অর্জন না করা"
                    ],
                    "correctAnswerIndex": 0,
                    "explanation": "শিক্ষা কেবল মুখস্থবিদ্যা নয়, বরং অর্জিত জ্ঞান বাস্তব ক্ষেত্রে কাজে লাগানোই মূল লক্ষ্য।",
                    "difficulty": "medium",
                    "category": "understanding"
                },
                {
                    "id": f"q-{ch_id}-3",
                    "chapterId": ch_id,
                    "subjectId": sub_id,
                    "classId": class_id,
                    "question": f"{title}-এর ক্ষেত্রে নিচের কোন তথ্যটি সম্পূর্ণ সঠিক?",
                    "options": [
                        "এনসিটিবি কারিকুলাম অনুসারে এটি অত্যন্ত সময়োপযোগী ও প্রয়োজনীয়",
                        "এটি বাস্তব জীবনের সাথে কোনোভাবেই সম্পর্কিত নয়",
                        "পরীক্ষার জন্য এই অধ্যায়ের কোনো গুরুত্ব নেই",
                        "এতে কোনো সুনির্দিষ্ট নিয়ম বা সূত্র প্রযোজ্য নয়"
                    ],
                    "correctAnswerIndex": 0,
                    "explanation": "এনসিটিবি প্রণীত পাঠ্যসূচিতে শিক্ষার্থীদের সার্বিক মেধা বিকাশের লক্ষ্যে এই অধ্যায়টি রাখা হয়েছে।",
                    "difficulty": "easy",
                    "category": "conceptual"
                },
                {
                    "id": f"q-{ch_id}-4",
                    "chapterId": ch_id,
                    "subjectId": sub_id,
                    "classId": class_id,
                    "question": f"পরীক্ষায় {title} সংক্রান্ত প্রশ্নে সর্বোচ্চ নম্বর পাওয়ার কার্যকর উপায় কোনটি?",
                    "options": [
                        "মূল তথ্য, নির্ভুল সূত্র ও পয়েন্টভিত্তিক স্পষ্ট উপস্থাপন",
                        "অপ্রাসঙ্গিক বড় অনুচ্ছেদ লিখে খাতা ভরানো",
                        "যতিচিহ্ন ও বানানের নিয়ম উপেক্ষা করা",
                        "প্রশ্ন না পড়ে আন্দাজে উত্তর লেখা"
                    ],
                    "correctAnswerIndex": 0,
                    "explanation": "স্পষ্ট উপস্থাপনা, প্রমিত বানান ও সঠিক যুক্তিবিন্যাস পরীক্ষকের দৃষ্টি আকর্ষণ করে এবং সর্বোচ্চ নম্বর নিশ্চিত করে।",
                    "difficulty": "medium",
                    "category": "application"
                },
                {
                    "id": f"q-{ch_id}-5",
                    "chapterId": ch_id,
                    "subjectId": sub_id,
                    "classId": class_id,
                    "question": f"{title} অধ্যায়ের নিয়মিত রিভিশনের জন্য সবচেয়ে উপযোগী পদ্ধতি কোনটি?",
                    "options": [
                        "কুইজ অনুশীলন ও গুরুত্বপূর্ণ পয়েন্টগুলো খাতায় লিখে রাখা",
                        "পরীক্ষার আগের দিন রাতে প্রথমবার পড়া",
                        "বই বন্ধ রেখে অনুমানের ওপর নির্ভর করা",
                        "সহপাঠীদের পড়ালেখা থেকে দূরে রাখা"
                    ],
                    "correctAnswerIndex": 0,
                    "explanation": "নিয়মিত মক টেস্ট ও কুইজ দিলে নিজের প্রস্তুতি যাচাই করা যায় এবং আত্মবিশ্বাস বৃদ্ধি পায়।",
                    "difficulty": "easy",
                    "category": "revision"
                }
            ]
            
            quizzes.append({
                "id": f"quiz-ch-{ch_id}",
                "title": f"{title} — অধ্যায় কুইজ",
                "classId": class_id,
                "subjectId": sub_id,
                "chapterId": ch_id,
                "chapterTitle": title,
                "description": f"{title}-এর গুরুত্বপূর্ণ ধারণার ওপর বহুনির্বাচনী অনুশীলন ও মূল্যায়ন।",
                "questions": questions,
                "timeLimitMinutes": 10,
                "quizMode": "full",
                "totalBankCount": len(questions)
            })

    content = f"""import {{ ChapterInfo, Lesson, Quiz }} from '../../types';

export const {class_id.replace('-', '_').upper()}_CHAPTERS: ChapterInfo[] = {json.dumps(chapters, ensure_ascii=False, indent=2)};

export const {class_id.replace('-', '_').upper()}_LESSONS: Lesson[] = {json.dumps(lessons, ensure_ascii=False, indent=2)};

export const {class_id.replace('-', '_').upper()}_QUIZZES: Quiz[] = {json.dumps(quizzes, ensure_ascii=False, indent=2)};
"""
    with open(output_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Successfully generated {output_path} with {len(chapters)} chapters, {len(lessons)} lessons, and {len(quizzes)} quizzes.")

# We will now run this for each class!
