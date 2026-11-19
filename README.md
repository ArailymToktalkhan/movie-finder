# Secure Movie Finder

Movie search app: Vite + vanilla JS, OMDb API (GET), JSON Server (POST).

## Setup
1. Get a free key: https://www.omdbapi.com/apikey.aspx
2. Put it in `.env`: `VITE_OMDB_KEY=your_key`
3. `npm install`

## Run (two terminals)
```bash
npm run server   # mock DB on http://localhost:3001
npm run dev      # app on http://localhost:5173
```

## API key protection
- The key lives only in `.env`, which is listed in `.gitignore`.
- The code reads it via `import.meta.env.VITE_OMDB_KEY`.
- `.env.example` shows the format without the real key.

## Requirements covered
- GET (OMDb) and POST (JSON Server) with async/await
- Errors: `response.ok` + `try/catch`
- POST: `JSON.stringify` + `Content-Type: application/json`
- Output via `textContent` (XSS protection)
