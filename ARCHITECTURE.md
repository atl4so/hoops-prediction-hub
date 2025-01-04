# euroleague.bet Architecture

## Overview
euroleague.bet is a web application for managing and predicting Euroleague basketball games. This document outlines the key architectural decisions and component relationships.

## Core Features & Rules

### 1. Predictions System (IMMUTABLE RULES)
- Users can make ONE prediction per game
- Predictions are locked 1 hour before game start
- No editing or deleting predictions once submitted
- Points are calculated automatically when admin sets final result
- Predictions cannot be made after a game result is posted

### 2. Points Calculation (IMMUTABLE RULES)
- Winner prediction: 5 points
- Point difference accuracy:
  - Exact: 25 points
  - Within 1: 18 points
  - Within 2: 15 points
  - Within 3: 12 points
  - Within 4: 10 points
  - Within 5: 8 points
  - Within 6: 6 points
  - Within 7: 4 points
  - Within 8: 2 points
  - Within 9: 1 point
- Score accuracy (per team):
  - Exact: 10 points
  - Within 1: 9 points
  - Within 2: 8 points
  - Within 3: 7 points
  - Within 4: 6 points
  - Within 5: 5 points
  - Within 6: 4 points
  - Within 7: 3 points
  - Within 8: 2 points
  - Within 9: 1 point
- Maximum possible points per game: 50

### 3. Admin Controls (IMMUTABLE RULES)
- Access restricted to likasvy@gmail.com
- Can manage teams, rounds, and games
- Can set and update game results
- Results trigger automatic point calculations
- Can manage user permissions

### 4. User Features
- Profile management with avatar support
- Following other users
- Viewing predictions and statistics
- Accessing leaderboards

### 5. User Statistics (IMMUTABLE RULES)
Automatically tracked metrics:
- Total points
- Points per game (PPG)
- Highest/lowest points per round
- Highest/lowest points per game
- Total predictions made
- All-time rank
- Current round rank

## Component Structure

### Pages
- `/` - Home page with upcoming games
- `/admin` - Admin dashboard (restricted)
- `/dashboard` - User dashboard with statistics
- `/login` - Authentication
- `/register` - User registration
- `/leaderboard` - Rankings
- `/profile` - User profile management
- `/following` - Following management

### Core Components
```
src/
├── components/
│   ├── admin/
│   │   └── ... (admin components)
│   ├── profile/
│   │   ├── ProfileMenu.tsx
│   │   ├── AvatarUpload.tsx
│   │   └── ProfileSettings.tsx
│   ├── dashboard/
│   │   └── ... (dashboard components)
│   ├── games/
│   │   └── ... (game components)
│   └── layout/
│       └── ... (layout components)
```

## Data Flow
1. Authentication
   - Supabase handles user authentication
   - Admin access by email
   - RLS policies control data access

2. Profile Management
   - Avatar storage in Supabase Storage
   - Profile data in profiles table
   - Real-time avatar updates

3. Game Operations
   - Teams Management
   - Rounds Management
   - Games Management
   - Results Management
   - Points Calculation

4. User Operations
   - View games and rounds
   - Make predictions (with time restrictions)
   - Track points and rankings
   - Follow other users
   - View followed users' predictions

## Security Model
1. Authentication
   - Supabase Auth for user management
   - Protected routes using React Router
   - Session management with Supabase client

2. Authorization
   - Row Level Security (RLS) policies
   - Admin-only operations
   - Public read access where appropriate

3. File Storage
   - Avatars stored in Supabase Storage
   - Public read access for avatars
   - User-specific write access

## Development Guidelines
1. Document changes in CHANGELOG.md
2. Follow component-based architecture
3. Implement features incrementally
4. Maintain type safety with TypeScript
5. Use Tailwind CSS for styling
6. Leverage shadcn/ui components
7. Keep components small and focused
8. Use custom hooks for data fetching
9. Implement proper error handling

## Testing Strategy
1. Component testing
2. Integration testing
3. End-to-end testing

## Deployment
- Frontend: Vite build process
- Backend: Supabase managed services
- Database: PostgreSQL on Supabase