import LogoutButton from "./LogoutButton";
import Link from "next/link";
import { stories } from "@/lib/fakeStories";

export default function HomePage() {
  const uniqueCountries = new Set(stories.map((s) => s.country));

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <div className="flex justify-end mb-6">
        <LogoutButton />
      </div>

      <h1 className="text-3xl font-bold mb-6">Welcome Back</h1>

      <p className="text-gray-600 mb-6">
        Total Countries Visited: <strong>{uniqueCountries.size}</strong>
      </p>

      <div className="flex flex-col gap-4">
        <Link href="/add-story" className="border p-4 rounded">
          Add a Story
        </Link>

        <Link href="/stories" className="border p-4 rounded">
          View My Stories
        </Link>
      </div>
    </main>
  );
}
