# High-Resolution Interface Map: `apps/web/src/content`

## Tree: C:\projects\moreways-ecosystem\apps\web\src\content

```
content/
├── data/
│   ├── consumerIssues.ts
```

---

## File Summaries

### `content/data/consumerIssues.ts`
**Role:** Serves as the static "database" for all supported consumer legal issue categories, driving the UI for issue selection, menus, and landing pages.
**Key Exports:**
- `ConsumerIssue` (Interface) - Defines the data structure for a legal issue (ID, title, icon, descriptions, potential value).
- `consumerIssues` (Array) - The master list of configured issues (e.g., "Used Car Issues", "Debt Collection") used throughout the application.
**Dependencies:** `lucide-react` (Icons).