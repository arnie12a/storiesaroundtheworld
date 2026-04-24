import { supabase } from "@/lib/supabaseClient";

export default async function TestPage() {
  const { data, error } = await supabase.from("stories").select("*");

  return (
    <pre>
      {error ? JSON.stringify(error, null, 2) : JSON.stringify(data, null, 2)}
    </pre>
  );
}
