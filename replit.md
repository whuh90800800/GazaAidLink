# Gaza Relief Directory

## Overview

This is a full-stack web application built as a charity directory focused on Gaza relief organizations. The application provides a searchable, categorized listing of charitable organizations with detailed information about their focus areas and missions.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **Build Tool**: Vite for development and bundling

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API**: RESTful API with JSON responses
- **Middleware**: Custom logging middleware for API requests
- **Error Handling**: Centralized error handling middleware

### Data Storage
- **Database**: PostgreSQL (configured via Drizzle)
- **ORM**: Drizzle ORM for type-safe database operations
- **Connection**: Neon Database serverless PostgreSQL
- **Schema**: Single `charities` table with UUID primary keys
- **Development Storage**: In-memory storage implementation for development

## Key Components

### Database Schema
```typescript
charities table:
- id: UUID (primary key, auto-generated)
- name: text (charity name)
- description: text (detailed description)
- website: text (organization website)
- category: text (muslim, featured, gaza, medical, education)
- focusArea: text (specific focus area)
- featured: text ("true"/"false" flag for highlighting)
```

### API Endpoints
- `GET /api/charities` - Retrieve all charities
- `GET /api/charities/category/:category` - Filter by category
- `GET /api/charities/search?q={query}` - Search charities
- `POST /api/charities` - Create new charity (admin functionality)

### Frontend Components
- **Navbar**: Sticky navigation with smooth scrolling to sections (updated for new categories)
- **SearchFilter**: Real-time search and category filtering (supports muslim, featured, gaza, medical, education)
- **CharityCard**: Individual charity display with external links (no images, clean card design)
- **CharitySection**: Categorized groupings of charities (removed international section)
- **Footer**: Legal information and resources with Islamic reminder

### UI/UX Features
- Dark theme by default
- Responsive design for mobile and desktop
- Search functionality with real-time filtering
- Category-based organization
- Featured charity highlighting
- Smooth scrolling navigation
- Loading states and error handling

## Data Flow

1. **Initial Load**: Home page fetches all charities via React Query
2. **Search/Filter**: Client-side filtering of fetched data based on search terms and categories
3. **Navigation**: Smooth scrolling to different charity sections
4. **External Links**: Direct navigation to charity websites in new tabs

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL hosting
- **Connection**: Via `@neondatabase/serverless` driver

### UI/Styling
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **class-variance-authority**: Component variant management

### Development Tools
- **Vite**: Build tool with HMR and development server
- **ESBuild**: Production bundling for server code
- **TypeScript**: Type safety across the stack
- **Drizzle Kit**: Database migration and schema management

## Deployment Strategy

### Build Process
1. **Client Build**: Vite builds React app to `dist/public`
2. **Server Build**: ESBuild bundles server code to `dist/index.js`
3. **Database**: Drizzle migrations applied via `db:push` command

### Environment Configuration
- **Development**: Uses Vite dev server with proxy to Express API
- **Production**: Express serves static files and API from single process
- **Database**: Requires `DATABASE_URL` environment variable

### Scripts
- `dev`: Development server with hot reloading
- `build`: Production build for both client and server
- `start`: Production server startup
- `db:push`: Apply database schema changes

### Hosting Requirements
- Node.js runtime environment
- PostgreSQL database (configured for Neon Database)
- Environment variable support for database connection
- Static file serving capability

### Vercel Deployment
- **vercel.json**: Configured for Vercel deployment with proper routing
- **api/index.js**: Serverless API handler for Vercel functions
- **Build Process**: Uses npm run build to create production assets
- **Routes**: API requests routed to /api/index.js, static files served from dist/public

The application is designed for easy deployment on platforms like Replit, Vercel, or similar Node.js hosting providers with minimal configuration required beyond the database connection string.

## Recent Changes (Latest)
- ✓ Removed international relief organizations section as requested
- ✓ Added Save the Children as featured organization in separate "featured" category
- ✓ Updated navigation and search filters to reflect new category structure
- ✓ Added Vercel deployment configuration (vercel.json and api/index.js)
- ✓ Maintained Islamic reminder "Allah S.W.T Knows Best and we can only guess" throughout the application
- ✓ Ensured no images are displayed, keeping clean text-based charity cards