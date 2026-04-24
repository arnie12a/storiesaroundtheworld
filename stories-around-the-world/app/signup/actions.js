"use server";

import { supabase } from "@/lib/supabaseClient";

export async function signup(formData) {
  const email = formData.get("email");
  const password = formData.get("password");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  return { data, error };
}
