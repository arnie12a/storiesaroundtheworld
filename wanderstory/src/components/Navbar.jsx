import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Globe, BookOpen, Search, User, LogOut, PlusCircle, Compass } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { signOut } from '../lib/supabase';
import { Avatar } from './UI';

export default function Navbar({ onNewStory }) {
  const { user, profile } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-md border-b border-stone-100">
      <nav className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 bg-clay-600 rounded-lg flex items-center justify-center">
            <Globe size={16} className="text-white" />
          </div>
          <span className="font-bold text-stone-900 text-base tracking-tight font-display">
            WanderStory
          </span>
        </Link>

        {/* Center nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/explore" icon={<Compass size={16} />} label="Explore" active={isActive('/explore')} />
          <NavLink to="/search" icon={<Search size={16} />} label="Search" active={isActive('/search')} />
          {user && (
            <NavLink to="/my-stories" icon={<BookOpen size={16} />} label="My Stories" active={isActive('/my-stories')} />
          )}
        </div>

        {/* Right side */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <button
                onClick={onNewStory}
                className="hidden md:inline-flex items-center gap-1.5 px-3 py-1.5 bg-clay-600 text-white text-sm font-medium rounded-lg hover:bg-clay-700 transition-colors"
              >
                <PlusCircle size={15} />
                Add Story
              </button>
              <div className="relative group">
                <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-stone-50 transition-colors">
                  <Avatar
                    src={profile?.avatar_url}
                    name={profile?.display_name || profile?.username}
                    size="sm"
                  />
                  <span className="hidden md:block text-sm font-medium text-stone-700">
                    {profile?.username}
                  </span>
                </button>
                <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl shadow-lg border border-stone-100 py-1 opacity-0 group-hover:opacity-100 invisible group-hover:visible transition-all">
                  <Link
                    to="/profile"
                    className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                  >
                    <User size={15} />
                    Profile Settings
                  </Link>
                  {profile?.username && (
                    <Link
                      to={`/${profile.username}`}
                      className="flex items-center gap-2.5 px-4 py-2 text-sm text-stone-700 hover:bg-stone-50"
                    >
                      <Globe size={15} />
                      Public Page
                    </Link>
                  )}
                  <hr className="my-1 border-stone-100" />
                  <button
                    onClick={handleSignOut}
                    className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={15} />
                    Sign out
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/signin"
                className="px-3 py-1.5 text-sm font-medium text-stone-700 hover:text-stone-900 transition-colors"
              >
                Sign in
              </Link>
              <Link
                to="/signup"
                className="px-3 py-1.5 bg-clay-600 text-white text-sm font-medium rounded-lg hover:bg-clay-700 transition-colors"
              >
                Join
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile bottom nav */}
      {user && (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 flex items-center justify-around py-2 z-40">
          <MobileNavLink to="/explore" icon={<Compass size={22} />} label="Explore" active={isActive('/explore')} />
          <MobileNavLink to="/search" icon={<Search size={22} />} label="Search" active={isActive('/search')} />
          <button onClick={onNewStory} className="flex flex-col items-center gap-0.5">
            <div className="w-10 h-10 bg-clay-600 rounded-xl flex items-center justify-center">
              <PlusCircle size={20} className="text-white" />
            </div>
          </button>
          <MobileNavLink to="/my-stories" icon={<BookOpen size={22} />} label="Stories" active={isActive('/my-stories')} />
          <MobileNavLink to="/profile" icon={<User size={22} />} label="Profile" active={isActive('/profile')} />
        </div>
      )}
    </header>
  );
}

function NavLink({ to, icon, label, active }) {
  return (
    <Link
      to={to}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors
        ${active ? 'bg-stone-100 text-stone-900' : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'}`}
    >
      {icon}
      {label}
    </Link>
  );
}

function MobileNavLink({ to, icon, label, active }) {
  return (
    <Link to={to} className="flex flex-col items-center gap-0.5">
      <span className={active ? 'text-clay-600' : 'text-stone-400'}>{icon}</span>
      <span className={`text-[10px] font-medium ${active ? 'text-clay-600' : 'text-stone-400'}`}>
        {label}
      </span>
    </Link>
  );
}
