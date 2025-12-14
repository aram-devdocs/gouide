# Protocol Definitions

This directory contains Protocol Buffer (protobuf) definitions for communication
between the Gouide Core (Rust) and frontend clients (TypeScript).

## Structure (planned)

```
protocol/
├── buf.yaml
├── buf.gen.yaml
└── gouide/
    └── v1/
        ├── common.proto      # Shared types (RequestId, Timestamp, etc.)
        ├── handshake.proto   # Hello/Welcome messages
        ├── workspace.proto   # Open folder, file tree, buffers
        ├── editor.proto      # Open/save/edit operations
        └── search.proto      # Search RPCs and streaming results
```

## Codegen

Generated TypeScript types are output to `packages/protocol/src/generated/` (gitignored).

Run codegen with:
```bash
pnpm codegen
```

## Versioning

Protocol versions follow semver. Breaking changes require a major version bump.
