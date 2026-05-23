import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Globe, MapPin, Lock } from 'lucide-react';
import { getProfileByUsername, getStoriesByUsername } from '../lib/supabase';
import { countryFlag } from '../lib/countries';
import { Avatar, StoryCard, LoadingSpinner, EmptyState } from '../components/UI';
import StoryDetailModal from '../components/StoryDetailModal';

export default function PublicProfilePage() {
  const { username } = useParams();
  const [profile, setProfile]     = useState(null);
  const [stories, setStories]     = useState([]);
  const [loading, setLoading]     = useState(true);
  const [notFound, setNotFound]   = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeCountry, setActiveCountry] = useState('all');

  useEffect(() => {
    load();
  }, [username]); // eslint-disable-line

  const load = async () => {
    setLoading(true);

    const { data: prof, error } = await getProfileByUsername(username);
    if (error || !prof) {
      setNotFound(true);
      setLoading(false);
      return;
    }
    setProfile(prof);

    const { data: s } = await getStoriesByUsername(username);
    setStories(s || []);
    setLoading(false);
  };

  const countryList = [...new Set(stories.map((s) => s.country_code))].map((code) => ({
    code,
    name: stories.find((s) => s.country_code === code)?.country,
  }));

  const displayedStories =
    activeCountry === 'all'
      ? stories
      : stories.filter((s) => s.country_code === activeCountry);

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-50 pt-16 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen bg-sand-50 pt-16 flex flex-col items-center justify-center px-4 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <h1 className="text-2xl font-bold text-stone-800 mb-2 font-display">Profile not found</h1>
        <p className="text-stone-500 mb-6">
          This profile is either private or doesn't exist.
        </p>
        <Link to="/explore" className="px-5 py-2.5 bg-clay-600 text-white rounded-xl font-medium hover:bg-clay-700 transition-colors">
          Explore Stories
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-sand-50 pt-16 pb-12">
      {/* Profile header */}
      <div className="bg-white border-b border-stone-100">
        <div className="max-w-4xl mx-auto px-4 py-10">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <Avatar src={profile.avatar_url} name={profile.display_name || profile.username} size="xl" />
            <div className="text-center sm:text-left">
              <h1 className="text-2xl font-bold text-stone-900 font-display">
                {profile.display_name || profile.username}
              </h1>
              <p className="text-stone-500 text-sm">@{profile.username}</p>
              {profile.bio && (
                <p className="text-stone-600 mt-2 max-w-md">{profile.bio}</p>
              )}
              <div className="flex items-center justify-center sm:justify-start gap-4 mt-3">
                <div className="text-sm">
                  <span className="font-semibold text-stone-900">{stories.length}</span>
                  <span className="text-stone-500 ml-1">favorite {stories.length === 1 ? 'story' : 'stories'}</span>
                </div>
                <div className="text-sm">
                  <span className="font-semibold text-stone-900">{countryList.length}</span>
                  <span className="text-stone-500 ml-1">{countryList.length === 1 ? 'country' : 'countries'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {stories.length === 0 ? (
          <EmptyState
            icon="🌏"
            title="No stories yet"
            description={`${profile.display_name || profile.username} hasn't shared any favorites yet.`}
          />
        ) : (
          <>
            {/* Country filter */}
            <div className="flex gap-2 flex-wrap mb-6">
              <button
                onClick={() => setActiveCountry('all')}
                className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                  ${activeCountry === 'all' ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'}`}
              >
                All
              </button>
              {countryList.map((c) => (
                <button
                  key={c.code}
                  onClick={() => setActiveCountry(c.code === activeCountry ? 'all' : c.code)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                    ${activeCountry === c.code ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200 hover:border-stone-300'}`}
                >
                  <span>{countryFlag(c.code)}</span> {c.name}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {displayedStories.map((story) => (
                <StoryCard
                  key={story.id}
                  story={story}
                  onClick={() => setSelectedStory(story)}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* WanderStory branding for non-logged-in visitors */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-6 h-6 bg-clay-600 rounded flex items-center justify-center">
            <Globe size={12} className="text-white" />
          </div>
          <span className="text-sm font-bold text-stone-700 font-display">WanderStory</span>
        </Link>
        <Link to="/signup" className="px-4 py-1.5 bg-clay-600 text-white text-sm font-medium rounded-lg hover:bg-clay-700 transition-colors">
          Share your stories →
        </Link>
      </div>

      <StoryDetailModal story={selectedStory} onClose={() => setSelectedStory(null)} />
    </div>
  );
}
