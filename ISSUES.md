# M1

## List of Issues

### Issue 1: Delete Account Did Not Actually Remove User Data

**Description**:  
The "Delete Account" button originally behaved like a logout button. It did not send a `DELETE` request to the backend, so user accounts and data were never actually removed. Users could immediately re-login after “deletion,” violating expectations around data privacy and control.

**How it was fixed?**:  
I implemented a proper `DELETE` method on the backend (`/user/profile` endpoint) and updated the frontend to call this endpoint. JWT tokens were cleared after deletion to prevent cached access. I also added error handling and a clear message to prompt users to create a new account if they attempted to log in after deletion. This ensured that deletion truly removed user data and improved process transparency for the end user.

---

### Issue 2: No Logout Button Available

**Description**:  
The application allowed account deletion but offered no logout option. This trapped users into staying logged in or deleting their account entirely, which is a poor product experience and fails to meet basic session management standards.

**How it was fixed?**:  
I added a logout button and connected it to the appropriate callbacks. The logout functionality clears authentication tokens, redirects users to the authentication screen, and displays a confirmation message (`"Signed out successfully"`). This provides users with proper session control without forcing them to delete their account.

---

### Issue 3: User Bio Could Not Be Edited After Creation

**Description**:  
The bio field was immutable after profile creation. Users who skipped setting a bio could never add one later, and those wanting to update their profile information were blocked from doing so. This created a rigid and frustrating user experience.

**How it was fixed?**:  
A modifier flag was preventing the bio text field from being focused and edited. I removed this flag, restoring the ability to edit bios after creation. This fix significantly improved personalization and usability of the profile feature.

---

### Issue 4: Disorganized File Structure in the Backend

**Description**:  
The backend was originally organized as a single large folder where controllers, models, and services were all mixed together. This disorganized structure made it harder to extend the app, follow data flows, or onboard new developers.

**How it was fixed?**:  
I refactored the backend into a modular structure with clear folders (`controllers/`, `services/`, `models/`, `routes/`). Imports were updated accordingly. This improved maintainability, made the code easier to navigate, and reduced onboarding complexity for new contributors.
