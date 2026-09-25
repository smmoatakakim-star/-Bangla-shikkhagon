import express from 'express';
import path from 'path';
import fs from 'fs';
import multer from 'multer';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { exec } from 'child_process';
import { promisify } from 'util';
import { createServer as createViteServer } from 'vite';

const execAsync = promisify(exec);

dotenv.config();

const app = express();
const PORT = 3000;

app.use(cookieParser());

// Ensure uploads folder exists
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Serve uploaded files statically
app.use('/uploads', express.static(uploadsDir));

app.use(express.json({ limit: '25mb' }));
app.use(express.urlencoded({ extended: true, limit: '25mb' }));

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname) || '';
    const safeName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, '_')
      .replace(ext, '')
      .slice(0, 30);
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    cb(null, `${safeName || 'media'}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 80 * 1024 * 1024, // 80MB max limit
  },
  fileFilter: (_req, file, cb) => {
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/webp',
      'image/gif',
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-matroska',
      'video/3gpp',
    ];
    if (allowedMimes.includes(file.mimetype.toLowerCase())) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE'));
    }
  },
});

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiAI(): GoogleGenAI | null {
  const apiKey =
    process.env.GEMINI_API_KEY || process.env.API_KEY || process.env.GOOGLE_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Timeout helper to ensure resilient AI responses without hanging
function withTimeout<T>(promise: Promise<T>, timeoutMs: number = 30000): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout after ${timeoutMs}ms`)), timeoutMs)
    ),
  ]);
}

// Multi-model resilient caller for Gemini API
async function callGeminiGenerate(params: {
  contents: any;
  systemInstruction?: string;
  config?: any;
  hasImage?: boolean;
}): Promise<{ text: string; model: string }> {
  const ai = getGeminiAI();
  if (!ai) {
    throw new Error('NO_API_KEY');
  }

  // Model cascade:
  // For images/vision: 'gemini-3.5-flash', 'gemini-3.8-flash'
  // For text: 'gemini-3.1-flash-lite' is fast & highly available, then fallback to 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-lite-latest'
  const modelCandidates = params.hasImage
    ? ['gemini-3.5-flash', 'gemini-3.8-flash']
    : ['gemini-3.1-flash-lite', 'gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-lite-latest'];

  let lastError: any = null;
  for (const model of modelCandidates) {
    try {
      const response = await withTimeout(
        ai.models.generateContent({
          model,
          contents: params.contents,
          config: {
            ...(params.systemInstruction ? { systemInstruction: params.systemInstruction } : {}),
            ...(params.config || {}),
          },
        }),
        30000
      );
      if (response && response.text) {
        return { text: response.text, model };
      }
    } catch (err: any) {
      console.warn(`[AI Engine] Model ${model} encountered issue, trying fallback:`, err?.status || err?.message || err);
      lastError = err;
    }
  }

  throw lastError || new Error('ALL_MODELS_FAILED');
}

