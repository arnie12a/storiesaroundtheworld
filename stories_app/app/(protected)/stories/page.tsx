import Image from "next/image";
import { stories } from "@/lib/fakeStories";

export default function StoriesPage() {
  return (
    <main className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-10 tracking-tight text-stone-100">
        My Stories
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {stories.map((story) => (
          <div
            key={story.id}
            className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition hover:-translate-y-1"
          >
            <div className="relative h-56 w-full">
              <Image
                src={story.photo_url}
                alt={story.title}
                fill
                className="object-cover"
              />
            </div>

            <div className="p-5">
              <h2 className="text-xl font-semibold text-stone-100">
                {story.title}
              </h2>

              <p className="text-stone-400 text-sm mt-2 line-clamp-3">
                {story.description}
              </p>

              <p className="text-xs text-stone-500 mt-4">
                {story.city}, {story.country} — {story.story_date}
              </p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
