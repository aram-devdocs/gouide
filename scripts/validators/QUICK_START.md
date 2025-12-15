# UI Architecture Validators - Quick Start

## Installation

All scripts are ready to use! Just make them executable:

```bash
cd /Users/aramhammoudeh/dev/gouide
chmod +x scripts/validate-ui-architecture.sh
chmod +x scripts/validators/*.sh
chmod +x scripts/validators/lib/*.sh
```

## Basic Usage

### Run All Validators

```bash
./scripts/validate-ui-architecture.sh
```

### Common Commands

```bash
# Check for violations (development)
./scripts/validate-ui-architecture.sh

# Strict mode for CI/CD (fails on new violations)
./scripts/validate-ui-architecture.sh --strict

# Create/update baseline
./scripts/validate-ui-architecture.sh --baseline-update

# See detailed output
./scripts/validate-ui-architecture.sh --verbose
```

## What Gets Checked?

### 1. Direct DOM Usage
- **Checks**: Apps using `<div>`, `<span>`, `<button>`, etc.
- **Fix**: Use `@gouide/frontend-ui` components instead

### 2. Atomic Pattern Violations
- **Checks**: Direct imports from `/atoms/` or `/molecules/`
- **Fix**: Import from `@gouide/frontend-ui` root package

### 3. Business Logic in Components
- **Checks**: `fetch()`, `axios`, file operations in components
- **Fix**: Move to `hooks/` or `services/`

### 4. Complex Component State
- **Checks**: More than 3 `useState`/`useReducer` per component
- **Fix**: Extract to custom hook

## First Time Setup

1. **Install dependencies** (optional, for baseline features):
   ```bash
   brew install jq
   ```

2. **Make scripts executable**:
   ```bash
   chmod +x scripts/validate-ui-architecture.sh
   chmod +x scripts/validators/*.sh
   ```

3. **Create baseline** (if you have existing violations):
   ```bash
   ./scripts/validate-ui-architecture.sh --baseline-update
   ```

4. **Run validation**:
   ```bash
   ./scripts/validate-ui-architecture.sh
   ```

## Integration Examples

### Package.json

Add to your `package.json`:

```json
{
  "scripts": {
    "lint:ui": "bash scripts/validate-ui-architecture.sh",
    "lint:ui:strict": "bash scripts/validate-ui-architecture.sh --strict",
    "lint:ui:update-baseline": "bash scripts/validate-ui-architecture.sh --baseline-update"
  }
}
```

Then run:
```bash
npm run lint:ui
```

### Git Pre-commit Hook

Create `.git/hooks/pre-commit`:

```bash
#!/bin/bash
echo "Running UI architecture validation..."
./scripts/validate-ui-architecture.sh --strict

if [ $? -ne 0 ]; then
  echo "UI validation failed! Fix violations or update baseline."
  exit 1
fi
```

Make it executable:
```bash
chmod +x .git/hooks/pre-commit
```

### CI/CD (GitHub Actions)

Add to `.github/workflows/ci.yml`:

```yaml
- name: Validate UI Architecture
  run: |
    chmod +x scripts/validate-ui-architecture.sh
    ./scripts/validate-ui-architecture.sh --strict
```

## Understanding Output

### Success
```
✓ All validation checks passed!
```

### Violation Example
```
✗ apps/web/src/App.tsx:15
  Direct DOM element usage detected
  → Use components from @gouide/frontend-ui instead of raw HTML elements
```

### Summary
```
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Final Summary
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Total checks run: 4
Checks passed: 3
Checks failed: 1
```

## Baseline Workflow

The baseline system helps you fix violations incrementally:

### 1. Initial Setup (with existing violations)
```bash
./scripts/validate-ui-architecture.sh --baseline-update
```

This records all current violations in `.validation-baseline.json`.

### 2. Daily Development
```bash
./scripts/validate-ui-architecture.sh --strict
```

This will:
- Allow existing violations (in baseline)
- Fail on NEW violations only
- Prevent regression

### 3. Fixing Violations
As you fix violations:
```bash
# Fix some violations in your code
# Then update the baseline
./scripts/validate-ui-architecture.sh --baseline-update
```

### 4. Tracking Progress
```bash
# Check total violations
cat scripts/.validation-baseline.json | jq '.checks'
```

## Troubleshooting

### "Permission denied"
```bash
chmod +x scripts/validate-ui-architecture.sh
```

### "jq: command not found"
```bash
# macOS
brew install jq

# Ubuntu/Debian
apt-get install jq
```

Baseline features require jq. Validators work without it but won't track baselines.

### "No application files found"
Make sure you're running from the project root:
```bash
cd /Users/aramhammoudeh/dev/gouide
./scripts/validate-ui-architecture.sh
```

### Too many false positives
Update baseline to exclude current violations:
```bash
./scripts/validate-ui-architecture.sh --baseline-update
```

## Environment Variables

Customize behavior with environment variables:

```bash
# Change state hook threshold (default: 3)
MAX_STATE_HOOKS=5 ./scripts/validate-ui-architecture.sh

# Custom project root
PROJECT_ROOT=/path/to/project ./scripts/validate-ui-architecture.sh

# Custom baseline file
BASELINE_FILE=/path/to/baseline.json ./scripts/validate-ui-architecture.sh
```

## Next Steps

1. Run validators locally: `./scripts/validate-ui-architecture.sh`
2. Review violations and fix or baseline them
3. Add to CI/CD: `./scripts/validate-ui-architecture.sh --strict`
4. Set up pre-commit hook for automatic validation
5. Track progress by updating baseline as you fix violations

For more details, see [README.md](./README.md).
