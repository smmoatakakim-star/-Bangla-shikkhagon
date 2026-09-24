import React, { useState, useRef } from 'react';
import {
  Send,
  Camera,
  Video as VideoIcon,
  X,
  ArrowLeft,
  Sparkles,
  AlertCircle,
  Loader2,
  Film,
  Check,
  Play,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ClassId, SubjectId } from '../types';

export const CreatePostPage: React.FC = () => {
  const { currentUser, subjects, classes, createPost, navigate } = useApp();

  const [text, setText] = useState('');
  const [subjectId, setSubjectId] = useState<SubjectId>('bangla');
  const [classId, setClassId] = useState<ClassId>(currentUser?.classGrade || 'class-9');

  // Media state
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string | null>(null);

  // Upload progress state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <AlertCircle className="w-12 h-12 text-amber-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
          পোস্ট করতে লগইন প্রয়োজন
        </h2>
        <p className="text-xs text-slate-500">
          শিক্ষামূলক প্রশ্ন বা আলোচনা শেয়ার করতে অনুগ্রহ করে প্রথমে সাইন ইন বা রেজিস্টার করুন।
        </p>
        <button
          onClick={() => navigate('login')}
          className="px-6 py-2.5 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-md"
        >
          লগইন পাতায় যান
        </button>
      </div>
    );
  }

  // Extract video thumbnail frame
  const extractVideoThumbnail = (file: File): Promise<string> => {
    return new Promise((resolve) => {
      const video = document.createElement('video');
      video.preload = 'metadata';
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;

      video.onloadeddata = () => {
        video.currentTime = Math.min(1.0, video.duration / 2);
      };

      video.onseeked = () => {
        try {
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth || 640;
          canvas.height = video.videoHeight || 360;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
            const thumbUrl = canvas.toDataURL('image/jpeg', 0.85);
            URL.revokeObjectURL(url);
            resolve(thumbUrl);
            return;
          }
        } catch (e) {
          console.warn('Could not extract video frame thumbnail:', e);
        }
        URL.revokeObjectURL(url);
        resolve('');
      };

      video.onerror = () => {
        URL.revokeObjectURL(url);
        resolve('');
      };
    });
  };

  // Image Selection Handler
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      setErrorMessage('ছবিটি অনেক বড় (সর্বোচ্চ ২০ মেগাবাইট)। ছোট সাইজের ছবি নির্বাচন করুন।');
      return;
    }

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('ছবিটি নির্বাচন করা যায়নি। শুধুমাত্র JPG, PNG বা WEBP ছবি নির্বাচন করুন।');
      return;
    }

    setSelectedFile(file);
    setMediaType('image');
    setVideoThumbnailUrl(null);
    setMediaPreviewUrl(URL.createObjectURL(file));
    e.target.value = '';
  };

  // Video Selection Handler
  const handleVideoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 80 * 1024 * 1024) {
      setErrorMessage('ভিডিওটি অনেক বড় (সর্বোচ্চ ৮০ মেগাবাইট)। ছোট একটি ভিডিও নির্বাচন করুন।');
      return;
    }

    const validTypes = [
      'video/mp4',
      'video/webm',
      'video/ogg',
      'video/quicktime',
      'video/x-matroska',
      'video/3gpp',
    ];
    if (
      !validTypes.includes(file.type.toLowerCase()) &&
      !file.name.match(/\.(mp4|webm|mov|mkv|3gp|ogg)$/i)
    ) {
      setErrorMessage('ভিডিও ফাইল ফরম্যাট সমর্থিত নয়। MP4, WEBM বা MOV ভিডিও নির্বাচন করুন।');
      return;
    }

    setSelectedFile(file);
    setMediaType('video');
    const objectUrl = URL.createObjectURL(file);
    setMediaPreviewUrl(objectUrl);

    // Extract thumbnail
    const thumb = await extractVideoThumbnail(file);
    if (thumb) {
      setVideoThumbnailUrl(thumb);
    }

    e.target.value = '';
  };

  const handleClearMedia = () => {
    if (mediaPreviewUrl) {
      URL.revokeObjectURL(mediaPreviewUrl);
    }
    setSelectedFile(null);
    setMediaPreviewUrl(null);
    setVideoThumbnailUrl(null);
    setMediaType('none');
    setErrorMessage(null);
  };

  const handleCancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(0);
    setErrorMessage('আপলোড বাতিল করা হয়েছে।');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim() && !selectedFile) {
      setErrorMessage('পোস্টে কিছু লিখুন অথবা একটি ছবি/ভিডিও নির্বাচন করুন।');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    let finalImageUrl: string | undefined = undefined;
    let finalVideoUrl: string | undefined = undefined;

    if (selectedFile) {
      try {
        const formData = new FormData();
        formData.append('file', selectedFile, selectedFile.name);

        const uploadedUrl = await new Promise<string>((resolve, reject) => {
          const xhr = new XMLHttpRequest();
          xhrRef.current = xhr;

          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percent = Math.round((event.loaded / event.total) * 100);
              setUploadProgress(percent);
            }
          };

          xhr.onload = () => {
            if (xhr.status >= 200 && xhr.status < 300) {
              try {
                const response = JSON.parse(xhr.responseText);
                if (response.url) {
                  resolve(response.url);
                } else {
                  reject(new Error('সার্ভার থেকে সঠিক ইউআরএল পাওয়া যায়নি।'));
                }
              } catch {
                reject(new Error('রেসপন্স পার্স করা যায়নি।'));
              }
            } else {
              try {
                const errData = JSON.parse(xhr.responseText);
                reject(new Error(errData.error || 'আপলোড ব্যর্থ হয়েছে।'));
              } catch {
                reject(new Error('আপলোড ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।'));
              }
            }
          };

          xhr.onerror = () => {
            reject(new Error('আপলোড ব্যর্থ হয়েছে। ইন্টারনেট সংযোগ পরীক্ষা করুন।'));
          };

          xhr.onabort = () => {
            reject(new Error('আপলোড বাতিল করা হয়েছে।'));
          };

          xhr.open('POST', '/api/upload', true);
          xhr.send(formData);
        });

        if (mediaType === 'image') {
          finalImageUrl = uploadedUrl;
        } else if (mediaType === 'video') {
          finalVideoUrl = uploadedUrl;
        }
      } catch (err: any) {
        setIsUploading(false);
        setErrorMessage(err.message || 'আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
        return;
      }
    }

    createPost(text.trim(), subjectId, classId, {
      imageUrl: finalImageUrl,
      videoUrl: finalVideoUrl,
      videoThumbnail: videoThumbnailUrl || undefined,
      mediaType: mediaType === 'none' ? 'text' : mediaType,
    });

    setSuccessMessage('✓ পোস্ট সফলভাবে প্রকাশিত হয়েছে!');
    setUploadProgress(100);

    setTimeout(() => {
      setIsUploading(false);
      navigate('profile', { userId: currentUser.id });
    }, 1200);
  };

  return (
    <div id="create-post-page" className="max-w-2xl mx-auto space-y-6 pb-20">
      {/* Hidden inputs */}
      <input
        ref={imageInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleImageSelect}
      />
      <input
        ref={videoInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleVideoSelect}
      />

      {/* Header */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => navigate('posts')}
          className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-slate-100">
            নতুন পোস্ট বা জিজ্ঞাসা তৈরি করুন
          </h1>
          <p className="text-xs text-slate-500">
            ছবি বা ভিডিও সহ পড়াশোনার প্রশ্ন ও আলোচনা শিক্ষক ও বন্ধুদের সাথে শেয়ার করুন
          </p>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-5"
      >
        {/* Author info pill */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/40"
          />
          <div>
            <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block">
              {currentUser.name}
            </span>
            <span className="text-[11px] text-slate-500 dark:text-slate-400">
              {currentUser.role === 'teacher' ? 'শিক্ষক' : currentUser.schoolName || 'শিক্ষার্থী'}
            </span>
          </div>
        </div>

        {/* Category & Class Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              পাঠ্য বিষয় নির্বাচন:
            </label>
            <select
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value as SubjectId)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              শ্রেণি:
            </label>
            <select
              value={classId}
              onChange={(e) => setClassId(e.target.value as ClassId)}
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-semibold"
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Text body */}
        <div>
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
            ক্যাপশন বা প্রশ্ন লিখুন:
          </label>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={5}
            placeholder="পড়াশোনা সংক্রান্ত যেকোনো প্রশ্ন বা শিক্ষণীয় বিষয় লিখুন..."
            className="w-full text-sm p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/40 text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 leading-relaxed"
          />
        </div>

        {/* Media Buttons */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
            ছবি বা ভিডিও যুক্ত করুন:
          </label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => imageInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
            >
              <Camera className="w-4 h-4 text-emerald-600" />
              <span>📷 ছবি আপলোড</span>
            </button>

            <button
              type="button"
              onClick={() => videoInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center justify-center gap-2 p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
            >
              <VideoIcon className="w-4 h-4 text-teal-600" />
              <span>🎥 ভিডিও আপলোড</span>
            </button>
          </div>
        </div>

        {/* Media Preview Box */}
        {mediaType === 'image' && mediaPreviewUrl && (
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
            <img
              src={mediaPreviewUrl}
              alt="Preview"
              className="w-full max-h-64 object-contain mx-auto"
            />
            <button
              type="button"
              onClick={handleClearMedia}
              className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {mediaType === 'video' && mediaPreviewUrl && (
          <div className="space-y-2">
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
              <video
                src={mediaPreviewUrl}
                controls
                playsInline
                className="w-full max-h-64 object-contain mx-auto"
              />
              <button
                type="button"
                onClick={handleClearMedia}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="flex items-center justify-between text-[11px] text-slate-500 px-1">
              <span className="flex items-center gap-1 text-teal-600 font-semibold">
                <Film className="w-3.5 h-3.5" />
                <span>ভিডিও প্রিভিউ</span>
              </span>
              {selectedFile && (
                <span>সাইজ: {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</span>
              )}
            </div>
          </div>
        )}

        {/* Progress Bar & Status */}
        {isUploading && (
          <div className="space-y-2 p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-900/60">
            <div className="flex items-center justify-between text-xs font-bold text-emerald-800 dark:text-emerald-200">
              <span className="flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
                <span>মিডিয়া ফাইল আপলোড হচ্ছে...</span>
              </span>
              <span>{uploadProgress}%</span>
            </div>
            <div className="w-full h-2.5 bg-emerald-200/60 dark:bg-emerald-900/60 rounded-full overflow-hidden">
              <div
                className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleCancelUpload}
                className="text-[11px] text-rose-600 hover:underline font-bold"
              >
                আপলোড বাতিল করুন
              </button>
            </div>
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Success Alert */}
        {successMessage && (
          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('posts')}
            disabled={isUploading}
            className="px-5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            বাতিল
          </button>
          <button
            type="submit"
            disabled={isUploading || (!text.trim() && !selectedFile)}
            className="px-7 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center gap-2 disabled:opacity-50"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>পোস্ট হচ্ছে...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>পোস্ট প্রকাশ করুন</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
