"use server";

import { supabase } from "@/lib/supabaseClient";

export async function login(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  return { data, error };
}
