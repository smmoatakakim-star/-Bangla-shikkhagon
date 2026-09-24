import React, { useState } from 'react';
import {
  Camera,
  Plus,
  Play,
  Heart,
  MessageSquare,
  Bookmark,
  Edit2,
  Trash2,
  Award,
  BookOpen,
  School,
  GraduationCap,
  Calendar,
  Grid,
  List,
  Check,
  RotateCcw,
  Video as VideoIcon,
  Image as ImageIcon,
  Share2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { User, ClassId, Post } from '../types';
import { ProfilePhotoModal } from '../components/ProfilePhotoModal';
import { CreatePostModal } from '../components/CreatePostModal';
import { MediaViewerModal } from '../components/MediaViewerModal';

export const ProfilePage: React.FC = () => {
  const {
    currentUser,
    users,
    posts,
    lessons,
    pageParams,
    navigate,
    updateProfile,
    deletePost,
    editPost,
    toggleSaveItem,
    toggleLikePost,
    isItemSaved,
  } = useApp();

  // Target user (either params.userId or currentUser)
  const targetUserId = pageParams.userId || currentUser?.id;
  const profileUser = users.find((u) => u.id === targetUserId) || currentUser;
  const isOwnProfile = currentUser && profileUser && currentUser.id === profileUser.id;

  // Modals state
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [viewingMediaPost, setViewingMediaPost] = useState<Post | null>(null);

  // Tabs state
  const [activeTab, setActiveTab] = useState<'posts' | 'saved' | 'quizzes'>('posts');
  const [viewMode, setViewMode] = useState<'feed' | 'grid'>('feed');

  // Inline editing state for profile info
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState(profileUser?.name || '');
  const [editSchool, setEditSchool] = useState(profileUser?.schoolName || '');
  const [editClass, setEditClass] = useState<ClassId>(profileUser?.classGrade || 'class-9');
  const [editBio, setEditBio] = useState(profileUser?.bio || '');
  const [editNotice, setEditNotice] = useState<string | null>(null);

  // Inline post editing state
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editingPostText, setEditingPostText] = useState('');

  if (!profileUser) {
    return (
      <div className="py-20 text-center space-y-4">
        <p className="text-slate-500">প্রোফাইলটি খুঁজে পাওয়া যায়নি।</p>
        <button
          onClick={() => navigate('home')}
          className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold"
        >
          হোমে ফিরে যান
        </button>
      </div>
    );
  }

  // Filter posts
  const userPosts = posts.filter((p) => p.authorId === profileUser.id);

  // Filter saved lessons & posts
  const savedLessonIds = profileUser.savedLessonIds || [];
  const savedLessons = lessons.filter((l) => savedLessonIds.includes(l.id));
  const savedPostIds = profileUser.savedPostIds || [];
  const savedPosts = posts.filter((p) => savedPostIds.includes(p.id));

  // Handler: Avatar updated from modal
  const handleAvatarUpdated = (newAvatarUrl: string) => {
    updateProfile({ avatar: newAvatarUrl });
  };

  // Handler: Save profile info
  const handleSaveProfileInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: editName.trim() || profileUser.name,
      schoolName: editSchool.trim(),
      classGrade: editClass,
      bio: editBio.trim(),
    });
    setEditNotice('✓ প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!');
    setTimeout(() => {
      setEditNotice(null);
      setIsEditingProfile(false);
    }, 1200);
  };

  // Handler: Delete post
  const handleDeletePost = (postId: string) => {
    if (window.confirm('আপনি কি নিশ্চিত যে এই পোস্টটি মুছে ফেলতে চান?')) {
      deletePost(postId);
    }
  };

  // Handler: Save edited post
  const handleSaveEditedPost = (postId: string) => {
    if (!editingPostText.trim()) return;
    editPost(postId, editingPostText.trim());
    setEditingPostId(null);
  };

  const classDisplayMap: Record<string, string> = {
    'class-6': '৬ষ্ঠ শ্রেণি',
    'class-7': '৭ম শ্রেণি',
    'class-8': '৮ম শ্রেণি',
    'class-9': '৯ম শ্রেণি',
    'class-10': '১০ম শ্রেণি',
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-20">
      {/* 1. Profile Header Card */}
      <div
        id="profile-header-card"
        className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 sm:p-7 shadow-sm relative overflow-hidden"
      >
        {/* Subtle decorative banner strip */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-800 opacity-90" />

        <div className="relative pt-8 sm:pt-10 flex flex-col sm:flex-row items-center sm:items-end gap-5">
          {/* Circular Profile Picture with Real Camera Button Overlay */}
          <div className="relative group shrink-0">
            <div
              id="profile-avatar-wrapper"
              onClick={() => isOwnProfile && setIsPhotoModalOpen(true)}
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full ring-4 ring-white dark:ring-slate-900 overflow-hidden shadow-xl bg-slate-200 dark:bg-slate-800 ${
                isOwnProfile ? 'cursor-pointer' : ''
              }`}
            >
              <img
                id="profile-avatar-img"
                src={profileUser.avatar}
                alt={profileUser.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Camera Overlay Button */}
            {isOwnProfile && (
              <button
                id="btn-open-photo-upload"
                type="button"
                onClick={() => setIsPhotoModalOpen(true)}
                title="প্রোফাইল ছবি পরিবর্তন করুন"
                className="absolute bottom-1 right-1 p-2.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white shadow-lg ring-2 ring-white dark:ring-slate-900 transition transform hover:scale-110 flex items-center justify-center cursor-pointer"
              >
                <Camera className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* User Details & Identity */}
          <div className="flex-1 text-center sm:text-left space-y-1.5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h1
                  id="profile-user-name"
                  className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 tracking-tight"
                >
                  {profileUser.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                  @{profileUser.username}
                </p>
              </div>

              {isOwnProfile && (
                <button
                  id="btn-edit-profile-toggle"
                  onClick={() => setIsEditingProfile(!isEditingProfile)}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition shrink-0"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  <span>{isEditingProfile ? 'বাতিল' : 'প্রোফাইল এডিট'}</span>
                </button>
              )}
            </div>

            {/* Badges: Class & School */}
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 pt-1">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>
                  {profileUser.classGrade ? classDisplayMap[profileUser.classGrade] || '৯ম শ্রেণি' : '৯ম শ্রেণি'}
                </span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                <School className="w-3.5 h-3.5 text-slate-500" />
                <span>{profileUser.schoolName || 'ঢাকা রেসিডেনসিয়াল মডেল কলেজ'}</span>
              </span>
            </div>

            {/* Bio */}
            {profileUser.bio && (
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed pt-1 max-w-xl">
                {profileUser.bio}
              </p>
            )}

            {/* Quick Metrics Bar */}
            <div className="flex items-center justify-center sm:justify-start gap-6 pt-3 border-t border-slate-100 dark:border-slate-800/80 mt-3 text-xs">
              <div>
                <span className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 mr-1">
                  {userPosts.length}
                </span>
                <span className="text-slate-500">পোস্ট</span>
              </div>
              <div>
                <span className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 mr-1">
                  {profileUser.totalLikesReceived || userPosts.reduce((acc, p) => acc + p.likes, 0)}
                </span>
                <span className="text-slate-500">লাইক প্রাপ্ত</span>
              </div>
              <div>
                <span className="font-black text-sm sm:text-base text-slate-900 dark:text-slate-100 mr-1">
                  {profileUser.quizResults?.length || 0}
                </span>
                <span className="text-slate-500">কুইজ সম্পন্ন</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inline Edit Form */}
        {isEditingProfile && (
          <form
            onSubmit={handleSaveProfileInfo}
            className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-800 space-y-4"
          >
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100">
              প্রোফাইল তথ্য সম্পাদন করুন
            </h3>

            {editNotice && (
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center gap-2">
                <Check className="w-4 h-4" />
                <span>{editNotice}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  নাম
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  বিদ্যালয়ের নাম
                </label>
                <input
                  type="text"
                  value={editSchool}
                  onChange={(e) => setEditSchool(e.target.value)}
                  placeholder="বিদ্যালয়ের নাম"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                  শ্রেণি
                </label>
                <select
                  value={editClass}
                  onChange={(e) => setEditClass(e.target.value as ClassId)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="class-6">৬ষ্ঠ শ্রেণি</option>
                  <option value="class-7">৭ম শ্রেণি</option>
                  <option value="class-8">৮ম শ্রেণি</option>
                  <option value="class-9">৯ম শ্রেণি</option>
                  <option value="class-10">১০ম শ্রেণি</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400 block mb-1">
                বায়ো (Bio)
              </label>
              <textarea
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                rows={2}
                placeholder="নিজের পড়াশোনা ও আগ্রহ সম্পর্কে লিখুন..."
                className="w-full p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold"
              >
                বাতিল
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
              >
                সংরক্ষণ করুন
              </button>
            </div>
          </form>
        )}
      </div>

      {/* 2. Create Post Prominent Bar */}
      {isOwnProfile && (
        <div
          id="profile-create-post-bar"
          className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-sm flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <img
              src={profileUser.avatar}
              alt="avatar"
              className="w-10 h-10 rounded-full object-cover ring-2 ring-emerald-500/30 shrink-0"
            />
            <button
              type="button"
              onClick={() => setIsCreatePostModalOpen(true)}
              className="flex-1 text-left px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-500 dark:text-slate-400 transition truncate"
            >
              পড়াশোনা বা জিজ্ঞাসা সম্পর্কে কিছু লিখুন বা ভিডিও শেয়ার করুন...
            </button>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              id="btn-create-post-photo"
              onClick={() => setIsCreatePostModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/40 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <ImageIcon className="w-4 h-4" />
              <span className="hidden sm:inline">ছবি</span>
            </button>

            <button
              id="btn-create-post-video"
              onClick={() => setIsCreatePostModalOpen(true)}
              className="px-3 py-2 rounded-xl bg-teal-50 hover:bg-teal-100 dark:bg-teal-950/40 dark:hover:bg-teal-900/50 text-teal-700 dark:text-teal-300 text-xs font-bold transition flex items-center gap-1.5"
            >
              <VideoIcon className="w-4 h-4" />
              <span className="hidden sm:inline">ভিডিও</span>
            </button>

            <button
              id="btn-create-post-main"
              onClick={() => setIsCreatePostModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>পোস্ট</span>
            </button>
          </div>
        </div>
      )}

      {/* 3. Modern Tabs Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-6">
          <button
            id="tab-profile-posts"
            onClick={() => setActiveTab('posts')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative flex items-center gap-2 ${
              activeTab === 'posts'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <span>পোস্টসমূহ</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {userPosts.length}
            </span>
            {activeTab === 'posts' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            id="tab-profile-saved"
            onClick={() => setActiveTab('saved')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <span>সংরক্ষিত আইটেম</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {savedLessons.length + savedPosts.length}
            </span>
            {activeTab === 'saved' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            )}
          </button>

          <button
            id="tab-profile-quizzes"
            onClick={() => setActiveTab('quizzes')}
            className={`pb-3 text-xs sm:text-sm font-bold transition relative flex items-center gap-2 ${
              activeTab === 'quizzes'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
            }`}
          >
            <span>কুইজ হিস্ট্রি</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
              {profileUser.quizResults?.length || 0}
            </span>
            {activeTab === 'quizzes' && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
            )}
          </button>
        </div>

        {/* View mode toggle (Feed vs Grid) */}
        {activeTab === 'posts' && userPosts.length > 0 && (
          <div className="flex items-center gap-1 pb-2">
            <button
              onClick={() => setViewMode('feed')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'feed'
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="কমপ্যাক্ট ফিড ভিউ"
            >
              <List className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-lg text-xs transition ${
                viewMode === 'grid'
                  ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300'
                  : 'text-slate-400 hover:text-slate-600'
              }`}
              title="মিডিয়া গ্রিড ভিউ"
            >
              <Grid className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* 4. Tab Content: POSTS */}
      {activeTab === 'posts' && (
        <div className="space-y-4">
          {userPosts.length === 0 ? (
            <div className="py-14 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
              <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center mx-auto">
                <MessageSquare className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                এখনো কোনো পোস্ট করা হয়নি
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                সহপাঠীদের সাথে শেয়ার করতে নতুন পোস্ট তৈরি করুন—ছবি বা ভিডিও আপলোড করুন!
              </p>
              {isOwnProfile && (
                <button
                  onClick={() => setIsCreatePostModalOpen(true)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md transition"
                >
                  + প্রথম পোস্ট করুন
                </button>
              )}
            </div>
          ) : viewMode === 'grid' ? (
            /* Media Grid: 2 columns on mobile, 3 on tablet/desktop */
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {userPosts.map((post) => {
                const isVideo = post.mediaType === 'video' || !!post.videoUrl;
                const isImage = post.mediaType === 'image' || (!isVideo && !!post.imageUrl);

                return (
                  <div
                    key={post.id}
                    id={`grid-post-${post.id}`}
                    onClick={() => {
                      if (isVideo || isImage) {
                        setViewingMediaPost(post);
                      } else {
                        navigate('post_detail', { postId: post.id });
                      }
                    }}
                    className="group relative aspect-square bg-slate-950 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 cursor-pointer shadow-sm hover:shadow-md transition"
                  >
                    {isVideo ? (
                      <>
                        <img
                          src={
                            post.videoThumbnail ||
                            post.imageUrl ||
                            'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&auto=format&fit=crop&q=80'
                          }
                          alt="Video poster"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <div className="w-10 h-10 rounded-full bg-emerald-600/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition">
                            <Play className="w-5 h-5 fill-white ml-0.5" />
                          </div>
                        </div>
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-white flex items-center gap-1">
                          <VideoIcon className="w-3 h-3" />
                          <span>ভিডিও</span>
                        </span>
                      </>
                    ) : isImage ? (
                      <>
                        <img
                          src={post.imageUrl}
                          alt={post.text}
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                        />
                        <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 text-[10px] font-bold text-white flex items-center gap-1">
                          <ImageIcon className="w-3 h-3" />
                          <span>ছবি</span>
                        </span>
                      </>
                    ) : (
                      <div className="w-full h-full p-4 bg-gradient-to-br from-emerald-900 to-slate-900 text-white flex flex-col justify-between">
                        <span className="text-[10px] font-bold text-emerald-300">
                          {post.subjectName}
                        </span>
                        <p className="text-xs line-clamp-4 leading-relaxed">{post.text}</p>
                        <span className="text-[10px] text-slate-400">{post.createdAt}</span>
                      </div>
                    )}

                    {/* Bottom overlay info */}
                    <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex items-center justify-between text-[11px] text-white font-semibold opacity-90">
                      <span className="flex items-center gap-1">
                        <Heart className="w-3 h-3 fill-rose-500 text-rose-500" />
                        <span>{post.likes}</span>
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>{post.commentCount}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Compact Feed View */
            <div className="space-y-4">
              {userPosts.map((post) => {
                const isVideo = post.mediaType === 'video' || !!post.videoUrl;
                const isImage = post.mediaType === 'image' || (!isVideo && !!post.imageUrl);
                const isSaved = isItemSaved('post', post.id);

                return (
                  <div
                    key={post.id}
                    id={`profile-post-card-${post.id}`}
                    className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm space-y-3"
                  >
                    {/* Header: Author info, subject tag & edit/delete menu */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={post.authorAvatar}
                          alt={post.authorName}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-200 dark:ring-slate-700"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100">
                              {post.authorName}
                            </span>
                            <span className="text-[10px] px-2 py-0.5 rounded-full font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300">
                              {post.subjectName}
                            </span>
                          </div>
                          <span className="text-[11px] text-slate-400">
                            {post.authorClass || 'শিক্ষার্থী'} • {post.createdAt}
                          </span>
                        </div>
                      </div>

                      {/* Owner actions (Edit / Delete) */}
                      {isOwnProfile && (
                        <div className="flex items-center gap-1">
                          <button
                            onClick={() => {
                              setEditingPostId(post.id);
                              setEditingPostText(post.text);
                            }}
                            title="পোস্ট এডিট"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            title="পোস্ট মুছুন"
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Post Caption / Text */}
                    {editingPostId === post.id ? (
                      <div className="space-y-2">
                        <textarea
                          value={editingPostText}
                          onChange={(e) => setEditingPostText(e.target.value)}
                          rows={3}
                          className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs font-medium"
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setEditingPostId(null)}
                            className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                          >
                            বাতিল
                          </button>
                          <button
                            onClick={() => handleSaveEditedPost(post.id)}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-xs font-bold"
                          >
                            সংরক্ষণ
                          </button>
                        </div>
                      </div>
                    ) : (
                      post.text && (
                        <p
                          onClick={() => navigate('post_detail', { postId: post.id })}
                          className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line cursor-pointer"
                        >
                          {post.text}
                        </p>
                      )
                    )}

                    {/* Modern Compact Video Post UI */}
                    {isVideo && (
                      <div
                        onClick={() => setViewingMediaPost(post)}
                        className="relative rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer group"
                      >
                        <div className="aspect-video w-full max-h-72 overflow-hidden flex items-center justify-center relative">
                          <img
                            src={
                              post.videoThumbnail ||
                              post.imageUrl ||
                              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&auto=format&fit=crop&q=80'
                            }
                            alt="Video Poster"
                            className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
                          />
                          {/* Play Button Overlay */}
                          <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                            <div className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition duration-200">
                              <Play className="w-7 h-7 fill-white ml-1" />
                            </div>
                          </div>

                          <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-[11px] font-bold text-white flex items-center gap-1.5">
                            <VideoIcon className="w-3.5 h-3.5 text-teal-400" />
                            <span>ভিডিও দেখতে ক্লিক করুন</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Compact Image Post UI */}
                    {isImage && (
                      <div
                        onClick={() => setViewingMediaPost(post)}
                        className="rounded-2xl overflow-hidden bg-slate-950 border border-slate-200 dark:border-slate-800 cursor-pointer group"
                      >
                        <img
                          src={post.imageUrl}
                          alt="Post attachment"
                          className="w-full max-h-80 object-cover group-hover:scale-102 transition duration-300"
                        />
                      </div>
                    )}

                    {/* Actions Bar: Likes, Comments, Save */}
                    <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleLikePost(post.id)}
                          className={`flex items-center gap-1.5 transition ${
                            post.likes > 0 ? 'text-rose-500 font-bold' : 'hover:text-rose-500'
                          }`}
                        >
                          <Heart
                            className={`w-4 h-4 ${
                              post.likes > 0 ? 'fill-rose-500 text-rose-500' : ''
                            }`}
                          />
                          <span>{post.likes}</span>
                        </button>

                        <button
                          onClick={() => navigate('post_detail', { postId: post.id })}
                          className="flex items-center gap-1.5 hover:text-emerald-600 transition"
                        >
                          <MessageSquare className="w-4 h-4" />
                          <span>{post.commentCount}</span>
                        </button>
                      </div>

                      <button
                        onClick={() => toggleSaveItem('post', post.id)}
                        title={isSaved ? 'সংরক্ষণ বাতিল' : 'পোস্ট সংরক্ষণ করুন'}
                        className={`hover:text-emerald-600 transition ${
                          isSaved ? 'text-emerald-600' : ''
                        }`}
                      >
                        <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-emerald-600' : ''}`} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 5. Tab Content: SAVED ITEMS */}
      {activeTab === 'saved' && (
        <div className="space-y-4">
          {savedLessons.length === 0 && savedPosts.length === 0 ? (
            <div className="py-14 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
              <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <Bookmark className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                কোনো আইটেম সংরক্ষিত নেই
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                পড়াশোনার প্রয়োজনীয় পাঠ বা পোস্ট বুকমার্ক করে রাখলে এখানে দেখতে পাবেন।
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Saved Lessons */}
              {savedLessons.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    সংরক্ষিত পাঠ ({savedLessons.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedLessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        onClick={() => navigate('lesson', { lessonId: lesson.id })}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="p-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <div>
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                              {lesson.title}
                            </h4>
                            <span className="text-[11px] text-slate-400">
                              {lesson.readTimeMinutes || 5} মিনিট পাঠ
                            </span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveItem('lesson', lesson.id);
                          }}
                          className="text-emerald-600 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"
                        >
                          <Bookmark className="w-4 h-4 fill-emerald-600" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Saved Posts */}
              {savedPosts.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    সংরক্ষিত পোস্ট ({savedPosts.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {savedPosts.map((post) => (
                      <div
                        key={post.id}
                        onClick={() => navigate('post_detail', { postId: post.id })}
                        className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:border-emerald-500 cursor-pointer transition space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                            {post.subjectName}
                          </span>
                          <span className="text-[11px] text-slate-400">{post.createdAt}</span>
                        </div>
                        <p className="text-xs text-slate-800 dark:text-slate-200 line-clamp-2">
                          {post.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* 6. Tab Content: QUIZ HISTORY */}
      {activeTab === 'quizzes' && (
        <div className="space-y-4">
          {!profileUser.quizResults || profileUser.quizResults.length === 0 ? (
            <div className="py-14 text-center space-y-3 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 p-8">
              <div className="w-12 h-12 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 flex items-center justify-center mx-auto">
                <Award className="w-6 h-6" />
              </div>
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                কোনো কুইজ ফলাফল পাওয়া যায়নি
              </p>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                অধ্যায়ভিত্তিক কুইজ ও মডেল টেস্ট সম্পন্ন করে নিজের মেধা যাচাই করুন!
              </p>
              <button
                onClick={() => navigate('quiz')}
                className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold shadow-md transition"
              >
                কুইজ সেকশনে যান
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {profileUser.quizResults.map((result) => (
                <div
                  key={result.id}
                  className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 line-clamp-1">
                      {result.quizTitle}
                    </h4>
                    <p className="text-[11px] text-slate-500">
                      {result.completedAt} • {result.totalQuestions}টি প্রশ্ন
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span
                      className={`text-base sm:text-lg font-black block ${
                        result.percentage >= 80
                          ? 'text-emerald-600 dark:text-emerald-400'
                          : result.percentage >= 50
                          ? 'text-amber-500'
                          : 'text-rose-500'
                      }`}
                    >
                      {result.score} / {result.totalQuestions}
                    </span>
                    <span className="text-[10px] text-slate-400">{result.percentage}% সঠিক</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Profile Photo Upload Modal */}
      <ProfilePhotoModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentAvatar={profileUser.avatar}
        onAvatarUpdated={handleAvatarUpdated}
      />

      {/* Create Post with Photo/Video Modal */}
      <CreatePostModal
        isOpen={isCreatePostModalOpen}
        onClose={() => setIsCreatePostModalOpen(false)}
        defaultClassId={profileUser.classGrade}
      />

      {/* Media Viewer / Responsive Video Player Modal */}
      <MediaViewerModal
        isOpen={!!viewingMediaPost}
        onClose={() => setViewingMediaPost(null)}
        post={viewingMediaPost}
        onToggleLike={toggleLikePost}
        onToggleSave={toggleSaveItem}
        isSaved={viewingMediaPost ? isItemSaved('post', viewingMediaPost.id) : false}
      />
    </div>
  );
};
