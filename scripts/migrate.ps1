# migrate.ps1
# Neural Bridge - Database Migration Utility (Windows/Dev)

param (
    [string]$DatabaseUrl = $env:DATABASE_URL
)

$MigrationFile = "server/internal/db/migrate.sql"

if (-not $DatabaseUrl) {
    Write-Host "Error: DATABASE_URL is missing." -ForegroundColor Red
    Write-Host "Usage: .\migrate.ps1 -DatabaseUrl 'postgres://...'"
    exit 1
}

if (-not (Test-Path $MigrationFile)) {
    Write-Host "Error: Migration file not found at $MigrationFile" -ForegroundColor Red
    exit 1
}

Write-Host "🚀 Iniciando migración de base de datos..." -ForegroundColor Cyan

# Check if psql is available
$psqlPath = Get-Command psql -ErrorAction SilentlyContinue

if ($psqlPath) {
    try {
        & psql $DatabaseUrl -f $MigrationFile
        Write-Host "✅ Migración completada con éxito." -ForegroundColor Green
    } catch {
        Write-Host "❌ Error durante la migración: $_" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "⚠️ psql no encontrado en el PATH." -ForegroundColor Yellow
    Write-Host "Las migraciones se ejecutan automáticamente al iniciar el servidor Go."
    Write-Host "Si quieres ejecutarlas manualmente, instala PostgreSQL y añade bin/ a tu PATH."
}
