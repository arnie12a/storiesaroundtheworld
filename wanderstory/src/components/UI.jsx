import { useState } from 'react';
import { X, Upload, Loader2 } from 'lucide-react';

// ── Button ────────────────────────────────────────────────────
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  className = '',
  ...props
}) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sand-400 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-clay-600 text-white hover:bg-clay-700 focus:ring-clay-500',
    secondary: 'bg-sand-100 text-stone-800 hover:bg-sand-200 focus:ring-sand-300',
    ghost: 'text-stone-600 hover:bg-sand-50 hover:text-stone-900',
    danger: 'bg-red-500 text-white hover:bg-red-600',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  return (
    <button
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 size={16} className="animate-spin" />}
      {children}
    </button>
  );
}

// ── Input ─────────────────────────────────────────────────────
export function Input({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-stone-700">{label}</label>
      )}
      <input
        className={`w-full px-3 py-2 rounded-lg border text-stone-900 bg-white
          placeholder-stone-400 text-sm transition-colors
          focus:outline-none focus:ring-2 focus:ring-clay-400 focus:border-transparent
          ${error ? 'border-red-400' : 'border-stone-200 hover:border-stone-300'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Textarea ──────────────────────────────────────────────────
export function Textarea({ label, error, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-stone-700">{label}</label>
      )}
      <textarea
        className={`w-full px-3 py-2 rounded-lg border text-stone-900 bg-white
          placeholder-stone-400 text-sm resize-none transition-colors
          focus:outline-none focus:ring-2 focus:ring-clay-400 focus:border-transparent
          ${error ? 'border-red-400' : 'border-stone-200 hover:border-stone-300'}
          ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Select ────────────────────────────────────────────────────
export function Select({ label, error, children, className = '', ...props }) {
  return (
    <div className="space-y-1">
      {label && (
        <label className="block text-sm font-medium text-stone-700">{label}</label>
      )}
      <select
        className={`w-full px-3 py-2 rounded-lg border text-stone-900 bg-white
          text-sm transition-colors appearance-none cursor-pointer
          focus:outline-none focus:ring-2 focus:ring-clay-400 focus:border-transparent
          ${error ? 'border-red-400' : 'border-stone-200 hover:border-stone-300'}
          ${className}`}
        {...props}
      >
        {children}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}

// ── Modal ─────────────────────────────────────────────────────
export function Modal({ isOpen, onClose, title, children, maxWidth = 'max-w-lg' }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        className={`relative w-full ${maxWidth} bg-white rounded-2xl shadow-2xl
          max-h-[90vh] overflow-y-auto`}
      >
        <div className="flex items-center justify-between p-6 border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-6">{children}</div>
      </div>
    </div>
  );
}

// ── PhotoUpload ───────────────────────────────────────────────
export function PhotoUpload({ value, onChange, className = '' }) {
  const [preview, setPreview] = useState(value || null);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreview(URL.createObjectURL(file));
    onChange(file);
  };

  return (
    <div className={`relative ${className}`}>
      <label className="block cursor-pointer">
        {preview ? (
          <div className="relative w-full h-48 rounded-xl overflow-hidden group">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-white text-sm font-medium">Change photo</span>
            </div>
          </div>
        ) : (
          <div className="w-full h-48 rounded-xl border-2 border-dashed border-stone-200 hover:border-clay-400 transition-colors flex flex-col items-center justify-center gap-2 text-stone-400 hover:text-clay-500">
            <Upload size={24} />
            <span className="text-sm">Upload a photo</span>
          </div>
        )}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={handleFile}
        />
      </label>
    </div>
  );
}

// ── Avatar ────────────────────────────────────────────────────
export function Avatar({ src, name, size = 'md' }) {
  const sizes = { sm: 'w-8 h-8 text-xs', md: 'w-10 h-10 text-sm', lg: 'w-14 h-14 text-base', xl: 'w-20 h-20 text-xl' };
  const initials = name
    ? name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : '?';

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizes[size]} rounded-full object-cover flex-shrink-0`}
      />
    );
  }
  return (
    <div
      className={`${sizes[size]} rounded-full bg-clay-100 text-clay-700 font-semibold flex items-center justify-center flex-shrink-0`}
    >
      {initials}
    </div>
  );
}

// ── StoryCard ─────────────────────────────────────────────────
export function StoryCard({ story, onClick, showAuthor = false }) {
  const { countryFlag } = require('../lib/countries');
  return (
    <div
      onClick={onClick}
      className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer border border-stone-100"
    >
      <div className="relative h-52 overflow-hidden bg-sand-100">
        {story.photo_url ? (
          <img
            src={story.photo_url}
            alt={story.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl opacity-50">
            {countryFlag(story.country_code)}
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1.5 bg-white/90 backdrop-blur-sm text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full">
            <span>{countryFlag(story.country_code)}</span>
            {story.city}, {story.country}
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-stone-900 group-hover:text-clay-600 transition-colors line-clamp-2 mb-1">
          {story.title}
        </h3>
        <p className="text-stone-500 text-sm line-clamp-2 leading-relaxed">
          {story.description}
        </p>
        {showAuthor && (story.display_name || story.username) && (
          <div className="flex items-center gap-2 mt-3 pt-3 border-t border-stone-100">
            <Avatar src={story.avatar_url} name={story.display_name || story.username} size="sm" />
            <span className="text-xs text-stone-500">
              {story.display_name || story.username}
            </span>
          </div>
        )}
        <p className="text-xs text-stone-400 mt-2">
          {new Date(story.visited_date).toLocaleDateString('en-US', { year: 'numeric', month: 'long' })}
        </p>
      </div>
    </div>
  );
}

// ── EmptyState ────────────────────────────────────────────────
export function EmptyState({ icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-stone-700 mb-2">{title}</h3>
      <p className="text-stone-500 text-sm max-w-xs">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ── LoadingSpinner ────────────────────────────────────────────
export function LoadingSpinner({ className = '' }) {
  return (
    <div className={`flex justify-center items-center py-12 ${className}`}>
      <Loader2 size={28} className="animate-spin text-clay-500" />
    </div>
  );
}

// ── Toast ─────────────────────────────────────────────────────
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const show = (message, type = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3500);
  };

  const ToastContainer = () => (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`px-4 py-3 rounded-xl shadow-lg text-sm font-medium text-white animate-in slide-in-from-bottom-2
            ${t.type === 'error' ? 'bg-red-500' : 'bg-stone-800'}`}
        >
          {t.message}
        </div>
      ))}
    </div>
  );

  return { show, ToastContainer };
}
