#!/bin/sh
set -e

# Wait for the database to be ready
echo "Waiting for database to be ready..."
sleep 2

# Start the application
echo "Starting application..."
npm run start:prod
