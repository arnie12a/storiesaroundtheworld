import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Globe, Lock, ExternalLink } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile, uploadAvatar } from '../lib/supabase';
import { Input, Textarea, Button, useToast, Avatar } from '../components/UI';

export default function ProfilePage() {
  const { user, profile, refreshProfile } = useAuth();
  const { show, ToastContainer } = useToast();

  const [form, setForm]   = useState({ display_name: '', bio: '', is_public: true });
  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) {
      setForm({
        display_name: profile.display_name || '',
        bio: profile.bio || '',
        is_public: profile.is_public ?? true,
      });
    }
  }, [profile]);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAvatarFile(file);
    setAvatarPreview(URL.createObjectURL(file));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      let avatar_url = profile?.avatar_url;

      if (avatarFile) {
        const { url, error } = await uploadAvatar(user.id, avatarFile);
        if (error) throw error;
        avatar_url = url;
      }

      const { error } = await updateProfile(user.id, { ...form, avatar_url });
      if (error) throw error;

      refreshProfile();
      show('Profile updated!');
    } catch (err) {
      show(err.message || 'Failed to update profile', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-sand-50 pt-16 pb-12">
      <ToastContainer />
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-stone-900 font-display mb-6">Profile Settings</h1>

        <div className="bg-white rounded-2xl border border-stone-100 overflow-hidden">
          {/* Avatar section */}
          <div className="p-6 border-b border-stone-100">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Photo</h2>
            <div className="flex items-center gap-4">
              <Avatar
                src={avatarPreview || profile.avatar_url}
                name={form.display_name || profile.username}
                size="xl"
              />
              <label className="cursor-pointer">
                <span className="px-4 py-2 text-sm font-medium text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg transition-colors">
                  Change photo
                </span>
                <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarChange} />
              </label>
            </div>
          </div>

          {/* Info section */}
          <div className="p-6 border-b border-stone-100 space-y-4">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide">Info</h2>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">Username</label>
              <p className="px-3 py-2 bg-stone-50 rounded-lg text-sm text-stone-500">
                @{profile.username}
                <span className="ml-2 text-xs text-stone-400">(cannot be changed)</span>
              </p>
            </div>
            <Input
              label="Display Name"
              value={form.display_name}
              onChange={(e) => setForm((f) => ({ ...f, display_name: e.target.value }))}
              placeholder="Your name as shown to others"
            />
            <Textarea
              label="Bio"
              value={form.bio}
              onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
              placeholder="Tell people who you are and where you've been..."
              rows={3}
            />
          </div>

          {/* Privacy section */}
          <div className="p-6 border-b border-stone-100">
            <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-4">Privacy</h2>
            <div className="space-y-3">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  checked={form.is_public}
                  onChange={() => setForm((f) => ({ ...f, is_public: true }))}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Globe size={15} className="text-clay-500" />
                    <span className="text-sm font-medium text-stone-800">Public profile</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Your favorite stories appear on Explore. Anyone with your link can see your page.
                  </p>
                </div>
              </label>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="privacy"
                  checked={!form.is_public}
                  onChange={() => setForm((f) => ({ ...f, is_public: false }))}
                  className="mt-0.5"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <Lock size={15} className="text-stone-400" />
                    <span className="text-sm font-medium text-stone-800">Private profile</span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Only you can see your stories. Your profile won't appear in search.
                  </p>
                </div>
              </label>
            </div>
          </div>

          {/* Public link */}
          {form.is_public && (
            <div className="p-6 border-b border-stone-100">
              <h2 className="text-sm font-semibold text-stone-500 uppercase tracking-wide mb-3">Your Public Link</h2>
              <div className="flex items-center gap-2 p-3 bg-sand-50 rounded-xl border border-sand-100">
                <span className="text-sm text-stone-600 flex-1 truncate">
                  {window.location.origin}/{profile.username}
                </span>
                <Link
                  to={`/${profile.username}`}
                  target="_blank"
                  className="p-1.5 text-stone-400 hover:text-clay-600 transition-colors"
                >
                  <ExternalLink size={15} />
                </Link>
              </div>
              <p className="text-xs text-stone-400 mt-2">
                Share this link so people can see your favorite stories without signing up.
              </p>
            </div>
          )}

          <div className="p-6">
            <Button onClick={handleSave} loading={loading} className="w-full" size="lg">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
