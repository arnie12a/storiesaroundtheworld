"use client";

import { useState } from "react";
import { stories } from "@/lib/fakeStories";
import { useRouter } from "next/navigation";

export default function AddStoryPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [storyDate, setStoryDate] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    stories.push({
      id: crypto.randomUUID(),
      title,
      description,
      country,
      city,
      story_date: storyDate,
      photo_url: photoUrl || "/sample/default.jpg",
    });

    router.push("/stories");
  }

  return (
    <div className="p-8 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Add a Story</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Story Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className="border p-2 rounded"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          type="date"
          value={storyDate}
          onChange={(e) => setStoryDate(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Photo URL (optional)"
          value={photoUrl}
          onChange={(e) => setPhotoUrl(e.target.value)}
        />

        <button className="bg-black text-white p-2 rounded">
          Submit Story
        </button>
      </form>
    </div>
  );
}
