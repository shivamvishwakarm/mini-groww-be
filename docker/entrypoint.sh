#!/bin/sh
set -e

echo "Waiting for MongoDB..."
until nc -z mongodb 27017; do
  echo "MongoDB is unavailable - sleeping"
  sleep 1
done
echo "MongoDB is up!"

echo "Waiting for Redis..."
until nc -z redis 6379; do
  echo "Redis is unavailable - sleeping"
  sleep 1
done
echo "Redis is up!"

# Run seed script if SEED_DATA environment variable is set
if [ "$SEED_DATA" = "true" ]; then
  echo "Seeding database..."
  npm run seed:prod
  echo "Seeding completed!"
fi

# Start the application
exec "$@"
