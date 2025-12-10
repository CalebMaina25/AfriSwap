# AfriSwap Backend

Node.js + Express API for AfriSwap currency exchange platform.

## Prerequisites

- Node.js >= 18 (use `.nvmrc` with nvm: `nvm use`)
- Firebase Admin credentials (service account JSON)
- Redis (optional, for caching)

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure environment variables:**
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Set `FIREBASE_KEY_JSON` (full service account JSON as string) or `GOOGLE_APPLICATION_CREDENTIALS` (path to key file):
     ```bash
     # Option A: JSON in env var
     export FIREBASE_KEY_JSON='{"type":"service_account",...}'
     
     # Option B: Path to key file
     export GOOGLE_APPLICATION_CREDENTIALS=/path/to/firebase-key.json
     ```
   - Optionally set `PORT` (default 3001) and `NODE_ENV` (default development).

## Development

Start the dev server with hot reload (nodemon):
```bash
npm run dev
```

Server starts on http://localhost:3001 (configurable via `PORT`).

### API Documentation

- **Root:** http://localhost:3001/
- **Health check:** http://localhost:3001/health
- **Swagger UI (OpenAPI):** http://localhost:3001/api-docs

## Testing

Run tests:
```bash
npm test
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## Production

Start the server (without nodemon):
```bash
npm start
# or
node server.js
```

Set `NODE_ENV=production` and secure your Firebase credentials via CI secrets or secure vaults.

## Linting

Check code style:
```bash
npm run lint
```

## Project Structure

```
backend/
├── server.js              # Express server entry point
├── openapi.json          # OpenAPI specification (Swagger UI)
├── package.json          # Dependencies and scripts
├── .env                  # Local environment variables (gitignored)
├── .env.example          # Example env vars (safe to commit)
├── .gitignore            # Git ignore rules
├── .nvmrc                # Node version pin
├── src/
│   ├── config/
│   │   └── firebase.js   # Firebase Admin SDK init
│   ├── routes/
│   │   ├── auth.routes.js
│   │   ├── trade.routes.js
│   │   ├── wallet.routes.js
│   │   ├── documents.routes.js
│   │   └── ai.routes.js
│   └── services/
│       └── auth/
│           └── AuthService.js
└── tests/
    └── health.test.js    # Health endpoint tests
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment (development/production) | development |
| `FIREBASE_KEY_JSON` | Firebase service account JSON (as string) | — |
| `GOOGLE_APPLICATION_CREDENTIALS` | Path to Firebase service account file | — |

Either `FIREBASE_KEY_JSON` or `GOOGLE_APPLICATION_CREDENTIALS` must be set.

## API Routes

- `GET /health` — Health check (JSON)
- `GET /` — Welcome page (HTML)
- `GET /api-docs` — Swagger UI / OpenAPI docs
- `GET /api/auth` — Auth module root
- `GET /api/trades` — Trade module root
- `GET /api/wallet` — Wallet module root
- `GET /api/documents` — Documents module root
- `GET /api/ai` — AI module root

Extend routes by adding endpoints to `src/routes/*.routes.js` files.

## Security Notes

- Never commit `.env` or `firebase-key.json` to version control.
- Use `.gitignore` to exclude sensitive files.
- In CI/production, set credentials via secure environment variables or secret managers.
- Use helmet for security headers (already configured).
- Use CORS carefully — adjust origin whitelist for production.

## Troubleshooting

**"Cannot find module ./firebase-key.json"**
- Ensure `FIREBASE_KEY_JSON` or `GOOGLE_APPLICATION_CREDENTIALS` is set.
- Or place a valid `firebase-key.json` in the backend root (outside version control).

**Port already in use**
- Change `PORT` in `.env`: `PORT=3002`.
- Or kill the process: `pkill -f "node server.js"`.

**Tests fail**
- Ensure all dependencies are installed: `npm install`.
- Check that server can be imported correctly by running: `node -e "const app = require('./server'); console.log(app ? 'OK' : 'FAIL');"`

## License

See repository LICENSE.
