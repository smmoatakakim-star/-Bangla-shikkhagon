import React, { useState, useEffect } from 'react';
import {
  X,
  Github,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ExternalLink,
  Lock,
  GitBranch,
  Shield,
  FolderGit2,
  Terminal,
  Copy,
  Check,
  UploadCloud,
} from 'lucide-react';

interface GitHubUser {
  login: string;
  name: string;
  avatar_url: string;
  html_url: string;
  public_repos: number;
}

interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  private: boolean;
  description: string | null;
  updated_at: string;
}

interface GitHubStatusResponse {
  connected: boolean;
  user: GitHubUser | null;
  repos: GitHubRepo[];
  message: string;
}

interface GitHubConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubConnectionModal: React.FC<GitHubConnectionModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [connecting, setConnecting] = useState<boolean>(false);
  const [statusData, setStatusData] = useState<GitHubStatusResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [patInput, setPatInput] = useState<string>('');
  const [showPatInput, setShowPatInput] = useState<boolean>(false);
  const [patSubmitting, setPatSubmitting] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<string>('');

  // Push all files states
  const [pushing, setPushing] = useState<boolean>(false);
  const [pushRepoName, setPushRepoName] = useState<string>('nctb-education');
  const [pushIsPrivate, setPushIsPrivate] = useState<boolean>(false);
  const [pushSuccessResult, setPushSuccessResult] = useState<{
    repoUrl: string;
    repoName: string;
    createdNew: boolean;
  } | null>(null);
  const [copiedCmd, setCopiedCmd] = useState<boolean>(false);

  // Check connection status via real server API & official GitHub REST API
  const checkStatus = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/github/status', {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) {
        throw new Error(`HTTP error ${res.status}`);
      }
      const data: GitHubStatusResponse = await res.json();
      setStatusData(data);
      setLastChecked(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.warn('GitHub connection check error:', err);
      setStatusData({
        connected: false,
        user: null,
        repos: [],
        message: 'GitHub Not Connected',
      });
      setLastChecked(new Date().toLocaleTimeString());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkStatus();
      setPushSuccessResult(null);
    }
  }, [isOpen]);

  // Push all files to GitHub repository
  const handlePushAllFiles = async (overrideToken?: string) => {
    setPushing(true);
    setErrorMsg(null);
    setPushSuccessResult(null);

    try {
      const res = await fetch('/api/github/push-all-files', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: pushRepoName.trim() || 'nctb-education',
          isPrivate: pushIsPrivate,
          token: overrideToken || patInput.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'GitHub-এ ফাইল পাঠাতে ব্যর্থ হয়েছে।');
      }

      setPushSuccessResult({
        repoUrl: data.repoUrl,
        repoName: data.repoName,
        createdNew: data.createdNew,
      });

      // Refresh connection status
      await checkStatus();
    } catch (err: any) {
      console.error('Failed to push files to GitHub:', err);
      setErrorMsg(err.message || 'GitHub-এ ফাইল পাঠাতে ত্রুটি হয়েছে।');
    } finally {
      setPushing(false);
    }
  };

  // Connect via Personal Access Token
  const handleConnectPat = async () => {
    if (!patInput.trim()) {
      setErrorMsg('অনুগ্রহ করে একটি বৈধ GitHub Personal Access Token (PAT) লিখুন।');
      return;
    }

    setPatSubmitting(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/github/connect-pat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: patInput.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'টোকেন যাচাইকরণ ব্যর্থ হয়েছে');
      }

      setPatInput('');
      setShowPatInput(false);
      await checkStatus();
    } catch (err: any) {
      setErrorMsg(err.message || 'GitHub টোকেন দিয়ে সংযোগ স্থাপন করা যায়নি।');
    } finally {
      setPatSubmitting(false);
    }
  };

  const copyGitCommands = () => {
    const targetUser = statusData?.user?.login || 'YOUR_GITHUB_USERNAME';
    const targetRepo = pushRepoName || 'nctb-education';
    const cmd = `# ১. লোকাল রিপোজিটরি প্রস্তুত:
git add .
git commit -m "feat: complete Bangla Shikkhagor platform with AI and NCTB curriculum"

# ২. আপনার GitHub রিমোট লিঙ্ক যুক্ত করুন:
git remote add origin https://github.com/${targetUser}/${targetRepo}.git
git branch -M main

# ৩. GitHub-এ সম্পূর্ণ প্রজেক্ট পুশ করুন:
git push -u origin main`;
    navigator.clipboard.writeText(cmd);
    setCopiedCmd(true);
    setTimeout(() => setCopiedCmd(false), 2000);
  };

  if (!isOpen) return null;

  const isConnected = statusData?.connected === true && !!statusData?.user;

  return (
    <div
      id="github-connection-modal-backdrop"
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        id="github-connection-modal"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden my-6 animate-scale-in"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/40">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 dark:bg-slate-700 text-white flex items-center justify-center">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-slate-900 dark:text-slate-100">
                GitHub Repository & Sync Manager
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                সরাসরি GitHub-এ সমস্ত ফাইল ও কোড পুশ করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          {/* Status Badge Card */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between ${
              isConnected
                ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
                : 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {isConnected ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 shrink-0" />
              )}
              <div>
                <p className="text-xs font-bold">
                  {isConnected ? 'GitHub Connected' : 'GitHub Not Connected'}
                </p>
                <p className="text-[11px] opacity-80">
                  {isConnected
                    ? `অ্যাকাউন্ট: @${statusData?.user?.login}`
                    : 'Personal Access Token প্রদান করে সরাসরি ফাইল পুশ করতে পারেন'}
                </p>
              </div>
            </div>

            <button
              onClick={checkStatus}
              disabled={loading}
              className="p-2 rounded-lg bg-white/80 dark:bg-slate-800 hover:bg-white text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-xs transition flex items-center gap-1.5"
              title="স্ট্যাটাস রিফ্রেশ করুন"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">রিফ্রেশ</span>
            </button>
          </div>

          {/* Success Message Banner */}
          {pushSuccessResult && (
            <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-300 dark:border-emerald-800 space-y-2">
              <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>সবগুলো ফাইল সফলভাবে GitHub-এ পাঠানো হয়েছে!</span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">
                আপনার রিপোজিটরিতে সমস্ত সোর্স কোড ও কারিকুলাম সফলভাবে পুশ সম্পন্ন হয়েছে।
              </p>
              <a
                href={pushSuccessResult.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition shadow-xs"
              >
                <span>GitHub-এ রিপোজিটরি দেখুন</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {/* Error Message */}
          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Push All Files to GitHub Card */}
          <div className="p-4 rounded-xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-md">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
              <UploadCloud className="w-4 h-4 text-emerald-400" />
              <div>
                <h3 className="text-xs font-bold text-white">
                  সকালে আপডেট ও ডিলিট করা ফাইলগুলো GitHub-এ পুশ করুন
                </h3>
                <p className="text-[10px] text-slate-400">
                  শুধুমাত্র আজকের সকালের এআই আপডেট ও ডিলিট করা অংশ পুশ হবে
                </p>
              </div>
            </div>

            {/* Morning Changed Files Summary */}
            <div className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 space-y-1.5 text-[11px]">
              <p className="font-semibold text-emerald-400 text-[10px] uppercase tracking-wider">
                আজকে সকালের নির্দিষ্ট ফাইল পরিবর্তনসমূহ:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1 text-[10px] text-slate-300">
                <div className="flex items-center gap-1.5 text-rose-300">
                  <span className="text-rose-400 font-bold">✕ ডিলিট:</span>
                  <span>Navbar ও Footer GitHub বোতাম</span>
                </div>
                <div className="flex items-center gap-1.5 text-rose-300">
                  <span className="text-rose-400 font-bold">✕ ডিলিট:</span>
                  <span>HomePage GitHub ব্যানার কার্ড</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <span className="text-emerald-400 font-bold">✓ আপডেট:</span>
                  <span>server.ts (AI ইঞ্জিন ও দ্রুত রেসপন্স)</span>
                </div>
                <div className="flex items-center gap-1.5 text-emerald-300">
                  <span className="text-emerald-400 font-bold">✓ আপডেট:</span>
                  <span>AIChatPage.tsx (AI ত্রুটি সমাধান ও Retry)</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <label className="block text-slate-300 text-[11px] mb-1 font-medium">
                  রিপোজিটরি নাম (Repository Name):
                </label>
                <input
                  type="text"
                  value={pushRepoName}
                  onChange={(e) => setPushRepoName(e.target.value)}
                  placeholder="nctb-education"
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:ring-1 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-slate-300 text-[11px] mb-1 font-medium">
                  দৃশ্যমানতা (Visibility):
                </label>
                <div className="flex gap-4 pt-2">
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="repoVisibility"
                      checked={!pushIsPrivate}
                      onChange={() => setPushIsPrivate(false)}
                      className="text-emerald-500"
                    />
                    <span>পাবলিক (Public)</span>
                  </label>
                  <label className="flex items-center gap-1.5 cursor-pointer text-xs">
                    <input
                      type="radio"
                      name="repoVisibility"
                      checked={pushIsPrivate}
                      onChange={() => setPushIsPrivate(true)}
                      className="text-emerald-500"
                    />
                    <span>প্রাইভেট (Private)</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Token Input if not connected */}
            {!isConnected && (
              <div className="pt-1">
                <label className="block text-slate-300 text-[11px] mb-1 font-medium">
                  GitHub Personal Access Token (PAT):
                </label>
                <input
                  type="password"
                  value={patInput}
                  onChange={(e) => setPatInput(e.target.value)}
                  placeholder="ghp_xxxxxxxxxxxxxxxxxxxx (repo scope সহ)"
                  className="w-full p-2.5 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-mono placeholder:text-slate-500"
                />
                <p className="text-[10px] text-slate-400 mt-1">
                  GitHub Settings → Developer Settings → Personal Access Tokens (Classic) থেকে 'repo' অনুমতিসহ তৈরি করুন।
                </p>
              </div>
            )}

            <button
              onClick={() => handlePushAllFiles()}
              disabled={pushing || (!isConnected && !patInput.trim())}
              className={`w-full py-2.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition shadow-md cursor-pointer ${
                pushing || (!isConnected && !patInput.trim())
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white'
              }`}
            >
              <UploadCloud className={`w-4 h-4 ${pushing ? 'animate-bounce' : ''}`} />
              <span>
                {pushing
                  ? 'সকালের আপডেটগুলো GitHub-এ পাঠানো হচ্ছে...'
                  : 'সকালের আপডেট ও ডিলিট করা ফাইলগুলো GitHub-এ পুশ করুন'}
              </span>
            </button>
          </div>

          {/* Terminal / Git Command alternative */}
          <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Terminal className="w-3.5 h-3.5 text-slate-500" />
                <span>টার্মিনাল থেকে সরাসরি পুশ করার কমান্ড</span>
              </div>
              <button
                onClick={copyGitCommands}
                className="text-[11px] font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                {copiedCmd ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                <span>{copiedCmd ? 'কপি হয়েছে' : 'কমান্ড কপি করুন'}</span>
              </button>
            </div>
            <pre className="p-2.5 rounded-lg bg-slate-900 text-slate-200 text-[11px] font-mono overflow-x-auto leading-relaxed">
{`git remote add origin https://github.com/${statusData?.user?.login || 'USERNAME'}/${pushRepoName}.git
git branch -M main
git push -u origin main`}
            </pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/20 text-xs">
          <span className="text-[11px] text-slate-400">
            সর্বশেষ যাচাই: {lastChecked || 'এখনই'}
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-200 font-semibold text-xs hover:bg-slate-300 dark:hover:bg-slate-700 transition"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
};
