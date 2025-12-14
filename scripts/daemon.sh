#!/usr/bin/env bash
set -euo pipefail

# Gouide Daemon Management Script
# Usage: ./scripts/daemon.sh [start|stop|restart|status|logs|pid]

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
CORE_DIR="$PROJECT_ROOT/core"

# Daemon runtime paths
RUNTIME_DIR="/tmp/gouide-$(id -u)"
LOCK_FILE="$RUNTIME_DIR/daemon.lock.json"
SOCKET_PATH="$RUNTIME_DIR/daemon.sock"
LOG_FILE="$RUNTIME_DIR/daemon.log"
PID_FILE="$RUNTIME_DIR/daemon.pid"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

info() { echo -e "${GREEN}[INFO]${NC} $1"; }
warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
error() { echo -e "${RED}[ERROR]${NC} $1"; }
header() { echo -e "${CYAN}$1${NC}"; }

get_daemon_pid() {
    if [[ -f "$LOCK_FILE" ]]; then
        # Extract pid from JSON lock file
        local pid
        pid=$(grep -o '"pid":[0-9]*' "$LOCK_FILE" 2>/dev/null | grep -o '[0-9]*' || echo "")
        if [[ -n "$pid" ]] && kill -0 "$pid" 2>/dev/null; then
            echo "$pid"
            return 0
        fi
    fi

    # Fallback: check PID file
    if [[ -f "$PID_FILE" ]]; then
        local pid
        pid=$(cat "$PID_FILE")
        if kill -0 "$pid" 2>/dev/null; then
            echo "$pid"
            return 0
        fi
    fi

    return 1
}

is_running() {
    get_daemon_pid > /dev/null 2>&1
}

cmd_start() {
    if is_running; then
        local pid
        pid=$(get_daemon_pid)
        warn "Daemon already running (PID: $pid)"
        return 0
    fi

    info "Starting gouide-daemon..."

    # Ensure runtime directory exists
    mkdir -p "$RUNTIME_DIR"

    # Build daemon if needed
    if [[ ! -f "$CORE_DIR/target/release/gouide-daemon" ]]; then
        info "Building daemon (release mode)..."
        (cd "$CORE_DIR" && cargo build --release -p gouide-daemon)
    fi

    # Start daemon in background
    nohup "$CORE_DIR/target/release/gouide-daemon" > "$LOG_FILE" 2>&1 &
    local pid=$!
    echo "$pid" > "$PID_FILE"

    # Wait for daemon to be ready
    local retries=30
    while [[ $retries -gt 0 ]]; do
        if [[ -S "$SOCKET_PATH" ]]; then
            info "Daemon started successfully (PID: $pid)"
            info "Socket: $SOCKET_PATH"
            return 0
        fi
        sleep 0.1
        ((retries--))
    done

    error "Daemon failed to start. Check logs: $LOG_FILE"
    return 1
}

cmd_stop() {
    if ! is_running; then
        warn "Daemon is not running"
        return 0
    fi

    local pid
    pid=$(get_daemon_pid)
    info "Stopping daemon (PID: $pid)..."

    # Send SIGTERM for graceful shutdown
    kill -TERM "$pid" 2>/dev/null || true

    # Wait for process to exit
    local retries=50
    while [[ $retries -gt 0 ]] && kill -0 "$pid" 2>/dev/null; do
        sleep 0.1
        ((retries--))
    done

    # Force kill if still running
    if kill -0 "$pid" 2>/dev/null; then
        warn "Daemon did not stop gracefully, sending SIGKILL..."
        kill -KILL "$pid" 2>/dev/null || true
    fi

    # Cleanup
    rm -f "$PID_FILE" "$LOCK_FILE" "$SOCKET_PATH" 2>/dev/null || true

    info "Daemon stopped"
}

cmd_restart() {
    cmd_stop
    sleep 0.5
    cmd_start
}

