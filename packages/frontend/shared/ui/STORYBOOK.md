# Storybook for @gouide/frontend-ui

Complete component documentation and testing environment for the Gouide UI library.

## Overview

This package uses **Storybook 10.1.9** to provide interactive documentation and isolated testing for all UI components. Every component has corresponding stories demonstrating different states and use cases.

## Running Storybook

### From the UI package:
```bash
cd packages/frontend/shared/ui
pnpm storybook
```

### From the root:
```bash
pnpm storybook
```

Opens at **http://localhost:6006**

## Building Storybook

Generate a static build:

```bash
pnpm storybook:build
```

Output: `storybook-static/`

## Component Coverage

**100% coverage** - All 23 components have stories:

### Atoms (7)
- Badge - Status indicators with color variants
- Box - Layout container with flex/grid support
- Button - Clickable buttons with variants
- Divider - Horizontal/vertical separators
- Icon - Icon wrapper with size/color variants
- Input - Text input fields
- Text - Typography component

### Molecules (4)
- Card - Container with header/footer
- FormField - Input + label + error message
- SearchBar - Search input with clear button
- FileTreeItem - File/directory tree node

### Organisms (5)
- NavBar - Top navigation bar
- EditorPanel - Code editor container
- FileTreePanel - File tree with search
- StatusBar - Bottom status bar
- Sidebar - Side navigation container

### Templates (7)
- AppShell - Main application layout
- EditorAreaTemplate - Editor area with tabs
- EditorLayout - Editor layout wrapper
- EmptyState - Empty state placeholder
- MonacoEditorTemplate - Monaco code editor
- SidebarTemplate - Sidebar with file tree
- StatusBarTemplate - Status bar with connection info

## Creating New Stories

Every component **must** have a corresponding `.stories.tsx` file.

### Story File Template

```typescript
import type { Meta, StoryObj } from "@storybook/react";
import { ComponentName } from "./ComponentName";

const meta: Meta<typeof ComponentName> = {
  title: "Layer/ComponentName", // e.g., "Atoms/Button"
  component: ComponentName,
  tags: ["autodocs"],
  argTypes: {
    // Add controls for interactive testing
    variant: {
      control: "select",
      options: ["primary", "secondary"],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ComponentName>;

// Create separate stories for each state
export const Default: Story = {
  args: {
    children: "Click me",
  },
};

export const Disabled: Story = {
  args: {
    children: "Disabled",
    isDisabled: true,
  },
};
```

### Naming Conventions

- **File**: `ComponentName.stories.tsx` (same directory as component)
- **Story title**: `"Layer/ComponentName"` (e.g., `"Atoms/Button"`, `"Templates/AppShell"`)
- **Story names**: Descriptive state names (Default, Loading, Error, Empty, etc.)

### Using Mock Data

Import from `__mocks__/mockData.ts`:

```typescript
import { mockFileTree, mockDaemonStates, mockFileContent } from "../__mocks__/mockData";

export const WithFiles: Story = {
  render: () => (
    <FileTreePanel files={mockFileTree} />
  ),
};
```

## Validation

### Automated Validation

Story coverage is enforced automatically:

```bash
# Check coverage
pnpm validate:stories

# From root
pnpm validate:stories
```

This script:
- ✅ Checks every `.tsx` component has a `.stories.tsx` file
- ✅ Runs in CI/CD (blocks builds if stories missing)
- ✅ Integrated with UI architecture validation

### CI/CD Integration

Story validation runs in GitHub Actions:
1. After TypeScript type checking
2. Before building packages
3. **Blocks merge** if any stories are missing

## Best Practices

### 1. Stateless Components
All components should be **stateless** for Storybook testing:
- Business logic extracted to custom hooks
- State management via props only
- Pure UI rendering

### 2. Comprehensive Stories
Cover all meaningful states:
- **Default**: Standard appearance
- **Loading**: Async operations
- **Error**: Error states
- **Empty**: No data
- **Success**: Successful operations
- **Variants**: Different configurations

### 3. Interactive Controls
Use `argTypes` for interactive testing:

```typescript
argTypes: {
  variant: {
    control: "select",
    options: ["primary", "secondary", "ghost"],
  },
  isDisabled: {
    control: "boolean",
  },
}
```

### 4. Accessibility Testing
Stories include the **a11y addon** for accessibility testing:
- View in Storybook's Accessibility tab
- Checks WCAG compliance
- Highlights issues

## Architecture

### Atomic Design Hierarchy

Stories follow the strict atomic design pattern:

```
Atoms → Molecules → Organisms → Templates
```

- **Atoms**: Import primitives only
- **Molecules**: Compose atoms
- **Organisms**: Compose molecules + atoms
- **Templates**: Compose organisms (app-level layouts)

### Stateless UI Pattern

All components refactored to be stateless:

**Business Logic** (hooks):
- `useEditorAutoSave` - Editor state management
- `useFileTreeExpansion` - File tree expansion
- `useFileSearch` - Search filtering

**UI Components** (stateless):
- Receive data via props
- Render UI only
- No business logic

## Troubleshooting

### Storybook won't start
```bash
# Clean and reinstall
cd packages/frontend/shared/ui
rm -rf node_modules .storybook-cache
pnpm install
pnpm storybook
```

### Path alias errors
Check `.storybook/main.ts` has correct aliases:
```typescript
alias: {
  "@gouide/primitives-desktop": join(__dirname, "../../../primitives/desktop/src"),
  "@gouide/frontend-theme": join(__dirname, "../../theme/src"),
}
```

### Stories not appearing
- Ensure file ends with `.stories.tsx`
- Check `stories` glob pattern in `.storybook/main.ts`
- Clear Storybook cache: `rm -rf node_modules/.cache/storybook`

### Validation failing
```bash
# See which components are missing stories
pnpm validate:stories

# Creates stories for missing components
# File format: ComponentName.stories.tsx
```

## Resources

- **Storybook Docs**: https://storybook.js.org
- **Atomic Design**: https://atomicdesign.bradfrost.com
- **Accessibility**: https://storybook.js.org/docs/writing-stories/accessibility-testing

## Development Workflow

1. **Create component**: Write `.tsx` file
2. **Create stories**: Write `.stories.tsx` file (same directory)
3. **Test in Storybook**: `pnpm storybook`
4. **Validate**: `pnpm validate:stories`
5. **Commit**: Validation runs in CI/CD

**Every component must have stories before merging!**
