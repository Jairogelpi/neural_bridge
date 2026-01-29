# 🎯 Neural Bridge: Real-World Experience Manifest

Este documento orquestra la experiencia "irrefutable" del ecosistema Neural Bridge. Al seguir estos pasos, tendrás **exactamente la misma infraestructura** que un cliente Pro en el mundo real.

---

## 🛠️ Stack Detrás de la Magia

| Componente | Rol en el Mundo Real | Versión Demo |
|------------|-----------------------|--------------|
| **Chrome Extension** | El "Cerebro" en el navegador | 1.0 (Real LLM Calls) |
| **Go Backend** | API Industrial de Gestión | Docker Container (v1.2) |
| **PostgreSQL** | Persistencia de Crystals y Métricas | Docker (v16.0) |
| **Vite Dashboard** | Analytics de ROI y Ahorro | Local Host (Port 3001) |

---

## 🔐 Gestión de Secretos e Infraestructura

Para que la experiencia sea 100% real, cada pieza tiene su lugar:

### 1. Inteligencia (OpenRouter API)
- **Dónde va**: Se introduce en el icono ⚙️ (Settings) del **Popup de la Extensión**.
- **Por qué**: Así es como un cliente real gestiona su propio presupuesto de IA. La clave no se guarda en el servidor, solo en tu navegador (AES-256 local storage).

### 2. Base de Datos (PostgreSQL)
- **Dónde va**: Se auto-genera en un contenedor Docker.
- **Esfuerzo**: **Cero**. El script de inicio configura el esquema automáticamente usando [migrate.sql](file:///c:/Users/jairo/Desktop/neural_bridge/server/internal/db/migrate.sql).

### 3. Memoria (Redis)
- **Dónde va**: Contenedor Docker dedicado.
- **Función**: Gestiona la idempotencia y las sesiones de alta velocidad, tal como lo haría en producción.

---

## 🚦 Troubleshooting de Infraestructura

> [!WARNING]
> Si el script falla al levantar Docker:
> 1. Asegúrate de que **Docker Desktop** esté abierto.
> 2. Si es la primera vez, el comando `docker pull` puede tardar unos segundos en descargar Postgres 16 y Redis 7.

---

### 3. Carga en el Navegador
1. Ve a `chrome://extensions`.
2. Activa **Developer Mode**.
3. **Load Unpacked** → Selecciona la carpeta `extension/`.

---

## 🧪 El "Real World" Loop

Para validar que la experiencia es 100% auténtica:

1. **Capture**: Ve a ChatGPT y captura un contexto complejo.
2. **Dashboard**: Entra en `http://localhost:3001`. Verás aparecer tu sesión de captura en tiempo real.
3. **Mesh**: Abre Claude. Verás el aviso automático *"context received"*.
4. **Transfer**: Inyecta y verifica. El Dashboard actualizará tu **Success Rate** y **USD Savings**.

---

## 🛑 Notas Técnicas
- El backend corre en `http://localhost:8080`.
- Los datos se guardan en el volumen de Docker `pgdata`.
- Si cambias la API Key en la extensión, se sincroniza instantáneamente con el motor de precios dinámico.
