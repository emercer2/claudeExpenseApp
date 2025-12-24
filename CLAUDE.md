# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

**Expense Tracker AI** is a personal finance management web application that helps users track expenses, visualize spending patterns, and export financial data. Built with modern React patterns and a focus on simplicity and user experience.

### Core Features
- Add, edit, and delete expenses with category classification
- Filter and search expenses by date range, category, or description
- Dashboard with spending summaries and trend visualizations
- Monthly insights with budget streak tracking
- CSV export for filtered or all expenses
- Fully client-side with localStorage persistence (no backend required)

## Quick Reference

```bash
npm install      # Install dependencies
npm run dev      # Start dev server → http://localhost:3000
npm run build    # Production build (may fail due to known type issues)
npm run lint     # Run ESLint
npm start        # Start production server
```

## Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|------------|---------|
| Framework | Next.js 14 (App Router) | React framework with file-based routing |
| Language | TypeScript | Type safety and IDE support |
| Styling | Tailwind CSS | Utility-first CSS with custom theme |
| Charts | Recharts | Composable charting library |
| Dates | date-fns | Date manipulation and formatting |
| IDs | uuid | Unique identifier generation |
| State | React Context | Global state management |
| Storage | localStorage | Client-side data persistence |

### Project Structure

```
expense-tracker-ai/
├── .claude/
│   ├── commands/           # Slash commands for Claude
│   └── history/            # Claude-generated documentation
├── src/
│   ├── app/                # Next.js App Router
│   │   ├── layout.tsx      # Root layout with ExpenseProvider
│   │   ├── page.tsx        # Dashboard (/)
│   │   ├── add/            # Add expense (/add)
│   │   ├── expenses/       # Expense list (/expenses)
│   │   └── insights/       # Monthly insights (/insights)
│   ├── components/
│   │   ├── ui/             # Generic, reusable components
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   ├── Select.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── Badge.tsx
│   │   │   └── EmptyState.tsx
│   │   ├── expenses/       # Expense domain components
│   │   │   ├── ExpenseForm.tsx
│   │   │   ├── ExpenseList.tsx
│   │   │   ├── ExpenseItem.tsx
│   │   │   └── ExpenseFilters.tsx
│   │   ├── dashboard/      # Dashboard & analytics components
│   │   │   ├── SummaryCard.tsx
│   │   │   ├── CategoryChart.tsx
│   │   │   ├── MonthlyTrendChart.tsx
│   │   │   ├── RecentExpenses.tsx
│   │   │   └── MonthlyInsights.tsx
│   │   └── layout/
│   │       └── Header.tsx  # Navigation header
│   ├── context/
│   │   └── ExpenseContext.tsx  # Global state + CRUD operations
│   ├── lib/
│   │   ├── storage.ts      # localStorage read/write
│   │   └── utils.ts        # Formatting, calculations, CSV export
│   └── types/
│       └── expense.ts      # TypeScript types and constants
├── tailwind.config.ts      # Custom color palette
└── package.json
```

### Data Model

```typescript
// Core expense record
interface Expense {
  id: string;              // UUID
  amount: number;          // Positive number, max 1,000,000
  category: ExpenseCategory;
  description: string;     // Max 200 characters
  date: string;            // ISO date string (YYYY-MM-DD)
  createdAt: string;       // ISO timestamp
  updatedAt: string;       // ISO timestamp
}

// Available categories (defined in src/types/expense.ts)
type ExpenseCategory =
  | "food"           // 🍔 Red (#ef4444)
  | "transportation" // 🚗 Amber (#f59e0b)
  | "entertainment"  // 🎬 Purple (#8b5cf6)
  | "shopping"       // 🛍️ Pink (#ec4899)
  | "bills"          // 📄 Blue (#0ea5e9)
  | "other";         // 📦 Gray (#6b7280)
```

### State Management Pattern

```typescript
// Access expense state and actions via the useExpenses hook
const {
  expenses,           // All expenses
  filteredExpenses,   // Filtered based on current filters
  filters,            // Current filter state
  summary,            // Calculated totals and breakdowns
  isLoading,          // Initial load state
  addExpense,         // (data: ExpenseFormData) => void
  updateExpense,      // (id: string, data: ExpenseFormData) => void
  deleteExpense,      // (id: string) => void
  setFilters,         // (filters: Partial<ExpenseFilters>) => void
  resetFilters,       // () => void
} = useExpenses();
```

## Available Slash Commands

| Command | Description | When to Use |
|---------|-------------|-------------|
| `/create-pr` | Create a GitHub pull request | When ready to merge a feature branch |
| `/code-review` | Comprehensive code review | After implementing features |
| `/ux-audit` | UX audit with recommendations | To discover UX improvements |
| `/feature-ideas` | Generate new feature suggestions | Brainstorming or roadmap planning |
| `/update-claude-md` | Update CLAUDE.md documentation | After adding features, pages, or commands |
| `/api-test` | Test API endpoints | When adding/modifying API routes |
| `/generate-docs` | Generate documentation | After major changes |
| `/parallel-work` | Parallel feature development | Multiple features at once |
| `/parallel-agents` | Spawn subagents in worktrees | Large parallel tasks |
| `/integrate-parallel-work` | Merge parallel branches | After parallel development |

## Code Style & Conventions

### File Naming
- Components: `PascalCase.tsx` (e.g., `ExpenseList.tsx`)
- Utilities: `camelCase.ts` (e.g., `utils.ts`)
- Types: `camelCase.ts` with PascalCase exports

