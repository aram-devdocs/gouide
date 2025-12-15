#!/usr/bin/env bash
set -euo pipefail

# Gouide - System Dependencies Installer
# Installs required system packages for building Tauri desktop app

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        if command -v apt-get &> /dev/null; then
            echo "debian"
        elif command -v dnf &> /dev/null; then
            echo "fedora"
        elif command -v pacman &> /dev/null; then
            echo "arch"
        else
            echo "linux-unknown"
        fi
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "macos"
    else
        echo "unknown"
    fi
}

install_debian() {
    info "Installing dependencies for Debian/Ubuntu..."
    sudo apt-get update
    sudo apt-get install -y \
        build-essential \
        pkg-config \
        libgtk-3-dev \
        libwebkit2gtk-4.1-dev \
        libjavascriptcoregtk-4.1-dev \
        librsvg2-dev \
        libssl-dev \
        protobuf-compiler \
        curl \
        wget \
        file
}

install_fedora() {
    info "Installing dependencies for Fedora..."
    sudo dnf install -y \
        @development-tools \
        pkg-config \
        gtk3-devel \
        webkit2gtk4.1-devel \
        javascriptcoregtk4.1-devel \
        librsvg2-devel \
        openssl-devel \
        protobuf-compiler \
        curl \
        wget \
        file
}

install_arch() {
    info "Installing dependencies for Arch Linux..."
    sudo pacman -Syu --noconfirm \
        base-devel \
        pkg-config \
        gtk3 \
        webkit2gtk-4.1 \
        librsvg \
        openssl \
        protobuf \
        curl \
        wget \
        file
}

install_macos() {
    info "Installing dependencies for macOS..."
    if ! command -v brew &> /dev/null; then
        error "Homebrew is required. Install from https://brew.sh"
    fi
    # macOS has most deps built-in, just need Xcode CLI tools
    if ! xcode-select -p &> /dev/null; then
        info "Installing Xcode Command Line Tools..."
        xcode-select --install
    else
        info "Xcode Command Line Tools already installed"
    fi
    # Install protobuf compiler (required for Rust protocol codegen)
    if ! command -v protoc &> /dev/null; then
        info "Installing protobuf..."
        brew install protobuf
    else
        info "protobuf already installed: $(protoc --version)"
    fi
}

install_rust() {
    if command -v rustc &> /dev/null; then
        info "Rust already installed: $(rustc --version)"
    else
        info "Installing Rust..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source "$HOME/.cargo/env"
    fi
}

install_node() {
    if command -v node &> /dev/null; then
        info "Node.js already installed: $(node --version)"
    else
        warn "Node.js not found. Please install Node.js 20+ from https://nodejs.org"
    fi
}

install_pnpm() {
    if command -v pnpm &> /dev/null; then
        info "pnpm already installed: $(pnpm --version)"
    else
        info "Installing pnpm..."
        npm install -g pnpm@9
    fi
}

main() {
    echo "========================================"
    echo "  Gouide - System Dependencies Setup"
    echo "========================================"
    echo

    OS=$(detect_os)
    info "Detected OS: $OS"

    case $OS in
        debian)
            install_debian
            ;;
        fedora)
            install_fedora
            ;;
        arch)
            install_arch
            ;;
        macos)
            install_macos
            ;;
        *)
            error "Unsupported OS: $OS. Please install dependencies manually."
            ;;
    esac

    install_rust
    install_node
    install_pnpm

    echo
    info "System dependencies installed successfully!"
    echo
    echo "Next steps:"
    echo "  1. cd $(dirname "$0")/.."
    echo "  2. pnpm install"
    echo "  3. ./scripts/daemon.sh start"
    echo "  4. pnpm --filter @gouide/desktop tauri dev"
}

main "$@"
