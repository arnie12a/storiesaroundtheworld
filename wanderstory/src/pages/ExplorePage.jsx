import { useState, useEffect } from 'react';
import { getPublicFavorites } from '../lib/supabase';
import { CONTINENTS, getCountriesByContinent, countryFlag } from '../lib/countries';
import { StoryCard, LoadingSpinner, EmptyState } from '../components/UI';
import StoryDetailModal from '../components/StoryDetailModal';

export default function ExplorePage() {
  const [activeContinent, setActiveContinent] = useState('Europe');
  const [activeCountry, setActiveCountry]     = useState(null);
  const [stories, setStories]                 = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [selectedStory, setSelectedStory]     = useState(null);

  const countries = getCountriesByContinent(activeContinent);

  useEffect(() => {
    setActiveCountry(null);
  }, [activeContinent]);

  useEffect(() => {
    loadStories();
  }, [activeContinent, activeCountry]); // eslint-disable-line

  const loadStories = async () => {
    setLoading(true);
    const { data } = await getPublicFavorites({
      continent: activeContinent,
      countryCode: activeCountry || undefined,
    });
    setStories(data || []);
    setLoading(false);
  };

  // Group by country for the "all" view
  const grouped = stories.reduce((acc, s) => {
    const key = `${s.country_code}__${s.country}`;
    if (!acc[key]) acc[key] = [];
    acc[key].push(s);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-sand-50 pt-16">
      {/* Hero */}
      <div className="bg-white border-b border-stone-100 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-stone-900 font-display mb-1">Explore Stories</h1>
          <p className="text-stone-500">See how people really live in every corner of the world.</p>
        </div>
      </div>

      {/* Continent tabs */}
      <div className="bg-white border-b border-stone-100 sticky top-16 z-30">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex gap-1 overflow-x-auto py-2 scrollbar-hide">
            {CONTINENTS.map((c) => (
              <button
                key={c}
                onClick={() => setActiveContinent(c)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap
                  ${activeContinent === c
                    ? 'bg-clay-600 text-white'
                    : 'text-stone-600 hover:bg-stone-100'
                  }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Country filter pills */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActiveCountry(null)}
            className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors
              ${!activeCountry
                ? 'bg-stone-800 text-white'
                : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
          >
            All countries
          </button>
          {countries.map((c) => (
            <button
              key={c.code}
              onClick={() => setActiveCountry(c.code === activeCountry ? null : c.code)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
                ${activeCountry === c.code
                  ? 'bg-stone-800 text-white'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
                }`}
            >
              <span>{countryFlag(c.code)}</span>
              {c.name}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : stories.length === 0 ? (
          <EmptyState
            icon="🌍"
            title="No stories yet"
            description={`Be the first to share a story from ${activeCountry ? 'this country' : activeContinent}!`}
          />
        ) : activeCountry ? (
          // Single country — flat grid
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {stories.map((s) => (
              <StoryCard
                key={s.id}
                story={s}
                showAuthor
                onClick={() => setSelectedStory(s)}
              />
            ))}
          </div>
        ) : (
          // All countries — grouped sections
          <div className="space-y-10">
            {Object.entries(grouped).map(([key, countryStories]) => {
              const [code, name] = key.split('__');
              return (
                <section key={key}>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-2xl">{countryFlag(code)}</span>
                    <h2 className="text-xl font-semibold text-stone-900 font-display">{name}</h2>
                    <span className="text-sm text-stone-400">
                      {countryStories.length} {countryStories.length === 1 ? 'story' : 'stories'}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {countryStories.map((s) => (
                      <StoryCard
                        key={s.id}
                        story={s}
                        showAuthor
                        onClick={() => setSelectedStory(s)}
                      />
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>

      <StoryDetailModal story={selectedStory} onClose={() => setSelectedStory(null)} />
    </div>
  );
}
