#!/usr/bin/env bash

# Detect excessive state management in components
# Components with too many useState/useReducer hooks should
# extract state logic into custom hooks

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
MAX_STATE_HOOKS="${MAX_STATE_HOOKS:-3}"  # Maximum allowed state hooks per component

# Counters
total_violations=0
new_violations=0
violation_files=()

# Count state hooks in a file
count_state_hooks() {
    local file="$1"
    local count=0

    # Count useState
    local use_state_count
    use_state_count=$(grep -o -E 'useState\s*[<(]' "$file" 2>/dev/null | wc -l | tr -d ' ')
    count=$((count + use_state_count))

    # Count useReducer
    local use_reducer_count
    use_reducer_count=$(grep -o -E 'useReducer\s*[<(]' "$file" 2>/dev/null | wc -l | tr -d ' ')
    count=$((count + use_reducer_count))

    echo "$count"
}

# Check if file is a custom hook
is_custom_hook() {
    local file="$1"

    # Check filename pattern
    if [[ "$(basename "$file")" =~ ^use[A-Z] ]]; then
        return 0
    fi

    # Check if file is in hooks directory
    if [[ "$file" == */hooks/* ]]; then
        return 0
    fi

    # Check file content for hook export
    if grep -q -E "$CUSTOM_HOOK_PATTERN" "$file" 2>/dev/null; then
        return 0
    fi

    return 1
}

# Main validation function
validate_component_state() {
    print_header "Checking for Excessive Component State"

    # Find all component files
    local all_files=""

    # Get UI component files
    local ui_files
    ui_files=$(find_ui_component_files)
    if [[ -n "$ui_files" ]]; then
        all_files="$ui_files"
    fi

    # Get app files
    local app_files
    app_files=$(find_app_files)
    if [[ -n "$app_files" ]]; then
        if [[ -n "$all_files" ]]; then
            all_files="$all_files"$'\n'"$app_files"
        else
            all_files="$app_files"
        fi
    fi

    if [[ -z "$all_files" ]]; then
        echo -e "${YELLOW}No component files found${NC}"
        return 0
    fi

    # Check each file
    while IFS= read -r file; do
        if should_exclude_file "$file"; then
            continue
        fi

        # Skip custom hooks - they can have multiple state hooks
        if is_custom_hook "$file"; then
            continue
        fi

        # Skip service files
        if [[ "$file" == */services/* ]]; then
            continue
        fi

        # Count state hooks
        local hook_count
        hook_count=$(count_state_hooks "$file")

        if [[ "$hook_count" -gt "$MAX_STATE_HOOKS" ]]; then
            local rel_path
            rel_path=$(get_relative_path "$file")

            if should_report_violation "component-state" "$rel_path"; then
                ((new_violations++))
            fi

            ((total_violations++))
            violation_files+=("$rel_path")

            # Find first state hook for line number
            local first_hook_line
            first_hook_line=$(grep -n -E "$STATE_HOOK_PATTERN" "$file" 2>/dev/null | head -1 | cut -d: -f1)

            format_violation \
                "$rel_path" \
                "${first_hook_line:-1}" \
                "Component has $hook_count state hooks (max: $MAX_STATE_HOOKS)" \
                "Extract state management logic into a custom hook in hooks/"
        fi
    done <<< "$all_files"

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

    # Remove duplicates from violation_files
    local unique_files
    unique_files=$(printf '%s\n' "${violation_files[@]}" | sort -u)

    baseline_data=$(echo "$baseline_data" | jq \
        --arg timestamp "$timestamp" \
        --arg count "$total_violations" \
        --argjson files "$(echo "$unique_files" | jq -R . | jq -s .)" \
        '.updated = $timestamp |
         .checks["component-state"] = {
           count: ($count | tonumber),
           files: $files
         }')

    echo "$baseline_data" > "$BASELINE_FILE"
    echo -e "${GREEN}Baseline updated:${NC} $BASELINE_FILE"
}

# Main execution
main() {
    check_dependencies grep find

    validate_component_state

    print_summary "Component State Complexity" "$total_violations" "$new_violations"

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
