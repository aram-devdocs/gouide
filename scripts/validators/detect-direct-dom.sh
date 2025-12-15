#!/usr/bin/env bash

# Detect direct DOM element usage in application code
# Apps should use components from @gouide/frontend-ui instead

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${PROJECT_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# Source libraries
source "$SCRIPT_DIR/lib/common.sh"
source "$SCRIPT_DIR/lib/patterns.sh"
source "$SCRIPT_DIR/lib/file-lists.sh"

# Configuration
STRICT_MODE="${STRICT_MODE:-false}"
BASELINE_FILE="${BASELINE_FILE:-$SCRIPT_DIR/../.validation-baseline.json}"
UPDATE_BASELINE="${UPDATE_BASELINE:-false}"

# Counters
total_violations=0
new_violations=0
violation_files=()

# Main validation function
validate_direct_dom() {
    print_header "Checking for Direct DOM Element Usage"

    # Find all app files
    local app_files
    app_files=$(find_app_files)

    if [[ -z "$app_files" ]]; then
        echo -e "${YELLOW}No application files found${NC}"
        return 0
    fi

    # Check each file for direct DOM usage
    while IFS= read -r file; do
        if should_exclude_file "$file"; then
            continue
        fi

        # Skip if file is in atoms directory (atoms can use DOM elements)
        if [[ "$file" == */atoms/* ]]; then
            continue
        fi

        # Search for DOM element patterns
        local matches
        matches=$(grep -n -E "$DOM_ELEMENT_PATTERN" "$file" 2>/dev/null || true)

        if [[ -n "$matches" ]]; then
            local rel_path
            rel_path=$(get_relative_path "$file")

            # Check if this is a new violation
            if should_report_violation "direct-dom" "$rel_path"; then
                ((new_violations++))
            fi

            ((total_violations++))
            violation_files+=("$rel_path")

            # Parse and format violations
            while IFS=: read -r line_num line_content; do
                format_violation \
                    "$rel_path" \
                    "$line_num" \
                    "Direct DOM element usage detected" \
                    "Use components from @gouide/frontend-ui instead of raw HTML elements"
            done <<< "$matches"
        fi
    done <<< "$app_files"

    return 0
}

# Update baseline if requested
update_baseline() {
    if [[ "$UPDATE_BASELINE" != "true" ]]; then
        return
    fi

    if ! command -v jq >/dev/null 2>&1; then
        echo -e "${YELLOW}Warning: jq not found, cannot update baseline${NC}" >&2
        return
    fi

    local timestamp
    timestamp=$(date -u +"%Y-%m-%dT%H:%M:%SZ")

    # Create or update baseline
    local baseline_data
    if [[ -f "$BASELINE_FILE" ]]; then
        baseline_data=$(cat "$BASELINE_FILE")
    else
        baseline_data='{"version":"1.0.0","checks":{}}'
    fi

    baseline_data=$(echo "$baseline_data" | jq \
        --arg timestamp "$timestamp" \
        --arg count "$total_violations" \
        --argjson files "$(printf '%s\n' "${violation_files[@]}" | jq -R . | jq -s .)" \
        '.updated = $timestamp |
         .checks["direct-dom"] = {
           count: ($count | tonumber),
           files: $files
         }')

    echo "$baseline_data" > "$BASELINE_FILE"
    echo -e "${GREEN}Baseline updated:${NC} $BASELINE_FILE"
}

# Main execution
main() {
    check_dependencies grep find

    validate_direct_dom

    print_summary "Direct DOM Element Detection" "$total_violations" "$new_violations"

    update_baseline

    # Exit code
    if [[ "$STRICT_MODE" == "true" ]] && [[ "$new_violations" -gt 0 ]]; then
        exit 1
    fi

    if [[ "$total_violations" -gt 0 ]]; then
        exit 1
    fi

    exit 0
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
