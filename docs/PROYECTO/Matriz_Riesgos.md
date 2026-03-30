# Matriz de Riesgos — Proyecto Equipo A

| ID | Riesgo | Probabilidad | Impacto | Nivel | Mitigación | Dueño |
|---|---|---|---|---|---|---|
| R-01 | Inconsistencia entre DNS y direcciones reales de despliegue | Media | Alto | Alto | Normalizar redes/IP y validar resolución | Coder + QA |
| R-02 | Montajes Docker apuntan a rutas inexistentes | Alta | Alto | Alto | Corregir rutas y validar `docker compose config` | Coder |
| R-03 | Falta de evidencia trazable por prueba | Media | Alto | Alto | Estandarizar registro de evidencia por ID | QA + Writer |
| R-04 | Exposición excesiva de servicios en perímetro | Media | Alto | Alto | Revisión de NAT/ACL y hardening inicial | Líder + QA |
| R-05 | Retraso en cierre de readiness | Media | Medio | Medio | Priorización P0 y seguimiento diario | Líder |
| R-06 | Configuración AD/LDAP incompleta para FTP autenticado | Media | Alto | Alto | Completar secretos y configuración LDAP | Coder |
| R-07 | Validación runtime no ejecutada en laboratorio físico | Alta | Medio | Alto | Ejecutar checklist operativo en sala + evidencia QA | QA + Líder |

## Escala
- **Probabilidad:** Baja / Media / Alta
- **Impacto:** Bajo / Medio / Alto
- **Nivel:** combinación de probabilidad e impacto
