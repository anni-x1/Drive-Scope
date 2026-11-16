# Security notes

- OAuth state is random and bound to an HMAC signed short-lived HTTP-only cookie. Session cookies are HMAC signed, HTTP-only, SameSite=Lax and Secure in production.
- Google refresh tokens are encrypted at rest with AES-256-GCM. Set a private 32-byte base64 `TOKEN_ENCRYPTION_KEY`; rotate only with a planned decrypt-and-reencrypt process.
- OAuth client secrets, refresh tokens and encryption keys are used only on the server.
- Account and file queries include the authenticated DriveScope user. File identities also include connected account ID because Google file IDs are account-scoped.
- The app currently requests `drive.metadata.readonly`; the current UI does not offer writes or broad full-drive control. Google may require OAuth verification/security assessment for restricted scope use in public production.
- Protect `.env.local`, database credentials and backups. Restrict Atlas network access to known addresses in deployed environments.

Before production, add CSRF/origin checks to state-changing endpoints, rate limiting, sync job locks and safe refresh-token revocation on disconnect. This application has not undergone a security audit.
