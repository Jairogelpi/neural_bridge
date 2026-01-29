# Neural Bridge Backend (Go)

SaaS API for compiling transcripts into sealed ContextCrystals (RLM) for the Neural Bridge browser extension.

## Local Development

1. Ensure you have Docker and Docker Compose installed.
2. Run the environment:
```bash
docker compose up --build
```

### Testing Endpoints

- **Health**: `GET http://localhost:8080/healthz`
- **Bootstrap Session**: `POST http://localhost:8080/v1/session/bootstrap`
- **Compile**: `POST http://localhost:8080/v1/compile` (Requires `Authorization: Bearer <token>` and `Idempotency-Key: <uuid>`)
- **Host Profile**: `GET http://localhost:8080/v1/profiles/host?platform=chatgpt`

## Deployment (Render)

1. Deploy using the provided `Dockerfile`.
2. Configure the following environment variables:
   - `DATABASE_URL`: Your Render Postgres connection string.
   - `REDIS_URL`: Your Redis connection string (e.g., Upstash).
   - `JWT_SIGNING_KEY`: A secure random string.
   - `ENV`: `prod`

Refer to `render.yaml` for a complete list of required variables.
