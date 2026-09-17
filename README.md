# QRStandee Local-First

## Local mode
Open `index.html` directly in a browser. QR/business records are stored in `localStorage`.
Use **Save QR**, **Backup JSON**, and **Restore JSON**.

## Backend mode
The included `worker.js`, `schema.sql`, and `wrangler.toml` are ready for Cloudflare Workers + D1.

1. Create a D1 database named `qrstandee`.
2. Put its database ID in `wrangler.toml`.
3. Run the schema against D1.
4. Deploy the Worker.
5. In `index.html`, set `API_BASE` to the Worker origin.
6. Add authentication/rate limiting before public production use.

Dynamic route:
`https://YOUR-WORKER-ORIGIN/<slug>` -> redirects to the saved destination and increments scan count.

Important:
- The local app intentionally works with no backend.
- `API_BASE` is empty by default, so no network calls are made.
- For production, add auth, origin restrictions, rate limiting, input validation, and a privacy policy.
