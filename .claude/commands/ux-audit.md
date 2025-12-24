Perform a UX audit to discover user experience improvements for: $ARGUMENTS

If no specific area is provided, audit the entire application.

## Audit Process

### Phase 1: Understand Current State
1. Read the relevant component files and pages
2. Identify the user flows and interactions
3. Note the current UI patterns and design decisions

### Phase 2: Evaluate Against UX Principles

Analyze each area against these criteria:

**Usability**
- Is the feature intuitive and easy to use?
- Are there unnecessary steps that could be eliminated?
- Is the cognitive load reasonable?
- Are error states handled gracefully?

**Feedback & Affordances**
- Do interactive elements look clickable/tappable?
- Is there immediate feedback for user actions?
- Are loading states and progress indicators present?
- Do hover/focus states communicate interactivity?

**Information Architecture**
- Is content organized logically?
- Can users find what they need quickly?
- Is the navigation clear and consistent?
- Are labels and headings descriptive?

**Visual Hierarchy**
- Is the most important content emphasized?
- Is there appropriate use of whitespace?
- Are related items grouped together?
- Is the reading flow natural?

**Accessibility**
- Can keyboard-only users navigate effectively?
- Is color contrast sufficient?
- Are touch targets large enough (44x44px minimum)?
- Do form fields have proper labels?

**Mobile Experience**
- Does the layout adapt well to small screens?
- Are touch interactions comfortable?
- Is text readable without zooming?
- Do modals and dropdowns work on mobile?

**Performance Perception**
- Does the UI feel responsive?
- Are there skeleton loaders for async content?
- Do animations enhance or distract?

### Phase 3: Generate Recommendations

For each issue found, document:
1. **Problem**: What is the UX issue?
2. **Location**: Which file(s) and component(s)?
3. **Impact**: How does this affect users? (High/Medium/Low)
4. **Recommendation**: Specific improvement suggestion
5. **Implementation**: Brief technical approach

### Phase 4: Prioritize

Rank improvements by:
- **Quick wins**: Low effort, high impact
- **Strategic**: High effort, high impact
- **Minor**: Low effort, low impact
- **Backlog**: High effort, low impact

## Output

Save the audit report to `.claude/history/ux-audit-[date].md` with:

1. Executive summary (3-5 key findings)
2. Detailed findings organized by category
3. Prioritized recommendations table
4. Optional wireframe descriptions or mockup suggestions

## Example Findings Format

```markdown
### Finding: No confirmation before delete

**Problem**: Clicking delete immediately removes the expense with no undo option
**Location**: `src/components/expenses/ExpenseItem.tsx`
**Impact**: High - Users can accidentally lose data
**Recommendation**: Add confirmation modal or implement undo toast
**Implementation**:
- Option A: Add Modal component with confirm/cancel buttons
- Option B: Soft delete with 5-second undo toast notification
```

Begin the audit now.
