This is an Express + Mongoose application template.

# User

- id
- email
- password
- isVerified
- isDeleted
- verificationToken
- passwordChangedAt
- passwordResetToken
- passwordResetExpiresAt

# Endpoints

- /getMe
- /deleteMe -> checks password before deleting -> soft deletes

### /signup

1. email + password
2. generate verificationToken
3. create user or update
4. store hash of verificationToken (**does not expire?!**)
5. send email that contains token

### /verifyAccount

1. hash token received from email
2. compare hash
3. return jwt

### /login

1. email + password
2. compare password
3. return jwt

### /forgotPassword

1. email
2. generate passwordResetToken
3. update user & store hash (?!) of passwordResetToken + ExpiresAt
4. if not a user no email won't be sent
5. send email

### /resetPassword

1. token + password
2. hash token
3. compare with db and update password
4. return jwt

### /updatePassword

1. password + newPassword
2. compare old password
3. update password & passwordChangedAt
4. return jwt

### /updateEmail

1. password + newEmail
2. compare password
3. create verificationToken
4. update and store hash of verificationToken & newEmail
5. send email with verificationToken
