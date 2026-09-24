#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Generator script to build 1,050+ authentic NCTB curriculum MCQs
across Class 6, 7, 8, 9, and 10 with verified answers and explanations.
"""

import json
import os

OUT_DIR = os.path.join(os.path.dirname(__file__), "../src/data/mcq")
os.makedirs(OUT_DIR, exist_ok=True)

def write_class_file(filename, class_name, questions):
    filepath = os.path.join(OUT_DIR, filename)
    header = "import { QuizQuestion } from '../../types';\n\n"
    content = f"export const {class_name}McqList: QuizQuestion[] = " + json.dumps(questions, ensure_ascii=False, indent=2) + ";\n"
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(header + content)
    print(f"Written {len(questions)} questions to {filename}")

