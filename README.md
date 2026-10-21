# RxDesk

RxDesk is a doctor-focused prescription preparation app. Doctor accounts and chamber details are stored by the backend. Patient and clinical prescription data stay in the browser and are used locally for preview, printing, and PDF export.

## Project layout

- `client/` — React, Vite, and Tailwind frontend
- `server/` — Express API, MongoDB models, authentication, and chamber endpoints
- `render.yaml` — Render Blueprint for the backend service
- `client/vercel.json` — Vercel rewrite for client-side routes

## Run locally

Requirements: Node.js 20.19+ or 22.12+, npm, and MongoDB for persistent storage.

1. Install client dependencies with `cd client && npm ci`.
2. Copy `client/.env.example` to `client/.env` and set `VITE_API_URL=http://localhost:5000/api`.
3. Install server dependencies with `cd server && npm ci`.
4. Copy `server/.env.example` to `server/.env`. Set `MONGODB_URI`, a unique `JWT_SECRET`, and the email dispatcher URL if email delivery is needed.
5. Run `npm run dev` from `server/`.
6. In another terminal, run `npm run dev` from `client/`.
7. Open the Vite URL, normally `http://localhost:5173`.

The server health endpoint is `http://localhost:5000/api/health`. When MongoDB is not configured, the server uses temporary in-memory data. This mode is for local evaluation only: the data disappears on restart and must not be used for production.

## Deploy the backend to Render

First create the Vercel project with the `client` root directory so you know its production URL. The initial frontend build can use the default API URL; update it after Render has created the backend.

The repository includes a Render Blueprint. In Render, create a new Blueprint from this repository and review the `rxdesk-api` web service:

- Root directory: `server`
- Build command: `npm ci`
- Start command: `npm start`
- Health check: `/api/health`

Set these environment variables in Render:

| Variable | Value |
| --- | --- |
| `NODE_ENV` | `production` |
| `MONGODB_URI` | MongoDB Atlas connection string |
| `JWT_SECRET` | Render-generated secret from the Blueprint, or a strong unique secret |
| `JWT_EXPIRES_IN` | `7d` |
| `CLIENT_URL` | The exact HTTPS origin of the deployed Vercel frontend, without a trailing slash |
| `GOOGLE_SCRIPT_EMAIL_URL` | Deployed email dispatcher URL |

Production startup intentionally fails if MongoDB, JWT, email dispatcher, or HTTPS client-origin configuration is missing. Configure Atlas network access to allow the Render service to connect. Do not commit real environment values.

After deployment, confirm `https://<render-service>.onrender.com/api/health` returns a successful response.

## Deploy the frontend to Vercel

Import the repository into Vercel and set:

- Root directory: `client`
- Framework preset: Vite
- Build command: `npm run build`
- Output directory: `dist`
- Install command: `npm ci`
- Environment variable: `VITE_API_URL=https://<render-service>.onrender.com/api`

For the deployment order, create the Vercel project first to obtain its production URL, configure that URL as Render's `CLIENT_URL`, then create the Render Blueprint. After Render provides the backend URL, set `VITE_API_URL` in Vercel to `https://<render-service>.onrender.com/api` and redeploy the frontend. If using a custom frontend domain, set that exact HTTPS origin instead. Use the same Vercel production domain for browser access because preview deployments are not automatically trusted by the backend.

The Vercel rewrite in `client/vercel.json` serves the React application for direct requests to client routes. It prevents Vercel's platform 404 when a user refreshes or opens a route such as `/login` or `/dashboard`. Unknown application routes are then handled by the React router.

Authentication uses an HTTP-only secure cookie in production. Since Vercel and Render use different sites by default, production cookies use `SameSite=None; Secure`; the backend also checks browser request origins against `CLIENT_URL`. For the most reliable browser cookie behavior, configure custom domains for both services under the same registrable domain (for example, `app.example.com` and `api.example.com`).

## Useful checks

Run client checks:

```sh
cd client
npm run lint
npm run build
```

Check server JavaScript syntax:

```sh
cd server
node --check src/server.js
```

## Privacy and security

- Prescription data is maintained in browser memory and is not sent to the API.
- Authentication tokens are issued in HTTP-only cookies.
- Never use the development placeholder values in a production deployment.
- Keep `.env` files and live service credentials out of version control.
