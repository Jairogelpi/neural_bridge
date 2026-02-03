# 🗄️ DATABASE SETUP - NEURAL BRIDGE

## ¿Qué Falta en la DB?

**Necesitas 3 tablas principales en Supabase:**

---

## 📋 Tablas Requeridas

### 1. `crystals` ✅
```sql
CREATE TABLE crystals (
    id UUID PRIMARY KEY,
    context_id TEXT UNIQUE,
    user_id TEXT,
    title TEXT,
    domain TEXT,
    intent JSONB,
    metadata JSONB,
    created_at TIMESTAMPTZ
);
```

**Usada por:**
- `GET /v1/analytics/stats` (total crystals, daily crystals)
- `GET /v1/crystals` (lista de crystals recientes)

---

### 2. `analytics_events` ✅
```sql
CREATE TABLE analytics_events (
    id UUID PRIMARY KEY,
    event_name TEXT,
    event_data JSONB,
    user_id TEXT,
    created_at TIMESTAMPTZ
);
```

**Usada por:**
- `GET /v1/analytics/fidelity` (calcula avg score)
- Tracking de eventos del sistema

---

### 3. `processing_queue` ✅
```sql
CREATE TABLE processing_queue (
    id UUID PRIMARY KEY,
    status TEXT,
    job_type TEXT,
    job_data JSONB,
    created_at TIMESTAMPTZ
);
```

**Usada por:**
- `GET /v1/analytics/stats` (active jobs count)

---

## 🚀 SETUP RÁPIDO

### Opción 1: Copiar SQL completo
```bash
# Ve al archivo database_schema.sql y ejecútalo en Supabase SQL Editor
```

### Opción 2: Supabase Dashboard
1. Ir a tu proyecto Supabase
2. Ir a **SQL Editor**
3. Copiar contenido de `database_schema.sql`
4. Ejecutar query
5. ✅ Done!

---

## 🧪 DATOS DE PRUEBA

El archivo `database_schema.sql` incluye:
- ✅ 5 crystals de ejemplo
- ✅ 7 eventos de analytics
- ✅ 3 trabajos en queue

**Para testing inmediato sin crear datos manualmente.**

---

## ✅ VERIFICACIÓN

Después de ejecutar el SQL, verifica que funciona:

```bash
# Test desde terminal
curl http://localhost:5000/v1/analytics/stats
curl http://localhost:5000/v1/crystals?limit=5
curl http://localhost:5000/v1/analytics/fidelity
```

**Deberías ver:**
- Total crystals: 5
- Recent crystals: Lista con títulos reales
- Fidelity: ~93%

---

## 🔥 VARIABLES DE ENTORNO

**Asegúrate de tener en `.env`:**

```env
SUPABASE_URL=https://tu-proyecto.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
```

---

## 📊 DESPUÉS DEL SETUP

Una vez ejecutado el SQL:
1. ✅ Frontend mostrará datos reales
2. ✅ Dashboard stats serán reales
3. ✅ Extension fidelity será real
4. ✅ Zero mock data

---

## 🎯 SIGUIENTE PASO

**Ejecuta `database_schema.sql` en Supabase SQL Editor**

¿Necesitas ayuda con Supabase o quieres que te guíe paso a paso?
