import { createServerSupabase } from "@/lib/supabaseServer";
import LogoutButton from "./LogoutButton";

export default async function HomePage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.email}</h1>

      <p className="text-gray-600">
        You are now logged in. More features coming soon.
      </p>
      <div className="flex flex-col gap-4">
        <a href="/add-story" className="border p-4 rounded">
          Add a Story
        </a>

        <a href="/stories" className="border p-4 rounded">
          View My Stories
        </a>
      </div>


      <div className="flex justify-end mb-6">
        <LogoutButton />
        </div>

    </main>
  );
}
