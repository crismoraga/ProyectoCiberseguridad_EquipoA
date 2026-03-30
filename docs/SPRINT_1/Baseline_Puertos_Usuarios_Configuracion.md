# Baseline — Puertos, Usuarios y Configuración (Sprint 1)

## 1) Baseline de puertos por zona

### Zona 1 — Pública/NAT (`200.1.6.0/24`)
| Servicio | Puerto/Protocolo | Estado esperado |
|---|---|---|
| DNS (Bind9) | 53/TCP, 53/UDP | Abierto interno del lab |
| Proxy (NGINX) | 80/TCP | Abierto para entrada controlada |
| NAT publicación DMZ (VIPs) | 8080/TCP, 80/TCP, 21/TCP | Publicación controlada de servicios DMZ |

### Zona 2 — DMZ (`10.1.2.0/24`)
| Servicio | Puerto/Protocolo | Estado esperado |
|---|---|---|
| WebGoat (principal DMZ) | 8080/TCP | Accesible vía proxy/perímetro |
| Web DMZ (NGINX/Apache) | 80/TCP | Accesible según reglas |
| FTP Anónimo | 21/TCP + pasivo 30000-30009/TCP | Accesible según reglas |

### Zona 3 — Aplicaciones (`10.2.3.0/24`)
| Servicio | Puerto/Protocolo | Estado esperado |
|---|---|---|
| DVWA | 80/TCP | Acceso interno controlado |
| Samba AD/LDAP | 53, 88, 135, 389, 445 (TCP/UDP según servicio) | Acceso interno segmentado |
| FTP Autenticado | 21/TCP + pasivo 30000-30010/TCP | Acceso interno autenticado |

## 2) Baseline de usuarios
| Tipo | Usuario/Grupo | Uso |
|---|---|---|
| Dominio AD | Administrator (dominio) | Administración del directorio |
| Pruebas internas | Usuarios de laboratorio | Validación de autenticación/ACL |
| FTP DMZ | anonymous | Flujo controlado y auditado |
| FTP Zona 3 | usuarios autenticados | Pruebas de acceso por identidad |

## 3) Baseline de configuración
- Segmentación definida en 3 zonas (`200.1.6.0/24`, `10.1.2.0/24`, `10.2.3.0/24`).
- DNS interno para resolución de servicios del laboratorio.
- Proxy perimetral para exposición controlada de servicios DMZ.
- Zona de aplicaciones sin exposición directa externa.
- Configuración y validación deben quedar respaldadas con evidencia técnica.

## 4) Estado
**Versión:** 1.0  
**Fecha:** 2026-03-29  
**Estado:** Documentado y listo para validación en sala
