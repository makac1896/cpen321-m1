# M1

## New Feature

**Name:** Lyrics Finder for Hobbies

**Short description:**  
This feature allows users to search and display lyrics for their favorite songs while engaging in hobbies such as running, painting, or cooking. The goal was to make the app more personal and enjoyable by integrating music into the hobby experience. The feature fetches lyrics from a free external API, processes the request through the backend for consistency and separation of concerns, and then displays the results on the frontend with scrolling, error handling, and hobby-related suggestions.

**Location and code:**

- **Backend:**

  - `backend/src/controllers/lyrics.controller.ts` – Handles incoming requests for lyrics and connects to the service layer.
  - `backend/src/routes/lyrics.routes.ts` – Defines the `/api/lyrics` route.
  - `backend/src/routes/routes.ts` – Registers the `lyrics` route with authentication.
  - `backend/src/services/lyrics.service.ts` – Contains logic to call the external lyrics API and return results.
  - `backend/src/types/lyrics.types.ts` – Defines request and response types for lyrics API calls.

- **Frontend:**
  - `frontend/app/src/main/java/com/cpen321/usermanagement/data/remote/api/LyricsInterface.kt` – Retrofit interface for making lyrics API calls.
  - `frontend/app/src/main/java/com/cpen321/usermanagement/data/remote/api/RetrofitClient.kt` – Adds `lyricsInterface` to the existing Retrofit client.
  - `frontend/app/src/main/java/com/cpen321/usermanagement/ui/components/LyricsScreen.kt` – Composable screen for searching, displaying, and clearing lyrics. Includes a creative limerick introduction and hobby-based suggestions.
  - `frontend/app/src/main/java/com/cpen321/usermanagement/ui/screens/MainScreen.kt` – Integrates `LyricsScreen` into the main navigation flow.
  - `frontend/app/src/main/java/com/cpen321/usermanagement/ui/viewmodels/MainViewModel.kt` – Holds UI state (`LyricsState`), handles search logic, error handling, and connects to the backend API.
