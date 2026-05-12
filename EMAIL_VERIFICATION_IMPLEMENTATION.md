# Email Verification on Change - Implementation Summary

## Overview
When a user changes their general email in settings, the system now:
1. Sends a verification email to the new email address
2. User must verify via email link
3. After verification, user can login with the new email and old password
4. Falls back to .env SMTP settings if no database configuration exists

## Files Modified/Created

### 1. **Modified: `utils/model/SuperAdminHotel.js`**
Added fields to track email verification:
- `pendingEmailId`: Stores the new email pending verification
- `emailVerified`: Boolean flag for verification status
- `emailVerificationToken`: Hashed token for verification
- `emailVerificationExpiry`: Token expiration time

### 2. **Created: `utils/helpers/getSMTPConfig.js`**
New utility function that:
- Fetches SMTP configuration from database (EmailConfiguration model)
- Falls back to .env variables if database config is empty
- Handles both Gmail and other SMTP providers

### 3. **Modified: `app/api/hotelDetails/route.js`**
Updated PUT handler to:
- Detect when emailId is being changed
- Generate verification token (SHA256 hashed, 32-byte)
- Store pending email and token in database
- Send verification email using SMTP config (with fallback)
- Return status indicating email verification is required
- Keep old email active until verification completes

### 4. **Created: `app/api/verify-email-change/route.js`**
New API endpoint that:
- Accepts token and email from verification link
- Validates token against database (hash comparison)
- Checks token expiration (24 hours)
- Updates emailId and marks emailVerified = true
- Clears pending email and verification data
- Returns success/failure response

### 5. **Created: `app/verify-email-change/page.js`**
Frontend page that:
- Displays verification status UI
- Shows loading spinner while verifying
- Shows success/error messages
- Auto-redirects to login on success
- Manual redirect button for both success and error states

## Flow Diagram

```
User changes email in settings
    ↓
API validates new email is different
    ↓
Generates verification token
    ↓
Stores: pendingEmailId, tokenHash, expiryTime
    ↓
Sends verification email to NEW email address
    ↓
User clicks verification link
    ↓
Verification API validates token & expiry
    ↓
Updates emailId = new email
    ↓
Clears pendingEmailId, token, expiry
    ↓
User can login with NEW email + OLD password
```

## Key Features

### Security
- Tokens are SHA256 hashed before storage
- 24-hour expiration for tokens
- Token is unique per email change request
- Old email remains active until verification

### SMTP Fallback Strategy
1. First tries to use database SMTP configuration
2. If database config missing/incomplete → uses .env
3. Supports both Gmail and standard SMTP

### Email Format
- Professional HTML email template
- Clear verification instructions
- Direct link with token and email
- 24-hour expiration notice
- Auto-reply prevention

### Database Changes
```javascript
// New fields in SuperAdminHotel schema
{
  emailId: String,                    // Current email
  pendingEmailId: String,             // New email (temp)
  emailVerified: Boolean,             // Verification status
  emailVerificationToken: String,     // Hashed token
  emailVerificationExpiry: Date       // Token expires in 24h
}
```

## API Endpoints

### PUT /api/hotelDetails
Changes email with verification requirement

**Request:**
```json
{
  "emailId": "newemail@example.com",
  "otherFields": "..."
}
```

**Response (email changed):**
```json
{
  "success": true,
  "message": "Verification email sent...",
  "requiresEmailVerification": true,
  "hotelData": {...}
}
```

### GET /api/verify-email-change
Verifies email change token

**URL:** `/api/verify-email-change?token=xxx&email=new@email.com`

**Response:**
```json
{
  "success": true,
  "message": "Email verified successfully...",
  "hotelData": {...}
}
```

## Login Behavior

After email verification:
- User can login with **new email** + **old password**
- Authentication checks current emailId (updated field)
- Password validation uses stored hash (unchanged)

## SMTP Configuration Priority

1. Database `EmailConfiguration.smtpHost` (preferred)
2. Environment variable `SMTP_HOST` (fallback)

Same applies for:
- `smtpPort` / `SMTP_PORT`
- `smtpUsername` / `SMTP_USER`
- `smtpPassword` / `SMTP_PASS`
- `senderEmail` / `SMTP_FROM_EMAIL`

## Error Handling

### Invalid/Expired Tokens
- Message: "Invalid or expired verification link"
- Reason: Token hash doesn't match or token expired
- User must request email change again

### SMTP Failures
- Returns error in hotelDetails response
- Suggests checking SMTP configuration
- Gmail users advised about App Passwords

### Missing Configuration
- Falls back to .env automatically
- No user action required

## Testing the Feature

1. **Update email in settings:**
   ```
   PUT /api/hotelDetails
   { "emailId": "newemail@gmail.com" }
   ```

2. **Check verification email** sent to newemail@gmail.com

3. **Click verification link** in email

4. **See success page** and auto-redirect to login

5. **Login with:**
   - Email: `newemail@gmail.com`
   - Password: `original_password`

## Notes

- Old email doesn't work for login until verification
- Verification link expires after 24 hours
- User can request new email change if first one failed
- Clearing pendingEmailId = canceling unverified email
