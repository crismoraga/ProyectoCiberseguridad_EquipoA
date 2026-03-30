# Inventario de Activos — Equipo A

## Servicios principales
| Activo | Zona | Segmento | Función |
|---|---|---|---|
| DNS (Bind9) | Pública/NAT | 200.1.6.0/24 | Resolución interna del laboratorio |
| Proxy (NGINX) | Pública/NAT | 200.1.6.0/24 | Exposición controlada de servicios DMZ |
| WebGoat DMZ | DMZ | 10.1.2.0/24 | Aplicación vulnerable principal |
| Web DMZ | DMZ | 10.1.2.0/24 | Servicio web expuesto |
| FTP Anónimo | DMZ | 10.1.2.0/24 | Servicio FTP público controlado |
| Samba AD/LDAP | Aplicaciones | 10.2.3.0/24 | Identidad y directorio |
| DVWA | Aplicaciones | 10.2.3.0/24 | Aplicación vulnerable interna |
| FTP Autenticado | Aplicaciones | 10.2.3.0/24 | Servicio FTP con autenticación |

## Activos de gestión
| Activo | Ubicación | Función |
|---|---|---|
| Repositorio Git | Raíz del proyecto | Versionamiento y trazabilidad |
| Documentación técnica | `docs/` | Actas, baseline, informes, matrices |
| Evidencia QA | `qa_testing/` | Pruebas funcionales y validación |
| Evidencia de seguridad | `security_tests/` | Hallazgos y pruebas ofensivas controladas |
| Kanban | `kanban-board/` | Gestión de tareas y seguimiento |
