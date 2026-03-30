# Guía de Despliegue Docker en 3 Computadores (1 zona por host)

Esta guía deja el laboratorio listo para operar con **3 computadores físicos** conectados a switch/router/firewall del rack.

## 1) Arquitectura objetivo

- **PC-1 (Zona Pública / NAT):** `200.1.6.0/24`
- **PC-2 (Zona DMZ):** `10.1.2.0/24`
- **PC-3 (Zona Aplicaciones):** `10.2.3.0/24`

### Stacks activos (usar solo estos)

- `infra/Publica/docker-compose.yml`
- `infra/DMZ/docker-compose.yml`
- `infra/Aplicaciones/docker-compose.yml`

> No usar para despliegue principal: `infra/DMZ/web1`, `infra/DMZ/web2`, `infra/DMZ/ftpd` (son heredados de pruebas unitarias/locales).

---

## 2) Prerrequisitos por host

- Docker Engine + Docker Compose instalados.
- Tarjeta de red conectada al switch del laboratorio.
- Permisos para crear macvlan en el host.
- Hora del sistema sincronizada (crítico para AD/Kerberos).

Comprobar:

```bash
docker --version
docker compose version
```

---

## 3) Configurar variables por zona (`.env`)

Cada zona tiene su propio archivo `.env` listo:

- `infra/Publica/.env`
- `infra/DMZ/.env`
- `infra/Aplicaciones/.env`

Si la interfaz del host no se llama como en el ejemplo, cambiar **solo** `*_PARENT_IFACE`.

### Ejemplo típico por host

- PC-1 Pública: `PUBLIC_PARENT_IFACE=enp2s2`
- PC-2 DMZ: `DMZ_PARENT_IFACE=enp2s2`
- PC-3 Apps: `APPS_PARENT_IFACE=enp2s2`

> Recomendado para 3 PCs (1 zona por host): puertos access en switch y `enp2s2` en cada host.
>
> Opción avanzada: si el host recibe trunk 802.1Q, usar subinterfaces (`enp2s2.40`, `enp2s2.20`).

---

## 4) Inicialización por zona

### 4.1 Zona Pública (PC-1)

```bash
cd infra/Publica
docker compose --env-file .env config
docker compose --env-file .env up -d
docker compose ps
```

Servicios esperados:

- DNS Bind9: `200.1.6.2`
- Proxy NGINX: `200.1.6.3`

### 4.2 Zona DMZ (PC-2)

```bash
cd infra/DMZ
docker compose --env-file .env config
docker compose --env-file .env up -d
docker compose ps
```

Servicios esperados:

- WebGoat DMZ: `10.1.2.2`
- Web DMZ: `10.1.2.3`
- FTP anónimo: `10.1.2.4`

### 4.3 Zona Aplicaciones (PC-3)

Antes de levantar, confirmar secreto AD:

```bash
cd infra/Aplicaciones
cp -n secrets/samba_pass.txt.example secrets/samba_pass.txt
```

Luego:

```bash
docker compose --env-file .env config
docker compose --env-file .env up -d
docker compose ps
```

Validar además en `.env`:

- `AD_DOMAIN_DNS=equipoa.local`
- `AD_DOMAIN_NETBIOS=EQUIPOA.LOCAL`

Servicios esperados:

- AD/LDAP: `10.2.3.5`
- DVWA: `10.2.3.2`
- WebGoat interno: `10.2.3.3`
- FTP autenticado: `10.2.3.4`

---

## 5) Validación técnica mínima (Readiness)

### DNS

```bash
dig @200.1.6.2 webgoat.equipoa.local
dig @200.1.6.2 ad.equipoa.local
dig @200.1.6.2 webgoat-pub.equipoa.local
```

### Proxy

```bash
curl -i http://200.1.6.3/health
curl -I http://200.1.6.3
```

### DMZ

```bash
curl -I http://10.1.2.3
nc -zv 10.1.2.4 21
```

Prueba de publicación NAT (si se usa bloque NAT del router):

```bash
curl -I http://200.1.6.10:8080
curl -I http://200.1.6.11
nc -zv 200.1.6.12 21
```

### Apps

```bash
nc -zv 10.2.3.5 389
curl -I http://10.2.3.2
nc -zv 10.2.3.4 21
```

---

## 6) Orden recomendado de encendido

1. Encender y configurar switch/router/firewall.
2. Levantar Zona Pública.
3. Levantar Zona DMZ.
4. Levantar Zona Aplicaciones.
5. Ejecutar validaciones de readiness y guardar evidencia en `qa_testing/Sprint_1/`.

---

## 7) Troubleshooting rápido

- **No levanta macvlan:** revisar interfaz en `.env` (`*_PARENT_IFACE`).
- **No resuelve DNS:** validar `named.conf.options`, `db.equipoa.local`, y reachability a `200.1.6.2`.
- **AD inestable:** revisar tiempo del host y secreto `samba_pass.txt`.
- **FTP autenticado falla:** confirmar `infra/Aplicaciones/configs/pureftpd-ldap.conf` y bind DN.
- **Proxy sin tráfico:** verificar `infra/Publica/Proxy/conf.d/grupoa.conf` y reachability a `10.1.2.2:8080`.
