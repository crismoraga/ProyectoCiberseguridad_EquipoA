# Asignación de Roles y Matriz RACI — Sprint 0

## Roles
- **Líder (Cristóbal):** coordinación general, validación técnica transversal, decisiones de arquitectura.
- **Coder (Sergio):** despliegues Docker, DNS/Proxy, ajustes de configuración y automatización.
- **Hunter (Lucas):** reconocimiento ofensivo, validación de superficie de ataque, registro de hallazgos.
- **QA (Catalina):** pruebas funcionales, verificación de hardening y trazabilidad de evidencia.
- **Writer (Daniela):** documentación de sprints, actas, reportes y consolidado final.

## Matriz RACI (Readiness A/B/C)
| Actividad | Líder | Coder | Hunter | QA | Writer |
|---|---|---|---|---|---|
| Definir topología y segmentación | A | R | C | C | C |
| Configurar DNS y Proxy | C | R | I | C | I |
| Configurar NAT/ruteo/firewall base | A | R | C | C | I |
| Desplegar DMZ (WebGoat/Web/FTP anónimo) | C | R | C | C | I |
| Desplegar Aplicaciones (DVWA/FTP auth/AD) | C | R | C | C | I |
| Baseline puertos/usuarios/configuración | C | R | C | A | I |
| Hardening inicial | C | R | C | A | I |
| Pruebas básicas readiness | I | C | C | A/R | I |
| Registro de hallazgos | I | C | A/R | C | C |
| Informe de readiness Sprint 1 | I | C | C | C | A/R |

> **Leyenda:** R = Responsable, A = Aprobador, C = Consultado, I = Informado.
