import React, { useState, useEffect, useCallback } from 'react';
import {
  X,
  RefreshCw,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Github,
  GitFork,
  Star,
  Lock,
  Globe,
  BookMarked,
  Users,
  LogOut,
  KeyRound,
  Info,
  UploadCloud,
  GitBranch,
  FolderGit2,
  Copy,
  Check,
} from 'lucide-react';

export interface GitHubUser {
  login: string;
  name?: string;
  avatarUrl?: string;
  profileUrl?: string;
  bio?: string;
  publicRepos?: number;
  followers?: number;
  following?: number;
}

export interface GitHubRepo {
  id: number;
  name: string;
  fullName: string;
  htmlUrl: string;
  description?: string;
  isPrivate: boolean;
  stars: number;
  forks: number;
  language: string;
  updatedAt: string;
}

export interface GitHubStatusResponse {
  connected: boolean;
  configured: boolean;
  user?: GitHubUser;
  repositories?: GitHubRepo[];
  message?: string;
  error?: string;
  checkedAt?: string;
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
  const [status, setStatus] = useState<GitHubStatusResponse | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showTokenInput, setShowTokenInput] = useState<boolean>(false);
  const [patInput, setPatInput] = useState<string>('');
  const [patLoading, setPatLoading] = useState<boolean>(false);
  const [repoNameInput, setRepoNameInput] = useState<string>('nctb-education');
  const [isPrivateRepo, setIsPrivateRepo] = useState<boolean>(false);
  const [pushingFiles, setPushingFiles] = useState<boolean>(false);
  const [pushSuccessResult, setPushSuccessResult] = useState<{
    repoUrl: string;
    repoName: string;
    username: string;
    branch: string;
    message: string;
  } | null>(null);
  const [showManualCommands, setShowManualCommands] = useState<boolean>(false);
  const [copiedCommands, setCopiedCommands] = useState<boolean>(false);

  // Check connection status via real server API & official GitHub REST API
  const checkConnection = useCallback(async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/github/status', {
        credentials: 'include',
      });
      if (!res.ok) {
        throw new Error(`Server returned status: ${res.status}`);
      }
      const data: GitHubStatusResponse = await res.json();
      setStatus(data);
    } catch (err: any) {
      console.warn('GitHub connection check error:', err);
      setStatus({
        connected: false,
        configured: false,
        message: 'GitHub Not Connected',
      });
    } finally {
      setLoading(false);
    }
  }, []);

  // Check on modal open
  useEffect(() => {
    if (isOpen) {
      checkConnection();
    }
  }, [isOpen, checkConnection]);

  // Listen for popup postMessage
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin if needed or inspect data
      if (event.data?.type === 'GITHUB_AUTH_SUCCESS') {
        setConnecting(false);
        checkConnection();
      } else if (event.data?.type === 'GITHUB_AUTH_ERROR') {
        setConnecting(false);
        setErrorMsg(event.data?.error || 'GitHub অনুমোদন ব্যর্থ হয়েছে');
        checkConnection();
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [checkConnection]);

  // Start OAuth popup flow
  const handleConnectOAuth = async () => {
    setConnecting(true);
    setErrorMsg(null);

    try {
      const redirectUri = `${window.location.origin}/auth/github/callback`;
      const res = await fetch(
        `/api/github/auth-url?redirect_uri=${encodeURIComponent(redirectUri)}`
      );
      const data = await res.json();

      if (!data.configured || !data.url) {
        setConnecting(false);
        setShowTokenInput(true);
        setErrorMsg(
          'GitHub OAuth Client ID কনফিগার করা নেই। নিচে প্রদত্ত নির্দেশনা অনুযায়ী সেটআপ করুন অথবা Personal Access Token দিয়ে সরাসরি টেস্ট করুন।'
        );
        return;
      }

      // Open OAuth provider directly in popup window (never the container URL)
      const popupWidth = 600;
      const popupHeight = 700;
      const left = window.screenX + (window.outerWidth - popupWidth) / 2;
      const top = window.screenY + (window.outerHeight - popupHeight) / 2;

      const authPopup = window.open(
        data.url,
        'github_oauth_popup',
        `width=${popupWidth},height=${popupHeight},left=${left},top=${top},resizable=yes,scrollbars=yes,status=yes`
      );

      if (!authPopup) {
        setConnecting(false);
        setErrorMsg('পপ-আপ উইন্ডো ব্লক করা হয়েছে। অনুগ্রহ করে ব্রাউজারের পপ-আপ অনুমোদন করুন।');
        return;
      }

      // Fallback check: check every 2 seconds if popup was closed
      const checkTimer = setInterval(() => {
        if (authPopup.closed) {
          clearInterval(checkTimer);
          setConnecting(false);
          checkConnection();
        }
      }, 1500);
    } catch (err: any) {
      console.error('Error initiating OAuth:', err);
      setConnecting(false);
      setErrorMsg('GitHub OAuth শুরু করতে সমস্যা হয়েছে।');
    }
  };

  // Connect via PAT
  const handleConnectPAT = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!patInput.trim()) return;

    setPatLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/github/connect-pat', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: patInput.trim() }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setErrorMsg(data.error || 'টোকেনটি সঠিক নয় বা প্রয়োজনীয় অনুমতি নেই।');
      } else {
        setPatInput('');
        setShowTokenInput(false);
        checkConnection();
      }
    } catch (err: any) {
      setErrorMsg('টোকেন ভেরিফিকেশন ব্যর্থ হয়েছে।');
    } finally {
      setPatLoading(false);
    }
  };

  // Disconnect
  const handleDisconnect = async () => {
    if (!window.confirm('আপনি কি নিশ্চিত যে GitHub সংযোগ বিচ্ছিন্ন করতে চান?')) {
      return;
    }
    setLoading(true);
    try {
      await fetch('/api/github/disconnect', {
        method: 'POST',
        credentials: 'include',
      });
      await checkConnection();
    } catch (err) {
      console.error('Error disconnecting GitHub:', err);
    } finally {
      setLoading(false);
    }
  };

  // Push all files to GitHub repository
  const handlePushAllFiles = async (tokenOverride?: string) => {
    setPushingFiles(true);
    setErrorMsg(null);
    setPushSuccessResult(null);

    const tokenToUse = tokenOverride || patInput.trim();

    try {
      const res = await fetch('/api/github/push-all-files', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoName: repoNameInput.trim() || 'nctb-education',
          isPrivate: isPrivateRepo,
          token: tokenToUse || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        throw new Error(data.error || 'GitHub-এ ফাইল পাঠাতে ব্যর্থ হয়েছে।');
      }

      setPushSuccessResult({
        repoUrl: data.repoUrl,
        repoName: data.repoName,
        username: data.username,
        branch: data.branch || 'main',
        message: data.message,
      });

      // Refresh connection to update repository list
      await checkConnection();
    } catch (err: any) {
      console.error('Failed to push files to GitHub:', err);
      setErrorMsg(err.message || 'GitHub-এ ফাইল পাঠাতে ত্রুটি হয়েছে।');
    } finally {
      setPushingFiles(false);
    }
  };

  const getGitCliInstructions = () => {
    const targetUser = user?.login || 'YOUR_GITHUB_USERNAME';
    const targetRepo = repoNameInput.trim() || 'nctb-education';
    return `# ১. লোকাল টার্মিনাল বা কমান্ড প্রম্পটে প্রজেক্ট ফোল্ডারে যান:
cd nctb-education

# ২. গিট ইনিশিয়ালাইজ করুন ও মেইন ব্রাঞ্চ সেট করুন:
git init
git branch -M main

# ৩. সমস্ত ফাইল যুক্ত করুন এবং কমিট করুন:
git add .
git commit -m "feat: complete NCTB Education learning platform"

# ৪. আপনার GitHub রিপোজিটরি রিমোট হিসেবে যুক্ত করুন:
git remote add origin https://github.com/${targetUser}/${targetRepo}.git

# ৫. GitHub-এ সব ফাইল পুশ করুন:
git push -u origin main`;
  };

  const copyGitCommands = () => {
    navigator.clipboard.writeText(getGitCliInstructions());
    setCopiedCommands(true);
    setTimeout(() => setCopiedCommands(false), 2500);
  };

  if (!isOpen) return null;

  const isConnected = !!status?.connected;
  const user = status?.user;
  const repos = status?.repositories || [];

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-slate-900 dark:bg-slate-800 text-white flex items-center justify-center shadow-xs">
              <Github className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight">
                GitHub Connection Status
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                গিটহাব সংযোগ স্থিতি ও রিপোজিটরি ট্র্যাকার
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800 transition"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {/* Error Notice */}
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/50 flex items-start gap-2.5 text-xs text-rose-700 dark:text-rose-300">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-500 mt-0.5" />
              <div className="flex-1 leading-relaxed">{errorMsg}</div>
            </div>
          )}

          {/* Loading Indicator */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Checking GitHub Connection via Official API...
              </p>
              <p className="text-xs text-slate-400">
                গিটহাবের অফিসিয়াল সার্ভারের সাথে সংযোগ যাচাই করা হচ্ছে
              </p>
            </div>
          ) : isConnected && user ? (
            /* ========================================= */
            /* 1. CONNECTED STATE                        */
            /* ========================================= */
            <div className="space-y-4">
              {/* Primary Status Banner */}
              <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-emerald-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-emerald-800 dark:text-emerald-300">
                        GitHub Connected
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200/70 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-200">
                        সক্রিয়
                      </span>
                    </div>
                    <p className="text-xs text-emerald-700 dark:text-emerald-400">
                      অফিসিয়াল GitHub REST API এর সাথে সফলভাবে সংযুক্ত
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleDisconnect}
                  className="px-2.5 py-1.5 rounded-lg border border-emerald-300 dark:border-emerald-700 text-emerald-800 dark:text-emerald-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 text-xs font-semibold flex items-center gap-1.5 transition"
                  title="Disconnect"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">সংযোগ বিচ্ছিন্ন</span>
                </button>
              </div>

              {/* User Profile Card */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                <div className="flex items-center gap-3.5">
                  <img
                    src={
                      user.avatarUrl ||
                      'https://avatars.githubusercontent.com/u/9919?s=200&v=4'
                    }
                    alt={user.login}
                    className="w-14 h-14 rounded-full border-2 border-white dark:border-slate-700 shadow-xs"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 truncate">
                        {user.name || user.login}
                      </h3>
                      {user.profileUrl && (
                        <a
                          href={user.profileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400">
                      @{user.login}
                    </p>
                    {user.bio && (
                      <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 line-clamp-2">
                        {user.bio}
                      </p>
                    )}
                  </div>
                </div>

                {/* User Metrics */}
                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200/70 dark:border-slate-700 text-center">
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {user.publicRepos ?? 0}
                    </div>
                    <div className="text-[10px] text-slate-500">পাবলিক রিপোজিটরি</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {user.followers ?? 0}
                    </div>
                    <div className="text-[10px] text-slate-500">ফলোয়ার্স</div>
                  </div>
                  <div className="p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700/50">
                    <div className="text-sm font-bold text-slate-800 dark:text-slate-200">
                      {user.following ?? 0}
                    </div>
                    <div className="text-[10px] text-slate-500">ফলোয়িং</div>
                  </div>
                </div>
              </div>

              {/* Push All Files to GitHub Card */}
              <div className="p-4 rounded-xl bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white border border-slate-700 shadow-md space-y-3.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                      <UploadCloud className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs sm:text-sm font-bold text-white">
                        সবগুলো ফাইল GitHub-এ পাস করান
                      </h4>
                      <p className="text-[11px] text-slate-300">
                        প্রজেক্টের ১১৫টি ফাইল সরাসরি আপনার গিটহাব রিপোজিটরিতে পুশ করুন
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shrink-0">
                    Main Branch
                  </span>
                </div>

                {pushSuccessResult ? (
                  <div className="p-3 rounded-xl bg-emerald-950/70 border border-emerald-500/50 space-y-1.5">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold">
                      <CheckCircle2 className="w-4 h-4 shrink-0" />
                      <span>{pushSuccessResult.message}</span>
                    </div>
                    <p className="text-[11px] text-emerald-200">
                      রিপোজিটরি:{' '}
                      <a
                        href={pushSuccessResult.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="underline font-bold text-white hover:text-emerald-300 inline-flex items-center gap-1"
                      >
                        <span>{pushSuccessResult.username}/{pushSuccessResult.repoName}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </p>
                  </div>
                ) : null}

                <div className="space-y-2.5 pt-1">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        রিপোজিটরি নাম (Repository Name)
                      </label>
                      <input
                        type="text"
                        value={repoNameInput}
                        onChange={(e) => setRepoNameInput(e.target.value)}
                        placeholder="nctb-education"
                        className="w-full px-3 py-1.5 text-xs rounded-lg bg-slate-900 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-mono"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-slate-300 block mb-1">
                        গোপনীয়তা (Visibility)
                      </label>
                      <div className="flex items-center gap-3 pt-1 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="visibility"
                            checked={!isPrivateRepo}
                            onChange={() => setIsPrivateRepo(false)}
                            className="text-emerald-500 focus:ring-emerald-500"
                          />
                          <span>পাবলিক (Public)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="visibility"
                            checked={isPrivateRepo}
                            onChange={() => setIsPrivateRepo(true)}
                            className="text-emerald-500 focus:ring-emerald-500"
                          />
                          <span>প্রাইভেট (Private)</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => handlePushAllFiles()}
                    disabled={pushingFiles}
                    className="w-full py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                  >
                    {pushingFiles ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>ফাইলসমূহ গিটহাবে পাঠানো হচ্ছে...</span>
                      </>
                    ) : (
                      <>
                        <UploadCloud className="w-4 h-4" />
                        <span>GitHub-এ সমস্ত ফাইল পুশ করুন (Push All Files)</span>
                      </>
                    )}
                  </button>
                </div>

                <div className="pt-1 flex items-center justify-between text-[11px]">
                  <button
                    type="button"
                    onClick={() => setShowManualCommands(!showManualCommands)}
                    className="text-slate-400 hover:text-slate-200 underline flex items-center gap-1"
                  >
                    <FolderGit2 className="w-3.5 h-3.5" />
                    <span>{showManualCommands ? 'কমান্ড লুকান' : 'ম্যানুয়াল Git CLI কমান্ড দেখুন'}</span>
                  </button>
                  <span className="text-slate-400 text-[10px]">
                    স্বয়ংক্রিয়ভাবে নতুন রিপো তৈরি করে
                  </span>
                </div>

                {showManualCommands && (
                  <div className="mt-2 p-3 rounded-xl bg-black/60 border border-slate-800 space-y-2 text-left">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400 font-mono">Terminal Commands</span>
                      <button
                        type="button"
                        onClick={copyGitCommands}
                        className="text-[10px] text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
                      >
                        {copiedCommands ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedCommands ? 'কপি হয়েছে!' : 'কপি করুন'}</span>
                      </button>
                    </div>
                    <pre className="text-[10px] font-mono text-emerald-300/90 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {getGitCliInstructions()}
                    </pre>
                  </div>
                )}
              </div>

              {/* Connected Repositories */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                    <BookMarked className="w-3.5 h-3.5" />
                    <span>সংযুক্ত রিপোজিটরি তালিকা ({repos.length})</span>
                  </h4>
                  {user.profileUrl && (
                    <a
                      href={`${user.profileUrl}?tab=repositories`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                    >
                      <span>সকল রিপো</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>

                {repos.length === 0 ? (
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-center text-xs text-slate-500">
                    কোনো সক্রিয় রিপোজিটরি পাওয়া যায়নি।
                  </div>
                ) : (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {repos.map((repo) => (
                      <a
                        key={repo.id}
                        href={repo.htmlUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group block p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50 hover:bg-emerald-50/50 dark:hover:bg-slate-800 border border-slate-200/70 dark:border-slate-700/60 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              {repo.isPrivate ? (
                                <Lock className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              ) : (
                                <Globe className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                              )}
                              <span className="text-xs font-bold text-slate-900 dark:text-slate-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 truncate">
                                {repo.name}
                              </span>
                            </div>
                            {repo.description && (
                              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mt-0.5">
                                {repo.description}
                              </p>
                            )}
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-slate-500 shrink-0">
                            {repo.language && (
                              <span className="px-1.5 py-0.5 rounded bg-slate-200/60 dark:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium">
                                {repo.language}
                              </span>
                            )}
                            {repo.stars > 0 && (
                              <span className="flex items-center gap-0.5 text-amber-500 font-medium">
                                <Star className="w-3 h-3 fill-amber-500" />
                                {repo.stars}
                              </span>
                            )}
                            <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-emerald-500" />
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* ========================================= */
            /* 2. NOT CONNECTED STATE                    */
            /* ========================================= */
            <div className="space-y-4">
              {/* Primary Status Banner */}
              <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-900/60 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-rose-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm sm:text-base font-bold text-rose-800 dark:text-rose-300">
                        GitHub Not Connected
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-200/70 dark:bg-rose-900 text-rose-800 dark:text-rose-200">
                        বিচ্ছিন্ন
                      </span>
                    </div>
                    <p className="text-xs text-rose-700 dark:text-rose-400">
                      কোনো গিটহাব অ্যাকাউন্ট বর্তমানে যুক্ত নেই
                    </p>
                  </div>
                </div>
              </div>

              {/* Connect Action Box */}
              <div className="p-5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-slate-900 text-white flex items-center justify-center mx-auto shadow-sm">
                  <Github className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    GitHub অ্যাকাউন্টের সাথে সংযোগ করুন
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    নিরাপদ OAuth অথেনটিকেশনের মাধ্যমে আপনার গিটহাব অ্যাকাউন্ট যুক্ত করে স্ট্যাটাস ও রিপোজিটরি ডেটা যাচাই করুন।
                  </p>
                </div>

                <div className="pt-2">
                  <button
                    onClick={handleConnectOAuth}
                    disabled={connecting}
                    className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-black dark:bg-emerald-600 dark:hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition flex items-center justify-center gap-2 mx-auto disabled:opacity-50"
                  >
                    {connecting ? (
                      <RefreshCw className="w-4 h-4 animate-spin" />
                    ) : (
                      <Github className="w-4 h-4" />
                    )}
                    <span>{connecting ? 'অনুমোদন খোলা হচ্ছে...' : 'Connect GitHub'}</span>
                  </button>
                </div>
              </div>

              {/* Alternate / Token Test Panel */}
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => setShowTokenInput(!showTokenInput)}
                  className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 mx-auto"
                >
                  <KeyRound className="w-3.5 h-3.5" />
                  <span>
                    {showTokenInput
                      ? 'টোকেন ইনপুট গোপন করুন'
                      : 'অথবা Personal Access Token (PAT) দিয়ে দ্রুত টেস্ট করুন'}
                  </span>
                </button>

                {showTokenInput && (
                  <form
                    onSubmit={handleConnectPAT}
                    className="mt-3 p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2.5 text-left"
                  >
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                        GitHub Personal Access Token (PAT)
                      </label>
                      <span className="text-[10px] text-slate-500">
                        স্কোপ: read:user, repo
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <input
                        type="password"
                        value={patInput}
                        onChange={(e) => setPatInput(e.target.value)}
                        placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                        className="flex-1 px-3 py-2 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      />
                      <button
                        type="submit"
                        disabled={patLoading || !patInput.trim()}
                        className="px-3.5 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs disabled:opacity-50 transition shrink-0"
                      >
                        {patLoading ? 'যাচাই হচ্ছে...' : 'সংযুক্ত করুন'}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-700/60">
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="text"
                          value={repoNameInput}
                          onChange={(e) => setRepoNameInput(e.target.value)}
                          placeholder="রিপোজিটরি নাম (उदा. nctb-education)"
                          className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100 font-mono"
                        />
                        <button
                          type="button"
                          onClick={() => handlePushAllFiles(patInput.trim())}
                          disabled={pushingFiles || !patInput.trim()}
                          className="px-3 py-1.5 rounded-lg bg-slate-900 dark:bg-emerald-600 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition disabled:opacity-50 shrink-0 cursor-pointer"
                        >
                          {pushingFiles ? (
                            <>
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                              <span>পুশ হচ্ছে...</span>
                            </>
                          ) : (
                            <>
                              <UploadCloud className="w-3.5 h-3.5" />
                              <span>সব ফাইল গিটহাবে পাঠান</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                    <p className="text-[10px] text-slate-500 leading-relaxed">
                      * টোকেনটি সার্ভারে তাৎক্ষণিক অফিসিয়াল GitHub API যাচাইয়ের পর সেশন সুরক্ষায় থাকে। এটি ব্রাউজারে কখনো দৃশ্যমান বা প্রদর্শিত হয় না।
                    </p>
                  </form>
                )}
              </div>
            </div>
          )}

          {/* Security Guarantee Notice */}
          <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/40 flex items-start gap-2.5 text-[11px] text-slate-500 dark:text-slate-400">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong className="text-slate-700 dark:text-slate-300 font-semibold">
                নিরাপত্তা নিশ্চয়তা:
              </strong>{' '}
              কোনো অ্যাক্সেস টোকেন, ক্লায়েন্ট সিক্রেট বা ব্যক্তিগত ক্রিডেনশিয়াল কখনো ব্রাউজারে উন্মুক্ত বা প্রদর্শিত হয় না। কেবল গিটহাবের অফিসিয়াল API রেসপন্স যাচাই করা হয়।
            </div>
          </div>
        </div>

        {/* Modal Footer with Refresh / Check Again Button */}
        <div className="px-5 py-3.5 bg-slate-50 dark:bg-slate-900/60 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="text-[10px] text-slate-400">
            {status?.checkedAt && (
              <span>
                সর্বশেষ যাচাই:{' '}
                {new Date(status.checkedAt).toLocaleTimeString('bn-BD', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Refresh / Check Again Button */}
            <button
              id="github-refresh-status-btn"
              onClick={checkConnection}
              disabled={loading}
              className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>Refresh Status</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 font-bold text-xs transition"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
