# euroleague.bet Architecture

## Overview
euroleague.bet is a web application for managing and predicting Euroleague basketball games. This document outlines the key architectural decisions and component relationships.

## Core Features & Rules

### 1. Predictions System
- Users can make ONE prediction per game
- Predictions are locked 1 hour before game start
- No editing or deleting predictions once submitted
- Points are calculated automatically when admin sets final result
- Predictions cannot be made after a game result is posted

### 2. Points Calculation
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

### 3. Admin Controls
- Access restricted to likasvy@gmail.com
- Can manage teams, rounds, and games
- Can set and update game results
- Results trigger automatic point calculations
- Can manage user permissions

### 4. User Statistics
Automatically tracked metrics:
- Total points
- Points per game (PPG)
- Highest/lowest points per round
- Highest/lowest points per game
- Total predictions made

## Component Structure

### Pages
- `/` - Home page with upcoming games
- `/admin` - Admin dashboard (restricted)
- `/dashboard` - User dashboard
- `/login` - Authentication
- `/register` - User registration

### Core Components
```
src/
├── components/
│   ├── admin/
│   │   ├── TeamsList.tsx - Teams management
│   │   ├── RoundManager.tsx - Rounds management
│   │   ├── GameManager.tsx - Games scheduling
│   │   ├── GameResults.tsx - Results management
│   │   └── GameResultsList.tsx - Results display
│   ├── games/
│   │   ├── GameCard.tsx - Game display
│   │   ├── PredictionButton.tsx - Prediction controls
│   │   └── GamesList.tsx - Games listing
│   └── layout/
│       ├── AppHeader.tsx - Navigation
│       └── MainLayout.tsx - Page structure
```

## Data Flow
1. Authentication
   - Supabase handles user authentication
   - Admin access by email
   - RLS policies control data access

2. Admin Operations
   - Teams Management: Create/Read teams
   - Rounds Management: Create/Read/Update rounds
   - Games Management: Create/Read/Update games
   - Results Management: Set/Update results

3. User Operations
   - View games and rounds
   - Make predictions (with time restrictions)
   - Track points and rankings
   - Follow other users

## Database Schema
See CHANGELOG.md for detailed table structures

## Security Model
1. Authentication
   - Supabase Auth for user management
   - Protected routes using React Router

2. Authorization
   - Row Level Security (RLS) policies
   - Admin-only operations
   - Public read access where appropriate

## Development Guidelines
1. Document changes in CHANGELOG.md
2. Follow component-based architecture
3. Implement features incrementally
4. Maintain type safety with TypeScript
5. Use Tailwind CSS for styling
6. Leverage shadcn/ui components

## Testing Strategy (Planned)
1. Component testing
2. Integration testing
3. End-to-end testing

## Deployment
- Frontend: Vite build process
- Backend: Supabase managed services
- Database: PostgreSQL on Supabase

## Future Considerations
1. Performance optimization
2. Caching strategy
3. Real-time updates
4. Mobile responsiveness
5. Accessibility compliance