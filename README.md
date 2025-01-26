# euroleague.bet 🏀

A full-stack web application for Euroleague basketball predictions, featuring real-time updates, comprehensive statistics tracking, and social interactions.

## Overview

euroleague.bet enables users to:
- Make predictions for Euroleague basketball games
- Track performance with detailed statistics
- Compete on leaderboards
- Follow other users and share predictions
- View comprehensive game analytics

## Tech Stack

### Frontend
- **React 18** with **TypeScript** for type-safe component development
- **Vite** for fast development and optimized builds
- **TanStack Query** for efficient server state management
- **Tailwind CSS** for responsive styling
- **shadcn/ui** for accessible UI components
- **React Router** for client-side routing
- **date-fns** for date manipulation
- **Lucide Icons** for consistent iconography
- **Zod** for runtime type validation

### Backend (Supabase)
- **PostgreSQL** database with Row Level Security
- **Supabase Auth** for authentication
- **Supabase Storage** for file management
- **Supabase Real-time** for live updates
- **Edge Functions** for serverless operations

## Features

### Prediction System
- Real-time game predictions
- Time-locked submissions (1 hour before game start)
- Complex points calculation:
  - Winner prediction (5 points)
  - Point difference accuracy (up to 25 points)
  - Score accuracy per team (up to 10 points each)
- Maximum 50 points possible per game

### Statistics & Analytics
- Total points and PPG (Points Per Game)
- Highest/lowest points per round
- All-time and current round rankings
- Winner prediction accuracy
- Home/Away prediction success rates
- Underdog prediction tracking

### Social Features
- User following system
- Prediction sharing
- Real-time leaderboards
- Detailed user profiles

### Admin Dashboard
- Team management with logo support
- Round creation and management
- Game scheduling and results
- Automated points calculation
- UI customization options

## Architecture

The application follows a modern, component-based architecture with:
- Type-safe data flow
- Optimized database queries
- Real-time updates
- Secure authentication
- Responsive design
- Accessibility considerations

## Security

- Row Level Security (RLS) policies
- Protected API endpoints
- Secure file uploads
- Type-safe database operations
- Role-based access control

## Performance

- Efficient data fetching with TanStack Query
- Optimistic updates
- Lazy loading
- Asset optimization
- Efficient state management

## Requirements

- Node.js 18+
- npm or yarn
- Modern web browser
- Supabase account for backend services

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Euroleague for inspiration
- shadcn for the UI component system
- Supabase for backend infrastructure