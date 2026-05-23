import { Calendar, MapPin, X } from 'lucide-react';
import { countryFlag } from '../lib/countries';
import { Avatar } from './UI';

export default function StoryDetailModal({ story, onClose }) {
  if (!story) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Photo */}
        {story.photo_url ? (
          <div className="relative h-72">
            <img src={story.photo_url} alt={story.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-black/30 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-black/50 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="relative h-32 bg-sand-100 flex items-center justify-center text-6xl">
            {countryFlag(story.country_code)}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 bg-stone-100 rounded-full flex items-center justify-center text-stone-600 hover:bg-stone-200 transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        )}

        <div className="p-6">
          {/* Location badge */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-600 text-xs font-medium px-3 py-1.5 rounded-full">
              <MapPin size={12} />
              {story.city}, {story.country}
            </span>
            <span className="inline-flex items-center gap-1.5 bg-stone-100 text-stone-600 text-xs font-medium px-3 py-1.5 rounded-full">
              <Calendar size={12} />
              {new Date(story.visited_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
            </span>
          </div>

          <h2 className="text-2xl font-bold text-stone-900 leading-tight mb-4 font-display">
            {story.title}
          </h2>

          <p className="text-stone-600 leading-relaxed whitespace-pre-wrap">
            {story.description}
          </p>

          {/* Author */}
          {(story.display_name || story.username) && (
            <div className="mt-6 pt-5 border-t border-stone-100 flex items-center gap-3">
              <Avatar src={story.avatar_url} name={story.display_name || story.username} size="md" />
              <div>
                <p className="font-medium text-stone-800 text-sm">
                  {story.display_name || story.username}
                </p>
                {story.username && (
                  <a
                    href={`/${story.username}`}
                    className="text-xs text-clay-600 hover:underline"
                  >
                    @{story.username}
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
