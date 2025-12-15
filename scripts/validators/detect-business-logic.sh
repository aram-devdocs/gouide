#!/usr/bin/env bash

# Detect business logic in component files
# Components should not contain:
# - Direct fetch/axios calls
# - File system operations
# - Complex business logic
# These should be in hooks/ or services/

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

# Check for API calls in component
check_api_calls() {
    local file="$1"
    local violations=0

    # Check for fetch calls
    local fetch_calls
    fetch_calls=$(grep -n -E "$FETCH_PATTERN" "$file" 2>/dev/null || true)

    if [[ -n "$fetch_calls" ]]; then
        local rel_path
        rel_path=$(get_relative_path "$file")

        if should_report_violation "business-logic" "$rel_path"; then
            ((new_violations++))
        fi

        ((total_violations++))
        ((violations++))

        while IFS=: read -r line_num line_content; do
            format_violation \
                "$rel_path" \
                "$line_num" \
                "Direct fetch() call in component" \
                "Move API calls to custom hooks in hooks/ or services/"
        done <<< "$fetch_calls"
    fi

    # Check for axios calls
    local axios_calls
    axios_calls=$(grep -n -E "$AXIOS_PATTERN" "$file" 2>/dev/null || true)

    if [[ -n "$axios_calls" ]]; then
        local rel_path
        rel_path=$(get_relative_path "$file")

        if [[ "$violations" -eq 0 ]]; then
            if should_report_violation "business-logic" "$rel_path"; then
                ((new_violations++))
            fi
        fi

        ((total_violations++))
        ((violations++))

        while IFS=: read -r line_num line_content; do
            format_violation \
                "$rel_path" \
                "$line_num" \
                "Direct axios call in component" \
                "Move API calls to custom hooks in hooks/ or services/"
        done <<< "$axios_calls"
    fi

    if [[ "$violations" -gt 0 ]]; then
        local rel_path
        rel_path=$(get_relative_path "$file")
        violation_files+=("$rel_path")
    fi

    return 0
}

# Check for file system operations in component
check_fs_operations() {
    local file="$1"
    local violations=0

    # Check for fs operations
    local fs_calls
    fs_calls=$(grep -n -E "$FS_PATTERN" "$file" 2>/dev/null || true)

    if [[ -n "$fs_calls" ]]; then
        local rel_path
        rel_path=$(get_relative_path "$file")

        if should_report_violation "business-logic" "$rel_path"; then
            ((new_violations++))
        fi

        ((total_violations++))
        ((violations++))

        while IFS=: read -r line_num line_content; do
            format_violation \
                "$rel_path" \
                "$line_num" \
                "File system operation in component" \
                "Move file operations to services/ or backend API"
        done <<< "$fs_calls"
    fi

    if [[ "$violations" -gt 0 ]]; then
        local rel_path
        rel_path=$(get_relative_path "$file")
        violation_files+=("$rel_path")
    fi

    return 0
}

# Main validation function
validate_business_logic() {
    print_header "Checking for Business Logic in Components"

    # Find all component files, excluding hooks and services
    local component_files
    component_files=$(find_ui_component_files)

    if [[ -z "$component_files" ]]; then
        echo -e "${YELLOW}No UI component files found${NC}"
    else
        echo -e "${BLUE}Checking UI component files...${NC}"
        while IFS= read -r file; do
            if should_exclude_file "$file"; then
                continue
            fi

            # Skip hooks and services directories
            if [[ "$file" == */hooks/* ]] || [[ "$file" == */services/* ]]; then
                continue
            fi

            check_api_calls "$file"
            check_fs_operations "$file"
        done <<< "$component_files"
    fi

    # Check app files
    local app_files
    app_files=$(find_app_files)

    if [[ -z "$app_files" ]]; then
        echo -e "${YELLOW}No application files found${NC}"
    else
        echo -e "${BLUE}Checking application files...${NC}"
        while IFS= read -r file; do
            if should_exclude_file "$file"; then
                continue
            fi

            # Skip hooks and services directories
            if [[ "$file" == */hooks/* ]] || [[ "$file" == */services/* ]]; then
                continue
            fi

            check_api_calls "$file"
            check_fs_operations "$file"
        done <<< "$app_files"
    fi

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
         .checks["business-logic"] = {
           count: ($count | tonumber),
           files: $files
         }')

    echo "$baseline_data" > "$BASELINE_FILE"
    echo -e "${GREEN}Baseline updated:${NC} $BASELINE_FILE"
}

# Main execution
main() {
    check_dependencies grep find

    validate_business_logic

    print_summary "Business Logic Detection" "$total_violations" "$new_violations"

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
