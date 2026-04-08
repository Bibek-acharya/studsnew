<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

## Core Principle

This is a **server-first Next.js app**.

If you default to client-side React patterns, you’re doing it wrong.

---

## Rendering Model (NON-NEGOTIABLE)

### Default

* Everything is a **Server Component**
* Data fetching happens **on the server**

### Use `"use client"` ONLY if:

* You need:

  * event handlers (`onClick`, etc.)
  * browser APIs (localStorage, window)
  * interactive state

If not → **keep it server-side**

---

## Data Fetching Rules

### Correct Pattern

```ts
// Server Component
const data = await getData();
```

### Wrong Pattern

```ts
"use client";

useEffect(() => {
  fetch("/api/data");
}, []);
```

Stop writing React SPA code inside Next.js.

---

## Server Actions > API Routes

Prefer **Server Actions** over API routes when:

* It's internal (form submission, mutations)
* No external client needs it

### Example

```ts
"use server";

export async function createStudent(data: FormData) {
  // DB call
}
```

### Use API routes ONLY when:

* External systems need access
* You’re building a public API

---

## Folder Structure (STRICT)

```
/app
  /(routes)
  /(auth)
  /dashboard
/components
/features
/lib
/services
/actions
```

### Rules

* `/components` → dumb UI
* `/features` → domain logic (student, exam, etc.)
* `/actions` → server actions only
* `/services` → backend/API communication

If you mix these, your codebase will rot.

---

## Component Design

### Split properly:

* Server component → data fetching
* Client component → interactivity

### Example

```tsx
// Server
import StudentList from "./StudentList";

export default async function Page() {
  const students = await getStudents();
  return <StudentList students={students} />;
}
```

```tsx
"use client";

// Client
export default function StudentList({ students }) {
  return <div>{/* interactive UI */}</div>;
}
```

---

## Caching & Revalidation

If you don’t understand caching, you will ship bugs.

### Use explicitly:

```ts
fetch(url, { cache: "no-store" }) // always fresh
fetch(url, { next: { revalidate: 60 } }) // ISR
```

### Rules

* Dashboard/admin → `no-store`
* Public content → `revalidate`

---

## Navigation

Use:

```ts
import { useRouter } from "next/navigation";
```

NOT:

```ts
next/router ❌
```

---

## Forms

Use **Server Actions + form `action`**

```tsx
<form action={createStudent}>
  <input name="name" />
</form>
```

Avoid unnecessary client-side form handling unless UX requires it.

---

## Loading & Error Handling

Every route MUST have:

* `loading.tsx`
* `error.tsx`

Otherwise UX will suck under real latency.

---

## Performance Rules

* Use `next/image` always
* Avoid large client bundles
* Lazy load heavy components

```ts
const Chart = dynamic(() => import("./Chart"), { ssr: false });
```

---

## State Management

Don’t jump to global state like an idiot.

### Use:

* Server state → server components
* Local UI → `useState`
* Complex shared UI → Zustand (only if needed)

---

## Styling

* Tailwind only
* No random CSS files
* No inline chaos

---

## SEO & Metadata

Use:

```ts
export const metadata = {
  title: "Page",
};
```

NOT manual `<head>` hacks.

---

## Security

* Never trust client input
* Validate on server
* Use HTTP-only cookies for auth

---

## What NOT To Do

* Don’t convert everything to `"use client"`
* Don’t fetch inside `useEffect` by default
* Don’t mix API logic inside components
* Don’t ignore caching behavior
* Don’t build it like CRA

---

## Definition of Done

* Works with server rendering
* No unnecessary client JS
* Correct caching strategy
* No console errors
* Proper loading + error states

---

## If You’re Confused

Check how Next.js expects it to be done NOW — not how React used to work.


<!-- END:nextjs-agent-rules -->
