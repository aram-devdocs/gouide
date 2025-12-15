#!/usr/bin/env bash

# Main UI Architecture Validation Orchestrator
# Runs all validation checks and reports results
# Compatible with Bash 3.2+

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
VALIDATORS_DIR="$SCRIPT_DIR/validators"
BASELINE_FILE="$SCRIPT_DIR/.validation-baseline.json"

# Source common library for formatting
source "$VALIDATORS_DIR/lib/common.sh"

# Configuration
STRICT_MODE=false
UPDATE_BASELINE=false
VERBOSE=false

# Results tracking (Bash 3.2 compatible - using indexed arrays)
check_names=()
check_exit_codes=()
failed_check_names=()
total_checks=0
failed_checks=0

# Print usage
usage() {
    cat << EOF
Usage: $(basename "$0") [OPTIONS]

UI Architecture Validation - Enforce atomic design patterns and best practices

OPTIONS:
    --strict              Exit with error on any new violations (ignores baseline)
    --baseline-update     Update the baseline with current violations
    --verbose            Show detailed output from each validator
    -h, --help           Show this help message

CHECKS:
    1. Direct DOM Element Detection
       - Ensures apps use @gouide/frontend-ui components
       - Prevents direct HTML usage in application code

    2. Atomic Design Pattern Violations
       - Validates correct import patterns
       - Enforces atomic design hierarchy

    3. Business Logic in Components
       - Detects API calls in components
       - Ensures logic is in hooks/services

    4. Component State Complexity
       - Flags components with excessive state hooks
       - Encourages extraction to custom hooks

    5. Template-Only Architecture (STRICT)
       - Apps can ONLY import templates from @gouide/frontend-ui
       - Blocks atom, molecule, and organism imports in apps
       - Enforces clean separation of concerns

EXAMPLES:
    # Run all checks
    $(basename "$0")

    # Run in strict mode (CI/CD)
    $(basename "$0") --strict

    # Update baseline for existing violations
    $(basename "$0") --baseline-update

EXIT CODES:
    0 - All checks passed
    1 - One or more checks failed
    2 - Invalid arguments

EOF
}

# Parse command line arguments
parse_args() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --strict)
                STRICT_MODE=true
                shift
                ;;
            --baseline-update)
                UPDATE_BASELINE=true
                shift
                ;;
            --verbose)
                VERBOSE=true
                shift
                ;;
            -h|--help)
                usage
                exit 0
                ;;
            *)
                echo -e "${RED}Error: Unknown option $1${NC}" >&2
                usage
                exit 2
                ;;
        esac
    done
}

# Print main header
print_main_header() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║         UI Architecture Validation                         ║"
    echo "║         Enforcing Atomic Design Patterns                   ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""

    if [[ "$STRICT_MODE" == "true" ]]; then
        echo -e "${YELLOW}Running in STRICT mode - will fail on any new violations${NC}"
    fi

    if [[ "$UPDATE_BASELINE" == "true" ]]; then
        echo -e "${YELLOW}Baseline update mode - will update .validation-baseline.json${NC}"
    fi

    echo ""
}

# Run a validator script
run_validator() {
    local validator_name="$1"
    local validator_script="$2"
    local description="$3"

    ((total_checks++))

    echo -e "${BLUE}Running:${NC} $description"

    # Export configuration for validators
    export PROJECT_ROOT
    export STRICT_MODE
    export BASELINE_FILE
    export UPDATE_BASELINE

    # Run validator
    local exit_code=0
    local output=""

    if [[ "$VERBOSE" == "true" ]]; then
        bash "$validator_script" || exit_code=$?
    else
        output=$(bash "$validator_script" 2>&1) || exit_code=$?
    fi

    # Store results (Bash 3.2 compatible)
    check_names+=("$validator_name")
    check_exit_codes+=("$exit_code")

    if [[ $exit_code -ne 0 ]]; then
        ((failed_checks++))
        failed_check_names+=("$validator_name")

        if [[ "$VERBOSE" == "false" ]] && [[ -n "$output" ]]; then
            echo "$output"
        fi
    else
        echo -e "${GREEN}✓${NC} $description passed"
    fi

    echo ""

    return 0
}

