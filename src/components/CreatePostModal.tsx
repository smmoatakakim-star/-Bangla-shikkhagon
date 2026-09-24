import React, { useState, useRef } from 'react';
import {
  X,
  Camera,
  Video,
  Image as ImageIcon,
  Send,
  Loader2,
  AlertCircle,
  Check,
  Play,
  Film,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SubjectId, ClassId } from '../types';

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultSubjectId?: SubjectId;
  defaultClassId?: ClassId;
}

export const CreatePostModal: React.FC<CreatePostModalProps> = ({
  isOpen,
  onClose,
  defaultSubjectId,
  defaultClassId,
}) => {
  const { currentUser, subjects, classes, createPost } = useApp();

  const [text, setText] = useState('');
  const [subjectId, setSubjectId] = useState<SubjectId>(defaultSubjectId || 'bangla');
  const [classId, setClassId] = useState<ClassId>(
    defaultClassId || currentUser?.classGrade || 'class-9'
  );

  // Media state
  const [mediaType, setMediaType] = useState<'none' | 'image' | 'video'>('none');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [mediaPreviewUrl, setMediaPreviewUrl] = useState<string | null>(null);
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState<string | null>(null);

  // Upload & Progress states
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const videoRecordInputRef = useRef<HTMLInputElement>(null);
  const xhrRef = useRef<XMLHttpRequest | null>(null);

  if (!isOpen) return null;

  // Extract a video frame thumbnail automatically
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

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
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

    // Max 80MB for video
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

    // Generate thumbnail poster
    const thumb = await extractVideoThumbnail(file);
    if (thumb) {
      setVideoThumbnailUrl(thumb);
    }

    e.target.value = '';
  };

  // Cancel upload in-progress
  const handleCancelUpload = () => {
    if (xhrRef.current) {
      xhrRef.current.abort();
      xhrRef.current = null;
    }
    setIsUploading(false);
    setUploadProgress(0);
    setErrorMessage('আপলোড বাতিল করা হয়েছে।');
  };

  // Clear selected media
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

  // Real Publish Handler
  const handlePublish = async () => {
    if (!text.trim() && !selectedFile) {
      setErrorMessage('পোস্ট করতে কিছু লিখুন অথবা একটি ছবি/ভিডিও নির্বাচন করুন।');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);
    setErrorMessage(null);

    let finalImageUrl: string | undefined = undefined;
    let finalVideoUrl: string | undefined = undefined;

    // Upload media if attached
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
              } catch (e) {
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

    // Call createPost in global AppContext
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
      onClose();
      // Reset form
      setText('');
      setSelectedFile(null);
      setMediaPreviewUrl(null);
      setVideoThumbnailUrl(null);
      setMediaType('none');
      setSuccessMessage(null);
    }, 1200);
  };

  return (
    <div
      id="create-post-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={() => !isUploading && onClose()}
    >
      <div
        id="create-post-modal-content"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
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
        <input
          ref={videoRecordInputRef}
          type="file"
          accept="video/*"
          capture="environment"
          className="hidden"
          onChange={handleVideoSelect}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                নতুন পোস্ট বা জিজ্ঞাসা তৈরি করুন
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                সহপাঠী ও শিক্ষকদের সাথে ছবি, ভিডিও বা প্রশ্ন শেয়ার করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isUploading}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Author info pill */}
          {currentUser && (
            <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-10 h-10 rounded-full object-cover border border-emerald-500/40"
              />
              <div className="flex-1 min-w-0">
                <span className="font-bold text-xs text-slate-900 dark:text-slate-100 block truncate">
                  {currentUser.name}
                </span>
                <span className="text-[11px] text-slate-500 dark:text-slate-400 block truncate">
                  {currentUser.role === 'teacher' ? 'শিক্ষক' : currentUser.schoolName || 'শিক্ষার্থী'}
                </span>
              </div>
            </div>
          )}

          {/* Subject & Class Selectors */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                বিষয় নির্বাচন
              </label>
              <select
                id="post-subject-select"
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value as SubjectId)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300 block mb-1">
                শ্রেণি নির্বাচন
              </label>
              <select
                id="post-class-select"
                value={classId}
                onChange={(e) => setClassId(e.target.value as ClassId)}
                className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Caption / Text Area */}
          <div>
            <textarea
              id="create-post-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="পড়াশোনা বা জিজ্ঞাসা সম্পর্কে কিছু লিখুন... (যেমন: সালোকসংশ্লেষণ এর এই সমীকরণটি বুঝতে পারছি না)"
              rows={4}
              className="w-full p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none leading-relaxed"
            />
          </div>

          {/* Media Attach Buttons Bar */}
          <div className="space-y-2">
            <span className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block">
              মিডিয়া ফাইল যুক্ত করুন (ঐচ্ছিক)
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              {/* Photo Button */}
              <button
                type="button"
                id="btn-attach-photo"
                onClick={() => imageInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <Camera className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>📷 ছবি (Photo)</span>
              </button>

              {/* Video Button */}
              <button
                type="button"
                id="btn-attach-video"
                onClick={() => videoInputRef.current?.click()}
                disabled={isUploading}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-teal-500 dark:hover:border-teal-500 hover:bg-teal-50/50 dark:hover:bg-teal-950/20 text-xs font-bold text-slate-700 dark:text-slate-300 transition"
              >
                <Video className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                <span>🎥 ভিডিও (Video)</span>
              </button>
            </div>
          </div>

          {/* Media Preview Box */}
          {mediaType === 'image' && mediaPreviewUrl && (
            <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
              <img
                src={mediaPreviewUrl}
                alt="Post Preview"
                className="w-full max-h-56 object-contain mx-auto"
              />
              <button
                type="button"
                onClick={handleClearMedia}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/60 text-[10px] text-white font-medium">
                ছবি সংযুক্ত করা হয়েছে
              </div>
            </div>
          )}

          {mediaType === 'video' && mediaPreviewUrl && (
            <div className="space-y-2">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950">
                <video
                  src={mediaPreviewUrl}
                  controls
                  playsInline
                  className="w-full max-h-56 object-contain mx-auto"
                />
                <button
                  type="button"
                  onClick={handleClearMedia}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 hover:bg-black/80 text-white transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 px-1">
                <span className="flex items-center gap-1">
                  <Film className="w-3.5 h-3.5 text-teal-600" />
                  <span>ভিডিও প্রিভিউ প্রস্তুত</span>
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
                  <span>আপলোড হচ্ছে...</span>
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

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2 font-bold">
              <Check className="w-4 h-4 shrink-0" />
              <span>{successMessage}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:px-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex items-center justify-between gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            disabled={isUploading}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            বাতিল
          </button>

          <button
            id="btn-publish-post"
            type="button"
            onClick={handlePublish}
            disabled={isUploading || (!text.trim() && !selectedFile)}
            className="flex-1 sm:flex-initial px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>পোস্ট করা হচ্ছে...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                <span>পোস্ট প্রকাশ করুন</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