// Comprehensive offline fallback generator for educational curriculum
function generateEducationalFallback(
  userQuery: string,
  context?: {
    classId?: string;
    subjectId?: string;
    chapterTitle?: string;
    mode?: string;
  }
): string {
  const q = userQuery.toLowerCase();
  const className = context?.classId ? context.classId.replace('class-', '') + 'ম শ্রেণি' : 'স্কুল পাঠ্যক্রম';
  const subjectName = context?.subjectId || 'সাধারণ বিষয়';
  const chapter = context?.chapterTitle || '';

  // Specific educational responses in Bengali
  if (q.includes('সালোকসংশ্লেষণ') || q.includes('photosynthesis')) {
    return `### 🌱 সালোকসংশ্লেষণ (Photosynthesis) — সহজ ব্যাখ্যা ও মূল বিষয়\n\n` +
      `**১. সংজ্ঞা:**\n` +
      `যে জৈব-রাসায়নিক প্রক্রিয়ায় সবুজ উদ্ভিদ সূর্যালোকের উপস্থিতিতে, ক্লোরোফিলের সহায়তায়, পরিবেশ থেকে গৃহীত কার্বন ডাই-অক্সাইড ($CO_2$) এবং মাটি থেকে শোষিত পানির ($H_2O$) রাসায়নিক বিক্রিয়ায় শর্করা জাতীয় খাদ্য (গ্লুকোজ) প্রস্তুত করে এবং উপজাত হিসেবে অক্সিজেন ($O_2$) নির্গমন করে, তাকে **সালোকসংশ্লেষণ** বলে।\n\n` +
      `**২. রাসায়নিক সমীকরণ:**\n` +
      `$$6CO_2 + 12H_2O \\xrightarrow[ক্লোরোফিল]{সূর্যালোক} C_6H_{12}O_6 + 6H_2O + 6O_2$$\n\n` +
      `**৩. প্রধান উপাদানসমূহ:**\n` +
      `- **ক্লোরোফিল:** পাতার মেসোফিল টিস্যুর ক্লোরোপ্লাস্টে অবস্থিত সবুজ রঞ্জক।\n` +
      `- **সূর্যালোক:** ফোটন কণা ক্লোরোফিলকে সক্রিয় করে রাসায়নিক শক্তিতে রূপান্তরিত করে।\n` +
      `- **পানি ($H_2O$):** মূলরোম দিয়ে জাইলেম বাহিকার মাধ্যমে পাতায় পৌঁছায়।\n` +
      `- **কার্বন ডাই-অক্সাইড ($CO_2$):** বায়ুমণ্ডল থেকে পত্ররন্ধ্র (Stomata) দিয়ে প্রবেশ করে।\n\n` +
      `**৪. পরীক্ষার টিপস:**\n` +
      `পরীক্ষায় প্রায়ই সালোকসংশ্লেষণের আলোক পর্যায় ও অন্ধকার পর্যায়ের পার্থক্য এবং প্রস্বেদনের সাথে এর সম্পর্ক জানতে চাওয়া হয়।`;
  }

  if (q.includes('পিথাগোরাস') || q.includes('pythagoras') || q.includes('উপপাদ্য')) {
    return `### 📐 পিথাগোরাসের উপপাদ্য (Pythagorean Theorem)\n\n` +
      `**১. মূল সূত্র:**\n` +
      `একটি সমকোণী ত্রিভুজের অতিভুজের ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর ওপর অঙ্কিত বর্গক্ষেত্রদ্বয়ের ক্ষেত্রফলের সমষ্টির সমান।\n\n` +
      `$$\\text{অতিভুজ}^2 = \\text{ভূমি}^2 + \\text{লম্ব}^2$$\n` +
      `$$c^2 = a^2 + b^2$$\n\n` +
      `**২. বাস্তব উদাহরণ:**\n` +
      `ধরি, একটি সমকোণী ত্রিভুজের ভূমি $a = 3$ সেমি এবং লম্ব $b = 4$ সেমি।\n` +
      `তাহলে অতিভুজ $c$ হবে:\n` +
      `$$c = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5 \\text{ সেমি।}$$\n\n` +
      `**৩. গুরুত্বপূর্ণ ট্রিপলেট (Pythagorean Triples):**\n` +
      `- $(3, 4, 5)$\n` +
      `- $(5, 12, 13)$\n` +
      `- $(6, 8, 10)$\n` +
      `- $(8, 15, 17)$\n\n` +
      `এই ত্রয়ী সংখ্যাগুলো মনে রাখলে যেকোনো বহুনির্বাচনী (MCQ) প্রশ্নের উত্তর মাত্র ৫ সেকেন্ডে দেওয়া সম্ভব!`;
  }

  if (q.includes('নিউটন') || q.includes('গতি') || q.includes('সূত্র')) {
    return `### 🍎 নিউটনের ৩টি গতিসূত্র (Newton's Laws of Motion)\n\n` +
      `**১. প্রথম সূত্র (জড়তার সূত্র):**\n` +
      `বাইরে থেকে কোনো বল প্রয়োগ না করলে স্থির বস্তু চিরকাল স্থির থাকবে এবং গতিশীল বস্তু সুষম দ্রুতিতে সরলপথে চলতে থাকবে।\n` +
      `*(এখান থেকে বল ও জড়তার সংজ্ঞা পাওয়া যায়।)*\n\n` +
      `**২. দ্বিতীয় সূত্র (ভরবেগের পরিবর্তনের হার):**\n` +
      `বস্তুর ভরবেগের পরিবর্তনের হার তার ওপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে কাজ করে ভরবেগের পরিবর্তনও সেদিকে ঘটে।\n` +
      `$$\\mathbf{F = ma}$$\n` +
      `*(এখানে $F = \\text{বল}$, $m = \\text{ভর}$, $a = \\text{ত্বরণ}$)*\n\n` +
      `**৩. তৃতীয় সূত্র (ক্রিয়া ও প্রতিক্রিয়া):**\n` +
      `প্রত্যেক ক্রিয়ারই একটি সমান ও বিপরীত প্রতিক্রিয়া রয়েছে ($F_1 = -F_2$)।\n` +
      `*উদাহরণ: বন্দুক থেকে গুলি ছুড়লে বন্দুক পেছনের দিকে ধাক্কা দেয়, অথবা নৌকার বৈঠা দিয়ে পানিতে ধাক্কা দিলে নৌকা সামনে এগোয়।*`;
  }

  if (q.includes('tense') || q.includes('টেন্স') || q.includes('গ্রামার')) {
    return `### 🇬🇧 ইংরেজি Tense চেনার ও মনে রাখার সহজ কৌশল\n\n` +
      `Tense প্রধানত ৩ প্রকার: **Present, Past, Future**। প্রতিটির রয়েছে ৪টি রূপ:\n\n` +
      `| Tense | সাহায্যকারী ক্রিয়া (Auxiliary) | মূল ক্রিয়ার রূপ | উদাহরণ |\n` +
      `| :--- | :--- | :--- | :--- |\n` +
      `| **Present Indefinite** | Do / Does (প্রশ্ন ও নাবোধকে) | $V_1$ (he/she হলে s/es) | He plays football. |\n` +
      `| **Present Continuous** | am / is / are | $V_1 + \\text{ing}$ | He is playing football. |\n` +
      `| **Present Perfect** | have / has | $V_3$ (Past Participle) | He has played football. |\n` +
      `| **Past Indefinite** | Did (প্রশ্ন ও নাবোধকে) | $V_2$ (Past Form) | He played football. |\n` +
      `| **Future Indefinite** | will / shall | $V_1$ (Base Form) | He will play football. |\n\n` +
      `💡 **ম্যাজিক টিপ:** Continuous মানেই ক্রিয়ার শেষে \`-ing\`, আর Perfect মানেই মূল verb-এর ৩ নম্বর রূপ ($V_3$)।`;
  }

  // Generic contextual educational response
  return `### 🎓 শিক্ষামূলক উত্তর ও আলোচনা (${className} ${chapter ? '— ' + chapter : ''})\n\n` +
    `আপনার প্রশ্ন: **"${userQuery}"**\n\n` +
    `**১. মূল ধারণা:**\n` +
    `জাতীয় শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ডের (NCTB) পাঠ্যবই অনুযায়ী এই বিষয়টির মূল তাৎপর্য হলো তাত্ত্বিক ধারণাকে বাস্তব জীবনের উদাহরণের সাথে সংযুক্ত করা।\n\n` +
    `**২. সহজ কথায় ব্যাখ্যা:**\n` +
    `বিষয়টি গভীরভাবে মনে রাখার জন্য পাঠ্যপুস্তকের সংজ্ঞাসমূহ মুখস্থ করার পাশাপাশি এর বাস্তব প্রয়োগ খেয়াল করুন। যেমন গণিত বা বিজ্ঞানের ক্ষেত্রে প্রতিটি সূত্রের পেছনের কারণ বা লজিক বুঝলে পরীক্ষার খাতায় ভুল হওয়ার সম্ভাবনা কমে যায়।\n\n` +
    `**৩. পরীক্ষায় ভালো করার পরামর্শ:**\n` +
    `- অধ্যায়ের শেষে থাকা সংক্ষিপ্ত প্রশ্নোত্তরগুলো রিভিশন দিন।\n` +
    `- নিয়মিত আমাদের **প্রশ্নব্যাংক** ও **মডেল টেস্ট** সমাধান করে নিজের দুর্বলতাগুলো চিহ্নিত করুন।\n` +
    `- যেকোনো সুনির্দিষ্ট সমস্যা বা সূত্রের ধাপে ধাপে সমাধান জানতে আমাকে বিস্তারিত লিখুন!`;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Full source code project download endpoint (ZIP)
app.get(['/api/download-project', '/download/project-zip'], (req, res) => {
  const zipPath = path.join(process.cwd(), 'public', 'nctb-education-project.zip');
  if (fs.existsSync(zipPath)) {
    return res.download(zipPath, 'nctb-education-project.zip');
  }
  return res.status(404).json({ error: 'Project archive not found.' });
});

// ==========================================
// GITHUB OAUTH & CONNECTION STATUS SYSTEM
// ==========================================
let serverGitHubToken: string | null =
  process.env.GITHUB_TOKEN || process.env.GITHUB_ACCESS_TOKEN || null;

// 1. Get OAuth authorization URL
app.get('/api/github/auth-url', (req, res) => {
  const clientId = process.env.GITHUB_CLIENT_ID || process.env.CLIENT_ID;
  const appUrl = process.env.APP_URL || '';
  const redirectUri =
    (req.query.redirect_uri as string) ||
    (appUrl ? `${appUrl.replace(/\/$/, '')}/auth/github/callback` : '');

  if (!clientId) {
    return res.json({
      configured: false,
      message: 'GITHUB_CLIENT_ID is not configured in environment variables.',
      redirectUri,
    });
  }

  const state = Math.random().toString(36).substring(2, 15);
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    scope: 'read:user repo',
    state,
  });

  const url = `https://github.com/login/oauth/authorize?${params.toString()}`;
  return res.json({
    configured: true,
    url,
    redirectUri,
  });
});

