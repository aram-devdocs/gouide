#!/usr/bin/env bash
# install-deps.sh - Install development dependencies for Gouide
# Works on Linux, macOS, and Windows (Git Bash/WSL)

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

info() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; exit 1; }

# Detect OS
detect_os() {
    case "$(uname -s)" in
        Linux*)     OS="linux";;
        Darwin*)    OS="macos";;
        CYGWIN*|MINGW*|MSYS*) OS="windows";;
        *)          OS="unknown";;
    esac
    echo "$OS"
}

# Detect Linux package manager
detect_linux_pm() {
    if command -v apt-get &> /dev/null; then
        echo "apt"
    elif command -v dnf &> /dev/null; then
        echo "dnf"
    elif command -v yum &> /dev/null; then
        echo "yum"
    elif command -v pacman &> /dev/null; then
        echo "pacman"
    elif command -v apk &> /dev/null; then
        echo "apk"
    else
        echo "unknown"
    fi
}

# Check if a command exists
has_cmd() {
    command -v "$1" &> /dev/null
}

# Install protoc
install_protoc() {
    if has_cmd protoc; then
        local version=$(protoc --version | cut -d' ' -f2)
        info "protoc already installed (version $version)"
        return 0
    fi

    info "Installing protoc (Protocol Buffers compiler)..."

    case "$OS" in
        linux)
            local pm=$(detect_linux_pm)
            case "$pm" in
                apt)
                    sudo apt-get update
                    sudo apt-get install -y protobuf-compiler
                    ;;
                dnf)
                    sudo dnf install -y protobuf-compiler
                    ;;
                yum)
                    sudo yum install -y protobuf-compiler
                    ;;
                pacman)
                    sudo pacman -S --noconfirm protobuf
                    ;;
                apk)
                    sudo apk add protobuf
                    ;;
                *)
                    install_protoc_binary
                    ;;
            esac
            ;;
        macos)
            if has_cmd brew; then
                brew install protobuf
            else
                warn "Homebrew not found. Installing protoc from binary..."
                install_protoc_binary
            fi
            ;;
        windows)
            if has_cmd choco; then
                choco install protoc -y
            elif has_cmd winget; then
                winget install Google.Protobuf
            else
                install_protoc_binary
            fi
            ;;
        *)
            install_protoc_binary
            ;;
    esac

    # Verify installation
    if has_cmd protoc; then
        info "protoc installed successfully: $(protoc --version)"
    else
        error "Failed to install protoc"
    fi
}

# Install protoc from GitHub releases (fallback)
install_protoc_binary() {
    local version="27.3"
    local arch=$(uname -m)
    local os_name

    case "$OS" in
        linux)
            os_name="linux"
            case "$arch" in
                x86_64) arch="x86_64";;
                aarch64|arm64) arch="aarch_64";;
                *) error "Unsupported architecture: $arch";;
            esac
            ;;
        macos)
            os_name="osx"
            case "$arch" in
                x86_64) arch="x86_64";;
                arm64) arch="aarch_64";;
                *) error "Unsupported architecture: $arch";;
            esac
            ;;
        windows)
            os_name="win64"
            arch=""
            ;;
        *)
            error "Unsupported OS for binary installation"
            ;;
    esac

    local filename="protoc-${version}-${os_name}-${arch}.zip"
    if [ "$OS" = "windows" ]; then
        filename="protoc-${version}-${os_name}.zip"
    fi

    local url="https://github.com/protocolbuffers/protobuf/releases/download/v${version}/${filename}"
    local install_dir="${HOME}/.local"
    local tmp_dir=$(mktemp -d)

    info "Downloading protoc v${version} from GitHub..."

    if has_cmd curl; then
        curl -fsSL "$url" -o "${tmp_dir}/protoc.zip"
    elif has_cmd wget; then
        wget -q "$url" -O "${tmp_dir}/protoc.zip"
    else
        error "Neither curl nor wget found. Please install one of them."
    fi

    info "Extracting to ${install_dir}..."
    mkdir -p "$install_dir"
    unzip -q -o "${tmp_dir}/protoc.zip" -d "$install_dir"
    rm -rf "$tmp_dir"

    # Add to PATH if not already there
    if [[ ":$PATH:" != *":${install_dir}/bin:"* ]]; then
        warn "Add ${install_dir}/bin to your PATH:"
        echo "  export PATH=\"\${HOME}/.local/bin:\${PATH}\""
        export PATH="${install_dir}/bin:${PATH}"
    fi
}

# Install Rust toolchain
install_rust() {
    if has_cmd rustc; then
        local version=$(rustc --version | cut -d' ' -f2)
        info "Rust already installed (version $version)"
        return 0
    fi

    info "Installing Rust toolchain..."
    curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
    source "${HOME}/.cargo/env"
    info "Rust installed: $(rustc --version)"
}

# Install Node.js and pnpm
install_node() {
    if has_cmd node; then
        local version=$(node --version)
        info "Node.js already installed (version $version)"
    else
        warn "Node.js not found. Please install Node.js 20+ from https://nodejs.org"
    fi

    if has_cmd pnpm; then
        local version=$(pnpm --version)
        info "pnpm already installed (version $version)"
    else
        if has_cmd corepack; then
            info "Installing pnpm via corepack..."
            corepack enable
            corepack prepare pnpm@latest --activate
        elif has_cmd npm; then
            info "Installing pnpm via npm..."
            npm install -g pnpm
        else
            warn "pnpm not found. Install via: npm install -g pnpm"
        fi
    fi
}

# Main
main() {
    echo "=================================="
    echo "  Gouide Development Setup"
    echo "=================================="
    echo

    OS=$(detect_os)
    info "Detected OS: $OS"
    echo

    # Install dependencies
    install_protoc
    echo

    install_rust
    echo

    install_node
    echo

    echo "=================================="
    info "Setup complete!"
    echo
    echo "Next steps:"
    echo "  1. cd $(dirname "$0")/.."
    echo "  2. pnpm install"
    echo "  3. pnpm codegen"
    echo "  4. cargo build -p gouide-protocol"
    echo "=================================="
}

# Run if executed directly (not sourced)
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
