# Admission Form Backend Integration Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ensure the backend model and DTO for the institution admission page cover every field and sub-field from the frontend `AdmissionCreatePage.tsx` form.

**Architecture:** The frontend sends admission page data via `PUT /api/v1/institution/profile` with a JSON body shaped by `collectData()`. The backend must store/retrieve the exact same shape. All JSON objects described below map to backend model fields and DTO fields 1:1.

**Tech Stack:** Go/Gin + PostgreSQL. The frontend uses Next.js with `apiService.updateInstitutionProfile()`.

---

## Complete Data Contract

The frontend sends this exact JSON shape to `PUT /api/v1/institution/profile`. The backend `GET /api/v1/institution/profile` must return the same structure.

### Top-Level Keys

```
{
  overview_data: { ... },
  whats_new_data: { ... },
  programs_data: [ ... ],
  facilities_data: [ ... ],
  courses_data: [ ... ],
  downloads_data: [ ... ],
  faqs_data: [ ... ],
  contact_persons_data: [ ... ],
  scholarships_data: [ ... ],
  eligibility_data: { criteria: [ ... ] },
  admission_process_data: [ ... ],
  brochure_data: { ... }
}
```

### Task 1: overview_data Model & DTO

**Shape:**
```json
{
  "overviewHeading": "string",
  "overviewDesc": "string (HTML from Quill editor)",
  "applicationFormLink": "string (URL)",
  "level": "string (values: '+2', 'A-Level', 'Diploma/CTEVT')"
}
```

- [ ] **Step 1: Add `overviewHeading` field (string, required)**
- [ ] **Step 2: Add `overviewDesc` field (text/CLOB, required - stores HTML)**
- [ ] **Step 3: Add `applicationFormLink` field (string, optional)**
- [ ] **Step 4: Add `level` field (string enum: '+2', 'A-Level', 'Diploma/CTEVT', required)**

### Task 2: whats_new_data Model & DTO

**Shape:**
```json
{
  "title": "string",
  "description": "string",
  "btnText": "string",
  "btnLink": "string"
}
```

- [ ] **Step 5: Add `title` field (string, required)**
- [ ] **Step 6: Add `description` field (string, required)**
- [ ] **Step 7: Add `btnText` field (string, required)**
- [ ] **Step 8: Add `btnLink` field (string/URL, required)**

### Task 3: programs_data Model & DTO

**Shape (array):**
```json
[
  {
    "title": "string",
    "subtitle": "string",
    "admissionStatus": "string enum: 'deadline-near', 'limited-seats', 'ongoing', 'seats-available', 'closed'",
    "programIcon": "string (Lucide icon name)",
    "description": "string",
    "streams": ["string"],
    "careers": ["string"]
  }
]
```

- [ ] **Step 9: Add `title` field (string, required)**
- [ ] **Step 10: Add `subtitle` field (string, required)**
- [ ] **Step 11: Add `admissionStatus` field (string enum, required)**
- [ ] **Step 12: Add `programIcon` field (string, required - Lucide icon name)**
- [ ] **Step 13: Add `description` field (text, required)**
- [ ] **Step 14: Add `streams` field (array of strings, required)**
- [ ] **Step 15: Add `careers` field (array of strings, required)**
- [ ] **Step 16: Ensure getter maps stored JSON array to typed list and setter serializes back**

### Task 4: facilities_data Model & DTO

**Shape (array):**
```json
[
  {
    "heading": "string",
    "facilityIcon": "string (Lucide icon name)",
    "description": "string"
  }
]
```

- [ ] **Step 17: Add `heading` field (string, required)**
- [ ] **Step 18: Add `facilityIcon` field (string, required)**
- [ ] **Step 19: Add `description` field (text, required)**

### Task 5: courses_data Model & DTO

**Shape (array):**
```json
[
  {
    "courseName": "string",
    "curriculumLink": "string (URL)",
    "feesText": "string",
    "applicationDate": "string",
    "applyLink": "string (URL)"
  }
]
```

