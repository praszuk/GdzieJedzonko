#!/bin/bash

# Try to apply database migrations
echo "Apply database migrations"
until python manage.py migrate 2>/dev/null; do
    sleep 4
    echo "Waiting for database...Retry!";
done

# Start server
echo "Starting server"
# python manage.py runserver 0.0.0.0:8000
gunicorn backend.wsgi:application --bind 0.0.0.0:8000