# Changelog

All notable changes to the euroleague.bet project will be documented in this file.

## [Current Development]

### Core Features
- Complete predictions system with points calculation
- Admin dashboard for game management
- User profiles with avatar support
- Following system for users
- Comprehensive statistics tracking

### Recent Changes
- Removed game results management system for rebuild
- Admin game results functionality temporarily disabled

### Database Structure
- Teams table with 18 Euroleague teams and their logos
- Rounds table for managing competition rounds
- Games table for managing matches within rounds
- Profiles table for user information and avatars
- Predictions table for user predictions
- Game results table for final scores
- User follows table for following system
- User permissions table for special access

### Authentication & Authorization
- Admin access restricted to likasvy@gmail.com
- Row Level Security (RLS) policies implemented
- Public access for viewing teams, rounds, and games
- Protected routes for admin functionality
- Secure file storage for avatars

### Admin Features
- Teams management with logo display
- Rounds creation and management
- Games scheduling within rounds
- Results management and points calculation

### User Interface
- Responsive navigation with mobile and desktop views
- Dynamic navigation items based on user role
- Protected admin routes
- Profile management with avatar support
- Consistent branding and typography

### Technical Details

#### Tech Stack
- Frontend: React + TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Backend: Supabase
- Authentication: Supabase Auth
- Database: PostgreSQL (via Supabase)
- File Storage: Supabase Storage

#### Database Tables

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
- Secure file storage access control

## [Development Guidelines]
1. All database changes must be documented
2. New features should be added to this changelog
3. Admin functionality is restricted
4. All data modifications through RLS policies
5. User data properly isolated
6. UI components small and focused
7. Responsive design maintained
