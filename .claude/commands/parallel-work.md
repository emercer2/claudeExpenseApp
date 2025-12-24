# Parallel Work Command

I want to develop features in parallel for my expense tracker app using Git worktrees: $ARGUMENTS

## Phase 1: Feature Analysis

Before creating worktrees, analyze $ARGUMENTS to determine the best way to divide the work:

### If features are clearly specified:
- Use each feature name directly (e.g., "data-export" and "analytics-dashboard")

### If features need to be divided:
Consider splitting by:
- **Domain**: User-facing vs backend vs infrastructure
- **Independence**: Features that don't share code can be parallel
- **Risk**: Isolate experimental features from stable ones
- **Size**: Break large features into smaller parallel tracks

### Feature Naming Convention
- Use kebab-case: `feature-name` not `featureName`
- Be descriptive but concise: `data-export` not `export` or `data-export-system-v2`
- Prefix with domain if helpful: `ui-dark-mode`, `api-rate-limiting`

## Phase 2: Pre-flight Checks

Before creating worktrees:
1. **Verify clean working directory**: `git status` should show no uncommitted changes
2. **Ensure on latest main**: `git checkout main && git pull origin main`
3. **Check disk space**: Each worktree is a full copy of the codebase
4. **Verify no conflicting worktrees exist**: `git worktree list`

## Phase 3: Create Worktrees

For each feature identified from $ARGUMENTS:

```bash
# Create worktree with new branch from main
git worktree add -b feature/{feature-name} ../expense-tracker-{feature-name} main
```

This creates:
- A new directory at `../expense-tracker-{feature-name}`
- A new branch called `feature/{feature-name}` based on `main`
- An isolated working copy of the entire codebase

## Phase 4: Set Up Development Environment

For each worktree created:

```bash
cd ../expense-tracker-{feature-name}

# Install dependencies
npm install

# Verify build works
npm run build

# Start dev server on unique port
npm run dev -- --port {3001 + index}
```

### Port Assignment
| Worktree Index | Port |
|----------------|------|
| 1st feature    | 3001 |
| 2nd feature    | 3002 |
| 3rd feature    | 3003 |
| 4th feature    | 3004 |

## Phase 5: Verification

1. **List all worktrees**:
   ```bash
   git worktree list
   ```

2. **Verify each worktree**:
   - Correct branch checked out
   - Dependencies installed
   - Dev server starts without errors

3. **Document the setup**:
   | Feature | Directory | Branch | Port | Status |
   |---------|-----------|--------|------|--------|
   | ... | ... | ... | ... | Ready/Error |

## Worktree Isolation Explanation

### What's Shared
- Git history and objects (`.git` database)
- Remote tracking information
- Git configuration

### What's Isolated
- Working directory files (full separate copy)
- Branch position (each worktree on different branch)
- Staged changes
- node_modules (installed separately)
- Build outputs
- Local environment files (.env.local)

### Benefits
- **No branch switching**: Work on multiple features without stashing
- **Independent builds**: Each feature can be built/tested separately
- **Parallel development**: Multiple terminals, multiple features
- **Safe experimentation**: Break one worktree without affecting others
- **Easy comparison**: View different implementations side-by-side

## Working with Worktrees

### Daily Workflow
```bash
# Terminal 1: Work on feature A
cd ../expense-tracker-feature-a
npm run dev -- --port 3001

# Terminal 2: Work on feature B
cd ../expense-tracker-feature-b
npm run dev -- --port 3002
```

### Committing Changes
Each worktree commits to its own branch:
```bash
cd ../expense-tracker-{feature-name}
git add .
git commit -m "feat: description of changes"
git push origin feature/{feature-name}
```

### Keeping Up with Main
```bash
cd ../expense-tracker-{feature-name}
git fetch origin main
git merge origin/main
# or
git rebase origin/main
```

### When Done with a Feature
```bash
# From main worktree
git worktree remove ../expense-tracker-{feature-name}
git branch -d feature/{feature-name}  # if merged
```

## Output Requirements

After setup, provide:
1. Table of all worktrees created with status
2. Commands to start each dev server
3. Summary of what each worktree will contain
4. Any warnings or issues encountered
5. Next steps for development

## Troubleshooting

### "Branch already exists"
The feature branch already exists. Either:
- Use existing branch: `git worktree add ../expense-tracker-{name} feature/{name}`
- Delete and recreate: `git branch -D feature/{name}` then retry

### "Worktree already exists"
Remove the existing worktree first:
```bash
git worktree remove ../expense-tracker-{name} --force
```

### Port already in use
Choose a different port or find/kill the process using it:
```bash
# Windows
netstat -ano | findstr :{port}
taskkill /PID {pid} /F
```