### Component Pattern
```typescript
// Named export, function declaration, props interface
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="...">
      {/* Component content */}
    </div>
  );
}
```

### Import Order
```typescript
// 1. React/Next.js
import React, { useState, useMemo } from 'react';
import Link from 'next/link';

// 2. Third-party libraries
import { format, parseISO } from 'date-fns';
import { PieChart, Pie } from 'recharts';

// 3. Local imports (using @ alias)
import { useExpenses } from '@/context/ExpenseContext';
import { Button, Card } from '@/components/ui';
import { formatCurrency } from '@/lib/utils';
import { Expense, EXPENSE_CATEGORIES } from '@/types/expense';
```

### Tailwind CSS
- Use utility classes, not inline styles (except dynamic values)
- Custom colors: `primary-*`, `success-*`, `warning-*`, `danger-*`
- Responsive: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- Common patterns:
  ```typescript
  // Card container
  className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6"

  // Primary button
  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg"

  // Form input
  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary-500"
  ```

### Component Organization
- **UI components** (`src/components/ui/`): Generic, reusable, no business logic
- **Feature components** (`src/components/[domain]/`): Domain-specific, use context
- **Pages** (`src/app/`): Compose components, minimal logic
- **Each directory has an `index.ts`** for clean exports

## Development Guidelines

### Before Writing Code
1. Read relevant existing files to understand patterns
2. Check if similar functionality exists to reuse
3. Plan the component/feature structure

### While Writing Code
1. Match existing code style exactly
2. Use TypeScript strictly (no `any` unless absolutely necessary)
3. Handle loading and empty states
4. Consider mobile responsiveness
5. Keep components focused (single responsibility)
6. Follow SOLID principles when designing components and features

### After Writing Code
1. Run `npm run lint` to check for issues
2. Verify the dev server runs without errors
3. Test the feature manually in the browser
4. Check mobile responsiveness

### Validation Rules (ExpenseForm)
- **Amount**: Required, positive number, maximum $1,000,000
- **Description**: Required, maximum 200 characters
- **Date**: Required, cannot be in the future
- **Category**: Required, must be valid ExpenseCategory

### Error Handling
- **Form errors**: Display inline below the field with red text (`text-danger-500`)
- **Empty states**: Use `EmptyState` component with helpful message and action button
- **Loading states**: Show skeleton loaders or spinner, never blank screens
- **Failed operations**: Show inline error message, don't use alerts/modals for errors
- **Network errors**: N/A (app is fully client-side with localStorage)

### Accessibility Guidelines
- All interactive elements must be keyboard accessible
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<header>`)
- Form inputs must have associated `<label>` elements
- Include `aria-label` on icon-only buttons
- Maintain color contrast ratios (don't rely on color alone)
- Focus states must be visible (`focus:ring-2 focus:ring-primary-500`)

### Testing Expectations
- **No automated tests** currently in the project
- **Manual testing checklist** for new features:
  1. Feature works with no existing data (empty state)
  2. Feature works with existing data
  3. Form validation triggers correctly
  4. Mobile layout is usable (test at 375px width)
  5. Keyboard navigation works
  6. Data persists after page refresh

## Known Issues

These pre-existing type errors may cause `npm run build` to fail but don't affect development:

| File | Line | Issue |
|------|------|-------|
| `src/components/ui/Input.tsx` | 40 | Conditional class type (`icon && "pl-10"` returns `string \| false`) |
| `src/app/expenses/page.tsx` | 138 | `hasActiveFilters` type mismatch (string \| true vs boolean) |

## Parallel Development Workflow

This project supports parallel feature development using Git worktrees:

```bash
# View active worktrees
git worktree list

# Create a worktree for a new feature
git worktree add ../expense-tracker-[feature] -b feature/[feature-name]

# After merging, clean up
git worktree remove ../expense-tracker-[feature]
git branch -d feature/[feature-name]
```

Use `/parallel-agents` for Claude to spawn multiple subagents working simultaneously.

## Working With Claude

### Do
- Save implementation notes adn .work files to `.claude/history/`
- Suggest new slash commands when patterns emerge
- Fix bugs in the code you're modifying
- Follow existing patterns exactly
- Compile and Test changes before considering done

### Don't
- Refactor unrelated code
- Skip the linting step
- Leave `console.log` statements

### When Adding New Features
1. Create the page in `src/app/[route]/page.tsx`
2. Add components in appropriate `src/components/[domain]/` folder
3. Export from the domain's `index.ts`
4. Add navigation link in `Header.tsx` if user-facing
5. Update this CLAUDE.md if significant

### Common Tasks

**Add a new page:**
```
1. Create src/app/[route]/page.tsx
2. Add to Header.tsx navigation array
3. Create any needed components
```

**Add a new UI component:**
```
1. Create src/components/ui/[Component].tsx
2. Export from src/components/ui/index.ts
```

**Add a new chart/visualization:**
```
1. Create in src/components/dashboard/
2. Export from src/components/dashboard/index.ts
3. Use Recharts with ResponsiveContainer
```

## Useful Code References

| What | Where | Notes |
|------|-------|-------|
| State management | `src/context/ExpenseContext.tsx` | CRUD operations, filtering |
| Formatting helpers | `src/lib/utils.ts` | Currency, dates, CSV export |
| Category definitions | `src/types/expense.ts` | Colors, icons, labels |
| Chart example | `src/components/dashboard/CategoryChart.tsx` | Recharts patterns |
| Form example | `src/components/expenses/ExpenseForm.tsx` | Validation patterns |
| UI component | `src/components/ui/Button.tsx` | Props pattern, variants |
