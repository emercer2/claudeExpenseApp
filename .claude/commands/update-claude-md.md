# Update CLAUDE.md Command

Update the CLAUDE.md file to reflect recent changes: $ARGUMENTS

## Purpose

Keep CLAUDE.md accurate and up-to-date as the codebase evolves. This command audits the current state of the project and updates documentation accordingly.

## Process

### Step 1: Analyze Recent Changes

If arguments provided, focus on those specific areas. Otherwise, check for:

1. **New files and directories**
   - Scan `src/app/` for new pages
   - Scan `src/components/` for new component directories
   - Scan `.claude/commands/` for new slash commands

2. **Modified patterns**
   - Check if any documented patterns have changed
   - Look for new utilities in `src/lib/`
   - Check for new types in `src/types/`

3. **Dependency changes**
   - Review package.json for new dependencies
   - Note any removed dependencies

### Step 2: Read Current CLAUDE.md

Read the existing CLAUDE.md to understand:
- Current structure and sections
- What's already documented
- Writing style and formatting conventions

### Step 3: Identify Gaps

Compare actual codebase state against documentation:

```bash
# List all pages
ls src/app/

# List all component directories
ls src/components/

# List all slash commands
ls .claude/commands/

# Check for new types
cat src/types/expense.ts
```

### Step 4: Update Sections

Update these sections as needed:

**Project Structure** - Add/remove files and directories
**Available Slash Commands** - Add new commands to the table
**Data Model** - Update types if changed
**Tech Stack** - Add new dependencies
**Known Issues** - Add/remove resolved issues
**Useful Code References** - Add new reference files

### Step 5: Maintain Consistency

When updating:
- Match existing formatting exactly
- Keep descriptions concise
- Use consistent table formatting
- Preserve the overall document structure
- Don't remove sections, only update them

## Update Guidelines

### Adding a New Slash Command
```markdown
| `/command-name` | Brief description | When to use it |
```

### Adding a New Page
Add to Project Structure under `src/app/`:
```
│   ├── new-page/       # Description (/new-page)
```

### Adding a New Component Directory
Add under appropriate section in Project Structure.

### Adding a Known Issue
```markdown
| `src/file.tsx` | Line | Brief description of issue |
```

## Output

After updating:
1. Summarize what was changed
2. List any sections that may need manual review
3. Note if any documented features no longer exist

## Example Usage

```
/update-claude-md
/update-claude-md "Added new settings page and preferences context"
/update-claude-md "New slash command: /deploy"
```
