# 🚨 RENDER BACKEND - TROUBLESHOOTING GUIDE

## Error 500 Persistente

El backend sigue crasheando. Necesitas **VER LOS LOGS DE RENDER**.

---

## 📋 PASO 1: Ver Logs de Render

1. Ve a https://dashboard.render.com
2. Selecciona tu servicio **neural-bridge-backend**
3. Click en **"Logs"** (arriba)
4. Busca líneas en **ROJO** con el error
5. **Copia el error completo** y envíamelo

---

## 🔍 PASO 2: Verificar Variables de Entorno

En Render, ve a **Settings → Environment**:

### Variables REQUERIDAS:

```env
SUPABASE_URL=https://bpoeaecirfszaipzhngl.supabase.co
SUPABASE_ANON_KEY=eyJhbGc... (tu key completa)
PORT=5000
NODE_ENV=production
```

### ¿Faltan variables?

1. Click **"Add Environment Variable"**
2. Agrega las que faltan
3. Click **"Save Changes"**
4. **Manual Deploy** (botón arriba a la derecha)

---

## 🔧 PASO 3: Verificar Supabase RLS

Si las variables están correctas, el problema es **Row Level Security**.

### En Supabase SQL Editor ejecuta:

```sql
-- Ver si RLS está activado
SELECT schemaname, tablename, rowsecurity 
FROM pg_tables 
WHERE tablename IN ('crystals', 'analytics_events');

-- Si rowsecurity = true, desactívalo temporalmente:
ALTER TABLE crystals DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE processing_queue DISABLE ROW LEVEL SECURITY;
```

---

## 🎯 PASO 4: Test Manual del Backend

Una vez que veas el deploy como **"Live"** en Render:

```bash
# Test desde terminal (o Postman)
curl https://neural-bridge-backend.onrender.com/v1/analytics/stats
```

**Respuesta esperada:**
```json
{
  "success": true,
  "stats": {
    "total_crystals": 0,
    "crystals_today": 0,
    ...
  }
}
```

**Si ves error:**
Envíame el mensaje de error completo.

---

## 📊 Errores Comunes y Soluciones

### Error: "SUPABASE_URL is not defined"
**Fix:** Agregar variable en Render Environment

### Error: "relation crystals does not exist"  
**Fix:** Ejecutar MASTER_PRODUCTION_SCHEMA.sql en Supabase

### Error: "column author does not exist"
**Fix:** Ya está arreglado en el último commit, espera deploy

### Error: "permission denied for table crystals"
**Fix:** Deshabilitar RLS (paso 3)

---

## ⚡ QUICK FIX

Si todo falla, puedes **temporalmente** hacer el backend más permisivo:

En Render, agrega esta variable:
```
DATABASE_URL=postgresql://... (connection string de Supabase)
```

Luego en el código usar un try-catch más robusto.

---

## 🎯 NEXT STEP

**MIRA LOS LOGS DE RENDER** y envíame el error exacto que aparece.

Sin ver el error específico, no puedo saber si es:
- ❌ Variables de entorno
- ❌ Supabase permissions
- ❌ Query syntax
- ❌ Otro problema

**Copia y pega el error de los logs de Render** 📋
