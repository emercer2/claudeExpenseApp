# Integrate Parallel Work Command

I have features developed in parallel worktrees that I need to integrate: $ARGUMENTS

Please help me integrate these features:
1. Create a new integration branch called "integration/parallel-features"
2. For each feature name provided, merge the branch feature/[feature-name] into the integration branch
3. Resolve any merge conflicts that arise
4. Test that all features work together
5. Run all tests to ensure nothing is broken
6. Once integration is successful, merge to main and clean up branches

I want to integrate these safely before merging to main.

## Integration Process

### Phase 1: Preparation
1. **Verify all feature branches exist** and have been committed
2. **Check worktree status** - ensure no uncommitted changes in any worktree
3. **Fetch latest changes** from remote to ensure we're up to date
4. **Document current branch positions** for rollback if needed

### Phase 2: Create Integration Branch
```bash
git checkout main
git pull origin main
git checkout -b integration/parallel-features
```

### Phase 3: Merge Features Sequentially
For each feature in $ARGUMENTS:
1. Merge `feature/{feature-name}` into integration branch
2. If conflicts occur:
   - List all conflicting files
   - Analyze each conflict
   - Resolve with preference for combining both changes when possible
   - Mark resolution and continue
3. Run `npm run build` after each merge to catch issues early
4. Commit merge with descriptive message

### Phase 4: Integration Testing
1. **Install dependencies**: `npm install`
2. **Run linting**: `npm run lint`
3. **Run type checking**: `npx tsc --noEmit`
4. **Run tests**: `npm test` (if configured)
5. **Build project**: `npm run build`
6. **Manual verification**: Start dev server and verify features work together

### Phase 5: Finalize Integration
If all tests pass:
1. Merge integration branch to main:
   ```bash
   git checkout main
   git merge integration/parallel-features
   git push origin main
   ```

2. Clean up feature branches:
   ```bash
   git branch -d feature/{feature-name}  # for each feature
   git push origin --delete feature/{feature-name}  # if pushed to remote
   ```

3. Remove worktrees:
   ```bash
   git worktree remove ../expense-tracker-{feature-name}  # for each worktree
   ```

4. Clean up integration branch:
   ```bash
   git branch -d integration/parallel-features
   ```

### Rollback Plan
If integration fails:
1. Abort current merge: `git merge --abort`
2. Return to main: `git checkout main`
3. Delete integration branch: `git branch -D integration/parallel-features`
4. Features remain safe in their original branches

## Conflict Resolution Guidelines

### Common Conflict Types

**1. Package.json conflicts**
- Combine dependencies from both features
- Use higher version numbers when same dependency differs

**2. Import/Export conflicts in index files**
- Include exports from both features
- Ensure no duplicate exports

**3. Shared component modifications**
- Analyze both changes for compatibility
- Prefer composition over replacement
- Create separate components if changes are incompatible

**4. Style conflicts (CSS/Tailwind)**
- Merge both style additions
- Check for class name collisions
- Verify responsive breakpoints don't conflict

**5. Context/State conflicts**
- Extend state shape to include both features
- Ensure actions don't have naming collisions
- Merge reducers/handlers appropriately

## Output Requirements
- Report each merge step with success/failure status
- List any conflicts encountered and how they were resolved
- Provide test results summary
- Confirm final integration status
- List cleanup actions taken
