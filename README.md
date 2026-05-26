# WiNK Blog Backend

REST API per blog e CMS sviluppata con Express, MongoDB e TypeScript.

## Tech Stack

- **Express 4** + **TypeScript**
- **MongoDB** + **Mongoose 8**
- **CORS** abilitato
- **dotenv** per configurazione

## Avvio rapido

```bash
# 1. Installa dipendenze
npm install

# 2. Configura le variabili d'ambiente
cp .env.example .env
# Modifica MONGODB_URI se necessario

# 3. Avvia in sviluppo (hot reload)
npm run dev

# 4. Build + start produzione
npm run build && npm start
```

Il server parte su `http://localhost:3001`.

---

## Autenticazione

Non è presente un sistema di autenticazione completo per specifica.
Le route admin richiedono l'header:

```
Authorization: Bearer wink-admin-secret-token-2024
```

Il token è hardcoded in `.env.example` — in produzione sostituirlo con un valore sicuro.

---

## API Reference

### Pubbliche (nessun token richiesto)

#### `GET /api/posts`
Restituisce tutti i post **pubblicati**.

Query params:
- `hashtag` — filtra per uno o più hashtag (stringa o array)
  - Esempi: `?hashtag=tech`, `?hashtag=tech,news`, `?hashtag=tech&hashtag=news`

Risposta `200`:
```json
{
  "success": true,
  "data": [
    {
      "_id": "...",
      "title": "Hello World",
      "body": "...",
      "hashtags": ["tech", "news"],
      "status": "published",
      "author": "Brian Fox",
      "publishedAt": "2024-01-15T10:00:00.000Z",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ]
}
```

---

#### `GET /api/posts/:id`
Restituisce un singolo post pubblicato per ID.

Risposta `200`: `{ "success": true, "data": { ... } }`
Risposta `404`: `{ "success": false, "message": "Post not found" }`

---

### Admin (token richiesto)

#### `GET /api/posts/all`
Restituisce **tutti** i post (draft + published).

Header: `Authorization: Bearer wink-admin-secret-token-2024`

---

#### `POST /api/posts`
Crea un nuovo post. Status iniziale: `draft`. Author: sempre `"Brian Fox"`.

Header: `Authorization: Bearer wink-admin-secret-token-2024`

Body:
```json
{
  "title": "Il mio primo post",
  "body": "Contenuto del post...",
  "hashtags": ["tech", "react"]
}
```

Risposta `201`:
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "title": "Il mio primo post",
    "body": "Contenuto del post...",
    "hashtags": ["tech", "react"],
    "status": "draft",
    "author": "Brian Fox",
    "createdAt": "...",
    "updatedAt": "..."
  }
}
```

---

#### `PATCH /api/posts/:id/publish`
Pubblica un post (cambia status da `draft` → `published`, imposta `publishedAt`).

Header: `Authorization: Bearer wink-admin-secret-token-2024`

Risposta `200`: post aggiornato
Risposta `400`: se già pubblicato
Risposta `404`: se non trovato

---

#### `DELETE /api/posts/:id`
Elimina un post.

Header: `Authorization: Bearer wink-admin-secret-token-2024`

Risposta `200`: `{ "success": true, "message": "Post deleted" }`
Risposta `404`: se non trovato

---

## Struttura del progetto

```
src/
├── config/
│   └── db.ts                  # Connessione MongoDB
├── controllers/
│   └── postsController.ts     # Business logic
├── middleware/
│   └── auth.ts                # Token guard
├── models/
│   └── Post.ts                # Schema Mongoose
├── routes/
│   └── posts.ts               # Router Express
└── index.ts                   # Entry point
```

## Schema Post

| Campo        | Tipo     | Note                              |
|-------------|----------|-----------------------------------|
| `title`     | String   | Obbligatorio, max 300 char        |
| `body`      | String   | Obbligatorio                      |
| `hashtags`  | [String] | Default: `[]`                     |
| `status`    | String   | `"draft"` \| `"published"`        |
| `author`    | String   | Sempre `"Brian Fox"`, immutabile  |
| `publishedAt` | Date   | Impostato al momento della pubblicazione |
| `createdAt` | Date     | Auto (timestamps)                 |
| `updatedAt` | Date     | Auto (timestamps)                 |
# wink-blog-backend
