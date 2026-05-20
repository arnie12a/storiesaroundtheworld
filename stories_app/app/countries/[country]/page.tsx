import { supabase } from "@/lib/supabaseClient";

interface CountryPageProps {
  params: {
    country: string;
  };
}

export default async function CountryFeed({ params }: CountryPageProps) {
  const { country } = params;

  const { data: stories, error } = await supabase
    .from("stories")
    .select(`
      id,
      title,
      description,
      photo_url,
      city,
      story_date,
      profiles (
        username,
        profile_visibility
      )
    `)
    .eq("country", country)
    .eq("is_favorite", true);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Favorite Stories from {country}
      </h1>

      {stories?.length === 0 && <p>No stories yet.</p>}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories?.map((story) => (
          <div key={story.id} className="border rounded p-4">
            <img
              src={story.photo_url}
              className="w-full h-48 object-cover rounded"
            />
            <h2 className="text-xl font-semibold mt-2">{story.title}</h2>
            <p className="text-gray-600">{story.city}</p>
            <p className="mt-2">{story.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
