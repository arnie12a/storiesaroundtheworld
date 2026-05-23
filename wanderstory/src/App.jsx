import { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import StoryModal from './components/StoryModal';
import HomePage from './pages/HomePage';
import ExplorePage from './pages/ExplorePage';
import SearchPage from './pages/SearchPage';
import MyStoriesPage from './pages/MyStoriesPage';
import ProfilePage from './pages/ProfilePage';
import PublicProfilePage from './pages/PublicProfilePage';
import { SignInPage, SignUpPage } from './pages/AuthPages';

function AppContent() {
  const { user, loading } = useAuth();
  const [newStoryOpen, setNewStoryOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-clay-200 border-t-clay-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Navbar onNewStory={() => setNewStoryOpen(true)} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/search" element={<SearchPage />} />
        <Route path="/signin" element={user ? <Navigate to="/my-stories" /> : <SignInPage />} />
        <Route path="/signup" element={user ? <Navigate to="/my-stories" /> : <SignUpPage />} />
        <Route path="/my-stories" element={user ? <MyStoriesPage /> : <Navigate to="/signin" />} />
        <Route path="/profile" element={user ? <ProfilePage /> : <Navigate to="/signin" />} />
        {/* Public username route — must be last */}
        <Route path="/:username" element={<PublicProfilePage />} />
      </Routes>

      {user && (
        <StoryModal
          isOpen={newStoryOpen}
          onClose={() => setNewStoryOpen(false)}
          onSaved={() => {
            // Trigger refresh if on my-stories page
            window.dispatchEvent(new CustomEvent('story-saved'));
          }}
        />
      )}
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}
