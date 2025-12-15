#!/usr/bin/env bash

# Color codes for output
RED='\033[0;31m'
YELLOW='\033[1;33m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Format and print a violation message
# Usage: format_violation <file> <line> <message> <suggestion>
format_violation() {
    local file="$1"
    local line="$2"
    local message="$3"
    local suggestion="$4"

    echo -e "${RED}✗${NC} ${BLUE}${file}${NC}:${line}"
    echo -e "  ${message}"
    if [[ -n "$suggestion" ]]; then
        echo -e "  ${YELLOW}→${NC} ${suggestion}"
    fi
    echo ""
}

# Check if a violation should be reported based on baseline
# Usage: should_report_violation <check_name> <file>
# Returns: 0 if should report, 1 if in baseline
should_report_violation() {
    local check_name="$1"
    local file="$2"
    local baseline_file="${BASELINE_FILE:-}"

    # If no baseline file or updating baseline, always report
    if [[ -z "$baseline_file" ]] || [[ ! -f "$baseline_file" ]] || [[ "${UPDATE_BASELINE:-false}" == "true" ]]; then
        return 0
    fi

    # Check if file exists in baseline for this check
    if command -v jq >/dev/null 2>&1; then
        local in_baseline=$(jq -r --arg check "$check_name" --arg file "$file" \
            '.checks[$check].files | index($file) != null' "$baseline_file" 2>/dev/null)

        if [[ "$in_baseline" == "true" ]]; then
            return 1
        fi
    fi

    return 0
}

# Print summary statistics
# Usage: print_summary <check_name> <total_violations> <new_violations>
print_summary() {
    local check_name="$1"
    local total_violations="$2"
    local new_violations="$3"

    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}${check_name} Summary${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

    if [[ "$total_violations" -eq 0 ]]; then
        echo -e "${GREEN}✓${NC} No violations found"
    else
        echo -e "${YELLOW}Total violations:${NC} $total_violations"
        if [[ -n "$new_violations" ]] && [[ "$new_violations" != "$total_violations" ]]; then
            echo -e "${YELLOW}New violations:${NC} $new_violations"
            echo -e "${BLUE}Baseline violations:${NC} $((total_violations - new_violations))"
        fi
    fi

    echo ""
}

# Print a header for a validation check
# Usage: print_header <title>
print_header() {
    local title="$1"
    echo ""
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${BLUE}${title}${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
}

# Check if required commands are available
# Usage: check_dependencies cmd1 cmd2 ...
check_dependencies() {
    local missing=()

    for cmd in "$@"; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            missing+=("$cmd")
        fi
    done

    if [[ ${#missing[@]} -gt 0 ]]; then
        echo -e "${RED}Error: Missing required commands:${NC} ${missing[*]}" >&2
        return 1
    fi

    return 0
}

# Get relative path from project root
# Usage: get_relative_path <absolute_path>
get_relative_path() {
    local abs_path="$1"
    local project_root="${PROJECT_ROOT:-$(pwd)}"

    echo "${abs_path#$project_root/}"
}
