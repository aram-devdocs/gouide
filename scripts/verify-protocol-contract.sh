#!/bin/bash
set -euo pipefail

echo "Verifying protocol contract enforcement..."

# Check if protocol files changed
CHANGED_PROTOS=$(git diff --name-only origin/main...HEAD | grep "\.proto$" || true)

if [ -n "$CHANGED_PROTOS" ]; then
  echo "Protocol files changed:"
  echo "$CHANGED_PROTOS"

  echo ""
  echo "Running buf breaking check..."
  cd protocol
  buf breaking --against .git#branch=origin/main
  cd ..

  echo ""
  echo "Regenerating TypeScript code..."
  pnpm codegen

  echo ""
  echo "Type checking all TypeScript packages..."
  pnpm typecheck

  echo ""
  echo "Building all Rust crates (includes codegen)..."
  cd core
  cargo build --all-features
  cd ..

  echo ""
  echo "Protocol contract verified! All consumers compile successfully."
else
  echo "No protocol changes detected."
fi
