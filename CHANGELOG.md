# Changelog

All notable changes to the euroleague.bet project will be documented in this file.

## [Current Development]

### Database Structure
- Teams table with 18 Euroleague teams and their logos
- Rounds table for managing competition rounds
- Games table for managing matches within rounds
- Profiles table for user information

### Authentication & Authorization
- Admin access restricted to likasvy@gmail.com
- Row Level Security (RLS) policies implemented for all tables
- Public access for viewing teams, rounds, and games
- Protected routes for admin functionality

### Admin Features
- Admin dashboard at /admin route
- Teams management with logo display
- Rounds creation and management
- Games scheduling within rounds

### User Interface
- Responsive navigation with mobile and desktop views
- Dynamic navigation items based on user role
- Protected admin routes
- Consistent branding and typography

## [Planned Features]
- User predictions for games
- Leaderboard system
- User profiles
- Statistics dashboard
- Following other users
- Points calculation system

## [Technical Details]

### Tech Stack
- Frontend: React + TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Backend: Supabase
- Authentication: Supabase Auth
- Database: PostgreSQL (via Supabase)

### Database Tables

#### Teams
- id (UUID)
- name (TEXT)
- logo_url (TEXT)
- timestamps (created_at, updated_at)

#### Rounds
- id (UUID)
- name (TEXT)
- start_date (TIMESTAMP)
- end_date (TIMESTAMP)
- timestamps (created_at, updated_at)

#### Games
- id (UUID)
- round_id (UUID, FK to rounds)
- home_team_id (UUID, FK to teams)
- away_team_id (UUID, FK to teams)
- game_date (TIMESTAMP)
- timestamps (created_at, updated_at)

#### Profiles
- id (UUID, FK to auth.users)
- email (TEXT)
- display_name (TEXT)
- total_points (INTEGER)
- timestamps (created_at, updated_at)

### Security
- RLS policies implemented for all tables
- Admin-only access for data modification
- Public read access for necessary data
- Protected routes with role-based access

## [Development Guidelines]
1. All database changes must be documented with SQL migrations
2. New features should be added to this changelog
3. Admin functionality is restricted to likasvy@gmail.com
4. All data modifications should go through RLS policies
5. User data should be properly isolated
6. Keep UI components small and focused
7. Maintain responsive design across all features