# FoodRescue UI System

## Brand and tokens

- **Forest green** (`primary`) communicates trust, stewardship, and action.
- **Cream** (`background`) and **white** (`card`) create a calm, readable light-first interface.
- **Orange** (`accent`) reserves visual priority for meaningful calls to action.
- Semantic tokens cover destructive, success, warning, muted text, borders, and focus rings. Components must use tokens rather than hard-coded colors.

## Type and layout

Use a compact hierarchy: 12px uppercase eyebrows, 14–16px interface text, 18–20px card headings, and 30–60px page/hero headings. Content sits in responsive containers with 24px mobile gutters and 32px desktop gutters. Cards use a 12px radius and restrained shadows.

## Component conventions

`components/ui` contains reusable primitives. `components/shared` contains cross-page composition. `components/layout` owns application framing. Prefer `Button` for actions and `LinkButton` or semantic links for navigation; never render a control without a truthful destination or behavior.

The dashboard preview is explicitly non-operational. Future authenticated role interfaces should reuse `PageHeading`, `StatusIndicator`, `FormField`, feedback states, and existing primitives rather than duplicate them.

## Accessibility

Controls have visible focus rings, native labels, semantic sections, keyboard-capable Radix primitives, and reduced-motion support. Error and loading states have text/roles rather than color alone. Maintain the light theme as the production baseline; a dark theme must be designed and tested as a separate enhancement.
