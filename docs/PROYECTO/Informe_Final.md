# Informe Final — Proyecto Ciberseguridad Equipo A

## 1. Resumen ejecutivo

Al cierre de la fase de **Readiness (Sprint 0/1)**, el Equipo A deja el repositorio consolidado para despliegue físico de las zonas Pública/NAT, DMZ y Aplicaciones, con artefactos obligatorios, baseline de seguridad y guías operativas listas para ejecución en sala.

Estado del proyecto global:

- **Readiness (S0/S1):** técnico-documental completado.
- **Pendiente para cierre formal de sprint:** ejecución runtime en 3 PCs del laboratorio + evidencia y aprobación QA/Líder.

## 2. Alcance y objetivos

- Zonas a cargo del Equipo A: `200.1.6.0/24`, `10.1.2.0/24`, `10.2.3.0/24`.
- Objetivo alcanzado en readiness: repositorio y documentación listos para operar en laboratorio físico.

## 3. Arquitectura final implementada

- Topología segmentada por VLAN/zonas con router-on-a-stick y control perimetral.
- Servicios por zona:
  - Pública: DNS Bind9 + Proxy NGINX.
  - DMZ: WebGoat + Web DMZ + FTP anónimo.
  - Aplicaciones: Samba AD/LDAP + DVWA + WebGoat interno + FTP autenticado.

## 4. Seguridad y hardening

- ACL base entre zonas y NAT documentado en router perimetral.
- DNS restringido por ACLs de consulta/recursión.
- Parametrización por `.env` y separación de secreto AD.
- Validación final en sala pendiente de ejecución operativa.

## 5. Pruebas ofensivas y hallazgos

- Hallazgos técnicos de configuración H-001..H-005 cerrados.
- Hallazgo operativo H-006 abierto hasta ejecutar pruebas en sala y adjuntar evidencia.

## 6. Evidencia técnica

- Estructura de evidencia preparada en `qa_testing/Sprint_1/` y `security_tests/Sprint_1/`.
- Plantilla de trazabilidad en `docs/SPRINT_1/Evidencia_Pruebas_Basicas.md`.

## 7. Lecciones aprendidas

- Unificar dominio y direccionamiento desde el inicio evita retrabajo en LDAP/DNS.
- Estandarizar `.env.example` por zona acelera despliegue multi-host.
- Separar cambios de configuración de evidencia runtime mejora auditoría de cierre.

## 8. Anexos

- Matriz de riesgos.
- Inventario de activos.
- Registro de hallazgos.
- Informes por sprint.
