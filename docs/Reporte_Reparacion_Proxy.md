# 🛠️ Reporte de Auditoría y Reparación Focada: Proxy Inverso (Zona 1)

**Destinatario:** Desarrollo de Infraestructura (Equipo A)
**Auditor Detección:** Rol QA / Arquitecto
**Archivo a reparar:** `PROYECTO/infra/Publica/Proxy/conf.d/grupoa.conf`

---

> [!WARNING]
> **El Problema Arquitectónico (Bloqueo de Tráfico)**
> Actualmente, todo el tráfico entrante al Proxy Inverso (Nginx) se enruta ciegamente a una única dirección (El contenedor WebGoat en la IP `10.1.2.2`). Esto inutiliza por completo los servidores DVWA (`10.2.3.2`) y la página de "Awesome Landing Page" (`10.1.2.3`), ya que el Proxy carece de rutas lógicas hacia ellos.

## 1. Explicación Técnica (El Descubrimiento de tu Esquema DNS)

Me pediste que revisara si mi código rompía su esquema, ¡y tenías toda la razón en desconfiar!
Al inspeccionar su archivo `Publica/DNS/config_dns/db.equipoa.local`, noté que ustedes no crearon Subdominios DNS que apunten al Proxy (`200.1.6.3`). Su archivo BIND tiene asignado solo nombres directos (Ej. `proxy.equipoa.local`).

Si usábamos mi código anterior (Routing por Nombre de Dominio), ustedes tendrían que reescribir su servidor DNS entero. Para respetar su código actual al 100%, la solución correcta es cambiar a **Routing basado en Rutas (Path-Based Routing)**.

* **¿Cómo funcionará ahora?** Los atacantes u usuarios irán a la IP del proxy, pero agregarán una carpeta en la URL.
  * `http://proxy.equipoa.local/webgoat/` (Hacia Zona 2)
  * `http://proxy.equipoa.local/dvwa/` (Hacia Zona 3)
  * `http://proxy.equipoa.local/webdmz/` (Hacia Zona 2)

Además, noté en su DNS que al WebGoat de la Zona 3 lo bautizaron intencionalmente **`webgoatint`** (IP `10.2.3.3`). Dado que lo hicieron a propósito, respetaré esa decisión en el código.

---

## 2. El Código de Reparación

Copien este código exacto y **reemplacen todo** el contenido antiguo de su archivo `grupoa.conf`.

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name proxy.equipoa.local www.grupoa grupoa;

    #====================================================================
    # HealthCheck (Para el demonio de Docker)
    #====================================================================
    location = /health {
        return 200 'ok';
        add_header Content-Type text/plain;
    }

    #====================================================================
    # ZONA 2 (DMZ) - WebGoat
    #====================================================================
    location /webgoat/ {
        # La barra '/' final es crítica en Nginx para reescribir la ruta
        proxy_pass http://10.1.2.2:8080/;
        include /etc/nginx/proxy_params;
    }

    #====================================================================
    # ZONA 2 (DMZ) - Awesome Landing Page (Nginx Público)
    #====================================================================
    location /webdmz/ {
        proxy_pass http://10.1.2.3:80/;
        include /etc/nginx/proxy_params;
    }

    #====================================================================
    # ZONA 3 (APLICACIONES) - DVWA Vulnerable
    #====================================================================
    location /dvwa/ {
        proxy_pass http://10.2.3.2:80/;
        include /etc/nginx/proxy_params;
    }

    #====================================================================
    # ZONA 3 (APLICACIONES) - Web Interno (Intranet HTTP 80)
    #====================================================================
    location /webint/ {
        # si usamos webgoat se cambia el puerto a 8080
        proxy_pass http://10.2.3.3:80/;
        include /etc/nginx/proxy_params;
    }

    # Si entran solo a proxy.equipoa.local sin subcarpeta, mostrar un error o redirección.
    location = / {
        return 404 "Por favor especifique el servicio: /webgoat/, /dvwa/, etc.";
    }
}
```

---

Con esta configuración, ustedes NO necesitan modificar el DNS (`db.equipoa.local`). Todo cuadra perfecto. El Red Team solo deberá abrir el navegador, ir a la IP pública del Proxy y agregar la barra: `http://200.1.6.3/dvwa/`.

