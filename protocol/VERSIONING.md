# Protocol Versioning Policy

## Semantic Versioning for Protobuf

The Gouide protocol follows strict semantic versioning:

### Major Version (X.0.0)

Breaking changes detected by `buf breaking`:

- Removing or renaming fields
- Changing field types
- Removing or renaming services/RPCs
- Changing RPC signatures

### Minor Version (0.X.0)

Backward-compatible additions:

- Adding new optional fields
- Adding new services/RPCs
- Adding new messages

### Patch Version (0.0.X)

Non-breaking changes:

- Documentation updates
- Comment changes
- Internal refactoring with no wire format changes

## CI Enforcement

1. **Pull Requests**: `buf breaking` checks against `main` branch
2. **Version Bumps**: PRs with breaking changes MUST update major version in:
   - `protocol/buf.yaml`
   - `packages/protocol/package.json`
   - `core/Cargo.toml` (workspace version)

3. **Build Contract**: Any protocol change triggers:
   - Full TypeScript codegen
   - Full Rust codegen (via tonic-build)
   - Type checking across all packages
   - Rust compilation across all crates

If any package fails to compile after protocol change, CI fails.

## Migration Guide

When making breaking changes:

1. Update protocol version to next major version
2. Run codegen: `pnpm codegen && cargo build`
3. Fix all type errors in TypeScript packages
4. Fix all compile errors in Rust crates
5. Update migration guide in `protocol/CHANGELOG.md`
6. Document changes in PR description
