# Guía de Configuración Básica de BIND9 (Ubuntu) - Sprint 1

Esta guía es un desglose práctico ("Recetario") para el Coder, enfocado exclusivamente en lograr la meta de **Readiness** de la **Zona 1**. Utiliza como base el formato estándar de la Wiki de Ubuntu para BIND9.

## 1. Estructura de Archivos Locales (El Volumen)

En la carpeta donde repose el `docker-compose.yml` de la **Zona 1**, el Coder debe crear una carpeta llamada `config_dns`. El `docker-compose.yml` montará esta carpeta así:

```yaml
    volumes:
      - ./config_dns:/etc/bind
```

---

## 2. Los 3 Archivos Clave que el Coder debe Crear

Dentro de la carpeta `config_dns`, deben existir exactamente estos tres archivos de configuración de texto plano:

### Archivo 1: `named.conf.options`

Este archivo dicta las opciones de seguridad y consultas externas (hacia internet).

```text
acl "trusted_zones" {
    127.0.0.0/8;
    200.1.6.0/24;  # Zona 1 - Publica
    10.1.2.0/24;   # Zona 2 - DMZ
    10.2.3.0/24;   # Zona 3 - Aplicaciones
};

options {
    directory "/var/cache/bind";

    recursion yes;
    allow-query { trusted_zones; localhost; localnets; };
    allow-recursion { trusted_zones; localhost; localnets; };

    # Forwarders: Si el DNS del lab no sabe una respuesta (ej. google.com), le pregunta a estos:
    forwarders {
        8.8.8.8;
        1.1.1.1;
    };

    dnssec-validation auto;
    listen-on { any; };
    listen-on-v6 { any; };
};
```

### Archivo 2: `named.conf.local`

Aquí declaramos que el Equipo A es "dueño" del dominio local de prueba (reemplazar `equipoa.local` por el dominio que defina su Topología).

```text
zone "equipoa.local" {
    type master;
    file "/etc/bind/db.equipoa.local"; # La ruta como la ve el contenedor, no el host
};
```

### Archivo 3: `db.equipoa.local` (El Archivo de Zona)

El corazón del DNS. Aquí mapeamos nombres amigables con las direcciones IP internas de los demás contenedores del Equipo A.

```text
$TTL    604800
@       IN      SOA     ns1.equipoa.local. admin.equipoa.local. (
                              2         ; Serial
                         604800         ; Refresh
                          86400         ; Retry
                        2419200         ; Expire
                         604800 )       ; Negative Cache TTL
;
; Name Servers
@       IN      NS      ns1.equipoa.local.
ns1     IN      A       200.1.6.2       ; IP del contenedor DNS en Zona 1

; ZONA 1 (Proxy)
proxy   IN      A       200.1.6.3       ; IP del contenedor Nginx de Z1

; Publicación NAT de DMZ (VIPs en Zona 1)
webgoat-pub IN   A       200.1.6.10
webdmz-pub  IN   A       200.1.6.11
ftp-pub     IN   A       200.1.6.12

; ZONA 2 (DMZ)
webgoat IN      A       10.1.2.2        ; WebGoat principal DMZ
webdmz  IN      A       10.1.2.3        ; Web DMZ
ftp     IN      A       10.1.2.4        ; FTP anónimo

; ZONA 3 (App)
dvwa        IN  A       10.2.3.2
webgoatint  IN  A       10.2.3.3
ftp_aut     IN  A       10.2.3.4
ad          IN  A       10.2.3.5        ; Samba AD Controller
```

---

## 3. Consideraciones para el Equipo Ofensivo (Red Team)

Esta configuración inicial tiene `recursion yes;`, lo que significa que el servidor DNS realizará búsquedas externas para cualquier IP del laboratorio. En el **Sprint 3 (Hardening)**, investigarás cómo limitar esto y aplicar *Rate Limiting* para evitar un ataque de *DNS Amplification (DDoS)* que un atacante desde el Kali podría simular.

---

## 4. Respuestas a Problemas Comunes (Troubleshooting)

**P: Al ejecutar el `docker-compose up`, sale un error diciendo que "El puerto 53 ya está en uso".**
**R:** Este es el problema más clásico en Ubuntu. Ubuntu nativo usa el servicio `systemd-resolved` que acapara el puerto 53 en la IP `127.0.0.53`. El Coder deberá apagar ese servicio temporalmente en el host físico (`sudo systemctl stop systemd-resolved`) para que el contenedor de Docker pueda "apropiarse" del puerto 53 hacia el exterior.

**P: Hice ping a `webgoat.equipoa.local` y el DNS resolvió la IP bien (`10.1.2.2`), pero al abrir el navegador sale "Página no encontrada". ¿Qué falló?**
**R:** Nada falló en el DNS. El trabajo del DNS es solo *"traducir el nombre a un número IP"*. Si te dio la IP, el DNS está perfecto. El problema suele ser que el Proxy Nginx o el contenedor de WebGoat no tienen ese puerto abierto.

**P: ¿Qué pasa si el contenedor muere por problemas con los archivos de zona (`db.equipoa.local`)?**
**R:** Revisa minuciosamente los punto y comas (`;`) en el archivo de texto. El DNS de Linux (Bind9) es implacable con los errores de tipeo; si te falta un `;` al final de una línea o dejaste un espacio en blanco donde no iba, el contenedor se caerá durante el arranque por seguridad.