- [ ] **Step 20: Add `courseName` field (string, required)**
- [ ] **Step 21: Add `curriculumLink` field (string/URL, required)**
- [ ] **Step 22: Add `feesText` field (string, required)**
- [ ] **Step 23: Add `applicationDate` field (string, required)**
- [ ] **Step 24: Add `applyLink` field (string/URL, required)**

### Task 6: downloads_data Model & DTO

**Shape (array):**
```json
[
  {
    "title": "string",
    "description": "string"
  }
]
```

- [ ] **Step 25: Add `title` field (string, required)**
- [ ] **Step 26: Add `description` field (string, required)**

### Task 7: faqs_data Model & DTO

**Shape (array):**
```json
[
  {
    "question": "string",
    "answer": "string"
  }
]
```

- [ ] **Step 27: Add `question` field (string, required)**
- [ ] **Step 28: Add `answer` field (text, required)**

### Task 8: contact_persons_data Model & DTO

**Shape (array):**
```json
[
  {
    "name": "string",
    "designation": "string",
    "number": "string",
    "email": "string",
    "whatsapp": "string (URL)"
  }
]
```

- [ ] **Step 29: Add `name` field (string, required)**
- [ ] **Step 30: Add `designation` field (string, required)**
- [ ] **Step 31: Add `number` field (string, required)**
- [ ] **Step 32: Add `email` field (string, required)**
- [ ] **Step 33: Add `whatsapp` field (string/URL, required)**

### Task 9: scholarships_data Model & DTO

**Shape (array):**
```json
[
  {
    "name": "string",
    "level": "string",
    "stream": "string",
    "coverage": "string",
    "eligibility": "string",
    "seats": "string"
  }
]
```

- [ ] **Step 34: Add `name` field (string, required)**
- [ ] **Step 35: Add `level` field (string, required)**
- [ ] **Step 36: Add `stream` field (string, required)**
- [ ] **Step 37: Add `coverage` field (string, required)**
- [ ] **Step 38: Add `eligibility` field (string, required)**
- [ ] **Step 39: Add `seats` field (string, required - numeric but stored as string per frontend)**

### Task 10: eligibility_data Model & DTO

**Shape (object with criteria array):**
```json
{
  "criteria": [
    {
      "level": "string",
      "stream": "string",
      "eligibility": ["string"],
      "documents": ["string"]
    }
  ]
}
```

- [ ] **Step 40: Create wrapper object containing `criteria` array**
- [ ] **Step 41: Add `level` field (string, required)**
- [ ] **Step 42: Add `stream` field (string, required)**
- [ ] **Step 43: Add `eligibility` field (array of strings, required)**
- [ ] **Step 44: Add `documents` field (array of strings, required)**

### Task 11: admission_process_data Model & DTO

**Shape (array):**
```json
[
  {
    "stepNumber": "string",
    "title": "string",
    "description": "string"
  }
]
```

- [ ] **Step 45: Add `stepNumber` field (string, required)**
- [ ] **Step 46: Add `title` field (string, required)**
- [ ] **Step 47: Add `description` field (text, required)**

### Task 12: brochure_data Model & DTO

**Shape:**
```json
{
  "url": "string (URL)"
}
```

- [ ] **Step 48: Add `url` field (string/URL, optional)**

---

## Known Frontend Bug (Document for Backend Awareness)

The frontend has an inconsistency in how `eligibility_data` is handled:

- **GET** (data load): expects `eligibility_data.criteria` as the array of criteria items
- **PUT** (data save) in `collectData()`: sends `eligibility_data` as a flat array directly (no `criteria` wrapper)

**Backend should handle BOTH shapes** during transition, or coordinate a fix with frontend. The correct shape (per DTO above) is `{ criteria: [...] }`.

---

## Verification

After implementing all tasks:

- [ ] **Step 49: Verify GET returns all fields in the exact shape frontend expects**
- [ ] **Step 50: Verify PUT accepts all fields and stores them correctly**
- [ ] **Step 51: Verify null/empty arrays are returned as `[]` not `null`**
- [ ] **Step 52: Verify the `criteria` wrapper in eligibility_data is consistent (see known bug above)**
