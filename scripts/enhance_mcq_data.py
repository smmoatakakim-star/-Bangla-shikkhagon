#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Script to sanitize and distribute options in SSC and HSC quizzes.
Eliminates all placeholder distractors, restores truncated options,
and balances the correct answers across 0, 1, 2, 3 ('ক', 'খ', 'গ', 'ঘ').
"""

import json
import hashlib
import re

SUBJECT_DISTRACTORS = {
    'physics': [
        'বল ও ভরবেগের সংরক্ষণশীলতা নীতি',
        'অভিকর্ষজ ত্বরণ ও মুক্ত পতন গতি',
        'তড়িৎ ক্ষেত্র ও বিভব পার্থক্য',
        'আলোর পূর্ণ অভ্যন্তরীণ প্রতিফলন ও সংকট কোণ',
        'তাপগতিবিদ্যার প্রথম ও দ্বিতীয় সূত্র',
        'তরঙ্গদৈর্ঘ্য ও কম্পাঙ্কের ব্যস্তানুপাতিক সম্পর্ক',
        'পর্যায়কাল ও সরল ছন্দিত স্পন্দন',
        'ওহমের সূত্র ও বর্তনীর তুল্যরোধ',
        'নিউক্লীয় বিভাজন ও তেজস্ক্রিয় ক্ষয়',
        'জড়তার ভ্রামক ও কৌণিক ভরবেগ',
        'স্থির তড়িৎ আবেশ ও কুলম্বের সূত্র',
        'আলোক তড়িৎ ক্রিয়া ও ফোটনের শক্তি',
        'গতিশক্তি ও বিভব শক্তির রূপান্তর',
        'সান্দ্রতা গুণাঙ্ক ও সান্দ্র বল'
    ],
    'chemistry': [
        'অরবিটাল সংকরায়ণ ও সমযোজী বন্ধন',
        'ইলেকট্রন আসক্তি ও পর্যায়বৃত্ত ধর্ম',
        'লা-শাতেলিয়ারের সাম্যাবস্থা নীতি',
        'জারণ-বিজারণ ও ইলেকট্রন স্থানান্তর',
        'আদর্শ গ্যাস সমীকরণ (PV = nRT)',
        'আয়নিক ল্যাটিস ও উচ্চ গলনাঙ্ক',
        'অম্ল ও ক্ষারকের ব্রনস্টেড-লাউরি মতবাদ',
        'হাইড্রোকার্বনের ইলেক্ট্রনাকর্ষী প্রতিস্থাপন',
        'ফ্যারাডের তড়িৎ বিশ্লেষণ সূত্র',
        'মোলার দ্রবণ ও এসিড-ক্ষার টাইট্রেশন',
        'ক্ষার ধাতু ও হ্যালোজেন গ্রুপের সক্রিয়তা',
        'পরমাণুর বোর মডেল ও কোয়ান্টাম সংখ্যা',
        'বাফার দ্রবণের pH নিয়ন্ত্রণ ক্ষমতা',
        'রাসায়নিক গতিবিদ্যা ও সক্রিয়ণ শক্তি'
    ],
    'biology': [
        'মাইটোকন্ড্রিয়া ও এটিপি (ATP) সংশ্লেষণ',
        'ডিএনএ প্রতিলিপন ও প্রোটিন সংশ্লেষণ',
        'মায়োসিস বিভাজনে ক্রসিং ওভার ও জিন বিনিময়',
        'জাইলেম ও ফ্লোয়েমের পরিবহন ব্যবস্থা',
        'হৃদপিণ্ডের অলিন্দ-নিলয় সংকোচন ও রক্তসংবহন',
        'নেফ্রনের গ্লোমেরুলার ফিল্ট্রেশন প্রক্রিয়া',
        'সালোকসংশ্লেষণের আলোক ও অন্ধকার পর্যায়',
        'অক্সিন ও জিবেরেলিন হরমোনের প্রভাব',
        'বাস্তুতন্ত্রের ট্রফিক লেভেল ও শক্তি প্রবাহ',
        'মেন্ডেলের বংশগতির মৌলিক সূত্রাবলি',
        'ব্যাকটেরিয়া ও ভাইরাসের গঠনগত পার্থক্য',
        'উদ্ভিদের প্রস্বেদন ও বাষ্পমোচন প্রক্রিয়া',
        'মানবদেহের অ্যান্টিবডি ও অনাক্রম্যতা',
        'জীববৈচিত্র্য সংরক্ষণ ও জিনব্যাংক'
    ],
    'math': [
        'দ্বিপদী বিস্তৃতি ও পদসংখ্যা নির্ণয়',
        'পিথাগোরাসের জ্যামিতিক উপপাদ্য',
        'স্থানাঙ্ক জ্যামিতির সরলরেখার সমীকরণ',
        'ত্রিকোণমিতিক অভেদাবলী ও মান নির্ণয়',
        'লগারিদম ও সূচকের মৌলিক নিয়মাবলি',
        'ম্যাট্রিক্সের গুণন ও নির্ণায়কের মান',
        'ফাংশনের ডোমেন ও রেঞ্জ নির্ধারণ',
        'সসীম ধারার পদসংখ্যা ও সমষ্টি নির্ণয়',
        'সম্ভাবনা ও দৈব পরীক্ষার ফলাফল',
        'বৃত্তের স্পর্শক ও জ্যা সংক্রান্ত ধর্ম',
        'উৎপাদকে বিশ্লেষণ ও দ্বিঘাত সমীকরণ',
        'পরিমিতির ক্ষেত্রফল ও ঘনফল হিসাব'
    ],
    'higher_math': [
        'ম্যাট্রিক্সের গুণন ও বিপরীত ম্যাট্রিক্স',
        'অন্তরীকরণ ও পরিবর্তনের তাৎক্ষণিক হার',
        'সমাকলন ও আবদ্ধ বক্ররেখার ক্ষেত্রফল',
        'সমতলীয় ভেক্টরের ডট ও ক্রস গুণন',
        'দ্বিপদী উপপাদ্য ও সাধারণ পদ নির্ণয়',
        'স্থানাঙ্ক জ্যামিতির সরলরেখার ঢাল ও কোণ',
        'ত্রিকোণমিতিক বিপরীত বৃত্তীয় ফাংশন',
        'কনিক্স (পরাবৃত্ত, উপবৃত্ত ও অধিবৃত্ত)',
        'সম্ভাবনা বিন্যাস ও শর্তাধীন সম্ভাবনা',
        'বিন্যাস ও সমাবেশ সংক্রান্ত গণনা'
    ],
    'bangla': [
        'রবীন্দ্রনাথ ঠাকুরের সাহিত্য ও ছোটগল্পের মানবতাবোধ',
        'কাজী নজরুল ইসলামের সাম্যবাদী ও বিদ্রোহী দর্শন',
        'তৎপুরুষ ও বহুব্রীহি সমাসের ব্যাকরণিক পার্থক্য',
        'স্বরধ্বনি ও ব্যঞ্জনধ্বনির প্রমিত উচ্চারণরীতি',
        'সাধু ও চলিত ভাষারীতিতে ব্যাকরণিক পরিবর্তন',
        'মাইকেল মধুসূদন দত্তের অমিত্রাক্ষর ছন্দ',
        'বঙ্কিমচন্দ্র চট্টোপাধ্যায়ের ঐতিহাসিক উপন্যাস',
        'কৃৎ-প্রত্যয় ও তদ্ধিত-প্রত্যয়যোগে শব্দগঠন',
        'যতিচিহ্ন ও বাক্য রূপান্তরের নিয়মাবলি',
        'উপমা, রূপক ও উৎপ্রেক্ষা অলংকার'
    ],
    'english': [
        'Subject-Verb Agreement Rules and Applications',
        'Past Perfect and Continuous Tense Formations',
        'Appropriate Prepositions and Idiomatic Usages',
        'Complex to Simple Sentence Transformation',
        'Passive Voice Transformation with Modals',
        'Direct to Indirect Speech Sequence Shifts',
        'Relative Pronouns and Subordinate Clauses',
        'Conditional Sentence Structures (Type 1, 2, 3)',
        'Contextual Synonyms and Antonyms',
        'Cohesive Devices and Discourse Markers'
    ],
    'ict': [
        'বাইনারি, অকটাল ও হেক্সাডেসিমেল রূপান্তর',
        'মৌলিক ও সার্বজনীন লজিক গেটের কার্যাবলি',
        'HTML ট্যাগ ও CSS দিয়ে ওয়েব পেজ ডিজাইন',
        'IPv4 ও IPv6 নেটওয়ার্ক আইপি অ্যাড্রেসিং',
        'রিলেশনাল ডাটাবেজ ম্যানেজমেন্ট সিস্টেম (RDBMS)',
        'ক্রিপ্টোগ্রাফিক এনক্রিপশন ও পাসওয়ার্ড নিরাপত্তা',
        'ক্লাউড কম্পিউটিং ও ক্লাউড স্টোরেজ আর্কিটেকচার',
        'সি প্রোগ্রামিং ভাষার লুপ, কন্ডিশন ও ফাংশন',
        'অপটিক্যাল ফাইবার ও মাইক্রোওয়েভ কমিউনিকেশন',
        'কৃত্রিম বুদ্ধিমত্তা ও মেশিন লার্নিং প্রযুক্তি'
    ],
    'bgs': [
        '১৯৫২ সালের ঐতিহাসিক ভাষা আন্দোলন ও তাৎপর্য',
        '১৯৬৬ সালের ঐতিহাসিক ৬ দফা দাবি পেশ',
        '১৯৭১ সালের মুক্তিযুদ্ধ ও মুজিবনগর সরকার',
        'গণপ্রজাতন্ত্রী বাংলাদেশের সংবিধান ও মূলনীতি',
        'আইনের শাসন, ন্যায়বিচার ও মৌলিক অধিকার',
        'জাতিসংঘের নিরাপত্তা পরিষদ ও আন্তর্জাতিক শান্তি',
        'জাতীয় সংসদের আইন প্রণয়ন ও গণতান্ত্রিক ব্যবস্থা',
        'বিচার বিভাগের স্বাধীনতা ও সংবিধানের অভিভাবকত্ব',
        'বাংলাদেশের প্রাকৃতিক সম্পদ ও পরিবেশ সংরক্ষণ'
    ],
    'accounting': [
        'দুতরফা দাখিলা পদ্ধতির মৌলিক নিয়মাবলি',
        'রেওয়ামিলের ডেবিট ও ক্রেডিট উদ্বৃত্তের সমতা',
        'আর্থিক অবস্থার বিবরণী ও নিট মুনাফা পরিমাপ',
        'স্থায়ী সম্পদের অবচয় ধার্যের সরলরৈখিক পদ্ধতি',
        'অংশীদারি কারবারের লাভ-লোকসান আবন্টন',
        'ব্যাংক সমন্বয় বিবরণী তৈরির সঠিক কৌশল',
        'চলতি সম্পদ ও চলতি দায়ের কার্যকরী মূলধন অনুপাত',
        'বিক্রিত পণ্যের ব্যয় ও মোট লাভের অনুপাত',
        'একতরফা দাখিলা পদ্ধতি থেকে লাভ-ক্ষতি নির্ণয়'
    ],
    'finance': [
        'অর্থের বর্তমান মূল্য ও বাট্টাকরণ প্রক্রিয়া',
        'বাণিজ্যিক ব্যাংকের ঋণ আমানত সৃষ্টির কৌশল',
        'ঝুঁকি ও প্রত্যাশিত আয়ের হার পরিমাপ',
        'মূলধনি বাজেট প্রণয়ন ও পে-ব্যাক সময়',
        'কেন্দ্রীয় ব্যাংকের মুদ্রানীতি ও নিকাশঘর ব্যবস্থা',
        'জীবন বিমা ও সাধারণ বিমার মৌলিক চুক্তি',
        'হস্তান্তরযোগ্য দলিল আইন ও চেকের প্রকারভেদ',
        'তারল্য ও মুনাফার মধ্যে পারস্পরিক ভারসাম্য'
    ],
    'economics': [
        'চাহিদা ও যোগানের পারস্পরিক ভারসাম্য দাম',
        'উৎপাদন সম্ভাবনা রেখা (Production Possibility Frontier)',
        'জাতীয় আয় পরিমাপের আয় ও ব্যয় পদ্ধতি',
        'মুদ্রাস্ফীতি নিয়ন্ত্রণ ও সরকারের রাজস্ব নীতি',
        'ক্রমহ্রাসমান প্রান্তিক উপযোগ বিধির প্রায়োগিক ব্যাখ্যা',
        'একচেটিয়া ও পূর্ণ প্রতিযোগিতামূলক বাজার কাঠামো',
        'মাথাপিছু আয় ও অর্থনৈতিক প্রবৃদ্ধির সূচক',
        'কেন্দ্রীয় ব্যাংকের খোলাবাজার কার্যক্রম ও ঋণ নিয়ন্ত্রণ'
    ],
    'civics': [
        'গণতান্ত্রিক রাষ্ট্রব্যবস্থা ও নাগরিক অধিকার',
        'সুশাসন প্রতিষ্ঠার প্রধান উপাদান ও স্বচ্ছতা',
        'আইনের শাসন ও ন্যায়বিচার প্রতিষ্ঠা',
        'স্থানীয় সরকার কাঠামোর স্তর ও কার্যাবলি',
        'আন্তর্জাতিক আইন ও মানবাধিকার সনদ',
        'রাজনৈতিক দল ও জনমত গঠনের মাধ্যম'
    ],
    'business_org': [
        'একমালিকানা ও অংশীদারি ব্যবসায়ের সুবিধা-অসুবিধা',
        'যৌথ মূলধনী কোম্পানির স্মারকলিপি ও পরিমেল নিয়মাবলি',
        'ব্যবস্থাপনার হেনরি ফেয়ল প্রদত্ত ১৪টি মূলনীতি',
        'কর্মীসংস্থান ও প্রেষণা তত্ত্বের বাস্তব প্রয়োগ',
        'ব্যবসায়িক ঝুঁকি ও সামাজিক দায়বদ্ধতা (CSR)',
        'নেতৃত্বের শৈলী ও সমন্বিত সিদ্ধান্ত গ্রহণ'
    ]
}

DUMMY_PATTERNS = [
    'ব্যক্তিগত মতামত', 'কাল্পনিক', 'প্রচলিত লোককথা', 'মুখস্থ করে', 'অযৌক্তিক',
    'কোনো ব্যবহারিক', 'খাতা ভরানো', 'আন্দাজে', 'বহির্ভূত', 'ভিত্তি নেই',
    'সীমিত কিছু ক্ষেত্রে', 'পৃষ্ঠাসংখ্যা বাড়ানো', 'বিভ্রান্তিতে ফেলা',
    'জটিলতা তৈরি করা', 'পরীক্ষার আগের দিন', 'চিত্র অনুশীলন না করা',
    'কুইজ দিয়ে পড়াশোনা শেষ করা', 'পর্যাপ্ত তথ্য বিশ্লেষণ', 'তাত্ত্বিক পর্যবেক্ষণ',
    'পরীক্ষামূলক প্রমাণ', 'প্রথম বিকল্প সিদ্ধান্ত', 'দ্বিতীয় নিয়ামক উপাদান',
    'তৃতীয় তুলনামূলক বিশ্লেষণ', 'চতুর্থ সার্বিক সিদ্ধান্ত', 'ভুল উত্তর',
    'অপ্রাসঙ্গিক', 'তত্ত্ববহির্ভূত', 'আংশিক অসত্য'
]

def is_dummy(opt: str) -> bool:
    if opt.endswith('...'):
        return True
    return any(p in opt for p in DUMMY_PATTERNS)

def get_subject_pool(subject_id: str):
    sub = (subject_id or 'physics').lower()
    for key in ['higher_math', 'math', 'physics', 'chemistry', 'biology', 'bangla', 'english', 'ict', 'bgs', 'accounting', 'finance', 'economics', 'civics', 'business_org']:
        if key in sub:
            return SUBJECT_DISTRACTORS[key]
    return SUBJECT_DISTRACTORS['physics']

def deterministic_index(qid: str) -> int:
    h = int(hashlib.md5(qid.encode('utf-8')).hexdigest(), 16)
    return h % 4

def sanitize_and_balance_quiz_question(q: dict) -> dict:
    options = list(q.get('options', []))
    old_correct_idx = q.get('correctAnswerIndex', 0)
    explanation = q.get('explanation', '')
    qid = q.get('id', 'q-0')
    subject_id = q.get('subjectId', '')

    # 1. Determine the authentic correct option text
    # Often option 0 had the correct text, but if it ends with "...", explanation has the full text
    correct_text = options[old_correct_idx] if old_correct_idx < len(options) else (options[0] if options else 'সঠিক উত্তর')
    
    if correct_text.endswith('...') and 'সঠিক উত্তর:' in explanation:
        # Extract full correct text from explanation
        extracted = explanation.split('সঠিক উত্তর:')[1].strip()
        # strip trailing period if present
        if extracted.endswith('।'):
            extracted = extracted[:-1].strip()
        if len(extracted) > 5:
            correct_text = extracted

    # 2. Prepare distractors
    pool = get_subject_pool(subject_id)
    # Filter pool items not equal to correct_text
    available_alts = [item for item in pool if item != correct_text]

    # Collect existing valid options (excluding the correct answer and dummy options)
    valid_existing = []
    for idx, opt in enumerate(options):
        if idx == old_correct_idx:
            continue
        if not is_dummy(opt) and opt != correct_text and opt not in valid_existing:
            valid_existing.append(opt)

    # Fill up to 3 distractors
    distractors = list(valid_existing)
    alt_idx = 0
    # Seed alternate selection deterministically from qid
    seed_num = int(hashlib.sha256(qid.encode('utf-8')).hexdigest(), 16)
    while len(distractors) < 3:
        candidate = available_alts[(seed_num + alt_idx) % len(available_alts)]
        if candidate not in distractors and candidate != correct_text:
            distractors.append(candidate)
        alt_idx += 1

    # Now we have exactly 3 distractors
    distractors = distractors[:3]

    # 3. Deterministically choose slot for correct answer (0, 1, 2, or 3)
    target_idx = deterministic_index(qid)

    # Build the final 4 options
    final_options = []
    d_pointer = 0
    for i in range(4):
        if i == target_idx:
            final_options.append(correct_text)
        else:
            final_options.append(distractors[d_pointer])
            d_pointer += 1

    # 4. Format explanation clearly
    final_explanation = explanation
    if not final_explanation or 'সঠিক উত্তর:' not in final_explanation:
        final_explanation = f"সঠিক উত্তর: {correct_text}। এনসিটিবি পাঠ্যক্রমের প্রাসঙ্গিক অধ্যায়ের আলোকে এটি যথাযথ।"

    return {
        **q,
        'options': final_options,
        'correctAnswerIndex': target_idx,
        'explanation': final_explanation
    }

def process_file(file_path: str, quiz_var_name: str):
    print(f"Processing {file_path} for {quiz_var_name}...")
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    split_token = f"export const {quiz_var_name}: Quiz[] = "
    split_idx = content.find(split_token)
    if split_idx == -1:
        print(f"Error: Token {split_token} not found in {file_path}")
        return

    prefix = content[:split_idx + len(split_token)]
    json_str = content[split_idx + len(split_token):].strip()
    if json_str.endswith(';'):
        json_str = json_str[:-1].strip()

    quizzes = json.loads(json_str)
    print(f"Loaded {len(quizzes)} quizzes.")

    distribution = [0, 0, 0, 0]
    total_q = 0

    for qz in quizzes:
        new_questions = []
        for q in qz.get('questions', []):
            sanitized = sanitize_and_balance_quiz_question(q)
            new_questions.append(sanitized)
            distribution[sanitized['correctAnswerIndex']] += 1
            total_q += 1
        qz['questions'] = new_questions

    print(f"Processed {total_q} questions. Distribution [ক, খ, গ, ঘ]: {distribution}")

    # Re-serialize
    new_json = json.dumps(quizzes, ensure_ascii=False, indent=2)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(prefix + new_json + ';\n')

    print(f"Saved {file_path} successfully.\n")

if __name__ == '__main__':
    process_file('src/data/curriculum/sscLessonsQuizzes.ts', 'SSC_QUIZZES')
    process_file('src/data/curriculum/hscLessonsQuizzes.ts', 'HSC_QUIZZES')
