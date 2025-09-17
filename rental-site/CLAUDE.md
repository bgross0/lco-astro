# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
LCO Equipment Rental Site - A Next.js 15 application for Lake County Outdoors' equipment rental business, designed to integrate with Odoo 18 backend.

## Tech Stack
- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 with custom LCO design system
- **Backend**: Odoo 18 integration via API proxy
- **Deployment**: Vercel/Cloudflare compatible

## Development Commands
```bash
npm run dev          # Start development server on http://localhost:3000
npm run build        # Create production build
npm run start        # Run production server
npm run lint         # Run ESLint
```

## Architecture

### Directory Structure
- `app/` - Next.js 15 app router pages and layouts
- `components/` - Reusable React components
- `lib/api/` - Structured API client modules for Odoo integration
- `lib/types/` - TypeScript type definitions
- `public/` - Static assets and images

### API Integration Pattern
The application uses a structured API client pattern in `lib/api/`:
- Each resource (equipment, bookings, customers) has its own module
- API calls proxy through `/api/odoo/*` to the Odoo backend
- Currently uses mock data from `lib/mockData.ts` until Odoo integration is complete

### Key Design System Values
- **Primary Blue**: `#4A90E2` (Trust Blue)
- **Primary Green**: `#2d5016` (Forest Green)
- **Font**: Inter
- **Component Classes**: `.btn`, `.card`, `.gradient-bg`

## Important Patterns

### TypeScript Requirements
- NEVER use `as any` type assertions
- All components must have proper TypeScript interfaces
- Use type imports: `import type { ... }`

### API Client Usage
```typescript
// Use the structured API client
import { equipmentApi } from '@/lib/api/equipment'
const equipment = await equipmentApi.getAll()
```

### Component Structure
- All components use TypeScript with proper prop interfaces
- Follow existing patterns in `components/` directory
- Use Tailwind CSS classes, avoid inline styles

## Environment Variables
- `NEXT_PUBLIC_ODOO_API_URL` - Odoo API endpoint
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe public key
- `NEXT_PUBLIC_SITE_URL` - Production site URL

## Current Development State
- Frontend is complete with mock data
- API client structure is ready for Odoo integration
- Awaiting completion of Odoo `atlas_equipment_rental` module for backend integration