// 2. OAuth Callback route (both with and without trailing slash)
app.get(['/auth/github/callback', '/auth/github/callback/'], async (req, res) => {
  const code = req.query.code as string;
  const error = req.query.error as string;
  const errorDescription = (req.query.error_description as string) || error;

  if (error || !code) {
    return res.status(400).send(`
      <!DOCTYPE html>
      <html>
        <head><title>GitHub Connection Failed</title></head>
        <body style="font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 16px;">
          <div style="background: #1e293b; border: 1px solid #ef4444; border-radius: 16px; padding: 28px; max-width: 440px; text-align: center; box-shadow: 0 15px 30px rgba(0,0,0,0.4);">
            <div style="width: 50px; height: 50px; border-radius: 50%; background: rgba(239, 68, 68, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #ef4444; font-size: 26px; font-weight: bold;">✕</div>
            <h2 style="margin: 0 0 10px; font-size: 20px; font-weight: 700;">GitHub সংযোগ ব্যর্থ হয়েছে</h2>
            <p style="margin: 0 0 18px; font-size: 13px; color: #94a3b8; line-height: 1.5;">${errorDescription || 'অনুমোদন প্রদান করা হয়নি বা কোডটি অনুপস্থিত।'}</p>
            <button onclick="window.close()" style="background: #334155; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-weight: 600; cursor: pointer;">উইন্ডো বন্ধ করুন</button>
          </div>
          <script>
            if (window.opener) {
              window.opener.postMessage({ type: 'GITHUB_AUTH_ERROR', error: ${JSON.stringify(errorDescription || 'Authorization failed')} }, '*');
              setTimeout(() => window.close(), 2500);
            }
          </script>
        </body>
      </html>
    `);
  }

  const clientId = process.env.GITHUB_CLIENT_ID || process.env.CLIENT_ID;
  const clientSecret = process.env.GITHUB_CLIENT_SECRET || process.env.CLIENT_SECRET;
  const appUrl = process.env.APP_URL || '';
  const redirectUri =
    (req.query.redirect_uri as string) ||
    (appUrl ? `${appUrl.replace(/\/$/, '')}/auth/github/callback` : undefined);

  if (!clientId || !clientSecret) {
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <head><title>Configuration Missing</title></head>
        <body style="font-family: system-ui, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
          <div style="background: #1e293b; border: 1px solid #eab308; border-radius: 16px; padding: 24px; text-align: center; max-width: 420px;">
            <h3 style="color: #facc15; margin: 0 0 10px;">Environment Variables Missing</h3>
            <p style="color: #94a3b8; font-size: 13px; margin: 0 0 16px;">GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is missing.</p>
            <button onclick="window.close()" style="background: #334155; color: white; border: none; padding: 8px 16px; border-radius: 8px; cursor: pointer;">Close</button>
          </div>
        </body>
      </html>
    `);
  }

  try {
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = (await tokenResponse.json()) as {
      access_token?: string;
      error?: string;
      error_description?: string;
    };

    if (tokenData.error || !tokenData.access_token) {
      return res.status(400).send(`
        <!DOCTYPE html>
        <html>
          <body style="font-family: system-ui, sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0;">
            <div style="background: #1e293b; border-radius: 12px; padding: 24px; text-align: center;">
              <h3 style="color: #ef4444;">Token Exchange Failed</h3>
              <p style="color: #94a3b8; font-size: 13px;">${tokenData.error_description || tokenData.error || 'Failed to exchange token'}</p>
            </div>
            <script>
              if (window.opener) {
                window.opener.postMessage({ type: 'GITHUB_AUTH_ERROR', error: ${JSON.stringify(tokenData.error_description || 'Token exchange failed')} }, '*');
              }
              setTimeout(() => window.close(), 2000);
            </script>
          </body>
        </html>
      `);
    }

    const accessToken = tokenData.access_token;
    serverGitHubToken = accessToken;

    res.cookie('gh_oauth_token', accessToken, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>GitHub Connected</title>
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        </head>
        <body style="font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; height: 100vh; margin: 0; padding: 16px;">
          <div style="background: #1e293b; border: 1px solid #22c55e; border-radius: 16px; padding: 32px 24px; max-width: 420px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.5);">
            <div style="width: 52px; height: 52px; border-radius: 50%; background: rgba(34, 197, 94, 0.15); display: flex; align-items: center; justify-content: center; margin: 0 auto 16px; color: #22c55e;">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                <polyline points="22 4 12 14.01 9 11.01"></polyline>
              </svg>
            </div>
            <h2 style="margin: 0 0 8px; font-size: 20px; font-weight: 700; color: #f8fafc;">GitHub Connected Successfully!</h2>
            <p style="margin: 0 0 16px; font-size: 13px; color: #94a3b8;">আপনার গিটহাব অ্যাকাউন্ট সফলভাবে যুক্ত হয়েছে। এই উইন্ডো স্বয়ংক্রিয়ভাবে বন্ধ হয়ে যাবে...</p>
            <div style="font-size: 12px; color: #64748b;">Closing popup...</div>
          </div>
          <script>
            try {
              if (window.opener) {
                window.opener.postMessage({ type: 'GITHUB_AUTH_SUCCESS' }, '*');
                setTimeout(() => window.close(), 600);
              } else {
                window.location.href = '/';
              }
            } catch (e) {
              window.close();
            }
          </script>
        </body>
      </html>
    `);
  } catch (exchangeErr) {
    console.error('Error during GitHub token exchange:', exchangeErr);
    return res.status(500).send(`
      <!DOCTYPE html>
      <html>
        <body style="font-family: sans-serif; background: #0f172a; color: white; display: flex; align-items: center; justify-content: center; height: 100vh;">
          <p>Failed to connect with GitHub. Please try again.</p>
        </body>
      </html>
    `);
  }
});

