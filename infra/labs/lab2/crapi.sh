#!/bin/bash

if [ -f ./docker-compose.yml ]; then
    echo "crAPI is installed"
    docker compose up
else
    echo "crAPI not installed... installing"
    curl -o docker-compose.yml https://raw.githubusercontent.com/OWASP/crAPI/refs/heads/main/deploy/docker/docker-compose.yml
    docker-compose -f docker-compose.yml --compatibility up -d
    docker compose up
fi
