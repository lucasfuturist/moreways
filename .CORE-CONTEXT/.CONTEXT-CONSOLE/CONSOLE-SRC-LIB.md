# High-Resolution Interface Map

## Tree: `apps/console/src/lib`

```
lib/
├── utils.ts
```

## File Summaries

### `utils.ts`
**Role:** Utility for conditionally merging and deduplicating Tailwind CSS classes.
**Key Exports:**
- `cn(...inputs): string` - Combines class names using `clsx` and resolves Tailwind conflicts using `tailwind-merge`.
**Dependencies:** `clsx`, `tailwind-merge`.