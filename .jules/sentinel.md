## 2026-08-17 - Authentication Bypass via Development Fallback
**Vulnerability:** `authMiddleware.js` attached a default user (`usr_default`) and called `next()` whenever an Authorization header was missing or contained an invalid JWT token.
**Learning:** Convenience fallbacks in authentication middleware meant to aid local testing or demo modes can accidentally disable authentication across protected routes entirely.
**Prevention:** Strictly reject unauthenticated requests with HTTP 401 Unauthorized in middleware; handle mock auth explicitly in dedicated test fixtures or mock environments rather than in core authentication code.
