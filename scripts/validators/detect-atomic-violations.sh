#!/usr/bin/env bash

# Detect atomic design pattern violations
# - Apps should not import from /atoms/ or /molecules/ paths directly
# - Molecules/organisms should not import from primitives
# - All imports should go through package root or use templates

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

# Check for direct atom/molecule imports in apps
check_app_imports() {
    local file="$1"
    local violations=0

    # Check for direct atom imports
    local atom_imports
    atom_imports=$(grep -n -E "$ATOM_IMPORT_PATTERN" "$file" 2>/dev/null || true)

    if [[ -n "$atom_imports" ]]; then
        local rel_path
        rel_path=$(get_relative_path "$file")

        if should_report_violation "atomic-violations" "$rel_path"; then
            ((new_violations++))
        fi

        ((total_violations++))
        ((violations++))

        while IFS=: read -r line_num line_content; do
            format_violation \
                "$rel_path" \
                "$line_num" \
                "Direct import from atoms directory" \
                "Import from @gouide/frontend-ui root package or use template components"
        done <<< "$atom_imports"
    fi

    # Check for direct molecule imports
    local molecule_imports
    molecule_imports=$(grep -n -E "$MOLECULE_IMPORT_PATTERN" "$file" 2>/dev/null || true)

    if [[ -n "$molecule_imports" ]]; then
        local rel_path
        rel_path=$(get_relative_path "$file")

        if [[ "$violations" -eq 0 ]]; then
            if should_report_violation "atomic-violations" "$rel_path"; then
                ((new_violations++))
            fi
        fi

        ((total_violations++))
        ((violations++))

        while IFS=: read -r line_num line_content; do
            format_violation \
                "$rel_path" \
                "$line_num" \
                "Direct import from molecules directory" \
                "Import from @gouide/frontend-ui root package or use template components"
        done <<< "$molecule_imports"
    fi

    if [[ "$violations" -gt 0 ]]; then
        local rel_path
        rel_path=$(get_relative_path "$file")
        violation_files+=("$rel_path")
    fi

    return 0
}

# Check for primitive imports in molecules/organisms
check_component_imports() {
    local file="$1"
    local component_type="$2"  # molecule or organism
    local violations=0

    # Check for primitive imports
    local primitive_imports
    primitive_imports=$(grep -n -E "$PRIMITIVE_IMPORT_PATTERN" "$file" 2>/dev/null || true)

    if [[ -n "$primitive_imports" ]]; then
        local rel_path
        rel_path=$(get_relative_path "$file")

        if should_report_violation "atomic-violations" "$rel_path"; then
            ((new_violations++))
        fi

        ((total_violations++))
        ((violations++))

        while IFS=: read -r line_num line_content; do
            format_violation \
                "$rel_path" \
                "$line_num" \
                "Direct import from primitives in $component_type" \
                "Use atoms that wrap primitives or import from package root"
        done <<< "$primitive_imports"
    fi

    if [[ "$violations" -gt 0 ]]; then
        local rel_path
        rel_path=$(get_relative_path "$file")
        violation_files+=("$rel_path")
    fi

    return 0
}

# Main validation function
validate_atomic_patterns() {
    print_header "Checking for Atomic Design Pattern Violations"

    # Check app files
    echo -e "${BLUE}Checking application files...${NC}"
    local app_files
    app_files=$(find_app_files)

    if [[ -n "$app_files" ]]; then
        while IFS= read -r file; do
            if should_exclude_file "$file"; then
                continue
            fi
            check_app_imports "$file"
        done <<< "$app_files"
    fi

    # Check molecule files
    echo -e "${BLUE}Checking molecule components...${NC}"
    local molecule_files
    molecule_files=$(find_molecule_files)

    if [[ -n "$molecule_files" ]]; then
        while IFS= read -r file; do
            if should_exclude_file "$file"; then
                continue
            fi
            check_component_imports "$file" "molecule"
        done <<< "$molecule_files"
    fi

    # Check organism files
    echo -e "${BLUE}Checking organism components...${NC}"
    local organism_files
    organism_files=$(find_organism_files)

    if [[ -n "$organism_files" ]]; then
        while IFS= read -r file; do
            if should_exclude_file "$file"; then
                continue
            fi
            check_component_imports "$file" "organism"
        done <<< "$organism_files"
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
         .checks["atomic-violations"] = {
           count: ($count | tonumber),
           files: $files
         }')

    echo "$baseline_data" > "$BASELINE_FILE"
    echo -e "${GREEN}Baseline updated:${NC} $BASELINE_FILE"
}

# Main execution
main() {
    check_dependencies grep find

    validate_atomic_patterns

    print_summary "Atomic Design Pattern Validation" "$total_violations" "$new_violations"

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
