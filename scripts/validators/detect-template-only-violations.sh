#!/usr/bin/env bash

# Detect template-only architecture violations
# STRICT MODE: Apps can ONLY import templates from @gouide/frontend-ui
# - No atom imports (Box, Button, Text, etc.)
# - No molecule imports (FormField, SearchBar, etc.)
# - No organism imports (FileTreePanel, NavBar, etc.)
# - Only template imports (AppShell, SidebarTemplate, etc.)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${PROJECT_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# Source libraries
source "$SCRIPT_DIR/lib/common.sh"
source "$SCRIPT_DIR/lib/patterns.sh"
source "$SCRIPT_DIR/lib/file-lists.sh"

# Configuration
STRICT_MODE="${STRICT_MODE:-true}"
BASELINE_FILE="${BASELINE_FILE:-$SCRIPT_DIR/../.validation-baseline.json}"
UPDATE_BASELINE="${UPDATE_BASELINE:-false}"

# Counters
total_violations=0
new_violations=0
violation_files=()

echo "🔍 Checking for template-only architecture violations..."
echo

# Check for non-template imports from UI package
check_template_only() {
    local file="$1"
    local violations=0
    local rel_path
    rel_path=$(get_relative_path "$file")

    # Check for path imports (atoms, molecules, organisms directories)
    local path_imports
    path_imports=$(grep -n -E "from [\"']@gouide/frontend-ui/(atoms|molecules|organisms|src/atoms|src/molecules|src/organisms)" "$file" 2>/dev/null || true)

    if [[ -n "$path_imports" ]]; then
        if should_report_violation "template-only-violations" "$rel_path"; then
            ((new_violations++))
        fi

        ((total_violations++))
        ((violations++))

        while IFS=: read -r line_num line_content; do
            format_violation \
                "$rel_path" \
                "$line_num" \
                "Direct path import from UI package (atoms/molecules/organisms)" \
                "Apps can ONLY import templates from @gouide/frontend-ui package root"
        done <<< "$path_imports"
    fi

    # Check for named atom imports from package root
    local atom_imports
    atom_imports=$(grep -n -E "import.*\{.*${NON_TEMPLATE_ATOMS}.*\}.*from [\"']@gouide/frontend-ui[\"']" "$file" 2>/dev/null || true)

    if [[ -n "$atom_imports" ]]; then
        if [[ "$violations" -eq 0 ]]; then
            if should_report_violation "template-only-violations" "$rel_path"; then
                ((new_violations++))
            fi
        fi

        ((total_violations++))
        ((violations++))

        while IFS=: read -r line_num line_content; do
            format_violation \
                "$rel_path" \
                "$line_num" \
                "Import of atom components (Box, Button, Text, etc.) from UI package" \
                "Apps can ONLY import templates (AppShell, SidebarTemplate, etc.), not atoms"
        done <<< "$atom_imports"
    fi

    # Check for named molecule imports from package root
    local molecule_imports
    molecule_imports=$(grep -n -E "import.*\{.*${NON_TEMPLATE_MOLECULES}.*\}.*from [\"']@gouide/frontend-ui[\"']" "$file" 2>/dev/null || true)

    if [[ -n "$molecule_imports" ]]; then
        if [[ "$violations" -eq 0 ]]; then
            if should_report_violation "template-only-violations" "$rel_path"; then
                ((new_violations++))
            fi
        fi

        ((total_violations++))
        ((violations++))

        while IFS=: read -r line_num line_content; do
            format_violation \
                "$rel_path" \
                "$line_num" \
                "Import of molecule components (FormField, SearchBar, etc.) from UI package" \
                "Apps can ONLY import templates (AppShell, SidebarTemplate, etc.), not molecules"
        done <<< "$molecule_imports"
    fi

    # Check for named organism imports from package root
    local organism_imports
    organism_imports=$(grep -n -E "import.*\{.*${NON_TEMPLATE_ORGANISMS}.*\}.*from [\"']@gouide/frontend-ui[\"']" "$file" 2>/dev/null || true)

    if [[ -n "$organism_imports" ]]; then
        if [[ "$violations" -eq 0 ]]; then
            if should_report_violation "template-only-violations" "$rel_path"; then
                ((new_violations++))
            fi
        fi

        ((total_violations++))
        ((violations++))

        while IFS=: read -r line_num line_content; do
            format_violation \
                "$rel_path" \
                "$line_num" \
                "Import of organism components (FileTreePanel, NavBar, etc.) from UI package" \
                "Apps can ONLY import templates (AppShell, SidebarTemplate, etc.), not organisms"
        done <<< "$organism_imports"
    fi

    # Track files with violations
    if [[ "$violations" -gt 0 ]]; then
        violation_files+=("$rel_path")
    fi

    return 0
}

# Main execution
main() {
    local app_files
    app_files=$(find_app_files)

    if [[ -z "$app_files" ]]; then
        echo "✅ No app files found to check"
        exit 0
    fi

    while IFS= read -r file; do
        check_template_only "$file"
    done <<< "$app_files"

    echo
    print_summary "Template-Only Architecture Enforcement" "$total_violations" "$new_violations"

    # Update baseline if requested
    if [[ "$UPDATE_BASELINE" == "true" ]] && [[ ${#violation_files[@]} -gt 0 ]]; then
        update_baseline "template-only" "$total_violations" "${violation_files[@]}"
    elif [[ "$UPDATE_BASELINE" == "true" ]]; then
        update_baseline "template-only" "$total_violations"
    fi

    # Exit with error in strict mode if violations found
    if [[ "$STRICT_MODE" == "true" ]] && [[ "$total_violations" -gt 0 ]]; then
        echo
        echo "❌ Template-only violations found in strict mode"
        echo "   Apps can ONLY import templates from @gouide/frontend-ui"
        echo "   Allowed: AppShell, SidebarTemplate, EditorAreaTemplate, etc."
        echo "   Blocked: Box, Button, Text, FileTreePanel, NavBar, etc."
        exit 1
    fi

    exit 0
}

main "$@"
