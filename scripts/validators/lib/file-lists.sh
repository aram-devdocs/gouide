#!/usr/bin/env bash

# File discovery functions for validation

# Source patterns if not already loaded
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
if [[ -z "$EXCLUDE_PATHS" ]]; then
    source "$SCRIPT_DIR/patterns.sh"
fi

# Find all TypeScript/JavaScript files in a directory
# Usage: find_ts_files <directory>
find_ts_files() {
    local dir="$1"
    local project_root="${PROJECT_ROOT:-$(pwd)}"

    if [[ ! -d "$project_root/$dir" ]]; then
        return
    fi

    find "$project_root/$dir" -type f \
        \( -name "*.ts" -o -name "*.tsx" -o -name "*.js" -o -name "*.jsx" \) \
        ! -path "*/node_modules/*" \
        ! -path "*/dist/*" \
        ! -path "*/build/*" \
        ! -path "*/.turbo/*" \
        ! -path "*/.next/*" \
        ! -path "*/coverage/*" \
        2>/dev/null
}

# Find all React component files (tsx/jsx only)
# Usage: find_component_files <directory>
find_component_files() {
    local dir="$1"
    local project_root="${PROJECT_ROOT:-$(pwd)}"

    if [[ ! -d "$project_root/$dir" ]]; then
        return
    fi

    find "$project_root/$dir" -type f \
        \( -name "*.tsx" -o -name "*.jsx" \) \
        ! -path "*/node_modules/*" \
        ! -path "*/dist/*" \
        ! -path "*/build/*" \
        ! -path "*/.turbo/*" \
        ! -path "*/.next/*" \
        ! -path "*/coverage/*" \
        ! -name "*.test.*" \
        ! -name "*.spec.*" \
        2>/dev/null
}

# Find files in apps/ directory
find_app_files() {
    find_component_files "apps"
}

# Find files in packages/frontend-ui/src/components
find_ui_component_files() {
    find_component_files "packages/frontend-ui/src/components"
}

# Find atom component files
find_atom_files() {
    local project_root="${PROJECT_ROOT:-$(pwd)}"
    find "$project_root/packages/frontend-ui/src/atoms" -type f \
        \( -name "*.tsx" -o -name "*.jsx" \) \
        ! -path "*/node_modules/*" \
        2>/dev/null || true
}

# Find molecule component files
find_molecule_files() {
    local project_root="${PROJECT_ROOT:-$(pwd)}"
    find "$project_root/packages/frontend-ui/src/molecules" -type f \
        \( -name "*.tsx" -o -name "*.jsx" \) \
        ! -path "*/node_modules/*" \
        2>/dev/null || true
}

# Find organism component files
find_organism_files() {
    local project_root="${PROJECT_ROOT:-$(pwd)}"
    find "$project_root/packages/frontend-ui/src/organisms" -type f \
        \( -name "*.tsx" -o -name "*.jsx" \) \
        ! -path "*/node_modules/*" \
        2>/dev/null || true
}

# Find template component files
find_template_files() {
    local project_root="${PROJECT_ROOT:-$(pwd)}"
    find "$project_root/packages/frontend-ui/src/templates" -type f \
        \( -name "*.tsx" -o -name "*.jsx" \) \
        ! -path "*/node_modules/*" \
        2>/dev/null || true
}

# Find hook files
find_hook_files() {
    local project_root="${PROJECT_ROOT:-$(pwd)}"
    find "$project_root" -type f \
        \( -name "*.ts" -o -name "*.tsx" \) \
        -path "*/hooks/*" \
        ! -path "*/node_modules/*" \
        ! -path "*/dist/*" \
        2>/dev/null || true
}

# Find service files
find_service_files() {
    local project_root="${PROJECT_ROOT:-$(pwd)}"
    find "$project_root" -type f \
        \( -name "*.ts" -o -name "*.tsx" \) \
        -path "*/services/*" \
        ! -path "*/node_modules/*" \
        ! -path "*/dist/*" \
        2>/dev/null || true
}

# Check if a file should be excluded from validation
# Usage: should_exclude_file <file_path>
should_exclude_file() {
    local file="$1"

    # Check against exclude patterns
    for pattern in "${EXCLUDE_PATHS[@]}"; do
        if [[ "$file" == *"$pattern"* ]]; then
            return 0  # Should exclude
        fi
    done

    # Exclude test files
    if [[ "$file" == *.test.* ]] || [[ "$file" == *.spec.* ]]; then
        return 0
    fi

    return 1  # Should not exclude
}

# Get all files for a specific atomic layer
# Usage: get_atomic_layer_files <layer>
# layer can be: atoms, molecules, organisms, templates
get_atomic_layer_files() {
    local layer="$1"

    case "$layer" in
        atoms)
            find_atom_files
            ;;
        molecules)
            find_molecule_files
            ;;
        organisms)
            find_organism_files
            ;;
        templates)
            find_template_files
            ;;
        *)
            echo "Unknown atomic layer: $layer" >&2
            return 1
            ;;
    esac
}
