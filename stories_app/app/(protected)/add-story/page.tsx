"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AddStoryPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [storyDate, setStoryDate] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return setErrorMsg("Not logged in");

    let photo_url = null;

    // Upload photo to Supabase Storage
    if (photo) {
      const fileName = `${user.id}-${Date.now()}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("stories")
        .upload(fileName, photo);

      if (uploadError) return setErrorMsg(uploadError.message);

      photo_url = uploadData.path;
    }

    // Insert into stories table
    const { error } = await supabase.from("stories").insert({
      user_id: user.id,
      title,
      description,
      country,
      city,
      story_date: storyDate,
      photo_url,
      is_favorite: false,
    });

    if (error) return setErrorMsg(error.message);

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
          type="file"
          onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
        />

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        <button className="bg-black text-white p-2 rounded">
          Submit Story
        </button>
      </form>
    </div>
  );
}
