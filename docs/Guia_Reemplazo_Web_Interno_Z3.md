# 🛠️ Guía de Reemplazo: Servidor Web Interno (Zona 3)

**Destinatario:** Desarrollo de Infraestructura (Equipo A)
**Objetivo:** Eliminar la redundancia del contenedor WebGoat en la Zona 3 y reemplazarlo por un Servidor Intranet limpio (Nginx Hardened), manteniendo el esquema de red `macvlan`, la IP `10.2.3.3`, y la integración con el Directorio Activo/DNS.

Sigan estos tres pasos exactos para corregir el despliegue de su Zona 3.

---

## 1. Modificar el `docker-compose.yml` de Aplicaciones

Abran el archivo `PROYECTO/infra/Aplicaciones/docker-compose.yml`.
Busquen el bloque de servicio correspondiente a `webgoat` (Líneas ~101 a ~127) y **reemplácenlo íntegramente** por este nuevo servicio llamado `intranet_interna`.

> He respetado su esquema original: Mantuvimos las restricciones de recursos (limits), los escudos de privilegios (`cap_drop`, `no-new-privileges`) y la IP estática `10.2.3.3` para no romper el proxy ni el Cisco.

```yaml
  intranet_interna:
    image: nginx:1.29.7-alpine-slim
    container_name: intranet-z3
    depends_on:
      samba_dc:
        condition: service_healthy
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE
      - CHOWN
      - SETGID
      - SETUID
    read_only: true
    tmpfs:
      - /var/cache/nginx:size=50M,mode=0777
      - /var/run:size=10M,mode=0777
      - /tmp:size=50M,mode=0777
    networks:
      infra_tier:
        ipv4_address: "${APPS_WEBINT_IP:-10.2.3.3}"
    dns:
      - ${APPS_AD_IP:-10.2.3.5}
    volumes:
      # Montamos la página corporativa en solo lectura (Hardening)
      - ./web3/html:/usr/share/nginx/html:ro
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 256M
        reservations:
          cpus: '0.1'
          memory: 64M
    healthcheck:
      test: ["CMD-SHELL", "wget -qO- http://localhost:80 || exit 1"]
      interval: 10s
      timeout: 5s
      retries: 3
    restart: unless-stopped
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

---

## 2. Crear la Página Web de la Intranet

Actualmente, su carpeta `PROYECTO/infra/Aplicaciones/web3` solo contiene un archivo `Dockerfile` y un `link.txt`. Ese `Dockerfile` (que descargaba WebGoat) ya es inservible.

1. **Eliminen** el archivo `Dockerfile` ubicado en `PROYECTO/infra/Aplicaciones/web3`.
2. Dentro de la carpeta `web3`, **creen una nueva carpeta** llamada `html`.
3. Adentro de la carpeta `html`, **creen un archivo** llamado `index.html` y peguen este código HTML de simulación corporativa:

**Ruta final:** `PROYECTO/infra/Aplicaciones/web3/html/index.html`

```html
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Intranet Corporativa - Equipo A</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f4f7f6; color: #333; margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100vh; }
        .container { background-color: #fff; padding: 40px; border-radius: 8px; box-shadow: 0 4px 8px rgba(0,0,0,0.1); text-align: center; max-width: 600px; }
        h1 { color: #0056b3; }
        .alert { background-color: #fff3cd; color: #856404; padding: 15px; border-radius: 4px; border: 1px solid #ffeeba; margin-top: 20px; text-align: left; }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔒 Bóveda Intranet (Solo Empleados)</h1>
        <p>Bienvenido a la red segura de Aplicaciones (Zona 3). Su acceso está siendo auditado por el Directorio Activo (Samba AD).</p>
        
        <div class="alert">
            <strong>Aviso de RR.HH:</strong> Recuerden no utilizar sus contraseñas del dominio en la aplicación antigua DVWA, ya que está catalogada como riesgosa (Damn Vulnerable Web App).
        </div>
        
        <p style="margin-top: 30px; font-size: 0.9em; color: #777;">
            Servidor Nginx Hardened | IP Fija L2: 10.2.3.3 | Equipo A
        </p>
    </div>
</body>
</html>
```

---

## 3. Actualizar el Registro DNS (Recomendado)

Para ser perfeccionistas y que el profesor vea consistencia total, hay que cambiarle el nombre en la zona DNS.
Abran su servidor Bind9: `PROYECTO/infra/Publica/DNS/config_dns/db.equipoa.local`

Busquen la **Línea 28** y cambien esto:
* **Antes:** `webgoatint  IN      A       10.2.3.3`
* **Después:** `intranet    IN      A       10.2.3.3`

*Nota: Esto **NO** rompe mi regla del Proxy Inverso que escribí en el reporte anterior. Recientemente programé que cuando el profesor escriba `http://200.1.6.3/webint/`, el proxy enviará los paquetes a la IP dura `10.2.3.3:80`, ignorando el DNS.* 

---

## 4. Limpieza de Variables de Entorno (`.env`)

Dado que este proyecto usa de manera excelente plantillas dinámicas, debemos limpiar los rastros viejos de las variables de entorno para que el código quede consistente.

Abran el archivo `PROYECTO/infra/Aplicaciones/.env.example` (Y correspondientemente su copia real `.env` si ya la crearon). Busquen la antigua variable de WebGoat y cámbienle el nombre a la del nuevo servidor Intranet:

**Antes:**
```env
APPS_WEBGOAT_IP=10.2.3.3
```

**Después:**
```env
APPS_WEBINT_IP=10.2.3.3
```

¡Ahora sí! Con esta sincronización de variables, han purgado el código sucio y consolidado su Zona 3 como una joya arquitectónica L3 de simulaciones.
