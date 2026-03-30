# Bitácora del Proyecto — Equipo A

> Registro cronológico de actividades, decisiones y eventos relevantes.

## Formato de entrada
- **Fecha/Hora:**
- **Sprint:**
- **Responsable:**
- **Actividad realizada:**
- **Cambio aplicado:**
- **Impacto observado:**
- **Evidencia asociada:**
- **Próximo paso:**

---

## Entradas
### 2026-03-29
- **Sprint:** 0/1
- **Responsable:** Equipo A
- **Actividad realizada:** Inicio de implementación formal de Readiness.
- **Cambio aplicado:** Se crea estructura documental obligatoria para Sprint 0 y Sprint 1.
- **Impacto observado:** Mejora de trazabilidad y base de auditoría del proyecto.
- **Evidencia asociada:** `docs/SPRINT_0/`, `docs/SPRINT_1/`
- **Próximo paso:** Alinear infraestructura (compose/DNS/proxy/redes) y validar.

### 2026-03-29 (actualización de cierre técnico)
- **Sprint:** 1
- **Responsable:** Coder + Líder
- **Actividad realizada:** Consolidación final de infraestructura y documentación para ejecución en 3 PCs.
- **Cambio aplicado:** Parametrización `.env` por zona, NAT y ACL en router, actualización de guías operativas, dominio unificado `equipoa.local`, cierre de hallazgos técnicos H-001..H-005.
- **Impacto observado:** Repositorio queda listo para despliegue físico y validación en sala.
- **Evidencia asociada:** `infra/Publica/router/router_config.txt`, `infra/*/docker-compose.yml`, `docs/Guia_*`, `docs/SPRINT_1/Informe_Readiness.md`
- **Próximo paso:** Ejecutar checklist operativo en sala, capturar evidencias y cerrar firma QA/Líder.
