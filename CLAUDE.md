# CLAUDE.md

## Quick Reference

```bash
npm install      # Install dependencies
npm run dev      # Dev server → http://localhost:3000
npm run build    # Production build
npm run lint     # Run ESLint
```

## Project Overview

Expense Tracker AI - client-side expense tracking app with Next.js 14, TypeScript, Tailwind CSS. Data persists in localStorage (no backend).

**Stack:** Next.js 14 (App Router) | TypeScript | Tailwind CSS | Recharts | date-fns | uuid | React Context

### Core Features
- Add, edit, and delete expenses with category classification
- Filter and search expenses by date range, category, or description
- Dashboard with spending summaries and trend visualizations
- Monthly insights with budget streak tracking
- CSV export for filtered or all expenses

## Project Structure

```
src/
├── app/                        # Pages: /, /add, /expenses, /insights
├── components/
│   ├── ui/                     # Button, Input, Select, Card, Modal, Badge, EmptyState
│   ├── expenses/               # ExpenseForm, ExpenseList, ExpenseItem, ExpenseFilters
│   ├── dashboard/              # SummaryCard, CategoryChart, MonthlyTrendChart, RecentExpenses, MonthlyInsights
│   └── layout/                 # Header
├── context/ExpenseContext.tsx  # State: useExpenses() hook
├── lib/                        # utils.ts (formatting, CSV), storage.ts
└── types/expense.ts            # Expense, ExpenseCategory, EXPENSE_CATEGORIES
```

## Data Model

```typescript
interface Expense {
  id: string;              // UUID
  amount: number;          // Positive, max 1,000,000
  category: ExpenseCategory;
  description: string;     // Max 200 chars
  date: string;            // YYYY-MM-DD
  createdAt: string;
  updatedAt: string;
}

type ExpenseCategory = "food" | "transportation" | "entertainment" | "shopping" | "bills" | "other";
```

## Key Patterns

**State Management:**
```typescript
const {
  expenses, filteredExpenses, summary, filters, isLoading,
  addExpense, updateExpense, deleteExpense, setFilters, resetFilters
} = useExpenses();
```

**Component Pattern:**
```typescript
interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return <div>...</div>;
}
```

**Components:** Named exports, props interface, `"use client"` for interactive components. Each directory has `index.ts` for barrel exports.

**Styling:** Tailwind utilities. Custom colors: `primary-*`, `success-*`, `warning-*`, `danger-*`. Mobile-first with `sm:`, `md:`, `lg:` breakpoints.

**Import Order:**
1. React/Next.js
2. Third-party libraries (date-fns, recharts)
3. Local imports (using `@/` alias)

## Slash Commands

| Command | Description |
|---------|-------------|
| `/create-pr` | Create GitHub pull request |
| `/code-review` | Comprehensive code review |
| `/ux-audit` | UX audit with recommendations |
| `/feature-ideas` | Generate feature suggestions |
| `/update-claude-md` | Update this file |
| `/generate-docs` | Generate documentation |
| `/parallel-agents` | Parallel development with worktrees |
| `/api-test` | Test API endpoints |
| `/integrate-parallel-work` | Merge parallel branches |

## Development Guidelines

### Before Writing Code
1. Read relevant existing files to understand patterns
2. Check if similar functionality exists to reuse
3. Plan the component/feature structure

### While Writing Code
- Match existing code style exactly
- Use TypeScript strictly (no `any` unless absolutely necessary)
- Handle loading and empty states
- Consider mobile responsiveness
- Keep components focused (single responsibility)
- Follow Solid Principles when designing
- Use Tailwind for styling when possible

### After Writing Code
1. Run `npm run lint`
2. Verify dev server runs without errors
3. Test manually in browser
4. Check mobile responsiveness

### Validation Rules (ExpenseForm)
- **Amount**: Required, positive number, max $1,000,000
- **Description**: Required, max 200 characters
- **Date**: Required, cannot be in future
- **Category**: Required, must be valid ExpenseCategory

### Error Handling
- Form errors: Display inline below field (`text-danger-500`)
- Empty states: Use `EmptyState` component with helpful message and action button
- Loading states: Show skeleton loaders or spinner, never blank screens

### Accessibility
- All interactive elements keyboard accessible
- Use semantic HTML (`<button>`, `<nav>`, `<main>`, `<header>`)
- Form inputs must have associated `<label>` elements
- Include `aria-label` on icon-only buttons
- Focus states visible (`focus:ring-2 focus:ring-primary-500`)

### Testing (Manual)
1. Feature works with no existing data (empty state)
2. Feature works with existing data
3. Form validation triggers correctly
4. Mobile layout is usable (test at 375px width)
5. Keyboard navigation works
6. Data persists after page refresh

## Working With Claude

### Do
- Save implementation notes to `.claude/history/`
- Fix bugs in code you're modifying
- Follow existing patterns exactly
- Compile and test changes before considering done
- Suggest new slash commands when patterns emerge

### Don't
- Refactor unrelated code
- Skip the linting step
- Leave `console.log` statements
- Add features beyond what was asked

### Adding Features
1. Create page in `src/app/[route]/page.tsx`
2. Add components in `src/components/[domain]/`
3. Export from domain's `index.ts`
4. Add nav link in `Header.tsx` if user-facing
5. Update this CLAUDE.md if significant

### Common Tasks

**Add a new page:**
1. Create `src/app/[route]/page.tsx`
2. Add to Header.tsx navigation array
3. Create any needed components

**Add a new UI component:**
1. Create `src/components/ui/[Component].tsx`
2. Export from `src/components/ui/index.ts`

**Add a new chart:**
1. Create in `src/components/dashboard/`
2. Export from `src/components/dashboard/index.ts`
3. Use Recharts with ResponsiveContainer

## Parallel Development

Supports Git worktrees for parallel feature development:

```bash
git worktree add ../expense-tracker-[feature] -b feature/name  # Create worktree
git worktree remove ../expense-tracker-[feature]               # Clean up
```

Use `/parallel-agents` for Claude to spawn multiple subagents simultaneously.

## Code References

| What | Where |
|------|-------|
| State management | `src/context/ExpenseContext.tsx` |
| Formatting helpers | `src/lib/utils.ts` |
| Category definitions | `src/types/expense.ts` |
| Form validation | `src/components/expenses/ExpenseForm.tsx` |
| Chart example | `src/components/dashboard/CategoryChart.tsx` |
| UI component example | `src/components/ui/Button.tsx` |

