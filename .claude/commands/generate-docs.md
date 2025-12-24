# Documentation Generator Command

Generate comprehensive developer and user documentation for: $ARGUMENTS

## Analysis Phase

1. **Feature Detection**: Analyze the codebase to identify all files related to $ARGUMENTS
   - Search for components, hooks, utilities, API routes, types, and tests
   - Determine feature scope: Frontend / Backend / Full-Stack

2. **Code Analysis**: For each relevant file, extract:
   - Function signatures and parameters
   - Type definitions and interfaces
   - API endpoints and request/response schemas
   - Component props and state management
   - Dependencies and imports

## Documentation Generation

### Developer Documentation
Create `docs/dev/{feature-name}-implementation.md` with:

```markdown
# {Feature Name} - Technical Documentation

## Overview
Brief technical description of the feature and its purpose.

## Architecture
- Feature type: [Frontend | Backend | Full-Stack]
- Key patterns used
- Data flow diagram (text-based)

## File Structure
List all files involved with their responsibilities:
- `path/to/file.ts` - Description of purpose

## API Reference (if applicable)
### Endpoints
| Method | Path | Description |
|--------|------|-------------|
| POST | /api/... | ... |

### Request/Response Schemas
```typescript
// Include relevant type definitions
```

## Component Reference (if applicable)
### Props
| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|

### State Management
Describe how state is managed (Context, hooks, etc.)

## Dependencies
- External packages used
- Internal utilities/hooks referenced

## Implementation Notes
- Key design decisions
- Performance considerations
- Security measures

## Testing
- Test file locations
- Key test scenarios covered

## Related Documentation
- [User Guide](../user/{feature-name}-guide.md)
- Links to other relevant docs
```

### User Documentation
Create `docs/user/{feature-name}-guide.md` with:

```markdown
# How to {Use Feature Name}

## Overview
Simple, non-technical explanation of what this feature does and why it's useful.

## Prerequisites
- What users need before using this feature
- Required permissions or setup

## Step-by-Step Guide

### Step 1: {Action Title}
{Clear instruction}

![Screenshot: {Description}](../assets/screenshots/{feature-name}-step-1.png)
<!-- SCREENSHOT_PLACEHOLDER: Capture {specific UI element or action} -->

### Step 2: {Action Title}
{Clear instruction}

![Screenshot: {Description}](../assets/screenshots/{feature-name}-step-2.png)
<!-- SCREENSHOT_PLACEHOLDER: Capture {specific UI element or action} -->

(Continue for all steps...)

## Common Use Cases
### Use Case 1: {Scenario}
Brief walkthrough of a specific scenario.

### Use Case 2: {Scenario}
Brief walkthrough of another scenario.

## Tips & Best Practices
- Helpful tip 1
- Helpful tip 2

## Troubleshooting

### {Common Issue 1}
**Problem**: Description of the issue
**Solution**: How to resolve it

### {Common Issue 2}
**Problem**: Description of the issue
**Solution**: How to resolve it

## FAQ
**Q: Common question?**
A: Clear answer.

## Related Features
- [Related Feature 1](./related-feature-guide.md)
- [Technical Details (for developers)](../dev/{feature-name}-implementation.md)

## Need Help?
Instructions for getting support or reporting issues.
```

## Output Requirements

1. **Create directory structure** if it doesn't exist:
   - `docs/dev/`
   - `docs/user/`
   - `docs/assets/screenshots/`

2. **Generate both documentation files** with accurate, specific content based on actual code analysis

3. **Feature Type Detection**:
   - **Frontend**: Focus on components, UI state, user interactions
   - **Backend**: Focus on API endpoints, database operations, business logic
   - **Full-Stack**: Include both perspectives with clear separation

4. **Screenshot Placeholders**: Include HTML comments indicating exactly what should be captured:
   ```markdown
   <!-- SCREENSHOT_PLACEHOLDER: Capture the {specific element} showing {specific state} -->
   ```

5. **Cross-References**: Ensure both documents link to each other and any related existing documentation

6. **Consistency**: Match existing documentation style in the project if present

## Post-Generation Checklist
- [ ] Developer doc includes all relevant code files
- [ ] User doc has clear, numbered steps
- [ ] Screenshot placeholders are specific and actionable
- [ ] Cross-references are valid
- [ ] Technical accuracy verified against code
- [ ] No sensitive information exposed in user docs
