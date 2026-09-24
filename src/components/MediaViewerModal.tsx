import React, { useRef, useEffect } from 'react';
import { X, Heart, MessageSquare, Bookmark, Share2, Download } from 'lucide-react';
import { Post } from '../types';

interface MediaViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  post: Post | null;
  onToggleLike?: (postId: string) => void;
  onToggleSave?: (type: 'post', postId: string) => void;
  isSaved?: boolean;
}

export const MediaViewerModal: React.FC<MediaViewerModalProps> = ({
  isOpen,
  onClose,
  post,
  onToggleLike,
  onToggleSave,
  isSaved = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
  }, [isOpen, post]);

  if (!isOpen || !post) return null;

  const isVideo = post.mediaType === 'video' || !!post.videoUrl;
  const isImage = post.mediaType === 'image' || (!isVideo && !!post.imageUrl);

  return (
    <div
      id="media-viewer-modal-backdrop"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md transition-opacity"
      onClick={onClose}
    >
      <div
        id="media-viewer-modal-content"
        className="bg-slate-950 border border-slate-800 w-full max-w-3xl rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top bar with author info & close */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 text-white shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={post.authorAvatar}
              alt={post.authorName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/50"
            />
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-100">{post.authorName}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold">
                  {post.subjectName}
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                {post.authorClass || 'শিক্ষার্থী'} • {post.createdAt}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Player / Image Area */}
        <div className="relative bg-black flex-1 flex items-center justify-center overflow-hidden min-h-[260px] max-h-[60vh]">
          {isVideo && (
            <video
              ref={videoRef}
              src={post.videoUrl}
              poster={post.videoThumbnail || post.imageUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full max-h-[60vh] object-contain"
            />
          )}

          {isImage && (
            <img
              src={post.imageUrl}
              alt={post.text || 'Post image'}
              className="w-full h-full max-h-[60vh] object-contain"
            />
          )}
        </div>

        {/* Caption & Actions Bar */}
        <div className="p-4 sm:p-5 border-t border-slate-800 space-y-3 bg-slate-900 shrink-0">
          {post.text && (
            <p className="text-xs sm:text-sm text-slate-200 leading-relaxed max-h-24 overflow-y-auto whitespace-pre-line">
              {post.text}
            </p>
          )}

          <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onToggleLike?.(post.id)}
                className={`flex items-center gap-1.5 transition ${
                  post.likes > 0 ? 'text-rose-500 font-bold' : 'hover:text-rose-400'
                }`}
              >
                <Heart className={`w-4 h-4 ${post.likes > 0 ? 'fill-rose-500' : ''}`} />
                <span>{post.likes} লাইক</span>
              </button>

              <div className="flex items-center gap-1.5">
                <MessageSquare className="w-4 h-4 text-slate-400" />
                <span>{post.commentCount} মন্তব্য</span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleSave?.('post', post.id)}
                className={`p-2 rounded-xl hover:bg-slate-800 transition ${
                  isSaved ? 'text-emerald-400 font-bold' : 'hover:text-emerald-400'
                }`}
              >
                <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-400' : ''}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
