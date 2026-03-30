# Checklist Operativo de Readiness (Ejecución Guiada)

Usar este checklist como hoja de control durante el montaje real en la sala.

## Fase A — Red Física

- [ ] Switch con VLAN 10/20/40 creadas
- [ ] Trunk al router operativo
- [ ] Puertos access por zona asignados a host correcto
- [ ] Router con subinterfaces y gateways por VLAN
- [ ] ACLs base cargadas y verificadas
- [ ] Firewall con rutas estáticas y políticas mínimas

## Fase B — Docker por Zona

- [ ] `infra/Publica/.env` ajustado al host real
- [ ] `infra/DMZ/.env` ajustado al host real
- [ ] `infra/Aplicaciones/.env` ajustado al host real
- [ ] `docker compose config` OK en las 3 zonas
- [ ] Servicios levantados en las 3 zonas

## Fase C — Validación Funcional

- [ ] DNS resuelve nombres de todas las zonas
- [ ] Proxy responde `/health`
- [ ] VIPs NAT DMZ (`200.1.6.10/.11/.12`) responden según política
- [ ] WebGoat DMZ accesible
- [ ] Web DMZ accesible
- [ ] FTP anónimo DMZ responde
- [ ] AD/LDAP responde en Apps
- [ ] DVWA responde en Apps
- [ ] FTP autenticado responde en Apps

## Fase D — Evidencia y cierre

- [ ] Capturas y logs guardados en `qa_testing/Sprint_1/`
- [ ] Hallazgos registrados en `docs/PROYECTO/Registro_Hallazgos.md`
- [ ] `docs/SPRINT_1/Informe_Readiness.md` actualizado
- [ ] Aprobación QA + Líder registrada
