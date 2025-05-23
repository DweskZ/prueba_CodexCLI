#!/bin/sh

# Esperar a que la base de datos esté lista
echo "⏳ Esperando a PostgreSQL en $DB_HOST:$DB_PORT..."

while ! nc -z $DB_HOST $DB_PORT; do
  sleep 0.5
done

echo "✅ PostgreSQL está listo. Iniciando backend..."
exec "$@"