# Google Cloud setup

1. Create or select a Google Cloud project.
2. Enable Google Drive API.
3. Configure the OAuth consent screen with app name, support email, authorized domains and privacy policy as required by your deployment. Add test users while the app is in testing mode.
4. Add the scopes `openid`, `email`, `profile`, and `https://www.googleapis.com/auth/drive.metadata.readonly`.
5. Create an OAuth client ID for a Web application.
6. Add `http://localhost:3000/api/accounts/google/callback` to Authorized redirect URIs for local development. Add the exact deployed callback URL before production use.
7. Copy the client ID and secret into server environment variables.

`drive.metadata.readonly` is a restricted Drive scope. Google verification and a security assessment may be required before public production use. DriveScope currently uses read-only metadata access. It does not request the broader `drive` scope or claim upload/edit capability.