# Run all validators
run_all_validators() {
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo -e "${BLUE}Starting Validation Checks${NC}"
    echo -e "${BLUE}═══════════════════════════════════════════════════════════${NC}"
    echo ""

    # 1. Direct DOM Detection
    run_validator \
        "direct-dom" \
        "$VALIDATORS_DIR/detect-direct-dom.sh" \
        "Direct DOM Element Detection"

    # 2. Atomic Violations
    run_validator \
        "atomic-violations" \
        "$VALIDATORS_DIR/detect-atomic-violations.sh" \
        "Atomic Design Pattern Validation"

    # 3. Business Logic
    run_validator \
        "business-logic" \
        "$VALIDATORS_DIR/detect-business-logic.sh" \
        "Business Logic in Components"

    # 4. Component State
    run_validator \
        "component-state" \
        "$VALIDATORS_DIR/detect-component-state.sh" \
        "Component State Complexity"

    # 5. Template-Only Architecture (STRICT)
    run_validator \
        "template-only" \
        "$VALIDATORS_DIR/detect-template-only-violations.sh" \
        "Template-Only Architecture Enforcement"
}

# Print final summary
print_final_summary() {
    echo ""
    echo "╔════════════════════════════════════════════════════════════╗"
    echo "║                    Final Summary                           ║"
    echo "╚════════════════════════════════════════════════════════════╝"
    echo ""

    echo -e "Total checks run: ${BLUE}$total_checks${NC}"
    echo -e "Checks passed: ${GREEN}$((total_checks - failed_checks))${NC}"
    echo -e "Checks failed: ${RED}$failed_checks${NC}"
    echo ""

    if [[ $failed_checks -eq 0 ]]; then
        echo -e "${GREEN}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${GREEN}║  ✓ All validation checks passed!                          ║${NC}"
        echo -e "${GREEN}║  Your UI architecture follows best practices.             ║${NC}"
        echo -e "${GREEN}╚════════════════════════════════════════════════════════════╝${NC}"
    else
        echo -e "${RED}╔════════════════════════════════════════════════════════════╗${NC}"
        echo -e "${RED}║  ✗ Some validation checks failed                          ║${NC}"
        echo -e "${RED}║  Please review the violations above.                      ║${NC}"
        echo -e "${RED}╚════════════════════════════════════════════════════════════╝${NC}"
        echo ""
        echo "Failed checks:"
        for check_name in "${failed_check_names[@]}"; do
            echo -e "  ${RED}✗${NC} $check_name"
        done
    fi

    echo ""

    if [[ "$UPDATE_BASELINE" == "true" ]]; then
        echo -e "${GREEN}Baseline updated:${NC} $BASELINE_FILE"
        echo "Use this baseline in CI to prevent new violations while allowing existing ones."
        echo ""
    fi
}

# Check prerequisites
check_prerequisites() {
    local missing=()

    # Check for required commands
    for cmd in grep find; do
        if ! command -v "$cmd" >/dev/null 2>&1; then
            missing+=("$cmd")
        fi
    done

    # Check for jq if baseline operations are needed
    if [[ "$UPDATE_BASELINE" == "true" ]] || [[ -f "$BASELINE_FILE" ]]; then
        if ! command -v jq >/dev/null 2>&1; then
            echo -e "${YELLOW}Warning: jq not installed. Baseline features will be disabled.${NC}" >&2
            echo -e "${YELLOW}Install jq for baseline support: brew install jq${NC}" >&2
            echo ""
        fi
    fi

    if [[ ${#missing[@]} -gt 0 ]]; then
        echo -e "${RED}Error: Missing required commands:${NC} ${missing[*]}" >&2
        exit 2
    fi

    # Check if validators exist
    local validators=(
        "detect-direct-dom.sh"
        "detect-atomic-violations.sh"
        "detect-business-logic.sh"
        "detect-component-state.sh"
    )

    for validator in "${validators[@]}"; do
        if [[ ! -f "$VALIDATORS_DIR/$validator" ]]; then
            echo -e "${RED}Error: Validator not found:${NC} $validator" >&2
            exit 2
        fi
    done
}

# Initialize baseline if needed
initialize_baseline() {
    if [[ ! -f "$BASELINE_FILE" ]] && [[ "$UPDATE_BASELINE" != "true" ]]; then
        echo -e "${YELLOW}No baseline file found. Running without baseline.${NC}"
        echo -e "${YELLOW}Use --baseline-update to create a baseline.${NC}"
        echo ""
    fi
}

# Main execution
main() {
    parse_args "$@"

    print_main_header

    check_prerequisites

    initialize_baseline

    run_all_validators

    print_final_summary

    # Exit code
    if [[ $failed_checks -gt 0 ]]; then
        exit 1
    fi

    exit 0
}

# Run main function
main "$@"
