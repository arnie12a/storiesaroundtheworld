import { Link } from 'react-router-dom';
import { Globe, ArrowRight, Star } from 'lucide-react';

const SAMPLE_STORIES = [
  {
    flag: '🇯🇵', country: 'Japan', city: 'Kyoto',
    title: 'The woman who fed me ramen at 6am',
    excerpt: 'She didn\'t speak English. I didn\'t speak Japanese. But she refilled my bowl three times and patted my shoulder when I left.',
    photo: 'https://images.unsplash.com/photo-1545569341-9eb8b30979d9?w=600&q=80',
  },
  {
    flag: '🇲🇦', country: 'Morocco', city: 'Marrakech',
    title: 'Playing cards with strangers in the medina',
    excerpt: 'Three retired men waved me over to their table in an alleyway. Three hours later I understood nothing they said but everything about how they lived.',
    photo: 'https://images.unsplash.com/photo-1553073520-80b5ad5ec870?w=600&q=80',
  },
  {
    flag: '🇵🇪', country: 'Peru', city: 'Cusco',
    title: 'A grandmother\'s kitchen above the clouds',
    excerpt: 'She invited me into her home after I got lost hiking. The soup she made from scratch was the best thing I\'ve ever eaten.',
    photo: 'https://images.unsplash.com/photo-1526392060635-9d6019884377?w=600&q=80',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-sand-50">
      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-clay-50 text-clay-700 text-sm font-medium px-4 py-2 rounded-full border border-clay-100 mb-6">
            <Star size={14} className="fill-clay-400 text-clay-400" />
            Real stories from real travelers
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-stone-900 leading-tight mb-6 font-display">
            Travel is about{' '}
            <span className="text-clay-600">people</span>,<br />
            not places.
          </h1>
          <p className="text-xl text-stone-500 leading-relaxed max-w-xl mx-auto mb-10">
            Share the moments that really moved you. Discover how people live their lives in every corner of the world.
          </p>
          <div className="flex items-center justify-center gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 px-6 py-3 bg-clay-600 text-white font-semibold rounded-xl hover:bg-clay-700 transition-colors text-base"
            >
              Start sharing <ArrowRight size={18} />
            </Link>
            <Link
              to="/explore"
              className="inline-flex items-center gap-2 px-6 py-3 bg-white text-stone-700 font-semibold rounded-xl border border-stone-200 hover:border-stone-300 transition-colors text-base"
            >
              <Globe size={18} />
              Explore stories
            </Link>
          </div>
        </div>
      </section>

      {/* Sample story cards */}
      <section className="max-w-6xl mx-auto px-4 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {SAMPLE_STORIES.map((s, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl overflow-hidden shadow-sm border border-stone-100 hover:shadow-md transition-shadow"
            >
              <div className="h-48 relative overflow-hidden">
                <img src={s.photo} alt={s.title} className="w-full h-full object-cover" />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    {s.flag} {s.city}, {s.country}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-stone-900 mb-1 font-display">{s.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{s.excerpt}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white border-y border-stone-100 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-stone-900 mb-12 font-display">How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { emoji: '📸', title: 'Capture a moment', desc: 'Add stories for each country you\'ve visited — a photo, a place, a date, and the story behind it.' },
              { emoji: '⭐', title: 'Pick your favorite', desc: 'Choose one story per country that best captures how people really live there.' },
              { emoji: '🌍', title: 'Share & explore', desc: 'Your favorites go public. Explore other travelers\' authentic moments by country.' },
            ].map((step, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-4">{step.emoji}</div>
                <h3 className="font-semibold text-stone-800 mb-2">{step.title}</h3>
                <p className="text-stone-500 text-sm leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4 text-center">
        <div className="max-w-lg mx-auto">
          <h2 className="text-3xl font-bold text-stone-900 mb-4 font-display">
            What's your favorite story?
          </h2>
          <p className="text-stone-500 mb-8">
            The next traveler is waiting to discover what you found.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 px-8 py-4 bg-clay-600 text-white font-semibold rounded-xl hover:bg-clay-700 transition-colors text-base"
          >
            Join WanderStory free <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
