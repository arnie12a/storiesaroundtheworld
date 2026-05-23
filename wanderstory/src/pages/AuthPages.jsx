import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Globe } from 'lucide-react';
import { signIn, signUp } from '../lib/supabase';
import { Input, Button } from '../components/UI';

// ── Sign In ───────────────────────────────────────────────────
export function SignInPage() {
  const navigate = useNavigate();
  const [form, setForm]     = useState({ email: '', password: '' });
  const [error, setError]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await signIn(form);
    if (error) { setError(error.message); setLoading(false); return; }
    navigate('/my-stories');
  };

  return <AuthLayout title="Welcome back" subtitle="Sign in to your WanderStory account">
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        required
      />
      {error && <p className="text-sm text-red-500">{error}</p>}
      <Button type="submit" loading={loading} className="w-full" size="lg">
        Sign In
      </Button>
    </form>
    <p className="mt-6 text-center text-sm text-stone-500">
      No account?{' '}
      <Link to="/signup" className="text-clay-600 font-medium hover:underline">
        Create one free
      </Link>
    </p>
  </AuthLayout>;
}

// ── Sign Up ───────────────────────────────────────────────────
export function SignUpPage() {
  const navigate = useNavigate();
  const [form, setForm]       = useState({ email: '', password: '', username: '', displayName: '' });
  const [errors, setErrors]   = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username.match(/^[a-z0-9_]{3,20}$/))
      e.username = 'Username must be 3-20 chars, lowercase letters, numbers, underscores only';
    if (form.password.length < 8)
      e.password = 'Password must be at least 8 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    const { error } = await signUp(form);
    if (error) { setErrors({ submit: error.message }); setLoading(false); return; }
    navigate('/my-stories');
  };

  return <AuthLayout title="Start your story" subtitle="Share how people really live around the world">
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Username"
          placeholder="jane_travels"
          value={form.username}
          onChange={(e) => setForm((f) => ({ ...f, username: e.target.value.toLowerCase() }))}
          error={errors.username}
          required
        />
        <Input
          label="Display Name"
          placeholder="Jane"
          value={form.displayName}
          onChange={(e) => setForm((f) => ({ ...f, displayName: e.target.value }))}
        />
      </div>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        value={form.email}
        onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="At least 8 characters"
        value={form.password}
        onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
        error={errors.password}
        required
      />
      {errors.submit && <p className="text-sm text-red-500">{errors.submit}</p>}
      <Button type="submit" loading={loading} className="w-full" size="lg">
        Create Account
      </Button>
    </form>
    <p className="mt-6 text-center text-sm text-stone-500">
      Already have an account?{' '}
      <Link to="/signin" className="text-clay-600 font-medium hover:underline">
        Sign in
      </Link>
    </p>
  </AuthLayout>;
}

// ── Shared layout ─────────────────────────────────────────────
function AuthLayout({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-sand-50 flex flex-col items-center justify-center px-4 py-12">
      <Link to="/" className="flex items-center gap-2 mb-8 group">
        <div className="w-10 h-10 bg-clay-600 rounded-xl flex items-center justify-center">
          <Globe size={20} className="text-white" />
        </div>
        <span className="font-bold text-xl text-stone-900 font-display">WanderStory</span>
      </Link>
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm border border-stone-100 p-8">
        <h1 className="text-2xl font-bold text-stone-900 mb-1 font-display">{title}</h1>
        <p className="text-stone-500 text-sm mb-6">{subtitle}</p>
        {children}
      </div>
    </div>
  );
}
