#!/bin/bash
# infra/labs/lab2/crapi.sh

# Terminar la ejecución si ocurre un error
set -e

echo "[*] Verificando el entorno de crAPI..."

if [ -f ./docker-compose.yml ]; then
    echo "[+] Archivo docker-compose.yml detectado. Levantando contenedores..."
    docker compose up -d
else
    echo "[-] crAPI no está instalado. Descargando configuración oficial..."
    curl -s -o docker-compose.yml https://raw.githubusercontent.com/OWASP/crAPI/refs/heads/main/deploy/docker/docker-compose.yml
    
    echo "[+] Desplegando infraestructura..."
    docker compose --compatibility up -d
fi

echo "[+] Entorno crAPI operativo en segundo plano. Ingresa a http://127.0.0.1:8888"
