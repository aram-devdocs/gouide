#!/usr/bin/env bash

# Validate every .tsx component has a .stories.tsx file
# Strict enforcement: exits with code 1 if any stories are missing

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="${PROJECT_ROOT:-$(cd "$SCRIPT_DIR/../.." && pwd)}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

UI_PACKAGE_DIR="$PROJECT_ROOT/packages/frontend/shared/ui/src"
total_components=0
total_stories=0
missing_stories=0
missing_files=()

echo "🔍 Checking for missing Storybook story files..."
echo ""

# Find all .tsx component files (excluding .stories.tsx and index.tsx)
find_components() {
    find "$UI_PACKAGE_DIR" -type f -name "*.tsx" \
        ! -name "*.stories.tsx" \
        ! -name "index.tsx" \
        2>/dev/null || true
}

# Check if story file exists for a component
check_story_exists() {
    local component_file="$1"
    local rel_path="${component_file#$PROJECT_ROOT/}"
    ((total_components++))

    local story_file="${component_file%.tsx}.stories.tsx"

    if [[ -f "$story_file" ]]; then
        ((total_stories++))
        echo -e "${GREEN}✓${NC} $rel_path"
    else
        ((missing_stories++))
        missing_files+=("$rel_path")
        echo -e "${RED}✗${NC} $rel_path ${YELLOW}(missing story file)${NC}"
    fi
}

main() {
    if [[ ! -d "$UI_PACKAGE_DIR" ]]; then
        echo -e "${RED}Error: UI package not found at $UI_PACKAGE_DIR${NC}" >&2
        exit 2
    fi

    local components
    components=$(find_components)

    if [[ -z "$components" ]]; then
        echo "No components found"
        exit 0
    fi

    while IFS= read -r component_file; do
        check_story_exists "$component_file"
    done <<< "$components"

    echo ""
    echo "═══════════════════════════════════════════"
    echo "  Story File Validation Summary"
    echo "═══════════════════════════════════════════"
    echo ""
    echo -e "Total components:        ${BLUE}$total_components${NC}"
    echo -e "Components with stories: ${GREEN}$total_stories${NC}"
    echo -e "Missing stories:         ${RED}$missing_stories${NC}"
    echo ""

    if [[ $missing_stories -eq 0 ]]; then
        echo -e "${GREEN}✓ All components have story files!${NC}"
        exit 0
    else
        echo -e "${RED}✗ Missing story files (validation failed)${NC}"
        echo ""
        echo "Missing:"
        for file in "${missing_files[@]}"; do
            story_path="${file%.tsx}.stories.tsx"
            echo -e "  ${RED}✗${NC} $story_path"
        done
        echo ""
        echo "Please create story files for all components before committing."
        exit 1
    fi
}

main "$@"
