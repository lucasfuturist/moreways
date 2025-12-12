# High-Resolution Interface Map: `apps/web/src/forms`

## Tree: C:\projects\moreways-ecosystem\apps\web\src\forms

```
forms/
├── repo/
│   ├── forms.repo.formSchemaRepo.ts
├── schema/
│   ├── forms.schema.formEntity.ts
├── ui/
│   ├── AutoForm.tsx
```

---

## File Summaries

### `forms/repo/forms.repo.formSchemaRepo.ts`
**Role:** Persistence layer responsible for creating and versioning form schemas in the database.
**Key Exports:**
- `FormSchemaRepo` - Class encapsulating data access logic.
  - `createVersionAsync(organizationId, schemaData): Promise<FormEntity>` - Persists a new form schema version and returns the created entity.
**Dependencies:** `FormEntity`, `FormSchemaData`.

### `forms/schema/forms.schema.formEntity.ts`
**Role:** Defines the core domain models and validation schemas for dynamic forms.
**Key Exports:**
- `FormFieldSchema` - Zod definition for individual inputs (text, number, etc).
- `FormSchemaDataSchema` - Zod definition for the complete form structure.
- `FormEntity` - Type definition for the persisted database record including versioning and tenancy.
**Dependencies:** `zod`.

### `forms/ui/AutoForm.tsx`
**Role:** A dynamic, multi-step wizard component that renders form inputs based on a configuration array.
**Key Exports:**
- `AutoForm({ issueId, fields }): JSX.Element` - Renders the progressive form interface, handles navigation animations, and submits data to the intake API.
- `FormField` - Interface defining the expected shape of input fields.
**Dependencies:** `framer-motion`, `lucide-react`, `useRouter`, `Button`, `Input`, `Textarea`.