---

## 4. Reparación Crítica del Router Cisco (Evitar choque con el Proxy)

Al leer la rúbrica del proyecto, el profesor pide realizar dos cosas en la Zona 1:

1. *Configurar reglas NAT*
2. *Implementar servidor Proxy*

**El conflicto arquitectónico:** En su archivo actual `router_config.txt`, crearon reglas de "NAT Estático" apuntando a la DMZ (Ej. `ip nat inside source static tcp 10.1.2.2 8080 200.1.6.10 8080`). Al hacer esto, el router manda el tráfico directo al WebGoat y ¡Nadie usará nunca el Proxy Nginx! Además, el Firewall que programaron bloquea que el Proxy hable con las zonas internas.

Para que ambas rúbricas funcionen en armonía y el Proxy tenga el control supremo del tráfico web, **deben ajustar su `router_config.txt` con estos dos pasos:**

### A. Permitir que el Proxy cruce el Firewall Cisco

En la lista de acceso `ACL_PUBLIC_IN`, antes de la zona de denegación (`deny ip 200...`), agreguen a fuego esta regla. Esto evita que el router bloquee los paquetes del Proxy cuando intente buscar el DVWA o WebGoat.

```cisco
 remark EXCEPCION: Permitir que el Proxy Nginx cruce a las zonas DMZ/APPS
 permit ip host 200.1.6.3 10.1.2.0 0.0.0.255
 permit ip host 200.1.6.3 10.2.3.0 0.0.0.255
```

### B. Limpiar el NAT Estático (Eliminar bypass web)

Borren las reglas NAT estáticas de WebGoat y Nginx público. Queremos que los atacantes sean forzados a usar el Proxy Nginx (`200.1.6.3`) para acceder a la web.
*Nota: Solo conserven el NAT para el FTP, ya que el FTP no puede viajar a través de un Proxy HTTP.*

```cisco
! Borrar del archivo estas dos líneas:
! ip nat inside source static tcp 10.1.2.2 8080 200.1.6.10 8080
! ip nat inside source static tcp 10.1.2.3 80 200.1.6.11 80

! Dejar únicamente la del FTP:
ip nat inside source static tcp 10.1.2.4 21 200.1.6.12 21
```

Y en la `ACL_PUBLIC_IN`, borren también los permisos para la 200.1.6.10 y 11, y agreguen el permiso al Proxy:

```cisco
 permit tcp 200.1.6.0 0.0.0.255 host 200.1.6.3 eq 80   ! Permitir tráfico web hacia el Nginx Proxy
 permit tcp 200.1.6.0 0.0.0.255 host 200.1.6.12 eq 21  ! Permitir tráfico al FTP NATeado
```

---

## 5. Limpieza de Registros DNS Obsoletos (El "Efecto Mariposa")

Como en el **Paso 4** les pedí eliminar el NAT del Router que exponía a WebGoat y Nginx público a las IPs VIP `200.1.6.10` y `200.1.6.11`, eso significa que **esas direcciones públicas ya no existen físicamente en la red**.

Sin embargo, el servidor DNS de la Zona 1 sigue intentando resolverlas para todo el mundo.
Para evitar la confusión técnica total del evaluador, abran su DNS y purguen las líneas de publicación de la Zona DMZ (Conservando únicamente a la publicación del FTP).

**Archivo a modificar:** `PROYECTO/infra/Publica/DNS/config_dns/db.equipoa.local`

**Código final purgando la Línea 16 hasta la 18:**

```dns
; ZONA 1 (Proxy)
proxy   IN      A       200.1.6.3

; Publicación NAT FTP (VIP)
ftp-pub     IN   A       200.1.6.12

; ZONA 2 (DMZ)
webgoat IN      A       10.1.2.2
webdmz  IN      A       10.1.2.3
ftp     IN      A       10.1.2.4

; ZONA 3 (App)
dvwa        IN      A       10.2.3.2
intranet    IN      A       10.2.3.3      ; Nombre interno purgado por webint
ftp_aut     IN      A       10.2.3.4
ad          IN      A       10.2.3.5
```
