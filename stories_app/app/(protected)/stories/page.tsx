import { createServerSupabase } from "@/lib/supabaseServer";
import Image from "next/image";

export default async function StoriesPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: stories } = await supabase
    .from("stories")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <main className="p-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">My Stories</h1>

      <div className="flex flex-col gap-6">
        {stories?.map((story) => (
          <div key={story.id} className="border p-4 rounded">
            <h2 className="text-xl font-semibold">{story.title}</h2>
            <p className="text-gray-600">{story.description}</p>

            {story.photo_url && (
              <Image
                src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/stories/${story.photo_url}`}
                alt={story.title}
                width={600}
                height={400}
                className="rounded mt-4"
              />
            )}

            <p className="text-sm text-gray-500 mt-2">
              {story.city}, {story.country} — {story.story_date}
            </p>
          </div>
        ))}
      </div>
    </main>
  );
}
