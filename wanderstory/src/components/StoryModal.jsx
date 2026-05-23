import { useState, useEffect } from 'react';
import { Star } from 'lucide-react';
import { Modal, Button, Input, Textarea, Select, PhotoUpload, useToast } from './UI';
import { COUNTRIES, CONTINENTS, getCountriesByContinent } from '../lib/countries';
import {
  createStory,
  updateStory,
  setFavoriteStory,
  uploadStoryPhoto,
} from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function StoryModal({ isOpen, onClose, story = null, onSaved }) {
  const { user } = useAuth();
  const { show, ToastContainer } = useToast();

  const [form, setForm] = useState({
    continent: '',
    country_code: '',
    country: '',
    city: '',
    visited_date: '',
    title: '',
    description: '',
    is_favorite: false,
  });
  const [photoFile, setPhotoFile] = useState(null);
  const [loading, setLoading]     = useState(false);
  const [errors, setErrors]       = useState({});

  const isEdit = !!story;

  useEffect(() => {
    if (story) {
      setForm({
        continent: story.continent,
        country_code: story.country_code,
        country: story.country,
        city: story.city,
        visited_date: story.visited_date,
        title: story.title,
        description: story.description,
        is_favorite: story.is_favorite,
      });
    } else {
      setForm({ continent: '', country_code: '', country: '', city: '', visited_date: '', title: '', description: '', is_favorite: false });
    }
    setPhotoFile(null);
    setErrors({});
  }, [story, isOpen]);

  const countriesForContinent = form.continent
    ? getCountriesByContinent(form.continent)
    : [];

  const handleContinent = (e) => {
    setForm((f) => ({ ...f, continent: e.target.value, country_code: '', country: '' }));
  };

  const handleCountry = (e) => {
    const code = e.target.value;
    const country = COUNTRIES.find((c) => c.code === code);
    setForm((f) => ({
      ...f,
      country_code: code,
      country: country?.name || '',
      continent: country?.continent || f.continent,
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.country_code) e.country = 'Please select a country';
    if (!form.city.trim()) e.city = 'City is required';
    if (!form.visited_date) e.visited_date = 'Date is required';
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.description.trim()) e.description = 'Story is required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);

    try {
      let photo_url = story?.photo_url || null;

      // Upload photo if provided
      if (photoFile) {
        const { url, error } = await uploadStoryPhoto(user.id, photoFile);
        if (error) { show('Photo upload failed', 'error'); setLoading(false); return; }
        photo_url = url;
      }

      const payload = {
        user_id: user.id,
        ...form,
        photo_url,
      };

      let savedStory;
      if (isEdit) {
        const { data, error } = await updateStory(story.id, payload);
        if (error) throw error;
        savedStory = data;
      } else {
        const { data, error } = await createStory(payload);
        if (error) throw error;
        savedStory = data;
      }

      // Handle favorite setting
      if (form.is_favorite && savedStory) {
        await setFavoriteStory(user.id, savedStory.id, form.country_code);
      }

      show(isEdit ? 'Story updated!' : 'Story added!');
      onSaved?.();
      onClose();
    } catch (err) {
      console.error(err);
      show(err.message || 'Something went wrong', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={isEdit ? 'Edit Story' : 'Add a Story'}
        maxWidth="max-w-xl"
      >
        <div className="space-y-4">
          <PhotoUpload
            value={story?.photo_url}
            onChange={setPhotoFile}
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Continent"
              value={form.continent}
              onChange={handleContinent}
            >
              <option value="">Select continent</option>
              {CONTINENTS.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </Select>

            <Select
              label="Country"
              value={form.country_code}
              onChange={handleCountry}
              error={errors.country}
              disabled={!form.continent}
            >
              <option value="">Select country</option>
              {countriesForContinent.map((c) => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="City"
              placeholder="e.g. Kyoto"
              value={form.city}
              onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
              error={errors.city}
            />
            <Input
              label="Date Visited"
              type="date"
              value={form.visited_date}
              onChange={(e) => setForm((f) => ({ ...f, visited_date: e.target.value }))}
              error={errors.visited_date}
            />
          </div>

          <Input
            label="Story Title"
            placeholder="e.g. The woman who fed me ramen at 6am"
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            error={errors.title}
          />

          <Textarea
            label="Your Story"
            placeholder="Tell us what made this moment unforgettable..."
            rows={5}
            value={form.description}
            onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
            error={errors.description}
          />

          {/* Favorite toggle */}
          <button
            type="button"
            onClick={() => setForm((f) => ({ ...f, is_favorite: !f.is_favorite }))}
            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-all
              ${form.is_favorite
                ? 'border-amber-400 bg-amber-50 text-amber-700'
                : 'border-stone-200 text-stone-500 hover:border-stone-300'
              }`}
          >
            <Star size={18} className={form.is_favorite ? 'fill-amber-400 text-amber-400' : ''} />
            <div className="text-left">
              <p className="text-sm font-medium">
                {form.is_favorite ? 'This is my favorite from this country' : 'Set as my favorite story for this country'}
              </p>
              <p className="text-xs opacity-70">Your favorite will appear publicly on the explore page</p>
            </div>
          </button>

          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button onClick={handleSubmit} loading={loading} className="flex-1">
              {isEdit ? 'Save Changes' : 'Add Story'}
            </Button>
          </div>
        </div>
      </Modal>
      <ToastContainer />
    </>
  );
}
