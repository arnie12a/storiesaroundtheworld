import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing REACT_APP_SUPABASE_URL or REACT_APP_SUPABASE_ANON_KEY in .env');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// ── Auth helpers ──────────────────────────────────────────────
export const signUp = async ({ email, password, username, displayName }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username, display_name: displayName },
    },
  });
  return { data, error };
};

export const signIn = async ({ email, password }) => {
  return supabase.auth.signInWithPassword({ email, password });
};

export const signOut = () => supabase.auth.signOut();

// ── Profile helpers ───────────────────────────────────────────
export const getProfile = async (userId) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  return { data, error };
};

export const getProfileByUsername = async (username) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', username)
    .eq('is_public', true)
    .single();
  return { data, error };
};

export const updateProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single();
  return { data, error };
};

export const searchProfiles = async (query) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, display_name, avatar_url, bio')
    .eq('is_public', true)
    .ilike('username', `%${query}%`)
    .limit(20);
  return { data, error };
};

// ── Story helpers ─────────────────────────────────────────────
export const createStory = async (story) => {
  const { data, error } = await supabase
    .from('stories')
    .insert(story)
    .select()
    .single();
  return { data, error };
};

export const updateStory = async (storyId, updates) => {
  const { data, error } = await supabase
    .from('stories')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', storyId)
    .select()
    .single();
  return { data, error };
};

export const deleteStory = async (storyId) => {
  return supabase.from('stories').delete().eq('id', storyId);
};

// Set a story as the favorite for that country (unsets any existing favorite)
export const setFavoriteStory = async (userId, storyId, countryCode) => {
  // Unset previous favorite for this country
  await supabase
    .from('stories')
    .update({ is_favorite: false })
    .eq('user_id', userId)
    .eq('country_code', countryCode)
    .eq('is_favorite', true);

  // Set new favorite
  return supabase
    .from('stories')
    .update({ is_favorite: true })
    .eq('id', storyId)
    .select()
    .single();
};

// Get all stories for the logged-in user, grouped awareness via JS
export const getMyStories = async (userId) => {
  const { data, error } = await supabase
    .from('stories')
    .select('*')
    .eq('user_id', userId)
    .order('visited_date', { ascending: false });
  return { data, error };
};

// Public favorites for explore page — optionally filter by continent/country
export const getPublicFavorites = async ({ continent, countryCode } = {}) => {
  let query = supabase
    .from('public_favorites')
    .select('*')
    .order('created_at', { ascending: false });

  if (continent) query = query.eq('continent', continent);
  if (countryCode) query = query.eq('country_code', countryCode);

  const { data, error } = await query;
  return { data, error };
};

// Get public favorites for a specific username
export const getStoriesByUsername = async (username) => {
  const { data, error } = await supabase
    .from('public_favorites')
    .select('*')
    .eq('username', username)
    .order('visited_date', { ascending: false });
  return { data, error };
};

// ── Storage helpers ───────────────────────────────────────────
export const uploadStoryPhoto = async (userId, file) => {
  const ext = file.name.split('.').pop();
  const path = `${userId}/${Date.now()}.${ext}`;
  const { error } = await supabase.storage
    .from('story-photos')
    .upload(path, file, { upsert: false });
  if (error) return { url: null, error };
  const { data } = supabase.storage.from('story-photos').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
};

export const uploadAvatar = async (userId, file) => {
  const ext = file.name.split('.').pop();
  const path = `${userId}/avatar.${ext}`;
  const { error } = await supabase.storage
    .from('avatars')
    .upload(path, file, { upsert: true });
  if (error) return { url: null, error };
  const { data } = supabase.storage.from('avatars').getPublicUrl(path);
  return { url: data.publicUrl, error: null };
};
