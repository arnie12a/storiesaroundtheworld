"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleSignup(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (password !== confirmPassword) {
      return setErrorMsg("Passwords do not match");
    }

    // 1. Create auth user
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) return setErrorMsg(error.message);

    // 2. Fetch the user (THIS FIXES YOUR ERROR)
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return setErrorMsg("User not found after signup");

    // 3. Create profile row
    await supabase.from("profiles").insert({
      id: user.id,
      username: email.split("@")[0],
      display_name: "",
      bio: "",
      avatar_url: "",
      profile_visibility: "public",
    });

    router.push("/home");
  }

  return (
    <div className="p-8 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Account</h1>

      <form onSubmit={handleSignup} className="flex flex-col gap-4">
        <input
          className="border p-2 rounded"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <input
          className="border p-2 rounded"
          placeholder="Confirm Password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        <button className="bg-green-600 text-white p-2 rounded">
          Sign Up
        </button>
      </form>
    </div>
  );
}