// 3. GitHub Connection Status endpoint - Official GitHub API verification
app.get('/api/github/status', async (req, res) => {
  const token =
    (req.cookies && (req.cookies.gh_oauth_token as string)) ||
    serverGitHubToken ||
    process.env.GITHUB_TOKEN ||
    null;

  const configured = !!(process.env.GITHUB_CLIENT_ID || process.env.CLIENT_ID);

  if (!token) {
    return res.json({
      connected: false,
      configured,
      message: 'GitHub Not Connected',
      checkedAt: new Date().toISOString(),
    });
  }

  try {
    // Official GitHub API check: verify authenticated user
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'AI-Studio-GitHub-Connector',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (userRes.status === 401 || userRes.status === 403) {
      serverGitHubToken = null;
      res.clearCookie('gh_oauth_token', {
        secure: true,
        sameSite: 'none',
        httpOnly: true,
      });
      return res.json({
        connected: false,
        configured,
        error: 'GitHub authentication token has expired or is invalid.',
        checkedAt: new Date().toISOString(),
      });
    }

    if (!userRes.ok) {
      return res.json({
        connected: false,
        configured,
        error: `GitHub API error: HTTP ${userRes.status}`,
        checkedAt: new Date().toISOString(),
      });
    }

    const userData = (await userRes.json()) as any;

    // Fetch user repositories (recent repositories)
    let repositories: any[] = [];
    try {
      const reposRes = await fetch(
        'https://api.github.com/user/repos?sort=updated&per_page=8',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'User-Agent': 'AI-Studio-GitHub-Connector',
            Accept: 'application/vnd.github.v3+json',
          },
        }
      );
      if (reposRes.ok) {
        const reposData = (await reposRes.json()) as any[];
        if (Array.isArray(reposData)) {
          repositories = reposData.map((r: any) => ({
            id: r.id,
            name: r.name,
            fullName: r.full_name,
            htmlUrl: r.html_url,
            description: r.description || '',
            isPrivate: r.private,
            stars: r.stargazers_count,
            forks: r.forks_count,
            language: r.language || 'Code',
            updatedAt: r.updated_at,
          }));
        }
      }
    } catch (reposErr) {
      console.warn('Could not fetch repos list:', reposErr);
    }

    // Never return the access token, client secret, or private credentials
    return res.json({
      connected: true,
      configured: true,
      user: {
        login: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        profileUrl: userData.html_url,
        bio: userData.bio || '',
        publicRepos: userData.public_repos,
        followers: userData.followers,
        following: userData.following,
      },
      repositories,
      checkedAt: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error('Error querying GitHub API:', err);
    return res.status(500).json({
      connected: false,
      configured,
      error: 'Failed to verify GitHub connection via official API.',
      checkedAt: new Date().toISOString(),
    });
  }
});

// 4. Secure Personal Access Token (PAT) connection for testing official API
app.post('/api/github/connect-pat', async (req, res) => {
  const token = req.body?.token?.trim();
  if (!token) {
    return res.status(400).json({ error: 'Token is required.' });
  }

  try {
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'AI-Studio-GitHub-Connector',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      return res.status(401).json({
        error: 'Invalid GitHub token. Please verify your token permissions (read:user, repo).',
      });
    }

    const userData = (await userRes.json()) as any;
    serverGitHubToken = token;

    res.cookie('gh_oauth_token', token, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    return res.json({
      success: true,
      connected: true,
      user: {
        login: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        profileUrl: userData.html_url,
      },
    });
  } catch (err) {
    return res.status(500).json({ error: 'Connection test failed.' });
  }
});

// 5. Disconnect endpoint
app.post('/api/github/disconnect', (_req, res) => {
  serverGitHubToken = null;
  res.clearCookie('gh_oauth_token', {
    secure: true,
    sameSite: 'none',
    httpOnly: true,
  });
  return res.json({ success: true, connected: false });
});

// 6. Push all workspace files to GitHub repository
app.post('/api/github/push-all-files', async (req, res) => {
  const token =
    (req.body?.token && String(req.body.token).trim()) ||
    (req.cookies && (req.cookies.gh_oauth_token as string)) ||
    serverGitHubToken ||
    process.env.GITHUB_TOKEN ||
    null;

  if (!token) {
    return res.status(401).json({
      error: 'GitHub সংযোগ বা এক্সেস টোকেন পাওয়া যায়নি। দয়া করে প্রথমে GitHub কানেক্ট করুন বা আপনার Personal Access Token প্রদান করুন।',
    });
  }

  // Desired repo name, default to 'nctb-education'
  let repoName = (req.body?.repoName || 'nctb-education').trim().replace(/[^a-zA-Z0-9._-]/g, '-');
  if (!repoName) repoName = 'nctb-education';
  const isPrivate = !!req.body?.isPrivate;
  const commitMessage =
    (req.body?.commitMessage && String(req.body.commitMessage).trim()) ||
    'feat: complete Bangla Shikkhagor (NCTB Education) platform with full syllabus, 1000+ MCQs, and AI tutor';

  try {
    // 1. Verify token & get authenticated user
    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'AI-Studio-GitHub-Connector',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    if (!userRes.ok) {
      return res.status(401).json({
        error: 'GitHub টোকেন ভ্যালিড নয় বা পারমিশন নেই। টোকেনে repo পারমিশন থাকা আবশ্যক।',
      });
    }

    const userData = (await userRes.json()) as any;
    const username = userData.login;

    // Cache the working token for current session
    serverGitHubToken = token;
    res.cookie('gh_oauth_token', token, {
      secure: true,
      sameSite: 'none',
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
    });

    // 2. Check if repository already exists
    const checkRepoRes = await fetch(`https://api.github.com/repos/${username}/${repoName}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'User-Agent': 'AI-Studio-GitHub-Connector',
        Accept: 'application/vnd.github.v3+json',
      },
    });

    let createdNew = false;
    if (checkRepoRes.status === 404) {
      // Create repository on GitHub automatically
      const createRepoRes = await fetch('https://api.github.com/user/repos', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'User-Agent': 'AI-Studio-GitHub-Connector',
          'Content-Type': 'application/json',
          Accept: 'application/vnd.github.v3+json',
        },
        body: JSON.stringify({
          name: repoName,
          description: 'বাংলা শিক্ষাগর (NCTB Education) — বাংলাদেশ স্কুল লার্নিং প্ল্যাটফর্ম (Class 6 - 10)',
          private: isPrivate,
          auto_init: false,
        }),
      });

      if (!createRepoRes.ok) {
        const createErr = (await createRepoRes.json()) as any;
        return res.status(400).json({
          error:
            createErr.message ||
            'GitHub-এ নতুন রিপোজিটরি তৈরি করা যায়নি। আপনার টোকেনে "repo" স্কোপ আছে কি না চেক করুন।',
        });
      }
      createdNew = true;
    }

    // 3. Stage and commit all files in workspace
    if (!fs.existsSync('.git')) {
      await execAsync('git init && git branch -M main');
    }
    await execAsync('git config user.name "Bangla Shikkhagor" || true');
    await execAsync('git config user.email "shakib2006k@gmail.com" || true');
    await execAsync('git add -A');
    try {
      await execAsync(`git commit -m "${commitMessage.replace(/"/g, '\\"')}"`);
    } catch {
      // already committed
    }

    // 4. Push to remote authenticated repository
    const authenticatedRemoteUrl = `https://oauth2:${token}@github.com/${username}/${repoName}.git`;

    try {
      await execAsync('git remote remove origin');
    } catch {
      // ignore
    }

    await execAsync(`git remote add origin ${authenticatedRemoteUrl}`);
    await execAsync('git branch -M main');
    await execAsync('git push -u origin main --force');

    // 5. Clean up remote URL immediately to never keep credentials stored
    await execAsync(`git remote set-url origin https://github.com/${username}/${repoName}.git`);

    const repoUrl = `https://github.com/${username}/${repoName}`;

    return res.json({
      success: true,
      createdNew,
      message: 'সবগুলো ফাইল সফলভাবে GitHub-এ পাঠানো হয়েছে!',
      repoUrl,
      repoName,
      username,
      branch: 'main',
    });
  } catch (err: any) {
    console.error('Error pushing files to GitHub:', err);
    try {
      await execAsync('git remote remove origin');
    } catch {}
    return res.status(500).json({
      error:
        err.message ||
        'GitHub-এ ফাইল পুশ করতে সমস্যা হয়েছে। আপনার একাউন্টে রিপোজিটরি তৈরি ও পুশ করার অনুমতি (repo scope) নিশ্চিত করুন।',
    });
  }
});


