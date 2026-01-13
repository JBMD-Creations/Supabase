# Claude Context - Read Before Each Response

## User Environment

- **Supabase**: Hosted on **xCloud.host** as a web app (NOT self-hosted CLI)
- **Development**: Uses xCloud.host web interface, NOT local terminal/CLI/Bash
- **Database Management**: Done through Supabase web dashboard SQL Editor
- **Deployment**: Via Vercel or similar web-based deployment

## Important Notes

1. **No CLI/Terminal Access**: User does not use Supabase CLI, psql, or terminal commands for database operations
2. **All Supabase setup was done by Claude** through the xCloud.host web interface
3. **SQL execution**: Copy SQL from `supabase_schema.sql` and paste into Supabase Dashboard > SQL Editor > New Query > Run

## How to Run Database Schema

1. Open your Supabase project dashboard (web browser)
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Open `supabase_schema.sql` file from this project
5. Copy the entire contents
6. Paste into the SQL Editor
7. Click **Run** button

## Project Files Reference

- `supabase_schema.sql` - Database schema (12 tables, RLS policies, indexes, triggers)
- `.env.example` - Environment variable template
- `.env` - Local environment variables (gitignored)
- `src/lib/supabase.js` - Supabase client initialization

## Supabase Dashboard URL

Your Supabase project is at: `https://jbcloud.app` (or access via xCloud.host dashboard)
