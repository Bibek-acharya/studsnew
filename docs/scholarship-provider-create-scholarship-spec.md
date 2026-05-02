# Scholarship Provider Create Scholarship Spec

## Overview
The `Create Scholarship` screen in the scholarship provider dashboard is a long-form content builder used to create and publish scholarship listings. It contains core scholarship metadata, rich-text content, eligibility rules, repeated structured rows, payment configuration, and publication controls.

This spec defines the desired product behavior in phases, with clear acceptance criteria and test cases for each phase.

## Goals
- Make draft vs publish behavior unambiguous.
- Ensure all visible fields are persisted correctly.
- Reduce user friction in a long and complex form.
- Improve confidence through clearer validation and save feedback.
- Keep the form maintainable as the content model grows.

## Non-Goals
- Redesigning the entire dashboard navigation.
- Changing the backend schema without a separate implementation plan.
- Adding unrelated scholarship listing features outside this editor.

## Phase 1: Critical Fixes

### Scope
This phase addresses correctness, data integrity, and publish safety.

### Requirements
- The primary actions must be deterministic.
  - `Save as Draft` must always save as draft.
  - `Publish Scholarship` must always publish.
- Publish submissions must enforce required business rules.
  - Required fields should be validated before publish.
  - Draft saves may remain more permissive.
- The form must persist only fields that the backend can store reliably.
  - Any mismatch between UI fields and backend DTOs must be resolved or explicitly documented.
- Upload state must block save when needed.
  - A file upload in progress should prevent submission.
- Publication status controls must use one consistent internal model.
  - The UI should not expose contradictory values or labels.

### Acceptance Criteria
- Clicking `Save as Draft` stores the scholarship with draft status every time.
- Clicking `Publish Scholarship` stores the scholarship with published status every time.
- If a required publish field is missing, submission is blocked and the user sees a helpful error.
- If an image upload is in progress, the form cannot be submitted until the upload completes.
- The status radio or toggle reflects the same internal status values used in the payload.
- The payload sent to the backend contains only fields that are intended to persist.

### Test Cases
- Save draft with minimum fields filled.
  - Expected: request completes successfully, status is `draft`.
- Click publish with all required fields filled.
  - Expected: request completes successfully, status is `published`.
- Click publish with missing title.
  - Expected: submission is blocked with a validation message.
- Click publish with missing deadline or banner image.
  - Expected: submission is blocked with a validation message.
- Start a banner upload and immediately click save.
  - Expected: save is blocked until upload finishes.
- Toggle publication status and then click publish.
  - Expected: final payload matches the publish intent, not an accidental stale status.
- Inspect the submitted payload.
  - Expected: no accidental semantic misuse such as overwriting provider identity with scholarship title.

## Phase 2: UX Improvements

### Scope
This phase reduces cognitive load and improves clarity during form completion.

### Requirements
- Break the form into meaningful sections or steps.
  - Core details
  - Content and description
  - Eligibility and selection
  - Media and assets
  - Payment and publication
- Reduce duplicate action zones.
  - If both top and bottom actions remain, their roles must be clearly different.
- Make save feedback visible and actionable.
  - Show saving, saved, uploading, and validation states.
- Add per-section validation feedback where possible.
  - Errors should point users to the relevant area.
- Add confirmation for destructive row deletions.
  - Applies to repeated list rows and grouped data.
- Improve empty-state guidance for repeated sections.
  - Users should understand what each list is for and what a good entry looks like.

### Acceptance Criteria
- The user can complete the scholarship creation flow without having to scan one very long page.
- Save controls are easy to identify and do not feel duplicated without purpose.
- Users can tell whether they are saving a draft or publishing.
- Users receive feedback for uploads, saves, and validation issues in context.
- Deleting a row requires intentional confirmation or a clearly reversible action.
- Repeated sections include guidance for first-time users.

### Test Cases
- Open the form as a new provider user.
  - Expected: sections are understandable and the form does not feel like one large wall of inputs.
- Add and remove a video tutorial row.
  - Expected: the UI makes the effect of the action obvious.
- Try deleting a FAQ row accidentally.
  - Expected: the UI prevents accidental loss or provides a clear confirmation.
- Save a draft.
  - Expected: feedback clearly says the record was saved as draft.
- Upload a banner image.
  - Expected: the UI shows an uploading state and then a saved preview.

## Phase 3: Nice-to-Have Polish

### Scope
This phase improves speed, confidence, and maintainability after the core flow is stable.

### Requirements
- Add completion progress indicators.
  - Example: percentage complete or section completion markers.
- Add a live preview panel.
  - Show how the scholarship card or public page will look.
- Add autosave for long sessions.
  - Especially useful for complex drafts.
- Add section summaries when collapsed.
  - Helps users navigate a large form quickly.
- Add richer media previews.
  - Display counts and thumbnails for gallery images, partner logos, and downloads.
- Improve keyboard and accessibility behavior.
  - Especially for icon-only buttons and upload controls.
- Add templated starter content.
  - Useful for common scholarship structures.

### Acceptance Criteria
- Users can see how complete the scholarship is.
- Users can preview the public-facing result before publishing.
- Long edits are less risky because work is preserved automatically or semi-automatically.
- Collapsed sections remain readable through short summaries.
- Media-heavy sections feel organized rather than crowded.
- Keyboard users can complete the form comfortably.

### Test Cases
- Enter data into a few sections and inspect progress.
  - Expected: the form indicates partial completion.
- Open a live preview.
  - Expected: the preview reflects the current draft state.
- Leave the form idle during editing.
  - Expected: autosave or draft preservation behavior protects work.
- Add multiple gallery items or partner groups.
  - Expected: counts and thumbnails help the user orient themselves.
- Navigate the form with keyboard only.
  - Expected: key actions remain reachable and understandable.

## Button Action Matrix

### Current Primary Actions
- Top `Draft` button
  - Saves the scholarship as a draft.
- Top `Save` button
  - Saves using the current publication status.
- Bottom `Save as Draft` button
  - Saves the scholarship as a draft.
- Bottom `Publish Scholarship` button
  - Saves using the current publication status.

### Repeated Add Actions
- `Add Video`
- `Add Timeline Entry`
- `Add Scholarship Type`
- `Add Rubric Row`
- `Add Step`
- `Add Document`
- `Add FAQ`
- `Add Image`
- `Add Partner`
- `Add Partner Group`
- `Add Exam Center`
- `Add Download`
- `Add criteria`

These actions append empty rows or list items for the relevant section.

### Repeated Remove Actions
- Trash buttons in repeated rows remove the current row immediately.

### Publication Controls
- Draft radio
  - Sets local status to draft.
- Published radio
  - Sets local status to published.
- eSewa, Khalti, Bank transfer checkboxes
  - Toggle payment method availability.

## Risks and Open Questions
- Some UI fields appear richer than the current backend DTO. These need schema validation or explicit mapping.
- The form currently mixes content editing, media management, eligibility logic, and payment configuration in one screen.
- It is not yet obvious which fields are mandatory for draft versus publish.
- Payment configuration appears present in the UI, but backend handling should be confirmed before relying on it.

## Suggested Rollout Order
1. Phase 1
2. Phase 2
3. Phase 3

## QA Notes
- Test both local and production environments.
- Test with slow or failed image uploads.
- Test draft, publish, edit, and resave flows.
- Test with both empty and partially completed forms.
- Verify that a publish action cannot accidentally save as draft.

