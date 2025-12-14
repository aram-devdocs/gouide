# Gouide IDE

A modern IDE built with Rust and TypeScript.

## Prerequisites

- Node.js >= 20.0.0
- pnpm >= 9.15.0
- Rust >= 1.75.0

## Getting Started

```bash
# Install dependencies
pnpm install

# Run all packages in development mode
pnpm dev

# Build all packages
pnpm build

# Run type checking
pnpm typecheck

# Run tests
pnpm test
```

## Repository Structure

```
gouide/
├── apps/           # Applications
│   ├── desktop/    # Tauri desktop app
│   └── cli/        # Command-line client
├── packages/       # Shared packages
│   ├── protocol/   # Generated protocol types
│   ├── core-client/# Typed core client wrapper
│   ├── typescript-config/  # Shared TS configs
│   └── frontend/   # Frontend packages
│       ├── shared/ # Shared frontend code
│       │   ├── ui/     # Atomic UI components
│       │   ├── hooks/  # Reusable hooks
│       │   ├── state/  # State management
│       │   ├── editor/ # Editor adapter
│       │   └── theme/  # Design tokens
│       └── primitives/ # Platform primitives
│           ├── web/    # Web-specific
│           └── desktop/# Desktop-specific
├── core/           # Rust workspace
├── protocol/       # Protobuf definitions
├── tools/          # Development scripts
└── docs/           # Documentation
```

## Architecture

See [.cursor/plans/gouide_mvp_architecture_81c5c293.plan.md](.cursor/plans/gouide_mvp_architecture_81c5c293.plan.md) for the full architecture document.

## License

MIT
