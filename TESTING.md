# Flarum Lock Profile - Testing Checklist

## What's Protected
✅ Username field
✅ Email field  
✅ Bio/Description field
✅ Avatar/Profile picture upload
✅ Change email button
✅ Settings form submission
✅ Edit button on user card

## Frontend Protection (JavaScript)
- Hides "Edit" button on user profile card for non-admins
- Disables username, email, and bio input fields
- Blocks avatar editor with visual feedback
- Prevents change email modal from opening
- Intercepts form submission
- Shows user-friendly error messages

## Backend Protection (PHP)
- Validates all user save events
- Blocks changes to: username, email, bio, avatarUrl, password
- Checks both attributes and relationships (avatar upload)
- Validates dirty model attributes as extra safety
- Only allows admins to make changes
- Throws PermissionDeniedException with clear message

## Test Scenarios

### As Regular User (Non-Admin):
1. ✅ Visit your profile → "Edit" button should be hidden
2. ✅ Go to Settings → Username field should be disabled (greyed out)
3. ✅ Go to Settings → Email field should be disabled
4. ✅ Go to Settings → Bio field should be disabled
5. ✅ Go to Settings → Avatar editor should be locked (greyed out, no click)
6. ✅ Try to submit form → Should show error alert
7. ✅ Try API call directly (inspect network) → Should return 403 error

### As Admin:
1. ✅ All fields should be editable
2. ✅ Can change username, email, bio, avatar
3. ✅ Can edit other users' profiles (if permissions allow)

## Manual Testing Steps

1. **Login as regular user**
   - Navigate to your profile
   - Verify you cannot see "Edit" button
   - Go to Settings
   - Verify all profile fields are disabled and greyed out
   - Try clicking avatar → nothing should happen
   - Try submitting form → error message shown

2. **Login as admin**
   - Navigate to your profile
   - Verify "Edit" button is visible
   - Go to Settings
   - Verify all fields are editable
   - Successfully change and save fields

3. **Browser console test (as regular user)**
   ```javascript
   // Try to bypass frontend protection
   app.session.user.save({ username: 'newname' })
   // Should fail with backend error
   ```

## Expected Behaviors

### Visual Feedback:
- Locked fields: opacity 0.6, cursor "not-allowed"
- Tooltips: "Profile editing is locked"
- Alert message: "Profile editing is disabled by the administrator."

### Backend Response:
- Status: 403 Forbidden
- Message: "Your profile is locked and cannot be edited. Please contact an administrator if you need to make changes."

## Browser Compatibility
Tested on:
- [ ] Chrome/Edge
- [ ] Firefox
- [ ] Safari

## Flarum Version Compatibility
Tested on:
- [ ] Flarum 1.8.x
- [ ] Flarum 1.7.x
- [ ] Latest stable release

## Known Limitations
- Password changes are also blocked (by design)
- If other extensions modify the same fields, conflicts may occur
- Frontend protection can be bypassed (but backend will still block)
