# WanderStory

> Share how people *really* live around the world — not the tourist brochure version.

A full-stack web app built with React, Tailwind CSS, and Supabase that lets travelers share authentic stories from the places they visit.

---

## Features

- **Add stories** — photo, country, city, date, title, and description
- **One favorite per country** — only your best story per country goes public
- **Explore by continent/country** — browse authentic stories from anywhere on Earth
- **Public profiles** — share `/username` links without requiring sign-up
- **Search travelers** — find users by username
- **Privacy controls** — go private at any time

---

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, React Router v6 |
| Styling | Tailwind CSS, Playfair Display + Lora fonts |
| Backend | Supabase (Postgres + Auth + Storage) |
| Auth | Supabase email/password |
| Storage | Supabase Storage (story photos + avatars) |

---

## Setup

### 1. Create a Supabase project

Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Run the schema

In your Supabase dashboard → **SQL Editor**, paste and run the entire contents of `supabase_schema.sql`.

This creates:
- `profiles` table (auto-created on user signup)
- `stories` table with a unique-favorite-per-country constraint
- `public_favorites` view for the explore page
- Row Level Security policies
- Storage buckets (`story-photos` and `avatars`)

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Fill in your values from Supabase → Settings → API:

```
REACT_APP_SUPABASE_URL=https://your-project-id.supabase.co
REACT_APP_SUPABASE_ANON_KEY=your-anon-key-here
```

### 4. Install and run

```bash
npm install
npm start
```

---

## Project Structure

```
src/
├── components/
│   ├── Navbar.jsx          # Top nav + mobile bottom nav
│   ├── StoryModal.jsx      # Add/edit story form
│   ├── StoryDetailModal.jsx # Full story view
│   └── UI.jsx              # Button, Input, Modal, StoryCard, Avatar, etc.
├── contexts/
│   └── AuthContext.jsx     # Auth state + profile
├── lib/
│   ├── supabase.js         # Supabase client + all data helpers
│   └── countries.js        # Country list with continent grouping + flag emojis
├── pages/
│   ├── HomePage.jsx        # Landing page
│   ├── AuthPages.jsx       # Sign in + Sign up
│   ├── ExplorePage.jsx     # Browse stories by continent/country
│   ├── SearchPage.jsx      # Search travelers by username
│   ├── MyStoriesPage.jsx   # Personal story management
│   ├── ProfilePage.jsx     # Profile settings
│   └── PublicProfilePage.jsx # Public /username page
└── App.jsx                 # Router + layout
```

---

## Key Design Decisions

### One favorite per country
The database enforces this with a partial unique index:
```sql
create unique index one_favorite_per_country
  on public.stories (user_id, country_code)
  where is_favorite = true;
```
When you set a new favorite, the app first unsets the old one, then sets the new one.

### Public profiles without sign-up
The route `/:username` renders `PublicProfilePage`, which only queries the `public_favorites` view (RLS ensures only public profiles with public stories appear). No auth required.

### Row Level Security
All tables use RLS. The `public_favorites` view joins `stories` and `profiles` and only returns rows where both `is_favorite = true` and `is_public = true`.

---

## Deployment

This is a standard Create React App project. Deploy to:
- **Vercel**: `vercel --prod`
- **Netlify**: drag the `build/` folder or connect your repo
- **Any static host**: run `npm run build` first

For the `/:username` route to work on Netlify/Vercel, configure rewrites:

**Netlify** (`public/_redirects`):
```
/* /index.html 200
```

**Vercel** (`vercel.json`):
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/" }]
}
```
