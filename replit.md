# Pricing Simulator with Tax Substitution (ST) - MG Branch

## Overview

This is a full-stack pricing simulator application specifically designed for wholesale operations in Minas Gerais, Brazil. The application helps calculate optimal pricing with tax substitution (ST) considerations. It features both direct pricing calculations (from cost to price) and reverse calculations (from target price to required cost).

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript as the main frontend framework
- **Vite** for fast development and optimized builds
- **Tailwind CSS** with shadcn/ui components for styling
- **Wouter** for client-side routing
- **React Query** for state management and API calls
- **React Hook Form** with Zod validation for form handling

### Backend Architecture
- **Express.js** server with TypeScript
- **ESM modules** for modern JavaScript support
- RESTful API design with JSON responses
- Middleware for request logging and error handling
- File export services for PDF and Excel generation

### Database Design
- **Drizzle ORM** configured for PostgreSQL
- **Neon Database** as the serverless PostgreSQL provider
- Simple user schema with authentication capabilities
- Session management using PostgreSQL store

## Key Components

### Pricing Calculator Engine
- **Direct Calculation**: Computes final pricing from purchase costs
- **Reverse Calculation**: Determines required costs from target prices
- **Tax Calculations**: Handles IPI, ICMS, PIS/COFINS, and ST calculations
- **Margin Analysis**: Calculates markup and profit margins

### Export System
- **PDF Export**: Generates detailed pricing reports using jsPDF
- **Excel Export**: Creates comprehensive spreadsheets using ExcelJS
- **Data Formatting**: Includes all calculation steps and intermediate results

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Interactive Forms**: Real-time calculations as users input data
- **Tab Navigation**: Separate interfaces for direct and reverse calculations
- **Export Modal**: Streamlined export options with format selection

## Data Flow

1. **User Input**: Purchase data (costs, taxes, freight) and sales parameters (margins, MVA, payment conditions)
2. **Real-time Calculation**: Automatic computation of intermediate values and final pricing
3. **Result Display**: Formatted presentation of pricing results and calculations
4. **Export Generation**: Server-side document creation with complete calculation details

## External Dependencies

### Frontend Libraries
- **@radix-ui components**: Accessible UI primitives
- **@tanstack/react-query**: Server state management
- **class-variance-authority**: Utility for component variants
- **date-fns**: Date manipulation utilities
- **lucide-react**: Icon library

### Backend Libraries
- **drizzle-orm**: Type-safe database ORM
- **@neondatabase/serverless**: PostgreSQL serverless driver
- **jspdf**: PDF generation library
- **exceljs**: Excel file creation
- **connect-pg-simple**: PostgreSQL session store

## Deployment Strategy

### Development Environment
- **Replit**: Integrated development environment
- **Hot Module Replacement**: Vite HMR for rapid development
- **PostgreSQL 16**: Database provisioning through Replit
- **Environment Variables**: DATABASE_URL for database connection

### Production Build
- **Vite Build**: Optimized frontend bundle
- **ESBuild**: Backend compilation with external packages
- **Static Serving**: Express serves built frontend files
- **Autoscale Deployment**: Replit's autoscale deployment target

### Configuration
- **TypeScript**: Strict mode with path mapping
- **ESM**: Modern module system throughout
- **Tailwind**: Utility-first CSS with custom design tokens
- **Drizzle Kit**: Database schema management and migrations

## Recent Changes
- June 19, 2025: Completely redesigned PDF export with professional table layouts, fixed character encoding issues, and modern typography
- June 19, 2025: Added structured table format with proper borders, alternating row colors, and clear section headers for all PDF content
- June 19, 2025: Enhanced PDF visual hierarchy with highlighted key results (CMV Final, Preço com ST, Preço Alvo) in colored boxes
- June 19, 2025: Fixed character encoding problems removing symbols like Ø=ÜË� and ensuring proper Portuguese text display
- June 19, 2025: Added simulation naming feature with prominent display in header and export documents
- June 19, 2025: Enhanced Excel export with professional styling including colored headers, borders, and cell formatting
- June 19, 2025: Updated export file naming to include simulation name when provided
- June 19, 2025: Fixed "Custo de Compra Ideal" calculation to work backwards from target price, finding the exact purchase cost needed to achieve the target final price
- June 19, 2025: Enhanced PDF export with professional visual design including colored sections, better typography, and structured layout
- June 19, 2025: Fixed Excel export ExcelJS import issue and increased body parser limits
- June 19, 2025: Updated PIS/COFINS calculation formula to use base calculation (Custo + IPI - ICMS Compra) × % instead of simple Custo × %
- June 19, 2025: Fixed duplicate payment condition values that were causing React key warnings
- June 19, 2025: Added formula clarification in CMV calculation card

## Changelog
- June 19, 2025. Initial setup with complete tax substitution simulator

## User Preferences

Preferred communication style: Simple, everyday language.