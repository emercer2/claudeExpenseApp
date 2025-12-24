# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Expense Tracker AI is a modern, full-featured expense tracking web application built with Next.js 14 (App Router), TypeScript, and Tailwind CSS. It helps users manage personal finances with features including expense tracking, filtering, analytics dashboards, and CSV export.

## Build & Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linting
npm run lint
```

The development server runs at `http://localhost:3000`.

## Architecture

### Tech Stack
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom color palette
- **Charts**: Recharts
- **Date Handling**: date-fns
- **State Management**: React Context (ExpenseContext)
- **Data Persistence**: localStorage

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx          # Root layout with providers
│   ├── page.tsx            # Dashboard page
│   ├── expenses/page.tsx   # Expense list page
│   └── add/page.tsx        # Add expense page
├── components/
│   ├── ui/                 # Reusable UI components (Button, Input, Card, Modal, etc.)
│   ├── expenses/           # Expense-specific components (Form, List, Filters, Item)
│   ├── dashboard/          # Dashboard components (SummaryCard, Charts)
│   └── layout/             # Layout components (Header)
├── context/
│   └── ExpenseContext.tsx  # Global expense state management
├── lib/
│   ├── storage.ts          # localStorage utilities
│   └── utils.ts            # Helper functions (formatting, calculations, CSV export)
└── types/
    └── expense.ts          # TypeScript interfaces and types
```

### Key Patterns

**State Management**: The `ExpenseContext` provides global state for expenses with actions for CRUD operations. It also handles filtering logic and calculates summaries.

**Data Flow**: Components use the `useExpenses()` hook to access expense data and actions. All data persists to localStorage automatically.

**Component Structure**: UI components are in `src/components/ui/` and are generic/reusable. Feature components are organized by domain (expenses, dashboard).

### Expense Categories
The app uses 6 predefined categories: Food, Transportation, Entertainment, Shopping, Bills, Other. Categories are defined in `src/types/expense.ts` with colors and icons.

### Form Validation
The ExpenseForm component validates:
- Amount: required, positive, max $1,000,000
- Description: required, max 200 characters
- Date: required, cannot be in the future
