import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { searchProfiles } from '../lib/supabase';
import { Avatar, LoadingSpinner } from '../components/UI';

export default function SearchPage() {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setSearched(true);
    const { data } = await searchProfiles(query.trim());
    setResults(data || []);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-sand-50 pt-16">
      <div className="max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-stone-900 font-display mb-2">Find Travelers</h1>
        <p className="text-stone-500 mb-8">Search by username to discover someone's favorite stories.</p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <div className="flex-1 relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by username..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 text-stone-900 bg-white
                placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-clay-400 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 bg-clay-600 text-white font-medium rounded-xl hover:bg-clay-700 transition-colors"
          >
            Search
          </button>
        </form>

        {loading ? (
          <LoadingSpinner />
        ) : searched && results.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-stone-600 font-medium">No travelers found for "{query}"</p>
            <p className="text-stone-400 text-sm mt-1">Try a different username</p>
          </div>
        ) : (
          <div className="space-y-3">
            {results.map((profile) => (
              <Link
                key={profile.id}
                to={`/${profile.username}`}
                className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-stone-100 hover:border-stone-200 hover:shadow-sm transition-all group"
              >
                <Avatar src={profile.avatar_url} name={profile.display_name || profile.username} size="lg" />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-stone-900 group-hover:text-clay-600 transition-colors">
                    {profile.display_name || profile.username}
                  </p>
                  <p className="text-sm text-stone-500">@{profile.username}</p>
                  {profile.bio && (
                    <p className="text-sm text-stone-500 mt-1 line-clamp-1">{profile.bio}</p>
                  )}
                </div>
                <span className="text-stone-300 group-hover:text-clay-400 transition-colors text-lg">→</span>
              </Link>
            ))}
          </div>
        )}

        {!searched && (
          <div className="grid grid-cols-3 gap-4 mt-8">
            {['🗺️', '🤝', '💬'].map((emoji, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 border border-stone-100 text-center">
                <div className="text-3xl mb-2">{emoji}</div>
                <p className="text-xs text-stone-500">
                  {['Discover real stories', 'Follow travelers', 'Share perspectives'][i]}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
