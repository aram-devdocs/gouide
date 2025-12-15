#!/usr/bin/env bash
set -euo pipefail

# Prepare daemon sidecar for Tauri bundling
# This script builds the daemon and copies it to the Tauri binaries directory
# with the correct target triple suffix for sidecar bundling.

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

CORE_DIR="$PROJECT_ROOT/core"
TAURI_DIR="$PROJECT_ROOT/apps/desktop/src-tauri"
BINARIES_DIR="$TAURI_DIR/binaries"

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

info() { echo -e "${GREEN}[INFO]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
header() { echo -e "${CYAN}$1${NC}"; }

# Detect target triple
detect_target_triple() {
    local arch
    local os

    arch="$(uname -m)"
    os="$(uname -s)"

    case "$os" in
        Linux*)
            case "$arch" in
                x86_64)  echo "x86_64-unknown-linux-gnu" ;;
                aarch64) echo "aarch64-unknown-linux-gnu" ;;
                *)       error "Unsupported Linux architecture: $arch"; exit 1 ;;
            esac
            ;;
        Darwin*)
            case "$arch" in
                x86_64)  echo "x86_64-apple-darwin" ;;
                arm64)   echo "aarch64-apple-darwin" ;;
                *)       error "Unsupported macOS architecture: $arch"; exit 1 ;;
            esac
            ;;
        MINGW*|MSYS*|CYGWIN*)
            echo "x86_64-pc-windows-msvc"
            ;;
        *)
            error "Unsupported OS: $os"
            exit 1
            ;;
    esac
}

main() {
    header "Preparing Gouide Daemon Sidecar"
    echo

    local target_triple
    target_triple="$(detect_target_triple)"
    info "Target triple: $target_triple"

    # Build the daemon in release mode
    info "Building gouide-daemon (release mode)..."
    (cd "$CORE_DIR" && cargo build --release -p gouide-daemon)

    # Create binaries directory
    mkdir -p "$BINARIES_DIR"

    # Determine source and destination paths
    local src_binary
    local dst_binary

    if [[ "$target_triple" == *"windows"* ]]; then
        src_binary="$CORE_DIR/target/release/gouide-daemon.exe"
        dst_binary="$BINARIES_DIR/gouide-daemon-$target_triple.exe"
    else
        src_binary="$CORE_DIR/target/release/gouide-daemon"
        dst_binary="$BINARIES_DIR/gouide-daemon-$target_triple"
    fi

    # Check if source binary exists
    if [[ ! -f "$src_binary" ]]; then
        error "Daemon binary not found at: $src_binary"
        exit 1
    fi

    # Copy the binary with target triple suffix
    info "Copying daemon to: $dst_binary"
    cp "$src_binary" "$dst_binary"

    # Make executable on Unix
    if [[ "$target_triple" != *"windows"* ]]; then
        chmod +x "$dst_binary"
    fi

    echo
    info "Sidecar prepared successfully!"
    info "Binary: $dst_binary"
    echo
    info "The daemon will be bundled with the Tauri app during build."
}

main "$@"
