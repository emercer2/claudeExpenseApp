# Create Pull Request Command

Create a pull request for the current branch: $ARGUMENTS

If no arguments provided, create a PR for all commits on the current branch.

## Pre-flight Checks

Before creating the PR, verify:

1. **Branch Status**
   - Confirm we're not on main/master
   - Check for uncommitted changes (warn if present)
   - Verify branch is pushed to remote

2. **Commit Analysis**
   - Review all commits since branching from main
   - Understand the full scope of changes
   - Identify breaking changes or migrations needed

## PR Creation Process

### Step 1: Gather Context

```bash
# Get current branch name
git branch --show-current

# Check remote tracking
git status

# View all commits for this branch
git log main..HEAD --oneline

# View full diff against main
git diff main...HEAD --stat
```

### Step 2: Analyze Changes

Review the changes to understand:
- What features/fixes are included
- Which files were modified
- Any potential risks or considerations
- Testing that should be done

### Step 3: Create the PR

Use the GitHub CLI to create the PR with this format:

```bash
gh pr create --title "<type>: <concise description>" --body "$(cat <<'EOF'
## Summary

<2-4 bullet points describing what this PR does>

## Changes

<List of notable changes, organized by area>

## Test Plan

- [ ] <Specific testing steps>
- [ ] <Edge cases to verify>
- [ ] Verified no console errors
- [ ] Tested on mobile viewport

## Screenshots

<If UI changes, describe what changed visually>

## Notes

<Any additional context, breaking changes, or follow-up work needed>

---
🤖 Generated with [Claude Code](https://claude.ai/code)
EOF
)"
```

### PR Title Conventions

Use conventional commit format:
- `feat:` - New feature
- `fix:` - Bug fix
- `refactor:` - Code refactoring
- `style:` - Styling/CSS changes
- `docs:` - Documentation
- `test:` - Adding tests
- `chore:` - Maintenance tasks

Examples:
- `feat: add monthly insights page with budget streak`
- `fix: resolve date filter not clearing properly`
- `refactor: extract expense validation into utility`

## Post-Creation

After creating the PR:
1. Output the PR URL
2. Summarize what was included
3. Suggest reviewers if known
4. Note any manual testing needed

## Error Handling

- If not on a feature branch, warn and confirm before proceeding
- If no commits to push, explain and exit
- If gh CLI not authenticated, provide instructions
- If push fails, diagnose and report the issue

## Example Usage

```
/create-pr
/create-pr "Add dark mode toggle feature"
/create-pr --draft
```
