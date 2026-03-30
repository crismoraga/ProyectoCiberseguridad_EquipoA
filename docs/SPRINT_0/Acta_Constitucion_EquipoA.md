# Acta de Constitución — Equipo A

**Proyecto:** Laboratorio Blue Team / Red Team  
**Equipo:** A (Infraestructura Perimetral y de Aplicación)  
**Fecha de inicio:** 2026-03-01  
**Versión:** 1.0

## 1. Objetivo del equipo

Diseñar, desplegar, asegurar y documentar las zonas **Pública/NAT**, **DMZ** y **Aplicaciones** del laboratorio, garantizando trazabilidad técnica y evidencia verificable por sprint.

## 2. Alcance técnico

- **Zona 1 — Pública/NAT:** `200.1.6.0/24`
- **Zona 2 — DMZ:** `10.1.2.0/24`
- **Zona 3 — Aplicaciones:** `10.2.3.0/24` (subred unificada)

## 3. Entregables Sprint 0

- [x] Acta de constitución del equipo
- [x] Asignación de roles
- [x] Backlog inicial
- [x] Topología propuesta
- [x] Listado de herramientas
- [x] Checklist de instalación

## 4. Entregables Sprint 1

- [ ] Laboratorio operativo
- [ ] Servicios desplegados por zona
- [ ] Baseline de puertos/usuarios/configuración
- [ ] Checklist de hardening inicial
- [ ] Evidencia de pruebas básicas
- [ ] Informe de readiness

## 5. Acuerdos operativos

1. Todo cambio relevante debe registrarse en documentación y/o bitácora.
2. Toda evidencia debe ser trazable a requisito, fecha y responsable.
3. Todo ajuste de red/servicio debe incluir validación mínima (servicio, conectividad y puertos).
4. Se prioriza coherencia entre `docker-compose`, DNS y topología.

## 6. Criterios de aceptación de Readiness

Se considera readiness logrado cuando:

- Las 3 zonas operan con su segmentación definida.
- Los servicios principales responden en puertos esperados.
- Existe baseline documentado y validado.
- Hay evidencia técnica verificable.
- El informe de sprint cierra hallazgos y próximos pasos.
