# Contact Page Frontend Integration Plan

## 1. Current Architecture Analysis

### 1.1 Frontend Component
| Component | File | Purpose |
|-----------|------|---------|
| ContactPage | `components/contact/ContactPage.tsx` | Contact form with info |

### 1.2 Current Status
**CRITICAL ISSUE**: The contact page does NOT submit to backend - it just shows a toast:

```typescript
// ContactPage.tsx lines 58-62
const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  showToast("Success!", "Your quote request has been sent successfully.");
  setFormData(initialFormData);
};
```

The form submission is completely client-side with no API call.

### 1.3 Form Fields
```typescript
const initialFormData = {
  name: "",      // Required
  email: "",     // Required
  phone: "",    // Required  
  message: "",  // Optional
};
```

---

## 2. Backend API Requirements

### 2.1 Endpoint: POST `/api/v1/contact`
Submit contact/quotes form.

**Request Body:**
```json
{
  "name": "Jagdish Dhami",
  "email": "jagdish@example.com",
  "phone": "+977-9809890000",
  "message": "I need information about...",
  "type": "quote"  // or "general", "support", "partnership"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Your quote request has been submitted. We will contact you soon.",
  "data": {
    "id": 123,
    "created_at": "2024-01-15T10:30:00Z"
  }
}
```

### 2.2 Optional: GET `/api/v1/contact` (Admin)
List all contact submissions (for admin dashboard).

### 2.3 Optional: PUT `/api/v1/contact/:id` (Admin)
Update status (new, in-progress, resolved).

---

## 3. Integration Tasks

### 3.1 Phase 1: Create Backend Endpoint
- [ ] Create contact module in `studback/internal/contact/`
- [ ] POST endpoint to save contact submissions
- [ ] Add email notification to admin (optional)
- [ ] Add auto-response to submitter (optional)

### 3.2 Phase 2: Update Frontend
- [ ] Import apiService
- [ ] Update handleSubmit to call API
- [ ] Handle loading state (disable button)
- [ ] Handle success/error responses
- [ ] Show appropriate error message on failure

### 3.3 Phase 3: Admin Features (Optional)
- [ ] List contact submissions in admin panel
- [ ] Mark as resolved
- [ ] Add notes

---

## 4. Implementation Details

### 4.1 API Service Method
File: `services/api.ts`

```typescript
async submitContact(data: {
  name: string;
  email: string;
  phone: string;
  message?: string;
  type?: string;
}): Promise<{ success: boolean; message: string }> {
  return apiRequest("/api/v1/contact", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
```

### 4.2 Updated handleSubmit
```typescript
const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // Loading state
  setIsSubmitting(true);
  
  try {
    const response = await apiService.submitContact({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      message: formData.message,
      type: "quote",
    });
    
    showToast("Success!", response.message || "Your request has been sent.");
    setFormData(initialFormData);
  } catch (error) {
    showToast("Error", "Failed to send. Please try again.");
  } finally {
    setIsSubmitting(false);
  }
};
```

### 4.3 Loading State Addition
Need to add `isSubmitting` state:
```typescript
const [isSubmitting, setIsSubmitting] = useState(false);
```

Update button:
```typescript
<button
  type="submit"
  disabled={isSubmitting}
  className="..."
>
  {isSubmitting ? "Sending..." : "Send Now"}
</button>
```

---

## 5. Static Content (Already Hardcoded)

The contact info is currently hardcoded and works without backend:

| Field | Value |
|-------|-------|
| Address | Sallyan House, Baghbajar, Kathmandu, Nepal |
| Phone | 01-456746, 01-985647 |
| Email | info@stusphere.com |
| Hours | 9:00 AM - 6:00 PM |
| Social | Facebook, Instagram, TikTok, WhatsApp |

**Option**: Move to database if admins need to update without code changes.

---

## 6. Testing Checklist

- [ ] Form validation works (required fields)
- [ ] Submission shows loading state
- [ ] Success shows toast
- [ ] Error shows error toast
- [ ] Form resets after success
- [ ] Map embed loads correctly
- [ ] Social links open in new tab

---

## 7. Next Steps

1. **Create backend endpoint** `/api/v1/contact`
2. **Add API method** in `services/api.ts`
3. **Update ContactPage** to call API
4. **Test submission flow**
5. **Deploy**

---

## 8. Comparison Summary

| Aspect | find-college | admissions | campus-forum | contact |
|--------|-------------|-----------|--------------|---------|
| Data Source | API | Mock | API | **None** |
| Form Submit | N/A | N/A | Yes | **No - needs API** |
| CRUD | Read | No | Full | **Create only** |

The contact page needs a simple POST endpoint to store submissions. No complex listing/filtering needed unless admin panel requires it.