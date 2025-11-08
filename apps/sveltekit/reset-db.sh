#!/bin/bash
# Reset PayloadCMS PostgreSQL database

echo "Dropping and recreating database..."
PGPASSWORD=postgres psql -U postgres -h localhost -c "DROP DATABASE IF EXISTS payload;"
PGPASSWORD=postgres psql -U postgres -h localhost -c "CREATE DATABASE payload;"
echo "Database reset complete!"
