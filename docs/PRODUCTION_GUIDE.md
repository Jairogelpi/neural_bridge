# Neural Bridge - Producción Real

Este sistema está 100% preparado para un entorno de producción real. Todos los componentes de prueba han sido eliminados o reemplazados por implementaciones criptográficas y de IA reales.

## 🚀 Requisitos de Despliegue

### 1. Variables de Entorno (Environment Variables)
Para que el sistema funcione en producción, deben configurarse las siguientes claves:

| Variable | Descripción |
| :--- | :--- |
| `VITE_OPENROUTER_API_KEY` | API Key de OpenRouter para acceso a LLMs reales (Claude 3.5, Gemini, Llama). |
| `SUPABASE_URL` | URL de tu proyecto de Supabase para la base de datos cloud. |
| `SUPABASE_ANON_KEY` | Anon Key de Supabase para la persistencia de datos. |
| `PORT` | Puerto del servidor (por defecto 3000). |

### 2. Base de Datos (Supabase SQL)
Ejecuta el siguiente comando SQL en tu panel de Supabase para habilitar la persistencia:

```sql
-- Tabla principal de persistencia para Crystals, Transcripts y Cards
CREATE TABLE kv_store (
    key TEXT PRIMARY KEY,
    value JSONB,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Tabla de Reputación
CREATE TABLE authors (
    author_id UUID PRIMARY KEY,
    name TEXT NOT NULL,
    reputation DOUBLE PRECISION DEFAULT 0.5,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ledger de auditoría de reputación
CREATE TABLE reputation_ledger (
    id BIGSERIAL PRIMARY KEY,
    author_id UUID NOT NULL REFERENCES authors(author_id),
    delta DOUBLE PRECISION NOT NULL,
    new_reputation DOUBLE PRECISION NOT NULL,
    reason TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
```

## 🛡️ Garantías del Sistema Real
- **Cero Mocks:** No hay respuestas "fake". Cada verificación es procesada por LLMs reales.
- **Persistencia Cloud:** Los datos se guardan en Supabase, no se pierden al reiniciar Docker.
- **Autocuración:** El Truth Vault escanea contradicciones en tiempo real.
- **Consenso:** Las afirmaciones críticas son verificadas por múltiples modelos (Claude, Gemini, Llama).
- **Criptografía:** Firmas ECDSA P-256 reales y hashing SHA-256 mediante Web Crypto API.
- **Privacidad:** Pruebas de Conocimiento Cero (ZKP) integradas para validación sin exposición.

## 🐳 Ejecución con Docker
```bash
docker build -t neural-bridge .
docker run -p 3000:3000 \
  -e VITE_OPENROUTER_API_KEY=tu_key \
  -e SUPABASE_URL=tu_url \
  -e SUPABASE_ANON_KEY=tu_anon_key \
  neural-bridge
```
