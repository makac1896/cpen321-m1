# Issues Identified and Fixes

## 1. Delete Account Did Not Actually Remove User Data

**Problem:**  
The "Delete Account" button originally behaved like a logout button. It never sent a `DELETE` request to the backend, meaning user accounts and data were retained. Users could re-login immediately after “deletion,” which broke expectations around data control and privacy.

**Fix:**

- Implemented a proper `DELETE` method on the backend (`/user/profile` endpoint).
- Updated the frontend to call this endpoint.
- Cleared JWT tokens after deletion to prevent cached access.
- Added error handling and a message prompting users to create a new account if they attempted to log in after deletion.

**Impact:**

- Ensures actual data deletion, meeting user expectations.
- Strengthens trust by giving users real control over their data.
- Prevents unintended access to stale accounts.

---

## 2. No Logout Button Available

**Problem:**  
The app allowed account deletion but offered no logout option. This trapped users into staying logged in or deleting their account entirely. This omission is a poor product experience and fails to meet basic session management standards.

**Fix:**

- Added a logout button with proper callbacks.
- On logout, tokens are cleared, users are redirected to the authentication screen, and a confirmation message is displayed.

**Impact:**

- Restores expected functionality for session management.
- Aligns the app with modern usability and security standards.
- Prevents misuse of account deletion as a substitute for logout.

---

## 3. User Bio Could Not Be Edited After Creation

**Problem:**  
The bio field was immutable after profile creation. Users who skipped setting a bio could never add one later, and those wanting to update their information were blocked. This led to a rigid and frustrating user experience.

**Fix:**

- Removed a modifier flag that prevented the bio text field from being focused and edited.

**Impact:**

- Restores flexibility for users to update or add bios.
- Improves personalization of profiles.
- Reduces frustration for users who skipped initial setup.

---

## 4. Disorganized File Structure in the Backend

**Problem:**  
The backend codebase was originally a single large folder with controllers, models, and services mixed together. This made it difficult to navigate, extend, or onboard new developers.

**Fix:**

- Restructured the backend into a modular hierarchy:
  - `controllers/`
  - `services/`
  - `models/`
  - `routes/`
- Updated imports to match the new structure.

**Impact:**

- Improves maintainability and clarity.
- Makes adding features easier by grouping related code.
- Speeds up developer onboarding and reduces confusion.

---
