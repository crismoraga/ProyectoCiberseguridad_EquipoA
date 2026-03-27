# Guía de Configuración de Active Directory (Samba4) - Sprint 1

Esta guía proporciona la plantilla exacta para que el equipo implemente el Controlador de Dominio de Active Directory usando el contenedor [`nowsci/samba-domain`](https://hub.docker.com/r/nowsci/samba-domain) en la **Zona 3**.

## 1. El Archivo `docker-compose.yml` (Zona 3)
A diferencia de Bind9, la imagen de Samba AD de Nowsci es **"auto-provisionable"**. Esto significa que el "Coder" no tieen que crear archivos de texto complicados a mano iniciales; el contenedor se configura solo la primera vez que arranca basándose en **Variables de Entorno (`environment`)**.

Para la Zona 3 (IPs en la subred `10.2.3.0/24`), el servicio se debe declarar así:

```yaml
services:
  samba-ad:
    image: nowsci/samba-domain:latest
    container_name: ad_zona3
    environment:
      - DOMAIN=equipoa.local            # Cambiar por su dominio corporativo
      - DOMAINPASS=Password123!         # Clave del Administrador del Dominio (¡Debe ser compleja!)
      - HOSTIP=10.2.3.6                 # Importante: Poner la IP estática que le darán a este contenedor
      - DNSFORWARDER=200.1.6.5          # Apuntar a la IP de su Bind9 (Zona 1) o 8.8.8.8 si Binding falla
      - INSECURELDAP=true               # Permite probar LDAP por el puerto 389 (Solo para Sprint 1)
      - NOCOMPLEXITY=true               # VITAL PARA EL LAB: Permite crear contraseñas débiles (ej. "admin") para que el Red Team las crackee.
    ports:
      - "53:53/tcp"       # DNS Interno del Dominio
      - "53:53/udp"
      - "88:88/tcp"       # Kerberos (Validación de tickets TGT)
      - "88:88/udp"
      - "135:135/tcp"     # RPC (Llamadas a procedimientos remotos)
      - "137:137/udp"     # NetBIOS Name Service (Descubrimiento Windows)
      - "138:138/udp"     # NetBIOS Datagram
      - "139:139/tcp"     # NetBIOS Session Service
      - "389:389/tcp"     # LDAP estándar (Directorio abierto)
      - "389:389/udp"
      - "445:445/tcp"     # SMB (Carpetas compartidas y SYSVOL)
      - "464:464/tcp"     # Kerberos kpasswd (Para ataque/cambio de claves)
      - "464:464/udp"
      - "636:636/tcp"     # LDAPS (LDAP Seguro / Cifrado)
      - "3268:3268/tcp"   # Global Catalog LDAP (Búsquedas rápidas AD)
      - "3269:3269/tcp"   # Global Catalog LDAPS
    cap_add:
      - SYS_ADMIN         # Requerido nativamente para que Samba escriba permisos/ACL de Windows
    volumes:
      - ./samba_data/etc:/etc/samba
      - ./samba_data/lib:/var/lib/samba
      - /etc/localtime:/etc/localtime:ro # Vital: Kerberos fallará si el reloj no está sincronizado
    # networks:
    #   zona3_net:
    #     ipv4_address: 10.2.3.6
    # ------------------------------------------------------------------------------
    # NOTA: 
    # Las 3 líneas de arriba están comentadas a propósito para que el contenedor
    # no te dé error hoy ("network undefined") si lo pruebas de forma aislada.
    # Descoméntalas (bórrales el #) EXCLUSIVAMENTE cuando ya hayas armado el 
    # bloque maestro de redes "networks:" al final de tu archivo docker-compose total.
```

---

## 2. Puntos Clave para el Coder
1. **Volúmenes (`volumes`):** Es vital mapear las carpetas `/etc/samba` y `/var/lib/samba` como muestra el código. Si no lo hacen, cada vez que apaguen Docker, perderán a todos los usuarios creados y el Active Directory se corromperá.
2. **`HOSTIP`:** Esta imagen necesita saber qué IP tiene para configurar sus propios registros DNS de Active Directory internamente. Pongan ahí la IP de la Zona 3 (ej. `10.2.3.6`).
3. **`DOMAINPASS`:** Active Directory es muy exigente por defecto. La contraseña DEBE tener mayúsculas, minúsculas, números y caracteres especiales. Si ponen "12345", el contenedor fallará al encender.

---

## 3. Consideraciones para Integración (Hunter/QA)
Una vez que el contenedor levante (puede tardar un minuto la primera vez mientras genera la base de datos corporativa), el servidor FTP Autenticado (`pure-ftpd`) de la Zona 3 deberá configurarse apuntando a la IP `10.2.3.6` por el puerto `389` usando el dominio `equipoa.local`.

---

## 4. Respuestas a Problemas Comunes (Troubleshooting)

**P: El contenedor se reinicia infinitamente en un ciclo ("Crash Loop") cuando intento prenderlo la primera vez.**
**R:** Esto casi siempre significa que los volúmenes `./samba_data/etc` no se crearon localmente o Docker no tiene permisos de escritura en la carpeta del proyecto de tu Ubuntu. Verifica que el comando de Docker se corrió en una carpeta donde tu usuario tenga permisos totales para escribir archivos.

**P: Intento conectarme desde el Kali a los servicios corporativos por Kerberos, o hacer un Pass-The-Hash, pero me da un error de validación extraño como "Clock skew too great".**
**R:** Kerberos exige que ambas máquinas (Tu Kali y el contenedor Samba) tengan la hora casi idéntica (diferencia menor a 5 minutos). Si esto falla, verifica el reloj interno de tu Kali Linux o del contenedor conectándote y revisando la hora (`date`). Por eso agregué el volumen de `/etc/localtime` al archivo de configuración.

**P: ¿Las contraseñas de los usuarios internos del AD tienen que usar símbolos o números?**
**R:** Normalmente sí, pero gracias al parámetro `NOCOMPLEXITY=true` que agregamos en las variables de entorno, el equipo podrá configurar las contraseñas más ridículamente sencillas del mundo (ej. "hola" o "1234") para permitir ataques de diccionario en la fase Ofensiva (Sprint 4).
