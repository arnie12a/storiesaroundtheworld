import { supabase } from "@/lib/supabaseClient";

export default async function TestProfiles() {
  const { data, error } = await supabase.from("profiles").select("*");

  return (
    <div style={{ padding: 20 }}>
      <h1>Profiles Test</h1>
      <pre>{JSON.stringify({ data, error }, null, 2)}</pre>
    </div>
  );
}