// File upload endpoint for images and videos
app.post('/api/upload', (req, res) => {
  const uploadSingle = upload.any();

  uploadSingle(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          error: 'ভিডিও বা ফাইলটি অনেক বড়। সর্বোচ্চ ৮০ মেগাবাইট ফাইল আপলোড করতে পারবেন।',
          code: 'FILE_TOO_LARGE',
        });
      }
      return res.status(400).json({
        error: `আপলোড ত্রুটি: ${err.message}`,
        code: 'UPLOAD_ERROR',
      });
    } else if (err) {
      if (err.message === 'INVALID_FILE_TYPE') {
        return res.status(400).json({
          error: 'এই ফাইল ফরম্যাট সমর্থিত নয়। শুধুমাত্র ছবি (JPG, PNG, WEBP) অথবা ভিডিও (MP4, WEBM) নির্বাচন করুন।',
          code: 'INVALID_FILE_TYPE',
        });
      }
      return res.status(500).json({
        error: 'আপলোড ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করে আবার চেষ্টা করুন।',
        code: 'SERVER_ERROR',
      });
    }

    const files = (req.files as Express.Multer.File[]) || [];
    const file = files[0];

    if (!file) {
      return res.status(400).json({
        error: 'কোনো ফাইল পাওয়া যায়নি। দয়া করে একটি ছবি বা ভিডিও নির্বাচন করুন।',
        code: 'NO_FILE',
      });
    }

    const isVideo = file.mimetype.toLowerCase().startsWith('video/');
    const fileUrl = `/uploads/${file.filename}`;

    return res.json({
      success: true,
      url: fileUrl,
      filename: file.filename,
      originalname: file.originalname,
      size: file.size,
      mimetype: file.mimetype,
      mediaType: isVideo ? 'video' : 'image',
    });
  });
});

// Delete uploaded file endpoint (for photo removal / cleanup)
app.delete('/api/upload/:filename', (req, res) => {
  try {
    const filename = path.basename(req.params.filename);
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
    return res.json({ success: true, message: 'ফাইল সফলভাবে মুছে ফেলা হয়েছে।' });
  } catch (e) {
    return res.status(500).json({ error: 'ফাইলটি মোছা যায়নি।' });
  }
});

// AI Status endpoint
app.get('/api/ai/status', (req, res) => {
  const ai = getGeminiAI();
  return res.json({
    active: !!ai,
    hasApiKey: !!ai,
    defaultModel: 'gemini-3.1-flash-lite',
    fallbackModels: ['gemini-3.5-flash', 'gemini-3.8-flash', 'gemini-flash-lite-latest'],
  });
});

// AI Chat endpoint
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { messages, context } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    const lastMessage = messages[messages.length - 1];
    const userPrompt = lastMessage?.text || '';

    // Build system instruction
    const classText = context?.classId ? `শ্রেণি: ${context.classId.replace('class-', '')}ম শ্রেণি, ` : '';
    const subjectText = context?.subjectId ? `বিষয়: ${context.subjectId}, ` : '';
    const chapterText = context?.chapterTitle ? `অধ্যায়: ${context.chapterTitle}, ` : '';
    const modeText = context?.mode || 'general';

    const systemInstruction = `
আপনি হলেন "বাংলা শিক্ষাগর"-এর একজন অত্যন্ত সহানুভূতিশীল, অভিজ্ঞ ও বন্ধুভাবাপন্ন স্কুল শিক্ষক ও AI শিক্ষা সহায়ক।
আপনার লক্ষ্য হলো ৬ষ্ঠ থেকে ১২ম শ্রেণির বাংলাদেশি শিক্ষার্থীদের জাতীয় শিক্ষাক্রম (NCTB) অনুযায়ী পড়াশোনায় সর্বোত্তম সহায়তা করা।

বর্তমান প্রেক্ষাপট:
${classText}${subjectText}${chapterText}পদ্ধতি: ${modeText}

নিয়মাবলী:
১. সর্বদা শুদ্ধ, প্রাঞ্জল ও আকর্ষণীয় বাংলায় উত্তর দিন। ইংরেজি বিষয়ের ক্ষেত্রে প্রয়োজনীয় ইংরেজি বাক্য ও বাংলা অনুবাদ দিন।
২. উত্তর সহজ ভাষায় গুছিয়ে দিন। বুলেট পয়েন্ট, টেবিল ও বোল্ড টেক্সট ব্যবহার করে পড়তে সুবিধা তৈরি করুন।
৩. অঙ্কের ক্ষেত্রে সরাসরি উত্তর না দিয়ে প্রতিটি ধাপ (Step 1, Step 2...) সুন্দরভাবে ব্যাখ্যা করুন।
৪. বিজ্ঞানের ক্ষেত্রে বাস্তব জীবনের উদাহরণ ও পরীক্ষার টিপস দিন।
৫. সর্বদা সত্য ও নির্ভুল তথ্য প্রদান করুন।
৬. শেষে শিক্ষার্থীকে উৎসাহিত করুন এবং প্রাসঙ্গিক পরবর্তী প্রশ্ন করার সুযোগ রাখুন।
`.trim();

    const hasImage = Boolean(lastMessage?.imageBase64 && lastMessage?.imageMimeType);
    const contentParts: any[] = [];

    if (hasImage) {
      const cleanBase64 = lastMessage.imageBase64.replace(/^data:[^;]+;base64,/, '');
      contentParts.push({
        inlineData: {
          mimeType: lastMessage.imageMimeType,
          data: cleanBase64,
        },
      });
    }

    const promptText = userPrompt.trim() || 'অনুগ্রহ করে এই ছবিটিতে থাকা প্রশ্ন বা সমীকরণটি বিশ্লেষণ করে ধাপে ধাপে সমাধান বুঝিয়ে দিন।';
    contentParts.push({
      text: `${systemInstruction}\n\nশিক্ষার্থীর প্রশ্ন:\n${promptText}`,
    });

    const aiResult = await callGeminiGenerate({
      contents: [
        {
          role: 'user',
          parts: contentParts,
        },
      ],
      hasImage,
    });

    return res.json({
      reply: aiResult.text,
      model: aiResult.model,
      success: true,
    });
  } catch (error: any) {
    console.warn('Gemini API Error in /api/ai/chat, serving curriculum fallback:', error?.message || error);
    const lastMessage = req.body?.messages?.[req.body?.messages?.length - 1]?.text || '';
    const fallbackReply = generateEducationalFallback(lastMessage, req.body?.context);
    return res.json({
      reply: fallbackReply,
      model: 'educational-curriculum-engine',
      success: true,
      recovered: true,
    });
  }
});

