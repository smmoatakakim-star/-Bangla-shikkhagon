/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { VoiceGuideProvider } from './context/VoiceGuideContext';
import { Navbar } from './components/Navbar';
import { MobileBottomNav } from './components/MobileBottomNav';
import { AnnouncementBanner } from './components/AnnouncementBanner';
import { Footer } from './components/Footer';
import { GitHubConnectionModal } from './components/GitHubConnectionModal';
import { VoiceGuideWidget } from './components/VoiceGuideWidget';

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
import { ClassDashboardPage } from './pages/ClassDashboardPage';
import { CreativeQuestionsPage } from './pages/CreativeQuestionsPage';
import { EnglishCornerPage } from './pages/EnglishCornerPage';

const AppContent: React.FC = () => {
  const { currentPage, isGitHubModalOpen, setIsGitHubModalOpen } = useApp();

  // Scroll to top on page transition & toggle body class for fullscreen AI Assistant
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (currentPage === 'ai_chat') {
      document.body.classList.add('ai-assistant-page');
    } else {
      document.body.classList.remove('ai-assistant-page');
    }

    return () => {
      document.body.classList.remove('ai-assistant-page');
    };
  }, [currentPage]);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'class_dashboard':
        return <ClassDashboardPage />;
      case 'creative_questions':
        return <CreativeQuestionsPage />;
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
      case 'english_corner':
        return <EnglishCornerPage />;
      case 'curriculum_audit':
        return <CurriculumAuditPage />;
      default:
        return <HomePage />;
    }
  };

  const isAiChatPage = currentPage === 'ai_chat';

  return (
    <div
      id="app-container"
      className={`app-wrapper ${
        isAiChatPage
          ? 'h-screen h-[100dvh] flex flex-col overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200'
          : 'min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-200'
      }`}
    >
      {/* Top site-wide announcement (hidden in AI Chat page to maximize chat viewport) */}
      {!isAiChatPage && <AnnouncementBanner />}

      {/* Main responsive Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main
        className={
          isAiChatPage
            ? 'flex-1 w-full max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 pt-2 pb-0 overflow-hidden flex flex-col'
            : 'flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6'
        }
      >
        {renderPage()}
      </main>

      {/* Footer (hidden when on ai_chat) */}
      {!isAiChatPage && <Footer />}

      {/* GitHub Repository Manager Modal (Developer / Admin) */}
      <GitHubConnectionModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
      />

      {/* Interactive Bangla AI Voice Guide Widget */}
      <VoiceGuideWidget />

      {/* Mobile-only Bottom Navigation Bar */}
      <MobileBottomNav />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <VoiceGuideProvider>
        <AppContent />
      </VoiceGuideProvider>
    </AppProvider>
  );
}
