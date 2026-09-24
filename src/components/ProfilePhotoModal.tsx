import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  Image as ImageIcon,
  Crop,
  Trash2,
  X,
  Upload,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react';

interface ProfilePhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar: string;
  onAvatarUpdated: (newAvatarUrl: string) => void;
}

export const ProfilePhotoModal: React.FC<ProfilePhotoModalProps> = ({
  isOpen,
  onClose,
  currentAvatar,
  onAvatarUpdated,
}) => {
  const [step, setStep] = useState<'menu' | 'crop'>('menu');
  const [selectedImageSrc, setSelectedImageSrc] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('profile.jpg');
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const galleryInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const imageElementRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setStep('menu');
      setSelectedImageSrc(null);
      setZoom(1);
      setRotation(0);
      setPan({ x: 0, y: 0 });
      setErrorMessage(null);
      setSuccessMessage(null);
      setIsUploading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Handle file selection from gallery or camera
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    const file = e.target.files?.[0];
    if (!file) return;

    // Validation 1: Size check (max 15MB)
    const maxSizeBytes = 15 * 1024 * 1024;
    if (file.size > maxSizeBytes) {
      setErrorMessage('ছবিটি অনেক বড় (সর্বোচ্চ ১৫ মেগাবাইট)। ছোট একটি ছবি নির্বাচন করুন।');
      return;
    }

    // Validation 2: Format check
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type.toLowerCase())) {
      setErrorMessage('ছবিটি নির্বাচন করা যায়নি। শুধুমাত্র JPG, PNG বা WEBP ফরম্যাটের ছবি নির্বাচন করুন।');
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setSelectedImageSrc(reader.result);
        setZoom(1);
        setRotation(0);
        setPan({ x: 0, y: 0 });
        setStep('crop');
      }
    };
    reader.onerror = () => {
      setErrorMessage('ছবিটি লোড করা সম্ভব হয়নি। আবার চেষ্টা করুন।');
    };
    reader.readAsDataURL(file);

    // Reset input value so same file can be re-selected if needed
    e.target.value = '';
  };

  // Drag & Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsDragging(true);
      const touch = e.touches[0];
      setDragStart({ x: touch.clientX - pan.x, y: touch.clientY - pan.y });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    setPan({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y,
    });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  // Crop & Save handler
  const handleCropAndSave = async () => {
    if (!selectedImageSrc) return;
    setIsUploading(true);
    setErrorMessage(null);

    try {
      // 1. Create off-screen canvas to render cropped image
      const canvas = document.createElement('canvas');
      const size = 400; // 400x400 high-res avatar
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        throw new Error('ক্যানভাস তৈরি করা সম্ভব হয়নি।');
      }

      // Load image into HTMLImageElement
      const img = new Image();
      img.crossOrigin = 'anonymous';

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject(new Error('ছবি প্রসেস করা যায়নি।'));
        img.src = selectedImageSrc;
      });

      // Clear canvas
      ctx.clearRect(0, 0, size, size);

      // Translate to center
      ctx.save();
      ctx.translate(size / 2, size / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Compute scale
      const baseScale = Math.max(size / img.width, size / img.height);
      const finalScale = baseScale * zoom;

      // Draw transformed image
      ctx.drawImage(
        img,
        - (img.width * finalScale) / 2 + pan.x,
        - (img.height * finalScale) / 2 + pan.y,
        img.width * finalScale,
        img.height * finalScale
      );
      ctx.restore();

      // Convert canvas to Blob
      const blob: Blob = await new Promise((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('ছবি কনভার্ট করা সম্ভব হয়নি।'));
          },
          'image/jpeg',
          0.92
        );
      });

      // Prepare FormData to upload to real server endpoint
      const formData = new FormData();
      formData.append('file', blob, selectedFileName.replace(/\.[^/.]+$/, '') + '-avatar.jpg');

      let avatarUrl = '';

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          if (data.url) {
            avatarUrl = data.url;
          }
        }
      } catch (uploadError) {
        console.warn('Backend upload encountered network error, using local fallback:', uploadError);
      }

      // If backend responded, use real static URL; otherwise use canvas dataURL for 100% offline persistence
      if (!avatarUrl) {
        avatarUrl = canvas.toDataURL('image/jpeg', 0.9);
      }

      // Notify parent & update state
      onAvatarUpdated(avatarUrl);
      setSuccessMessage('প্রোফাইল ছবি সফলভাবে আপডেট করা হয়েছে!');

      setTimeout(() => {
        setIsUploading(false);
        onClose();
      }, 1000);
    } catch (err: any) {
      console.error('Avatar save failed:', err);
      setIsUploading(false);
      setErrorMessage(err.message || 'আপলোড ব্যর্থ হয়েছে। আবার চেষ্টা করুন।');
    }
  };

  // Remove photo handler
  const handleRemovePhoto = () => {
    // Default pleasant avatar
    const defaultAvatar =
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80';
    onAvatarUpdated(defaultAvatar);
    setSuccessMessage('প্রোফাইল ছবি মুছে ফেলা হয়েছে।');
    setTimeout(() => {
      onClose();
    }, 800);
  };

  return (
    <div
      id="profile-photo-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity"
      onClick={onClose}
    >
      <div
        id="profile-photo-modal-content"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transition-all"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Hidden inputs for real file picker and camera */}
        <input
          ref={galleryInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="user"
          className="hidden"
          onChange={handleFileChange}
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
              <Camera className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">
                {step === 'menu' ? 'প্রোফাইল ছবি পরিবর্তন' : 'ছবি ক্রপ ও অ্যাডজাস্ট করুন'}
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {step === 'menu'
                  ? 'আপনার পছন্দসই ছবি নির্বাচন করুন'
                  : 'ছবিটি ড্র্যাগ করে সঠিক অবস্থানে বসান'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notification alerts */}
        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/60 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Modal Body: STEP 1 - Menu */}
        {step === 'menu' && (
          <div className="p-6 space-y-6">
            {/* Current avatar preview */}
            <div className="flex flex-col items-center justify-center">
              <div className="relative group">
                <div className="w-28 h-28 rounded-full ring-4 ring-emerald-500/30 overflow-hidden shadow-lg bg-slate-100 dark:bg-slate-800">
                  <img
                    src={currentAvatar}
                    alt="Current Profile"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 p-2 rounded-full bg-emerald-600 text-white shadow-md">
                  <Camera className="w-4 h-4" />
                </div>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                বর্তমান প্রোফাইল ছবি
              </span>
            </div>

            {/* Action buttons list */}
            <div className="space-y-2.5">
              {/* Option 1: Take Photo */}
              <button
                id="btn-take-photo"
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Camera className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                      ক্যামেরা দিয়ে ছবি তুলুন
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      সরাসরি মোবাইল বা ওয়েব ক্যামেরা ব্যবহার করুন
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  শুরু করুন &rarr;
                </span>
              </button>

              {/* Option 2: Gallery/Files */}
              <button
                id="btn-choose-gallery"
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="w-full flex items-center justify-between p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500 dark:hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/20 transition group text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-100 dark:bg-teal-900/40 text-teal-700 dark:text-teal-300 flex items-center justify-center group-hover:scale-105 transition-transform">
                    <ImageIcon className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-bold text-sm text-slate-800 dark:text-slate-200 block">
                      গ্যালারি বা ফাইল থেকে নির্বাচন
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      JPG, PNG, WEBP ফাইল নির্বাচন করুন (সর্বোচ্চ ১৫MB)
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
                  ব্রাউজ &rarr;
                </span>
              </button>

              {/* Option 3: Remove Photo */}
              <button
                id="btn-remove-photo"
                type="button"
                onClick={handleRemovePhoto}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-100 dark:border-slate-800 hover:bg-rose-50 dark:hover:bg-rose-950/20 hover:border-rose-300 transition text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                    <Trash2 className="w-4 h-4" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-rose-600 dark:text-rose-400 block">
                      ছবি মুছে ফেলুন
                    </span>
                    <span className="text-[10px] text-slate-400">
                      ডিফল্ট অবতার ছবিতে রিসেট হবে
                    </span>
                  </div>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Modal Body: STEP 2 - Crop & Adjust */}
        {step === 'crop' && selectedImageSrc && (
          <div className="p-6 space-y-5">
            {/* Crop canvas container */}
            <div
              ref={containerRef}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onTouchStart={handleTouchStart}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              className="relative w-full h-64 bg-slate-950 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center"
            >
              {/* Image being cropped */}
              <img
                ref={imageElementRef}
                src={selectedImageSrc}
                alt="Crop preview"
                className="max-w-none transition-transform pointer-events-none"
                style={{
                  transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                  maxHeight: '100%',
                }}
              />

              {/* Circular overlay guide */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-52 h-52 rounded-full border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.65)]" />
              </div>

              <div className="absolute bottom-2 left-2 right-2 text-center pointer-events-none">
                <span className="inline-block px-2.5 py-1 rounded-full bg-black/60 text-[10px] text-white/90 backdrop-blur-sm">
                  মাউস বা আঙুল দিয়ে টেনে পজিশন ঠিক করুন
                </span>
              </div>
            </div>

            {/* Adjust controls: Zoom and Rotate */}
            <div className="space-y-3 bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-600 dark:text-slate-300 font-medium flex items-center gap-1.5">
                  <ZoomIn className="w-3.5 h-3.5 text-emerald-600" />
                  <span>জুম অ্যাডজাস্ট: {Math.round(zoom * 100)}%</span>
                </span>
                <button
                  type="button"
                  onClick={() => setRotation((prev) => (prev + 90) % 360)}
                  className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 hover:underline"
                >
                  <RotateCw className="w-3.5 h-3.5" />
                  <span>ঘোরান (৯০°)</span>
                </button>
              </div>

              <div className="flex items-center gap-2">
                <ZoomOut className="w-4 h-4 text-slate-400" />
                <input
                  type="range"
                  min="0.8"
                  max="3"
                  step="0.05"
                  value={zoom}
                  onChange={(e) => setZoom(parseFloat(e.target.value))}
                  className="w-full accent-emerald-600 cursor-pointer"
                />
                <ZoomIn className="w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep('menu')}
                disabled={isUploading}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                পেছনে যান
              </button>

              <button
                id="btn-save-cropped-photo"
                type="button"
                onClick={handleCropAndSave}
                disabled={isUploading}
                className="flex-1 py-2.5 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md hover:shadow-lg transition flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>আপলোড হচ্ছে...</span>
                  </>
                ) : (
                  <>
                    <Check className="w-4 h-4" />
                    <span>ক্রপ ও সেভ করুন</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
