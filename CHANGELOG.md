# Changelog

## [Current Development]

### Recent Updates
- Fixed predictions display issue in user round predictions
- Improved query structure for fetching predictions with proper ordering
- Enhanced data transformation for game results
- Added better error handling for predictions fetching

### Core Features
- Complete predictions system with points calculation
- Admin dashboard for game management
- User profiles with avatar support
- Following system for users
- Comprehensive statistics tracking

### Database Structure
- Teams table with Euroleague teams and logos
- Rounds table for competition rounds
- Games table for matches
- Profiles table for user information
- Predictions table for user predictions
- Game results table for final scores
- User follows table for following system
- User permissions table for special access

### Authentication & Authorization
- Admin access restricted to likasvy@gmail.com
- Row Level Security (RLS) policies
- Protected routes for admin functionality
- Secure file storage for avatars

### Technical Stack
- Frontend: React + TypeScript
- Styling: Tailwind CSS + shadcn/ui
- Backend: Supabase
- Authentication: Supabase Auth
- Database: PostgreSQL
- File Storage: Supabase Storage

### Security
- RLS policies for all tables
- Admin-only access for data modification
- Public read access for necessary data
- Protected routes with role-based access
- Secure file storage access control

### Development Guidelines
1. Document database changes
2. Add new features to changelog
3. Maintain admin restrictions
4. Follow RLS policies
5. Keep components focused
6. Ensure responsive design