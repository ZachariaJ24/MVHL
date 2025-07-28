# MVHL Hub - Comprehensive Hockey League Management Platform

## Overview

This is a full-stack web application that serves as the comprehensive digital hub for the MVHL (Major Virtual Hockey League). The platform provides complete league management functionality including team rosters, player statistics, live draft simulation, trade management, and AI-powered analytics. It features role-based access control for players, management, and administrators, with real-time updates and interactive features throughout.

## User Preferences

Preferred communication style: Simple, everyday language.
Authentication: User initially requested removal but then requested restoration for proper panel testing functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript for type safety
- **UI Components**: ShadCN UI component library built on Radix UI primitives
- **Styling**: Tailwind CSS for utility-first styling with custom design tokens
- **State Management**: React Query (TanStack Query) for server state and React hooks for local state
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript for both frontend and backend consistency
- **API Pattern**: RESTful API design with Express route handlers
- **Data Storage**: PostgreSQL database with Drizzle ORM
- **AI Integration**: Google Gemini AI via @google/genai for content generation
- **Database Connection**: Neon serverless PostgreSQL with connection pooling

### Database Design
- **Current**: PostgreSQL database with full MVHL schema
- **ORM**: Drizzle ORM with full type safety and migrations
- **Tables**: Users, teams, players, games, draft picks, trades, generated content, and activity logs
- **Seeding**: Complete 32-team MVHL league structure with sample players
- **Relations**: Fully modeled relationships between all entities

## Key Components

### Core Platform Features
The application provides comprehensive league management functionality:
1. **Team Management** - 32-team league with complete rosters and management
2. **Live Draft Center** - Interactive draft simulation with AI commentary
3. **Player Statistics** - Comprehensive offensive, defensive, and goalie stats
4. **Trade System** - Full trading block with offers and negotiations
5. **Schedule & Standings** - Complete season scheduling and real-time standings
6. **Role-Based Dashboards** - Specialized interfaces for players, management, and admins
7. **AI Integration** - Scouting reports, news generation, and draft analysis

### Frontend Components
- **Dashboard**: Main interface with tool selection grid
- **AI Tools Panel**: Interactive forms for each AI tool
- **Sidebar**: Statistics, recent activity, FAQ search, and player spotlight
- **Header/Footer**: Navigation and branding elements

### Backend Services
- **Storage Interface**: Abstracted data layer supporting multiple backends
- **AI Flows**: Specialized functions for each AI tool type
- **Route Handlers**: API endpoints for tool execution and data retrieval

## Data Flow

1. **User Input**: User selects AI tool and provides input parameters
2. **Validation**: Frontend validates input using Zod schemas
3. **API Request**: React Query sends request to Express backend
4. **AI Processing**: Backend calls Google Gemini AI with formatted prompts
5. **Storage**: Generated content saved to storage with metadata
6. **Response**: AI-generated content returned to frontend
7. **Display**: Content rendered with copy/download functionality
8. **Activity Tracking**: Tool usage logged for analytics

## External Dependencies

### AI Services
- **OpenAI**: Primary AI provider for text and image generation (migrated from Google Gemini)
- **Models Used**: 
  - `gpt-4o` for text generation and analysis (newest OpenAI model released May 13, 2024)
  - `dall-e-3` for player headshot generation

### UI Libraries
- **Radix UI**: Accessible component primitives
- **Lucide React**: Icon library
- **React Hook Form**: Form state management
- **Date-fns**: Date formatting utilities

### Development Tools
- **Drizzle Kit**: Database schema management
- **ESBuild**: Production bundling
- **TSX**: TypeScript execution for development

## Deployment Strategy

### Development
- **Frontend**: Vite dev server with HMR
- **Backend**: TSX for TypeScript execution
- **Database**: In-memory storage for rapid development

### Production Build
- **Frontend**: Vite builds static assets to `dist/public`
- **Backend**: ESBuild bundles server code to `dist/index.js`
- **Deployment**: Single production server serves both static files and API

### Database Migration
- **Current**: PostgreSQL database fully deployed and operational
- **Migration**: Completed via `drizzle-kit push` command
- **Connection**: Active PostgreSQL connection via `DATABASE_URL` environment variable
- **Seeding**: Complete MVHL league data with 32 teams and 640 players (20 per team with realistic hockey positions)
- **Player Distribution**: Each team has 4C, 4LW, 4RW, 3LD, 3RD, 2G players for realistic lineup management

### Environment Configuration
- **Required**: `OPENAI_API_KEY` for AI features (migrated from Google Gemini)
- **Required**: `DATABASE_URL` for PostgreSQL connection (automatically configured)
- **Development**: Automatic Replit integration support

## Recent Changes  
- **July 28, 2025**: Successfully migrated from Replit Agent to standard Replit environment
- **AI Migration**: Converted all AI flows from Google Gemini to OpenAI for improved reliability
- **Database Setup**: PostgreSQL database created and seeded with complete MVHL league data
- **Schema Updates**: Added HallOfFameInput type and updated all AI flow functions
- **Critical Fix**: Resolved mockRoster reference error causing frontend crashes
- **OpenAI Integration**: Full migration to OpenAI GPT-4o for text generation and DALL-E 3 for image generation
- **Authentication Removal**: Removed all sign-in/sign-up functionality from header per user request
- **Player Availability**: Fixed status update functionality with working dialog interface
- **Header Cleanup**: Streamlined header to show only navigation and dashboard panels
- **Authentication Restoration**: Restored Sign In/Sign Up buttons in header for proper panel testing
- **Database Complete**: Seeded PostgreSQL with exactly 32 teams (8 per division), 480 players (15 per team), and 10+ mock games (2 completed)
- **Data Structure**: Perfect MVHL league structure with 4 divisions (Atlantic, Metropolitan, Central, Pacific) across Eastern/Western conferences

### Professional Theming
- **Design**: Professional dark theme with modern aesthetics
- **Colors**: Dark background with light blue accent highlights
- **Typography**: Optimized for readability on dark backgrounds
- **User Experience**: Single, consistent dark theme for streamlined interface