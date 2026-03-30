# Checklist de Hardening Inicial — Sprint 1

## Controles ya implementados en repositorio (pre-validación en sala)

- [x] Segmentación por zonas y direccionamiento fijo en `docker-compose`.
- [x] DNS con `allow-query`/`allow-recursion` restringido a redes confiables.
- [x] Proxy con endpoint `/health` y upstream explícito a servicio DMZ.
- [x] NAT y ACL base documentados para router perimetral.
- [x] Variables de entorno por zona (`.env.example`) para despliegue controlado.
- [x] Secreto local para admin AD separado de configuración principal.

> Los checks siguientes se validan operativamente durante montaje físico en sala.

## Zona 1 — Pública/NAT
### DNS (Bind9)
- [ ] Limitar consultas a zonas confiables
- [ ] Revisar necesidad de recursión y ajustar
- [ ] Validar logging de consultas/errores

### Proxy (NGINX)
- [ ] Headers básicos de seguridad
- [ ] Rutas/proxy_pass solo a destinos permitidos
- [ ] Evitar exposición de información sensible de versión

## Zona 2 — DMZ
### WebGoat / Web DMZ
- [ ] Mantener servicios mínimos activos
- [ ] Validar aislamiento de red respecto a Zona 3
- [ ] Registrar intentos de acceso relevantes

### FTP Anónimo
- [ ] Restringir alcance de escritura
- [ ] Validar permisos de directorio
- [ ] Verificar puertos pasivos acotados

## Zona 3 — Aplicaciones
### Samba AD/LDAP
- [ ] Contraseña de administrador definida en secreto local
- [ ] Validar resolución DNS y sincronía horaria
- [ ] Verificar servicios de directorio operativos

### DVWA / FTP Autenticado
- [ ] Conectividad interna segmentada
- [ ] FTP autenticado conectado a identidad (LDAP/AD)
- [ ] Revisar exposición innecesaria de puertos

## Cierre de checklist
- **Responsable QA:** Catalina
- **Aprobación Líder:** Pendiente
- **Estado:** En progreso
