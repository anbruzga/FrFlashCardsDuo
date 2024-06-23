#!/bin/sh
# Source environment variables from .env file
if [ -f /app/.env-docker ]; then
  export $(cat /app/.env | xargs)
fi

# Run the application
java -jar /app/app.jar
