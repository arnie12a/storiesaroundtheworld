import { useState, useEffect } from 'react';
import { Pencil, Trash2, Star, PlusCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getMyStories, deleteStory, setFavoriteStory } from '../lib/supabase';
import { countryFlag, getCountriesByContinent, CONTINENTS } from '../lib/countries';
import { Button, LoadingSpinner, EmptyState, StoryCard, useToast, Avatar } from '../components/UI';
import StoryModal from '../components/StoryModal';
import StoryDetailModal from '../components/StoryDetailModal';

export default function MyStoriesPage() {
  const { user, profile } = useAuth();
  const { show, ToastContainer } = useToast();

  const [stories, setStories]           = useState([]);
  const [loading, setLoading]           = useState(true);
  const [editStory, setEditStory]       = useState(null);
  const [modalOpen, setModalOpen]       = useState(false);
  const [selectedStory, setSelectedStory] = useState(null);
  const [activeCountry, setActiveCountry] = useState('all');

  useEffect(() => {
    if (user) loadStories();
  }, [user]); // eslint-disable-line

  const loadStories = async () => {
    setLoading(true);
    const { data } = await getMyStories(user.id);
    setStories(data || []);
    setLoading(false);
  };

  const handleDelete = async (story) => {
    if (!window.confirm('Delete this story? This cannot be undone.')) return;
    const { error } = await deleteStory(story.id);
    if (error) { show('Failed to delete', 'error'); return; }
    show('Story deleted');
    loadStories();
  };

  const handleSetFavorite = async (story) => {
    await setFavoriteStory(user.id, story.id, story.country_code);
    show('Favorite updated!');
    loadStories();
  };

  const handleEdit = (story) => {
    setEditStory(story);
    setModalOpen(true);
  };

  // Group stories by country
  const byCountry = stories.reduce((acc, s) => {
    if (!acc[s.country_code]) acc[s.country_code] = { country: s.country, code: s.country_code, stories: [] };
    acc[s.country_code].stories.push(s);
    return acc;
  }, {});

  const countryList = Object.values(byCountry).sort((a, b) => a.country.localeCompare(b.country));

  const displayedStories =
    activeCountry === 'all'
      ? stories
      : stories.filter((s) => s.country_code === activeCountry);

  return (
    <div className="min-h-screen bg-sand-50 pt-16 pb-24 md:pb-8">
      <ToastContainer />

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar src={profile?.avatar_url} name={profile?.display_name || profile?.username} size="lg" />
            <div>
              <h1 className="text-2xl font-bold text-stone-900 font-display">My Stories</h1>
              <p className="text-stone-500 text-sm">{stories.length} stories across {countryList.length} countries</p>
            </div>
          </div>
          <Button
            onClick={() => { setEditStory(null); setModalOpen(true); }}
            className="hidden md:inline-flex"
          >
            <PlusCircle size={16} />
            Add Story
          </Button>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : stories.length === 0 ? (
          <EmptyState
            icon="✈️"
            title="No stories yet"
            description="Start sharing the moments that really moved you."
            action={
              <Button onClick={() => { setEditStory(null); setModalOpen(true); }}>
                <PlusCircle size={16} /> Add your first story
              </Button>
            }
          />
        ) : (
          <div className="flex gap-6">
            {/* Country sidebar */}
            <aside className="hidden md:block w-52 flex-shrink-0">
              <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
                <div className="p-3 border-b border-stone-100">
                  <p className="text-xs font-semibold text-stone-400 uppercase tracking-wide">Countries</p>
                </div>
                <nav className="py-1 max-h-[calc(100vh-250px)] overflow-y-auto">
                  <button
                    onClick={() => setActiveCountry('all')}
                    className={`w-full text-left px-3 py-2 text-sm flex items-center justify-between transition-colors
                      ${activeCountry === 'all' ? 'bg-clay-50 text-clay-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                  >
                    <span>All countries</span>
                    <span className="text-xs text-stone-400">{stories.length}</span>
                  </button>
                  {countryList.map((c) => {
                    const favorite = c.stories.find((s) => s.is_favorite);
                    return (
                      <button
                        key={c.code}
                        onClick={() => setActiveCountry(c.code)}
                        className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 transition-colors
                          ${activeCountry === c.code ? 'bg-clay-50 text-clay-700 font-medium' : 'text-stone-600 hover:bg-stone-50'}`}
                      >
                        <span>{countryFlag(c.code)}</span>
                        <span className="flex-1 truncate">{c.country}</span>
                        <span className="flex items-center gap-1 text-xs text-stone-400">
                          {favorite && <Star size={10} className="fill-amber-400 text-amber-400" />}
                          {c.stories.length}
                        </span>
                      </button>
                    );
                  })}
                </nav>
              </div>
            </aside>

            {/* Story grid */}
            <div className="flex-1">
              {/* Mobile country picker */}
              <div className="md:hidden mb-4 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                <button
                  onClick={() => setActiveCountry('all')}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                    ${activeCountry === 'all' ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200'}`}
                >
                  All
                </button>
                {countryList.map((c) => (
                  <button
                    key={c.code}
                    onClick={() => setActiveCountry(c.code)}
                    className={`flex-shrink-0 flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium border transition-colors
                      ${activeCountry === c.code ? 'bg-stone-800 text-white border-stone-800' : 'bg-white text-stone-600 border-stone-200'}`}
                  >
                    {countryFlag(c.code)} {c.country}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                {displayedStories.map((story) => (
                  <div key={story.id} className="relative group">
                    <StoryCard story={story} onClick={() => setSelectedStory(story)} />

                    {/* Actions overlay */}
                    <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSetFavorite(story); }}
                        title={story.is_favorite ? 'This is your favorite' : 'Set as favorite for this country'}
                        className={`w-8 h-8 rounded-full flex items-center justify-center shadow-md transition-colors
                          ${story.is_favorite
                            ? 'bg-amber-400 text-white'
                            : 'bg-white/90 text-stone-500 hover:bg-amber-50 hover:text-amber-500'
                          }`}
                      >
                        <Star size={14} className={story.is_favorite ? 'fill-white' : ''} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleEdit(story); }}
                        className="w-8 h-8 rounded-full bg-white/90 text-stone-500 hover:bg-stone-100 flex items-center justify-center shadow-md transition-colors"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(story); }}
                        className="w-8 h-8 rounded-full bg-white/90 text-stone-500 hover:bg-red-50 hover:text-red-500 flex items-center justify-center shadow-md transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    {story.is_favorite && (
                      <div className="absolute bottom-[88px] left-3">
                        <span className="inline-flex items-center gap-1 bg-amber-400 text-white text-xs font-medium px-2 py-0.5 rounded-full">
                          <Star size={10} className="fill-white" /> Favorite
                        </span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      <StoryModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditStory(null); }}
        story={editStory}
        onSaved={loadStories}
      />
      <StoryDetailModal story={selectedStory} onClose={() => setSelectedStory(null)} />
    </div>
  );
}
