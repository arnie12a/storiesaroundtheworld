import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";

export default async function HomePage() {
  // Check if user is logged in
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">
        Arnav Karnik Photography
      </h1>

      <p className="text-lg text-gray-600 mb-10">
        Stories from around the world — captured through my lens.
      </p>

      {/* Navigation */}
      <div className="flex flex-wrap gap-4 mb-12">
        <Link
          href="/stories/upload"
          className="px-4 py-2 bg-black text-white rounded"
        >
          Upload Story
        </Link>

        <Link
          href="/profile"
          className="px-4 py-2 border rounded"
        >
          My Profile
        </Link>

        <Link
          href="/countries/India"
          className="px-4 py-2 border rounded"
        >
          Explore Countries
        </Link>

        {!user && (
          <Link
            href="/login"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Login
          </Link>
        )}

        {!user && (
          <Link
            href="/signup"
            className="px-4 py-2 bg-green-600 text-white rounded"
          >
            Sign Up
          </Link>
        )}
      </div>

      {/* Featured Countries */}
      <h2 className="text-2xl font-semibold mb-4">Featured Countries</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {["India", "Portugal", "Mexico", "Sri Lanka", "England", "Scotland"].map(
          (country) => (
            <Link
              key={country}
              href={`/countries/${country}`}
              className="border rounded p-4 hover:shadow-md transition"
            >
              <h3 className="text-xl font-medium">{country}</h3>
              <p className="text-gray-500 text-sm">View stories →</p>
            </Link>
          )
        )}
      </div>
    </main>
  );
}
