# Informe de Readiness — Sprint 1

**Equipo:** A  
**Periodo:** Semanas 3 y 4 de marzo  
**Estado actual:** Repositorio listo para ejecución en laboratorio físico (pendiente evidencia runtime y firma de cierre)

## 1. Resumen ejecutivo

Se ejecuta cierre de Readiness con foco en:

- Ambiente funcional por zonas.
- Servicios desplegados y alineados a segmentación.
- Baseline de puertos/usuarios/configuración.
- Checklist de hardening inicial.
- Evidencia técnica trazable.

Resultado del cierre técnico del repositorio:

- Composición de infraestructura alineada por zona (`Publica`, `DMZ`, `Aplicaciones`).
- Segmentación fija en `200.1.6.0/24`, `10.1.2.0/24`, `10.2.3.0/24`.
- Dominio unificado en `equipoa.local` para DNS + AD/LDAP.
- Guías operativas listas para despliegue en **3 PCs + red física**.

## 2. Estado de entregables

| Entregable | Estado | Evidencia |
| --- | --- | --- |
| Laboratorio operativo | Listo para despliegue físico | `infra/README.md`, `docs/Guia_Despliegue_3PC_Docker.md` |
| Servicios desplegados | Definidos y parametrizados | `infra/Publica/docker-compose.yml`, `infra/DMZ/docker-compose.yml`, `infra/Aplicaciones/docker-compose.yml` |
| Baseline de seguridad | Documentado | `docs/SPRINT_1/Baseline_Puertos_Usuarios_Configuracion.md` |
| Checklist hardening inicial | Documentado (pendiente ejecución en sala) | `docs/SPRINT_1/Checklist_Hardening_Inicial.md` |
| Evidencia pruebas básicas | Plantilla lista (pendiente ejecución en sala) | `docs/SPRINT_1/Evidencia_Pruebas_Basicas.md`, `qa_testing/Sprint_1/` |
| Informe de readiness | Actualizado | Este documento |

## 3. Riesgos abiertos

1. Validar en sala `docker compose config/up` en los 3 hosts (en esta sesión no hay runtime Docker disponible).
2. Confirmar parámetros de interfaz física por host en `.env`.
3. Ejecutar y adjuntar evidencia de pruebas funcionales y de seguridad.

## 4. Plan inmediato

1. Aplicar guías operativas de red física y despliegue en 3 PCs.
2. Validar `docker compose config` y `up -d` en cada zona.
3. Ejecutar checklist operativo y consolidar evidencias.
4. Cerrar readiness con firma QA + Líder.

## 5. Aprobación de cierre

| Rol | Nombre | Estado |
| --- | --- | --- |
| QA | Catalina | Pendiente |
| Líder | Cristóbal | Pendiente |
