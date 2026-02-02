#!/bin/bash
# Neural Bridge - Database Migration Utility
# Usage: ./migrate.sh <database_url>

set -e

DB_URL=$1
MIGRATION_FILE="./server/internal/db/migrate.sql"

if [ -z "$DB_URL" ]; then
    echo "Error: DATABASE_URL is missing."
    echo "Usage: ./migrate.sh \"postgres://user:pass@host:5432/db\""
    exit 1
fi

if [ ! -f "$MIGRATION_FILE" ]; then
    echo "Error: Migration file not found at $MIGRATION_FILE"
    exit 1
fi

echo "🚀 Starting database migration..."

# Using psql if available, otherwise suggest using the server's auto-migrate
if command -v psql >/dev/null 2>&1; then
    psql "$DB_URL" -f "$MIGRATION_FILE"
    echo "✅ Migration completed successfully using psql."
else
    echo "⚠️  psql not found. Migrations are handled automatically by the Go backend on startup."
    echo "To run manually, install postgresql-client."
fi
