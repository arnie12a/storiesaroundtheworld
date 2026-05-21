import Link from "next/link";
import { createServerSupabase } from "@/lib/supabaseServer";
import { redirect } from "next/navigation";

export default async function LandingPage() {
  const supabase = createServerSupabase();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/home");

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">Arnav Karnik Photography</h1>

      <p className="text-lg text-gray-600 mb-10">
        Stories from around the world — captured through my lens.
      </p>

      <div className="flex gap-4">
        <Link href="/login" className="px-4 py-2 bg-blue-600 text-white rounded">
          Login
        </Link>

        <Link href="/signup" className="px-4 py-2 bg-green-600 text-white rounded">
          Sign Up
        </Link>
      </div>
    </main>
  );
}