cmd_status() {
    header "Gouide Daemon Status"
    echo

    if is_running; then
        local pid
        pid=$(get_daemon_pid)
        echo -e "  Status:  ${GREEN}Running${NC}"
        echo "  PID:     $pid"

        if [[ -f "$LOCK_FILE" ]]; then
            echo "  Lock:    $LOCK_FILE"

            # Parse lock file for additional info
            local daemon_id socket_path protocol_version
            daemon_id=$(grep -o '"daemon_id":"[^"]*"' "$LOCK_FILE" 2>/dev/null | cut -d'"' -f4 || echo "unknown")
            socket_path=$(grep -o '"socket_path":"[^"]*"' "$LOCK_FILE" 2>/dev/null | cut -d'"' -f4 || echo "unknown")
            protocol_version=$(grep -o '"protocol_version":"[^"]*"' "$LOCK_FILE" 2>/dev/null | cut -d'"' -f4 || echo "unknown")

            echo "  ID:      ${daemon_id:0:8}..."
            echo "  Socket:  $socket_path"
            echo "  Version: $protocol_version"
        fi

        if [[ -S "$SOCKET_PATH" ]]; then
            echo -e "  Socket:  ${GREEN}Available${NC}"
        else
            echo -e "  Socket:  ${YELLOW}Not found${NC}"
        fi
    else
        echo -e "  Status:  ${RED}Stopped${NC}"
    fi

    echo
}

cmd_logs() {
    if [[ ! -f "$LOG_FILE" ]]; then
        warn "No log file found at $LOG_FILE"
        return 1
    fi

    local follow=false
    local lines=50

    while [[ $# -gt 0 ]]; do
        case $1 in
            -f|--follow)
                follow=true
                shift
                ;;
            -n|--lines)
                lines="$2"
                shift 2
                ;;
            *)
                shift
                ;;
        esac
    done

    if $follow; then
        tail -f "$LOG_FILE"
    else
        tail -n "$lines" "$LOG_FILE"
    fi
}

cmd_pid() {
    if is_running; then
        get_daemon_pid
    else
        error "Daemon is not running"
        return 1
    fi
}

cmd_dev() {
    # Run daemon in foreground with debug logging (for development)
    info "Starting daemon in development mode..."

    mkdir -p "$RUNTIME_DIR"

    (cd "$CORE_DIR" && RUST_LOG=debug cargo run -p gouide-daemon)
}

cmd_clean() {
    info "Cleaning runtime directory..."

    if is_running; then
        cmd_stop
    fi

    rm -rf "$RUNTIME_DIR"
    info "Cleaned: $RUNTIME_DIR"
}

usage() {
    cat << EOF
Gouide Daemon Management

Usage: $(basename "$0") <command> [options]

Commands:
  start       Start the daemon in background
  stop        Stop the running daemon
  restart     Restart the daemon
  status      Show daemon status
  logs        Show daemon logs
              -f, --follow    Follow log output
              -n, --lines N   Show last N lines (default: 50)
  pid         Print daemon PID
  dev         Run daemon in foreground (development mode)
  clean       Stop daemon and clean runtime files

Paths:
  Runtime:    $RUNTIME_DIR
  Lock file:  $LOCK_FILE
  Socket:     $SOCKET_PATH
  Logs:       $LOG_FILE

Examples:
  $(basename "$0") start          # Start daemon
  $(basename "$0") logs -f        # Follow logs
  $(basename "$0") status         # Check status
EOF
}

main() {
    local cmd="${1:-}"
    shift || true

    case "$cmd" in
        start)
            cmd_start
            ;;
        stop)
            cmd_stop
            ;;
        restart)
            cmd_restart
            ;;
        status)
            cmd_status
            ;;
        logs)
            cmd_logs "$@"
            ;;
        pid)
            cmd_pid
            ;;
        dev)
            cmd_dev
            ;;
        clean)
            cmd_clean
            ;;
        -h|--help|help|"")
            usage
            ;;
        *)
            error "Unknown command: $cmd"
            echo
            usage
            exit 1
            ;;
    esac
}

main "$@"
