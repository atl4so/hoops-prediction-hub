# euroleague.bet Architecture

## Overview
euroleague.bet is a web application for managing and predicting Euroleague basketball games.

## Core Features & Rules

### 1. Predictions System (IMMUTABLE RULES)
- Users can make ONE prediction per game
- Predictions are locked 1 hour before game start
- No editing or deleting predictions once submitted
- Points are calculated automatically when admin sets final result
- Predictions cannot be made after a game result is posted
- All user predictions are visible to other users
- Predictions are ordered by game date for consistency

### 2. Points Calculation (IMMUTABLE RULES)
- Winner prediction: 5 points
- Point difference accuracy:
  - Exact: 25 points
  - Within 1-9: Decreasing points (18 to 1)
- Score accuracy (per team):
  - Exact: 10 points
  - Within 1-9: Decreasing points (9 to 1)
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
│   ├── profile/
│   ├── dashboard/
│   ├── games/
│   └── layout/
```

## Data Flow
1. Authentication via Supabase
2. Profile Management with avatar storage
3. Game Operations (Teams, Rounds, Games, Results)
4. User Operations (Predictions, Points, Rankings)

## Security Model
1. Authentication with Supabase Auth
2. Authorization with Row Level Security
3. File Storage with public read access

## Development Guidelines
1. Document changes in CHANGELOG.md
2. Follow component-based architecture
3. Keep components small and focused
4. Use custom hooks for data fetching
5. Implement proper error handling