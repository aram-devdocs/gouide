# Protocol Definitions

This directory contains Protocol Buffer (protobuf) definitions for communication
between the Gouide Core (Rust) and frontend clients (TypeScript).

## Structure

```
protocol/
├── buf.yaml                  # Buf CLI configuration (lint/breaking rules)
└── gouide/
    └── v1/
        ├── common.proto      # Shared types (RequestId, Timestamp, Error, StreamMeta, etc.)
        ├── handshake.proto   # Hello/Welcome messages, Control service (Cancel)
        ├── workspace.proto   # Workspace & Buffer services (file tree, buffers)
        └── editor.proto      # Editor service (edits, syntax tokens, diagnostics)
```

## Services

| Service | Proto | Description |
|---------|-------|-------------|
| `Handshake` | handshake.proto | Connection establishment (Connect, Disconnect, Ping) |
| `Control` | handshake.proto | Cross-cutting operations (Cancel) |
| `Workspace` | workspace.proto | Folder management, file tree streaming |
| `Buffer` | workspace.proto | Open/close/save buffers |
| `Editor` | editor.proto | Text edits, syntax highlighting, diagnostics |

## Streaming Protocol

All streams use `StreamMeta` for reliable progressive rendering:
- `sequence`: Monotonic sequence number for gap detection
- `delta_type`: SNAPSHOT, ADD, UPDATE, REMOVE, or RESET_REQUIRED
- `dedupe_key`: For coalescing repeated updates

Clients must handle `DELTA_TYPE_RESET_REQUIRED` by re-subscribing.

## Codegen

Generated TypeScript types are output to `packages/protocol/src/generated/` (gitignored).
Generated Rust types go to `core/crates/gouide-protocol/src/gen/` (gitignored).

Run codegen with:
```bash
pnpm codegen          # TypeScript (buf generate)
cargo xtask gen       # Rust (prost)
```

## Versioning Policy

- Package uses `gouide.v1` namespace
- Field numbers are never reused after removal
- New optional fields may be added without version bump
- Breaking changes require migration to `gouide.v2`
- Reserved field numbers document removed fields
