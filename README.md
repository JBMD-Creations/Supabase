# Supabase Todos App

A simple React todo application using Supabase as the backend.

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

3. Add your Supabase credentials to `.env`:
   ```
   VITE_SUPABASE_URL=your-supabase-url
   VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Make sure your Supabase database has a `todos` table with the following schema:
   - `id` (bigint, primary key)
   - `user_id` (uuid, references auth.users)
   - `task` (text)
   - `is_complete` (boolean, default false)
   - `inserted_at` (timestamp)

## Development

Run the development server:
```bash
npm run dev
```

## Features

- View all todos from your Supabase database
- Add new todos
- Toggle todo completion status
- Real-time error handling
