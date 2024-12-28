# euroleague.bet Architecture

## Overview
euroleague.bet is a web application for managing and predicting Euroleague basketball games. This document outlines the key architectural decisions and component relationships.

## Component Structure

### Pages
- `/` - Home page
- `/admin` - Admin dashboard (restricted to likasvy@gmail.com)
- `/dashboard` - User dashboard
- `/login` - Authentication page
- `/register` - User registration

### Core Components
```
src/
├── components/
│   ├── admin/
│   │   ├── TeamsList.tsx - Displays and manages teams
│   │   ├── RoundManager.tsx - Creates and manages rounds
│   │   └── GameManager.tsx - Schedules and manages games
│   ├── auth/
│   │   └── RegisterForm.tsx - User registration form
│   └── layout/
│       ├── AppHeader.tsx - Main navigation header
│       ├── MainLayout.tsx - Page layout wrapper
│       ├── DesktopNav.tsx - Desktop navigation menu
│       └── MobileMenu.tsx - Mobile navigation menu
```

## Data Flow
1. Authentication
   - Supabase handles user authentication
   - Admin access is restricted by email (likasvy@gmail.com)
   - RLS policies control data access

2. Admin Operations
   - Teams Management: Create/Read teams
   - Rounds Management: Create/Read/Update rounds
   - Games Management: Create/Read/Update games within rounds

3. User Operations (Planned)
   - View games and rounds
   - Make predictions
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

## Development Workflow
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