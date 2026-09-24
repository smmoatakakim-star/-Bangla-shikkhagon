#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Full NCTB MCQ Database Builder
Generates 1,060+ distinct, authentic NCTB curriculum questions
covering Class 6 to 10 across Bangla, English, Math, Science, Physics,
Chemistry, Biology, Higher Math, BGS, and ICT.
"""

import os
import json

OUT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), "../src/data/mcq"))
os.makedirs(OUT_DIR, exist_ok=True)

print("Target output dir:", OUT_DIR)
