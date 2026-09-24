/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Footer } from './components/Footer';
import { GitHubConnectionModal } from './components/GitHubConnectionModal';

// Pages
import { HomePage } from './pages/HomePage';
import { ClassesPage } from './pages/ClassesPage';
import { SubjectsPage } from './pages/SubjectsPage';
import { ChaptersPage } from './pages/ChaptersPage';
import { LessonViewPage } from './pages/LessonViewPage';
import { QuizListPage } from './pages/QuizListPage';
import { QuizPlayPage } from './pages/QuizPlayPage';
import { QuestionBankPage } from './pages/QuestionBankPage';
import { ModelTestsPage } from './pages/ModelTestsPage';
import { DailyQuizPage } from './pages/DailyQuizPage';
import { WrongQuestionsPage } from './pages/WrongQuestionsPage';
import { BookmarkedQuestionsPage } from './pages/BookmarkedQuestionsPage';
import { PostsFeedPage } from './pages/PostsFeedPage';
import { CreatePostPage } from './pages/CreatePostPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { SearchPage } from './pages/SearchPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AboutPage, PrivacyPage, TermsPage, ContactPage } from './pages/InfoPages';
import { SavedItemsPage } from './pages/SavedItemsPage';
import { AIChatPage } from './pages/AIChatPage';
import { GrammarMasterPage } from './pages/GrammarMasterPage';
import { CurriculumAuditPage } from './pages/CurriculumAuditPage';
import { SSCDashboardPage } from './pages/SSCDashboardPage';
import { HSCDashboardPage } from './pages/HSCDashboardPage';
import { FormulaBankPage } from './pages/FormulaBankPage';

const AppContent: React.FC = () => {
  const { currentPage, isGitHubModalOpen, setIsGitHubModalOpen } = useApp();

  // Scroll to top on page transition
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'ssc_dashboard':
        return <SSCDashboardPage />;
      case 'hsc_dashboard':
        return <HSCDashboardPage />;
      case 'formula_bank':
        return <FormulaBankPage />;
      case 'ai_chat':
        return <AIChatPage />;
      case 'classes':
        return <ClassesPage />;
      case 'subjects':
        return <SubjectsPage />;
      case 'chapters':
        return <ChaptersPage />;
      case 'lesson':
        return <LessonViewPage />;
      case 'quiz':
        return <QuizListPage />;
      case 'quiz_play':
        return <QuizPlayPage />;
      case 'question_bank':
        return <QuestionBankPage />;
      case 'model_tests':
        return <ModelTestsPage />;
      case 'daily_quiz':
        return <DailyQuizPage />;
      case 'wrong_questions':
        return <WrongQuestionsPage />;
      case 'bookmarked_questions':
        return <BookmarkedQuestionsPage />;
      case 'posts':
        return <PostsFeedPage />;
      case 'create_post':
        return <CreatePostPage />;
      case 'post_detail':
        return <PostDetailPage />;
      case 'login':
        return <LoginPage />;
      case 'profile':
        return <ProfilePage />;
      case 'search':
        return <SearchPage />;
      case 'admin':
        return <AdminDashboardPage />;
      case 'about':
        return <AboutPage />;
      case 'privacy':
        return <PrivacyPage />;
      case 'terms':
        return <TermsPage />;
      case 'contact':
        return <ContactPage />;
      case 'saved':
        return <SavedItemsPage />;
      case 'grammar_master':
        return <GrammarMasterPage />;
      case 'curriculum_audit':
        return <CurriculumAuditPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200">
      {/* Top site-wide announcement */}
      <AnnouncementBanner />

      {/* Main responsive Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {renderPage()}
      </main>

      {/* Footer */}
      <Footer />

      {/* GitHub Connection Status Checker Modal */}
      <GitHubConnectionModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* Mobile-only Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
