# UI Architecture Validators

Custom bash validation scripts to enforce atomic design patterns and catch architectural violations in the UI codebase.

## Overview

These validators ensure your UI architecture follows best practices:

- **Atomic Design Compliance**: Enforces proper component hierarchy
- **Separation of Concerns**: Keeps business logic out of components
- **State Management**: Prevents over-complex component state
- **Component Reusability**: Encourages using the design system

## Usage

### Quick Start

Run all validators:

```bash
./scripts/validate-ui-architecture.sh
```

### Options

```bash
# Run in strict mode (fail on any new violations)
./scripts/validate-ui-architecture.sh --strict

# Update baseline with current violations
./scripts/validate-ui-architecture.sh --baseline-update

# Verbose output
./scripts/validate-ui-architecture.sh --verbose

# Show help
./scripts/validate-ui-architecture.sh --help
```

## Validators

### 1. Direct DOM Element Detection

**Script**: `detect-direct-dom.sh`

**Purpose**: Detects direct HTML element usage in application code.

**Rule**: Applications should use components from `@gouide/frontend-ui` instead of raw HTML elements.

**Example Violation**:
```tsx
// ✗ BAD
function MyComponent() {
  return <div>Hello</div>
}

// ✓ GOOD
import { Box } from '@gouide/frontend-ui'
function MyComponent() {
  return <Box>Hello</Box>
}
```

**Excludes**: Atom components (which are allowed to use raw HTML)

### 2. Atomic Design Pattern Violations

**Script**: `detect-atomic-violations.sh`

**Purpose**: Validates correct import patterns and atomic design hierarchy.

**Rules**:
- Apps should not import from `/atoms/` or `/molecules/` paths directly
- Molecules/organisms should not import from `/primitives/` directly
- All imports should go through package root or use templates

**Example Violations**:
```tsx
// ✗ BAD - Direct atom import in app
import { Button } from '@gouide/frontend-ui/atoms'

// ✓ GOOD - Import from package root
import { Button } from '@gouide/frontend-ui'

// ✗ BAD - Molecule importing primitives
import { Slot } from '@gouide/frontend-ui/primitives'

// ✓ GOOD - Use atoms that wrap primitives
import { Container } from '@gouide/frontend-ui'
```

### 3. Business Logic Detection

**Script**: `detect-business-logic.sh`

**Purpose**: Detects business logic in component files.

**Rules**: Components should not contain:
- Direct `fetch()` calls
- Axios API calls
- File system operations

**Example Violations**:
```tsx
// ✗ BAD - API call in component
function UserList() {
  const [users, setUsers] = useState([])

  useEffect(() => {
    fetch('/api/users').then(r => r.json()).then(setUsers)
  }, [])

  return <div>{users.map(u => <div>{u.name}</div>)}</div>
}

// ✓ GOOD - Use custom hook
import { useUsers } from './hooks/useUsers'
function UserList() {
  const { users } = useUsers()
  return <div>{users.map(u => <div>{u.name}</div>)}</div>
}
```

**Excludes**: `hooks/` and `services/` directories

### 4. Component State Complexity

**Script**: `detect-component-state.sh`

**Purpose**: Flags components with excessive state hooks.

**Rule**: Components should have no more than 3 `useState` or `useReducer` hooks.

**Configuration**: Set `MAX_STATE_HOOKS` environment variable to change threshold.

**Example Violations**:
```tsx
// ✗ BAD - Too many state hooks
function ComplexForm() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')
  // ... more state
}

// ✓ GOOD - Extract to custom hook
function ComplexForm() {
  const formState = useFormState()
  // Single hook manages all state
}
```

**Excludes**: Custom hooks (files starting with `use` or in `hooks/` directory)

## Directory Structure

```
scripts/
├── validate-ui-architecture.sh    # Main orchestrator
├── .validation-baseline.json      # Baseline for existing violations
└── validators/
    ├── README.md                  # This file
    ├── detect-direct-dom.sh       # Direct DOM validator
    ├── detect-atomic-violations.sh # Atomic pattern validator
    ├── detect-business-logic.sh   # Business logic validator
    ├── detect-component-state.sh  # State complexity validator
    └── lib/
        ├── common.sh              # Common utilities
        ├── patterns.sh            # Regex patterns
        └── file-lists.sh          # File discovery functions
```

## Baseline System

The baseline system allows you to:
1. Record existing violations
2. Prevent new violations
3. Gradually fix existing issues

### Creating a Baseline

```bash
./scripts/validate-ui-architecture.sh --baseline-update
```

This creates/updates `.validation-baseline.json` with current violations.

### Using in CI/CD

```bash
# Fail only on NEW violations (not in baseline)
./scripts/validate-ui-architecture.sh --strict
```

In strict mode:
- Existing violations (in baseline) are reported but don't fail the build
- New violations cause the build to fail
- Helps prevent regression while allowing incremental fixes

## Exit Codes

- `0` - All checks passed
- `1` - One or more checks failed
- `2` - Invalid arguments or missing dependencies

## Dependencies

**Required**:
- `bash` 4.0+
- `grep`
- `find`

**Optional**:
- `jq` - Required for baseline features

Install jq on macOS:
```bash
brew install jq
```

## Integration

### Pre-commit Hook

Add to `.git/hooks/pre-commit`:

```bash
#!/bin/bash
./scripts/validate-ui-architecture.sh --strict
```

### CI/CD (GitHub Actions)

```yaml
- name: Validate UI Architecture
  run: |
    chmod +x scripts/validate-ui-architecture.sh
    ./scripts/validate-ui-architecture.sh --strict
```

### Package.json Script

```json
{
  "scripts": {
    "validate:ui": "bash scripts/validate-ui-architecture.sh",
    "validate:ui:strict": "bash scripts/validate-ui-architecture.sh --strict"
  }
}
```

## Customization

### Adjusting Patterns

Edit patterns in `validators/lib/patterns.sh`:

```bash
# Example: Change state hook threshold
MAX_STATE_HOOKS=5 ./scripts/validate-ui-architecture.sh
```

### Adding New Validators

1. Create new script in `validators/`
2. Source the lib files
3. Implement validation logic
4. Add to main orchestrator

Example template:

```bash
#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${PROJECT_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

source "$SCRIPT_DIR/lib/common.sh"
source "$SCRIPT_DIR/lib/patterns.sh"
source "$SCRIPT_DIR/lib/file-lists.sh"

# Your validation logic here
```

## Troubleshooting

### Scripts not executable

```bash
chmod +x scripts/validate-ui-architecture.sh
chmod +x scripts/validators/*.sh
```

### jq not found

Baseline features require jq:
```bash
brew install jq  # macOS
apt-get install jq  # Ubuntu/Debian
```

### False positives

Update the baseline to exclude specific files:
```bash
./scripts/validate-ui-architecture.sh --baseline-update
```

## Best Practices

1. **Run locally**: Validate before committing
2. **Update baseline**: When refactoring, update baseline to track progress
3. **Fix incrementally**: Use baseline to fix violations gradually
4. **CI enforcement**: Use `--strict` in CI to prevent new violations
5. **Review violations**: Don't blindly update baseline - review and fix when possible

## Contributing

When adding new validation rules:

1. Add pattern to `lib/patterns.sh`
2. Create validator script
3. Update main orchestrator
4. Document in this README
5. Test with existing codebase
6. Update baseline if needed