// AI Notes Generator endpoint
app.post('/api/ai/generate-notes', async (req, res) => {
  try {
    const { classId, subjectId, chapterTitle, specificTopic } = req.body;
    const topic = specificTopic || chapterTitle || 'অধ্যায়ের সারসংক্ষেপ';
    const prompt = `অনুগ্রহ করে বাংলাদেশ জাতীয় শিক্ষাক্রম (NCTB) অনুযায়ী ${classId || 'স্কুল'} এর ${subjectId || 'বিষয়'} বিষয়ের "${topic}" অধ্যায়টির জন্য একটি সম্পূর্ণ ও উচ্চমানসম্পন্ন পরীক্ষার রিভিশন নোট তৈরি করুন।
এতে অন্তর্ভুক্ত থাকবে:
১. বিষয়টির সারসংক্ষেপ ও সহজ ভাষায় ব্যাখ্যা
২. ৫টি অতি গুরুত্বপূর্ণ সংজ্ঞা ও পরিভাষা
৩. গুরুত্বপূর্ণ সূত্রাবলী ও মূল তথ্য (যদি থাকে)
৪. পরীক্ষায় সচরাচর আসা ৩টি অনুধাবনমূলক প্রশ্ন ও উত্তর
৫. পরীক্ষার বিশেষ টিপস ও সাধারণ ভুলের সতর্কতা।`;

    const aiResult = await callGeminiGenerate({
      contents: prompt,
    });

    return res.json({ notes: aiResult.text, source: aiResult.model, success: true });
  } catch (err: any) {
    console.warn('Error generating notes, using fallback:', err?.message || err);
    return res.json({
      notes: generateEducationalFallback(req.body?.chapterTitle || 'সারসংক্ষেপ', req.body),
      source: 'curriculum-engine',
      success: true,
    });
  }
});

