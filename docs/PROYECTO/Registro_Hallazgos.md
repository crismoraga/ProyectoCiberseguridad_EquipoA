# Registro de Hallazgos — Proyecto Equipo A

> Estado de vulnerabilidades o brechas detectadas durante validaciones y pruebas controladas.

## Formato

- **ID Hallazgo**
- **Fecha**
- **Zona / Servicio**
- **Descripción**
- **Severidad (Baja/Media/Alta/Crítica)**
- **Estado (Abierto/En mitigación/Cerrado)**
- **Responsable**
- **Evidencia**

## Hallazgos

| ID | Fecha | Zona | Hallazgo | Severidad | Estado | Responsable | Evidencia |
| --- | --- | --- | --- | --- | --- | --- | --- |
| H-001 | 2026-03-29 | Pública | Montajes Docker DNS/Proxy inconsistentes | Alta | Cerrado | Coder | `infra/Publica/docker-compose.yml`, `infra/Publica/Proxy/` |
| H-002 | 2026-03-29 | DMZ | Servicio principal no alineado (Juice Shop vs WebGoat) | Alta | Cerrado | Líder + Coder | `infra/DMZ/docker-compose.yml` |
| H-003 | 2026-03-29 | Aplicaciones | Segmentación dual vs objetivo unificado 10.2.3.0/24 | Alta | Cerrado | Líder + Coder | `infra/Aplicaciones/docker-compose.yml` |
| H-004 | 2026-03-29 | DNS | Registros A con IPs no consistentes | Media | Cerrado | Coder + QA | `infra/Publica/DNS/config_dns/db.equipoa.local` |
| H-005 | 2026-03-29 | Apps/DNS | Dominio inconsistente (`labtel.local` vs `equipoa.local`) | Alta | Cerrado | Coder | `infra/Aplicaciones/.env.example`, `pureftpd-ldap.conf` |
| H-006 | 2026-03-29 | Operación | Falta evidencia runtime de sala en 3 hosts físicos | Media | Abierto | QA + Líder | `docs/Guia_Checklist_Readiness_Operativo.md` |

## Hallazgos abiertos (bloqueantes de cierre formal)

1. **H-006**: ejecutar validación real en laboratorio y adjuntar evidencia.
