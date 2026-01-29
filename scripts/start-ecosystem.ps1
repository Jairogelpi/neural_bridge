# start-ecosystem.ps1
# Neural Bridge Zero-to-One Orchestrator

$RootPath = Get-Location

Write-Host "Neural Bridge Ecosystem: Iniciando el motor industrial..." -ForegroundColor Cyan

# 1. Configuracion de Entorno
Write-Host "Configurando entorno..." -ForegroundColor Yellow
if (-not (Test-Path "server/.env")) {
    $databaseUrl = $Env:DATABASE_URL
    if (-not $databaseUrl) {
        # Plantilla Supabase: reemplaza <user>, <password>, <host>, <db>
        $databaseUrl = "postgres://<user>:<password>@<host>:5432/<db>?sslmode=require"
    }

    $redisUrl = $Env:REDIS_URL
    if (-not $redisUrl) {
        # Usa Redis del compose; si quieres Redis gestionado, exporta REDIS_URL antes de correr el script
        $redisUrl = "redis://redis:6379"
    }

    $jwtKey = $Env:JWT_SIGNING_KEY
    if (-not $jwtKey) {
        # Si usas Supabase, pega aquí el JWT secret (Settings -> API -> JWT secret)
        $jwtKey = "supabase-jwt-secret-change-me"
    }

    $envContent = "ENV=dev`nPORT=8080`nDATABASE_URL=$databaseUrl`nREDIS_URL=$redisUrl`nJWT_SIGNING_KEY=$jwtKey`nJWT_TTL=24h"
    Set-Content -Path "server/.env" -Value $envContent
}

if (-not (Test-Path "dashboard/.env")) {
    Set-Content -Path "dashboard/.env" -Value "VITE_API_BASE=http://localhost:8080"
}

# 2. Iniciar Infraestructura (Docker)
Write-Host "Levantando contenedores (Postgres, Redis, API)..." -ForegroundColor Yellow
if (Test-Path "server") {
    Set-Location "server"
    docker-compose up -d
    Set-Location $RootPath
}

# 3. Construir Extension
Write-Host "Compilando extension de Chrome..." -ForegroundColor Yellow
if (Test-Path "extension") {
    Set-Location "extension"
    npm install
    npm run build
    Set-Location $RootPath
}

# 4. Finalizacion
Write-Host "Ecosistema preparado!" -ForegroundColor Green
Write-Host "------------------------------------------------"
Write-Host "1. Backend: http://localhost:8080"
Write-Host "2. Dashboard: http://localhost:3001"
Write-Host "3. Extension: Carga la carpeta extension/ en Chrome"
Write-Host "------------------------------------------------"
Write-Host "IMPORTANTE: No olvides poner tu API Key de OpenRouter en la extension (Settings -> API Key) para que la IA funcione." -ForegroundColor Red
Write-Host "------------------------------------------------"
Write-Host "Para ver el dashboard, ejecuta 'npm run dev' en la carpeta dashboard."