// AI MCQ Generator endpoint
app.post('/api/ai/generate-mcqs', async (req, res) => {
  try {
    const { chapterTitle, subjectId, count = 5, difficulty = 'medium' } = req.body;
    const prompt = `You are a curriculum question expert for Bangladesh NCTB schools.
Generate ${count} high-quality Multiple Choice Questions (MCQ) for subject "${subjectId}" on chapter/topic "${chapterTitle}" at difficulty level "${difficulty}".
Respond ONLY with a valid JSON array of objects without Markdown code fences, conforming strictly to this format:
[
  {
    "question": "বাংলা ভাষায় প্রশ্ন",
    "options": ["বিকল্প ১", "বিকল্প ২", "বিকল্প ৩", "বিকল্প ৪"],
    "correctAnswerIndex": 0,
    "explanation": "সঠিক উত্তরের চমৎকার বাংলা ব্যাখ্যা"
  }
]`;

    const aiResult = await callGeminiGenerate({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const cleanText = aiResult.text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanText || '[]');
    return res.json({ questions: parsed, mcqs: parsed, success: true, source: aiResult.model });
  } catch (err: any) {
    console.warn('Error generating MCQs, using fallback:', err?.message || err);
    const fallbackList = [
      {
        question: `${req.body?.chapterTitle || 'অধ্যায়'} সংক্রান্ত গুরুত্বপূর্ণ ধারণা কোনটি?`,
        options: [
          'অধ্যায়ের প্রতিটি সূত্র ও সংজ্ঞার বাস্তব প্রয়োগ জানা আবশ্যক',
          'কোনো ব্যাখ্যা ছাড়া শুধু উত্তর মুখস্থ করা',
          'পরীক্ষায় কোনো ব্যাখ্যা না পড়া',
          'কোনোটিই নয়',
        ],
        correctAnswerIndex: 0,
        explanation: 'এনসিটিবি পাঠ্যক্রমে বাস্তব জীবনের সাথে বৈজ্ঞানিক ও গাণিতিক চিন্তন দক্ষতার মেলবন্ধনকে গুরুত্ব দেওয়া হয়েছে।',
      },
    ];
    return res.json({
      questions: fallbackList,
      mcqs: fallbackList,
      success: true,
      source: 'curriculum-engine',
    });
  }
});

// In-memory cache for ultra-fast response (<5ms) on popular educational queries
const QUICK_ANSWER_CACHE = new Map<string, any>();

// Structured Educational Quick Answer Generator
function generateQuickAnswerFallback(
  question: string,
  context?: { classId?: string; subjectId?: string; chapterTitle?: string; length?: string; simplify?: boolean }
) {
  const q = question.toLowerCase();
  
  if (q.includes('সালোকসংশ্লেষণ') || q.includes('photosynthesis')) {
    return {
      question,
      directAnswer: 'সালোকসংশ্লেষণ হলো সবুজ উদ্ভিদের সূর্যালোক ও ক্লোরোফিলের উপস্থিতিতে কার্বন ডাই-অক্সাইড এবং পানি বিক্রিয়া করিয়ে শর্করা (গ্লুকোজ) জাতীয় খাদ্য প্রস্তুত এবং অক্সিজেন নির্গমন করার জৈব-রাসায়নিক প্রক্রিয়া।',
      explanation: 'উদ্ভিদ তার পাতার মেসোফিল টিস্যুর ক্লোরোপ্লাস্টে সৌরশক্তিকে রাসায়নিক শক্তিতে রূপান্তরিত করে। মূলরোম দ্বারা মাটি থেকে শোষিত পানি এবং বায়ুমণ্ডল থেকে গৃহীত CO₂ এতে প্রধান কাঁচামাল হিসেবে কাজ করে।',
      realLifeExample: 'যেমন একটি সৌরশক্তিচালিত রান্নার চুলার সাথে এর তুলনা করা যায়—সূর্যের তাপকে কাজে লাগিয়ে রান্না করা খাদ্য হলো উদ্ভিদের গ্লুকোজ, আর ধোঁয়া বের হওয়ার বদলে নির্গত হচ্ছে জীবনধারণের অমূল্য অক্সিজেন।',
      keyPoints: [
        'রাসায়নিক সমীকরণ: 6CO₂ + 12H₂O → C₆H₁₂O₆ + 6H₂O + 6O₂',
        'প্রধান উপাদান ৪টি: সূর্যালোক, ক্লোরোফিল, পানি ও কার্বন ডাই-অক্সাইড',
        'আলোক নির্ভর পর্যায় থাইলাকয়েডে এবং আলোক নিরপেক্ষ পর্যায় স্ট্রোমাতে ঘটে',
      ],
      formulaOrRule: '6CO₂ + 12H₂O ⟶ C₆H₁₂O₆ + 6H₂O + 6O₂ (ক্লোরোফিল ও সূর্যালোক আবশ্যক)',
      simplerAnalogy: 'সহজ কথায়: সবুজ পাতা হলো উদ্ভিদের রান্নাঘর। সূর্যের আলো দিয়ে সেখানে পানি ও বাতাস মিশিয়ে নিজের খাবার নিজে তৈরি করে গাছ।',
      source: 'curriculum-engine',
    };
  }

  if (q.includes('পিথাগোরাস') || q.includes('pythagoras') || q.includes('উপপাদ্য')) {
    return {
      question,
      directAnswer: 'একটি সমকোণী ত্রিভুজের অতিভুজের ওপর অঙ্কিত বর্গক্ষেত্রের ক্ষেত্রফল অপর দুই বাহুর ওপর অঙ্কিত বর্গক্ষেত্রদ্বয়ের ক্ষেত্রফলের সমষ্টির সমান (c² = a² + b²)।',
      explanation: 'সমকোণী ত্রিভুজের বৃহত্তম বাহু হলো অতিভুজ (সমকোণের বিপরীত বাহু)। লম্ব ও ভূমির বর্গের যোগফল সবসময় অতিভুজের বর্গের সমান হবে।',
      realLifeExample: 'ধরো তোমার রুমের এক কোণা থেকে মেঝের সোজা উল্টো কোণা দিয়ে কার্পেট বা তার টানতে চাও, তখন সোজা দেয়াল বরাবর না গিয়ে কোণাকুণি পরিমাপ করতে পিথাগোরাসের সূত্র ব্যবহৃত হয়।',
      keyPoints: [
        'অতিভুজ² = ভূমি² + লম্ব²',
        'অতিভুজ c = √(a² + b²)',
        'গুরুত্বপূর্ণ ত্রয়ী সংখ্যা (Triples): (৩, ৪, ৫), (৫, ১২, ১৩), (৮, ১৫, ১৭)',
      ],
      formulaOrRule: 'c² = a² + b²',
      simplerAnalogy: 'সহজ কথায়: একটি সিঁড়িকে দেয়ালে খাড়া করে রাখলে দেয়ালের উচ্চতা (লম্ব) আর মেঝের দূরত্ব (ভূমি) জানা থাকলে সিঁড়ির আসল দৈর্ঘ্য (অতিভুজ) এক সেকেন্ডে বের করা যায়।',
      source: 'curriculum-engine',
    };
  }

  if (q.includes('নিউটন') || q.includes('গতিসূত্র') || q.includes('গতির সূত্র')) {
    return {
      question,
      directAnswer: 'স্যার আইজ্যাক নিউটনের ৩টি গতিসূত্র হলো: ১. বল প্রয়োগ না করলে স্থির বস্তু স্থির ও গতিশীল বস্তু সরলপথে গতিশীল থাকবে। ২. বস্তুর ভরবেগের পরিবর্তনের হার প্রযুক্ত বলের সমানুপাতিক (F = ma)। ৩. প্রত্যেক ক্রিয়ারই সমান ও বিপরীত প্রতিক্রিয়া রয়েছে।',
      explanation: 'প্রথম সূত্র জড়তা ও বলের সংজ্ঞা দেয়। দ্বিতীয় সূত্র বলের পরিমাপ ও সমীকরণ (F = ma) দেয়। তৃতীয় সূত্র দুটি বস্তুর মধ্যকার পারস্পরিক বলের স্বভাব ব্যাখ্যা করে।',
      realLifeExample: 'বাস হঠাৎ ব্রেক করলে আমরা সামনের দিকে ঝুঁকে পড়ি (গতির জড়তা) এবং বাস হঠাৎ চলা শুরু করলে পেছনে হেলে পড়ি (স্থিতির জড়তা)। বন্দুক দিয়ে গুলি ছুড়লে বন্দুক পেছনে ধাক্কা দেয় (৩য় সূত্র)।',
      keyPoints: [
        '১ম সূত্র: জড়তার সূত্র ও বলের সংজ্ঞা',
        '২য় সূত্র: F = ma (বল = ভর × ত্বরণ)',
        '৩য় সূত্র: ক্রিয়া = -প্রতিক্রিয়া (F₁ = -F₂)',
      ],
      formulaOrRule: 'F = ma (একক: নিউটন N বা kg·m/s²)',
      simplerAnalogy: 'সহজ কথায়: ধাক্কা না দিলে কোনো জিনিস নিজে থেকে নড়বে না, যত জোরে ধাক্কা দেবে তত জোরে ছুটবে, আর দেয়ালে ঘুসি মারলে তোমার হাতেও সমপরিমাণ ব্যথা লাগবে।',
      source: 'curriculum-engine',
    };
  }

  if (q.includes('tense') || q.includes('টেন্স')) {
    return {
      question,
      directAnswer: 'ক্রিয়া সম্পাদনের সুনির্দিষ্ট সময়কে Tense (কাল) বলে। এটি ৩ প্রকার: Present (বর্তমান), Past (অতীত) এবং Future (ভবিষ্যৎ)। প্রতিটি আবার ৪ ভাগে বিভক্ত (Indefinite, Continuous, Perfect, Perfect Continuous)।',
      explanation: 'ইংরেজি ব্যাকরণে বাক্য গঠনের মূল ভিত্তি হলো Tense। Subject ও সময়ের সাথে Verb-এর রূপ পরিবর্তন হওয়াই Tense-এর কাজ।',
      realLifeExample: '"I eat rice" (আমি ভাত খাই - অভ্যাসগত), "I am eating rice" (আমি খাচ্ছি - চলমান), "I have eaten rice" (আমি এইমাত্র খেয়েছি - পুরাঘটিত)।',
      keyPoints: [
        'Present: Indefinite (V₁), Continuous (am/is/are + V-ing), Perfect (have/has + V₃)',
        'Past: Indefinite (V₂), Continuous (was/were + V-ing), Perfect (had + V₃)',
        'Future: Indefinite (shall/will + V₁)',
      ],
      formulaOrRule: 'Continuous = Verb + ing | Perfect = have/has/had + Past Participle (V₃)',
      simplerAnalogy: 'সহজ কথায়: কাজটি এখন হচ্ছে, নাকি আগে হয়েছিল, নাকি সামনে হবে—তা ইংরেজি ক্রিয়ার মাধ্যমে নিশ্চিত করার ছকই হলো Tense।',
      source: 'curriculum-engine',
    };
  }

  // General Educational Structure
  return {
    question,
    directAnswer: `${question}-এর ক্ষেত্রে NCTB পাঠ্যক্রমের আলোকে প্রধান সমাধান হলো এর মূল সংজ্ঞা ও কারণভিত্তিক বিশ্লেষণ নির্ভুলভাবে উপস্থাপন করা।`,
    explanation: `তাত্ত্বিক ধারণাকে দৈনন্দিন বাস্তব উদাহরণের সাথে মেলানোই এই অধ্যায়ের প্রধান লক্ষ্য। এর মাধ্যমে বোর্ড পরীক্ষায় সৃজনশীল ও বহুনির্বাচনী উভয় অংশেই সর্বোচ্চ নম্বর নিশ্চিত করা সম্ভব।`,
    realLifeExample: 'পরীক্ষার খাতায় সরাসরি সূত্রের প্রমাণ ও বাস্তব প্রয়োগ পয়েন্ট আকারে লিখলে পরীক্ষক সম্পূর্ণ নম্বর প্রদান করেন।',
    keyPoints: [
      'পাঠ্যবইয়ের প্রতিটি মৌলিক সংজ্ঞা ও সূত্র ক্রমানুসারে মুখস্থ রাখা',
      'বিগত বছরের বোর্ড প্রশ্ন নিয়মিত সমাধান করা',
      'ধারণার সুস্পষ্ট চিত্র বা ছক ব্যবহার করা',
    ],
    formulaOrRule: 'ধারণা ⟶ সূত্র ⟶ সমাধান ⟶ বাস্তব জীবনে প্রয়োগ',
    simplerAnalogy: 'সহজ কথায়: যেকোনো কঠিন পাঠকে ছোট ছোট টুকরো করে বুঝলে তা চিরদিনের মতো মনে থাকে।',
    source: 'curriculum-engine',
  };
}

// 1-Click Fast Educational Answer Endpoint
app.post('/api/ai/quick-answer', async (req, res) => {
  try {
    const { question, classId, subjectId, chapterTitle, length = 'medium', simplify = false } = req.body;
    if (!question || typeof question !== 'string') {
      return res.status(400).json({ error: 'Question string is required.' });
    }

    const cacheKey = `${question.trim().toLowerCase()}_${length}_${simplify}`;
    if (QUICK_ANSWER_CACHE.has(cacheKey)) {
      return res.json({ ...QUICK_ANSWER_CACHE.get(cacheKey), cached: true });
    }

    const prompt = `You are the lead NCTB Master Teacher for Bangladeshi students (Class 6-10).
A student asked this question: "${question}".
Context: Class: ${classId || 'Secondary'}, Subject: ${subjectId || 'General'}, Chapter: ${chapterTitle || 'Curriculum'}.
Length: ${length}. Mode: ${simplify ? 'ultra-simple everyday analogy for a beginner' : 'standard clear explanation'}.

Respond STRICTLY with a valid JSON object matching this schema (NO code blocks, NO markdown fences):
{
  "question": "${question.replace(/"/g, '\\"')}",
  "directAnswer": "১-২ বাক্যে সুস্পষ্ট ও সরাসরি উত্তর",
  "explanation": "সহজ ও প্রাঞ্জল ভাষায় মূল বৈজ্ঞানিক/গাণিতিক/ব্যাকরণিক ব্যাখ্যা (${length === 'short' ? 'সংক্ষিপ্ত' : 'বিস্তারিত'})",
  "realLifeExample": "বাস্তব জীবনের সুন্দর উদাহরণ যা সহজেই কল্পনা করা যায়",
  "keyPoints": ["পয়েন্ট ১", "পয়েন্ট ২", "পয়েন্ট ৩"],
  "formulaOrRule": "যদি কোনো সূত্র বা ব্যাকরণিক নিয়ম থাকে তা লিখুন",
  "simplerAnalogy": "আরও সহজ ভাষায় বা রূপকের মাধ্যমে ১ বাক্যে সারসংক্ষেপ"
}`;

    const aiResult = await callGeminiGenerate({
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    try {
      const cleanText = aiResult.text.replace(/```(?:json)?/gi, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanText || '{}');
      const result = {
        question: parsed.question || question,
        directAnswer: parsed.directAnswer || 'সরাসরি উত্তর প্রস্তুত রয়েছে।',
        explanation: parsed.explanation || '',
        realLifeExample: parsed.realLifeExample || '',
        keyPoints: parsed.keyPoints || [],
        formulaOrRule: parsed.formulaOrRule || '',
        simplerAnalogy: parsed.simplerAnalogy || '',
        source: aiResult.model,
      };
      QUICK_ANSWER_CACHE.set(cacheKey, result);
      return res.json(result);
    } catch (parseError) {
      const fallback = generateQuickAnswerFallback(question, { classId, subjectId, chapterTitle, length, simplify });
      return res.json(fallback);
    }
  } catch (err: any) {
    console.warn('Quick Answer API Error, using fallback:', err?.message || err);
    const fallback = generateQuickAnswerFallback(req.body?.question || '', req.body);
    return res.json(fallback);
  }
});

// Setup server modes (Vite in development, static in production)
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Bangla Shiksha Ghor server running at http://0.0.0.0:${PORT}`);
  });
}

start();
