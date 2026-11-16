# DriveScope

DriveScope is a multi-account Google Drive metadata dashboard. Google Drive remains the source of truth; the app stores an analytical copy of file metadata only. It does not download Drive file contents.

## Current implementation

- Responsive dashboard shell for desktop and mobile.
- Google OAuth sign-in and additional account connection using offline access and the `drive.metadata.readonly` scope.
- AES-256-GCM encrypted per-account refresh tokens, signed HTTP-only session cookies, and OAuth state validation.
- MongoDB models and indexes scoped to both DriveScope user and Google account.
- Paginated, resumable initial metadata sync and server-paginated file search endpoints.

The overview displays connected account state and indexed file count from the API. Storage quota, file browsing UI, incremental sync, upload, management actions, and account disconnect UI are not implemented yet. Sync is available per account from the overview and through `POST /api/accounts/{accountId}/sync`; it processes up to three 100-file pages per request. A configured connection is required to use the account and file APIs.

## Requirements

Node.js 20+, npm, a MongoDB Atlas database, and a Google Cloud project with Drive API enabled.

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `MONGODB_URI` to your Atlas connection string. In Atlas, create a free cluster, add a database user, allow your development IP in Network Access, and copy the application's standard connection string.
3. Generate secrets (PowerShell):

   ```powershell
   $bytes = New-Object byte[] 32; [Security.Cryptography.RandomNumberGenerator]::Fill($bytes); [Convert]::ToBase64String($bytes)
   ```

   Use one generated value for `TOKEN_ENCRYPTION_KEY`. Use a separate random string of at least 32 characters for `AUTH_SECRET`. Keep both private and back them up securely; losing the encryption key makes stored tokens unreadable.
4. In Google Cloud Console, create a project, enable Google Drive API, configure the OAuth consent screen, and create an OAuth client of type Web application.
5. Add `http://localhost:3000/api/accounts/google/callback` as an authorised redirect URI. Put the client ID and secret in `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`; set `GOOGLE_REDIRECT_URI` to the same URI.
6. Configure the consent screen to request `openid`, `email`, `profile`, and `https://www.googleapis.com/auth/drive.metadata.readonly`. This Drive scope is restricted and public production use may require Google verification/security review. The current app requests metadata read access only; it does not grant full Drive access.
7. Install and start:

   ```sh
   npm install
   npm run dev
   ```

8. Open `http://localhost:3000` and use `/api/accounts/google/start` to connect the first account. After signing in, that endpoint can connect another Google account.

## Environment variables

See `.env.example`. No secrets belong in `NEXT_PUBLIC_*` variables. `CRON_SECRET` is reserved; no scheduled sync endpoint is implemented yet.

## Architecture and security

See [ARCHITECTURE.md](ARCHITECTURE.md), [SECURITY.md](SECURITY.md), and [SETUP_GOOGLE_CLOUD.md](SETUP_GOOGLE_CLOUD.md).

## Roadmap and limitations

- Replace the overview shell with live account, quota, file, and activity data.
- Add incremental sync using the Changes API, retry/backoff, sync locks, and explicit lost-access/deletion handling.
- Add responsive file explorer, filters, and account management UI.
- Add upload with explicit target account, folder selection, progress, and capability checks.
- Add duplicates, large/old files, storage history, sharing view, and permission-aware management.
- Add tests and verify at narrow and wide viewport sizes.
- Add deployment and production OAuth verification guidance as deployment is configured.
