# CPEN 321 M1 Issues and Fixes

## 1. Error Handling Refactoring - Auth Controller

**Issue:** The original error handling in `auth.controller.ts` used nested if statements for checking error types, which is less maintainable and harder to read.

**Solution:** Refactored error handling to use switch statements for better readability and maintainability.

**Changes:**

- Replaced nested if-else statements with switch statements in both `signUp` and `signIn` methods
- Example from the `signIn` method:

```typescript
// Before
if (error instanceof Error) {
  if (error.message === 'Invalid Google token') {
    return res.status(401).json({
      message: 'Invalid Google token',
    });
  }

  if (error.message === 'User not found') {
    return res.status(404).json({
      message: 'User not found, please sign up first.',
    });
  }

  // ...
}

// After
if (error instanceof Error) {
  switch (error.message) {
    case 'Invalid Google token':
      return res.status(401).json({
        message: 'Invalid Google token',
      });

    case 'User not found':
      return res.status(404).json({
        message: 'User not found, please sign up first.',
      });

    // ...
  }
}
```

## 2. Google Authentication Debugging

**Issue:** User authentication was failing with MongoDB operation timeout errors. Needed to debug whether the issue was with:

1. Google ID extraction from tokens
2. Database connection issues
3. ID mismatch between token and database

**Solution:** Added temporary debugging logs to track the flow of Google IDs and database operations.

**Changes:**

- Added logging to `verifyGoogleToken` in `auth.service.ts` to log the extracted Google ID
- Added logging to `findByGoogleId` in `user.model.ts` to show all users in the database
- Added connection state logging in `database.ts`

**Outcome:** Logs confirmed the Google ID was correctly extracted and matched the database. The issue was with intermittent MongoDB connection timeouts rather than with the authentication logic itself.

**Future Improvements to Consider:**

- Implement retry logic for database operations
- Add more robust error handling for database connection issues
- Consider connection pooling optimizations
- Add monitoring for database connection health
