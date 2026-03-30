# Infraestructura — Guía Rápida de Operación

Este directorio contiene la infraestructura del laboratorio para **Equipo A**.

## Stacks principales (fuente de verdad)

- `Publica/docker-compose.yml`
- `DMZ/docker-compose.yml`
- `Aplicaciones/docker-compose.yml`

Cada zona tiene su propio `.env` y `.env.example` para ajustar interfaz y parámetros locales del host.

## Carpetas por zona

### `Publica/`

- DNS (Bind9)
- Proxy (NGINX)
- Configs de router/switch de referencia

### `DMZ/`

- WebGoat (servicio vulnerable principal)
- Web DMZ (NGINX)
- FTP anónimo

### `Aplicaciones/`

- Samba AD/LDAP
- DVWA
- WebGoat interno
- FTP autenticado

## Importante

Los directorios `DMZ/web1`, `DMZ/web2` y `DMZ/ftpd` son **heredados de pruebas** y no deben usarse como despliegue principal del laboratorio.

## Flujo de despliegue recomendado

1. Configurar red física (switch/router/firewall).
2. Ajustar `.env` por zona.
3. Levantar contenedores zona por zona con Docker Compose.
4. Ejecutar validación de readiness y guardar evidencia.

Notas operativas:

- Dominio de referencia unificado: `equipoa.local`.
- Para laboratorio de 3 PCs (1 zona por host), usar puertos access y `*_PARENT_IFACE=enp2s2`.
- Si se usa trunk 802.1Q al host, ajustar `*_PARENT_IFACE` a subinterfaces VLAN.

Para el paso a paso completo usar:

- `docs/Guia_Despliegue_3PC_Docker.md`
- `docs/Guia_Red_Fisica_Router_Switch_Firewall.md`
- `docs/Guia_Checklist_Readiness_Operativo.md`
