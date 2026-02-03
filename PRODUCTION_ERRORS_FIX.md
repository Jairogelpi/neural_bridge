# 🔧 ERRORES EN PRODUCCIÓN - DIAGNÓSTICO

## ❌ Errores Detectados

### 1. Backend 500 Error
```
neural-bridge-backend.onrender.com/v1/analytics/stats: 500
```

**Causa:** El servidor backend está crasheando al procesar la petición.

**Posibles razones:**
- Variables de entorno faltantes en Render
- Supabase connection string incorrecta
- Código con errores de runtime

---

### 2. Supabase 400 Error en Crystals
```
supabase.co/rest/v1/crystals?select=context_id,domain,author,intent,metadata: 400
```

**Causa:** Columnas solicitadas no existen en la tabla `crystals`.

**Problema:** El schema en Supabase no coincide con el código.

---

### 3. Supabase 404 Error
```
supabase.co/rest/v1/sentinel_stats: 404
```

**Causa:** La tabla `sentinel_stats` NO EXISTE en Supabase.

---

### 4. Extension JavaScript Error
```
Cannot read properties of undefined (reading 'observe')
```

**Causa:** El código de la extensión intenta acceder a MutationObserver que no está disponible.

---

## ✅ SOLUCIONES

### PASO 1: Ejecutar SQL en Supabase (CRÍTICO) ⚠️

**Debes hacer esto PRIMERO:**

1. Abre tu proyecto Supabase
2. Ve a **SQL Editor**
3. Copia y ejecuta **TODO** el contenido de:
   ```
   MASTER_PRODUCTION_SCHEMA.sql
   ```
4. Esto creará:
   - ✅ Tabla `crystals` con columnas correctas
   - ✅ Tabla `analytics_events`
   - ✅ Tabla `processing_queue`
   - ✅ Y todas las demás tablas necesarias

---

### PASO 2: Variables de Entorno en Render

**Backend debe tener:**

```env
SUPABASE_URL=https://bpoeaecirfszaipzhngl.supabase.co
SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_KEY=tu-service-role-key-aqui (opcional)
PORT=5000
NODE_ENV=production
```

**Cómo agregar en Render:**
1. Ve a tu servicio backend en Render
2. Settings → Environment
3. Agrega las variables
4. Redeploy

---

### PASO 3: Verificar RLS Policies en Supabase

**Problema:** Las queries están siendo bloqueadas por Row Level Security.

**Solución temporal (para testing):**

En Supabase SQL Editor:
```sql
-- Deshabilitar RLS temporalmente para testing
ALTER TABLE crystals DISABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events DISABLE ROW LEVEL SECURITY;
ALTER TABLE processing_queue DISABLE ROW LEVEL SECURITY;
```

**Nota:** Para producción deberás crear policies correctas.

---

### PASO 4: Fix Extension Error

El error `observe` se resolverá una vez el backend funcione.

---

## 📋 CHECKLIST DE VERIFICACIÓN

Ejecuta en orden:

- [ ] **1. SQL ejecutado en Supabase** (MASTER_PRODUCTION_SCHEMA.sql)
- [ ] **2. Variables de entorno en Render** (SUPABASE_URL, SUPABASE_ANON_KEY)
- [ ] **3. RLS deshabilitado** (temporalmente)
- [ ] **4. Backend redeployado** en Render
- [ ] **5. Test endpoint:** `curl https://neural-bridge-backend.onrender.com/v1/analytics/stats`

---

## 🎯 ORDEN DE EJECUCIÓN

```bash
1. Supabase → SQL Editor → Ejecutar MASTER_PRODUCTION_SCHEMA.sql
2. Supabase → SQL Editor → Ejecutar disable RLS queries
3. Render → Backend Settings → Add Environment Variables
4. Render → Manual Deploy
5. Test en navegador
```

---

## 🔍 VERIFICAR SI FUNCIONA

Después de los pasos, deberías ver:

✅ **Backend:** Status 200 (no 500)  
✅ **Supabase:** Status 200 (no 400/404)  
✅ **Extension:** Sin errores en consola  
✅ **Dashboard:** Datos reales mostrados

---

## 📞 SIGUIENTE PASO

**Ejecuta el SQL primero.** Ese es el 80% del problema.

¿Necesitas ayuda con algún paso específico?
