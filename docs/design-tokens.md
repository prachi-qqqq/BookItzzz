# Design Tokens

Design system tokens used throughout BookItzzz for consistency.

## Colors

### Primary
- `blue-600`: #2563eb (primary actions, links)
- `blue-700`: #1d4ed8 (hover state)
- `blue-500`: #3b82f6 (focus ring)

### Neutral
- `gray-50`: #f9fafb (background)
- `gray-100`: #f3f4f6
- `gray-200`: #e5e7eb
- `gray-300`: #d1d5db (borders)
- `gray-600`: #4b5563 (secondary text)
- `gray-700`: #374151 (labels)
- `gray-800`: #1f2937
- `gray-900`: #111827 (primary text)

### Semantic
- `red-500`: #ef4444 (error)
- `red-600`: #dc2626 (error dark)
- `green-500`: #10b981 (success)
- `yellow-500`: #f59e0b (warning)

## Typography

### Font Family
- System fonts: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif

### Font Sizes
- `xs`: 0.75rem (12px)
- `sm`: 0.875rem (14px)
- `base`: 1rem (16px)
- `lg`: 1.125rem (18px)
- `xl`: 1.25rem (20px)
- `2xl`: 1.5rem (24px)
- `3xl`: 1.875rem (30px)
- `4xl`: 2.25rem (36px)

### Font Weights
- `normal`: 400
- `medium`: 500
- `semibold`: 600
- `bold`: 700

## Spacing

Base unit: 0.25rem (4px)

- `1`: 0.25rem (4px)
- `2`: 0.5rem (8px)
- `3`: 0.75rem (12px)
- `4`: 1rem (16px)
- `6`: 1.5rem (24px)
- `8`: 2rem (32px)
- `12`: 3rem (48px)
- `16`: 4rem (64px)

## Border Radius

- `sm`: 0.125rem (2px)
- `default`: 0.25rem (4px)
- `md`: 0.375rem (6px)
- `lg`: 0.5rem (8px)
- `xl`: 0.75rem (12px)
- `2xl`: 1rem (16px)
- `full`: 9999px

## Shadows

- `sm`: 0 1px 2px 0 rgb(0 0 0 / 0.05)
- `default`: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)
- `md`: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)
- `lg`: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)

## Breakpoints

- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px

## Usage

Apply tokens via Tailwind utility classes:
```jsx
<button className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow-md">
  Primary Button
</button>
```
