#!/usr/bin/env bash

# Pattern definitions for validation checks

# DOM element patterns - detect direct DOM usage in components
DOM_ELEMENT_PATTERN='<(div|span|button|input|textarea|select|form|p|h[1-6]|ul|ol|li|a|nav|header|footer|section|article|main|aside)[^a-zA-Z]'

# Fetch patterns - detect API calls in components
FETCH_PATTERN='\bfetch\s*\('
AXIOS_PATTERN='\baxios\.(get|post|put|delete|patch|request)'

# File system patterns - detect file operations in components
FS_PATTERN='\b(fs\.|readFile|writeFile|existsSync|mkdirSync)'

# State hook patterns - detect useState/useReducer usage
STATE_HOOK_PATTERN='use(State|Reducer)\s*[<(]'

# Import patterns - detect imports from specific paths
ATOM_IMPORT_PATTERN='from ["\x27]@gouide/frontend-ui/(atoms|src/atoms)'
MOLECULE_IMPORT_PATTERN='from ["\x27]@gouide/frontend-ui/(molecules|src/molecules)'
ORGANISM_IMPORT_PATTERN='from ["\x27]@gouide/frontend-ui/(organisms|src/organisms)'
PRIMITIVE_IMPORT_PATTERN='from ["\x27]@gouide/frontend-ui/primitives'

# Package import pattern - correct way to import from UI package (templates only)
PACKAGE_ROOT_IMPORT_PATTERN='from ["\x27]@gouide/frontend-ui["\x27]'

# Non-template atom/molecule/organism imports from package root (strict mode violation)
# These patterns detect imports like: import { Box, Button } from "@gouide/frontend-ui"
# Apps should ONLY import templates like AppShell, not atoms like Box
NON_TEMPLATE_ATOMS='(Box|Button|Text|Input|Icon|Badge|Divider)'
NON_TEMPLATE_MOLECULES='(FormField|SearchBar|Card|FileTreeItem)'
NON_TEMPLATE_ORGANISMS='(FileTreePanel|EditorPanel|NavBar|Sidebar|StatusBar)'

# Hook patterns - detect custom hooks
CUSTOM_HOOK_PATTERN='export (const|function) use[A-Z]'

# Service patterns - detect service layer
SERVICE_PATTERN='export (const|class|function) .*Service'

# Path patterns for filtering
EXCLUDE_PATHS=(
    'node_modules'
    'dist'
    'build'
    '.turbo'
    '.next'
    'coverage'
    '.git'
)

# File extensions to check
COMPONENT_EXTENSIONS='(tsx|jsx)'
SCRIPT_EXTENSIONS='(ts|js|tsx|jsx)'

# Build exclude pattern for grep
build_exclude_pattern() {
    local pattern=""
    for path in "${EXCLUDE_PATHS[@]}"; do
        if [[ -z "$pattern" ]]; then
            pattern="$path"
        else
            pattern="$pattern|$path"
        fi
    done
    echo "$pattern"
}

# Build grep exclude arguments
build_grep_excludes() {
    local excludes=()
    for path in "${EXCLUDE_PATHS[@]}"; do
        excludes+=(--exclude-dir="$path")
    done
    echo "${excludes[@]}"
}
