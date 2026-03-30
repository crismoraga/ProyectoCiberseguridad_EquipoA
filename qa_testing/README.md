# QA Testing — Readiness y Validación Funcional

Este directorio concentra validaciones funcionales del laboratorio y evidencia de cierre de sprint.

## Objetivo
- Verificar que servicios por zona estén operativos.
- Comprobar conectividad y puertos esperados.
- Registrar evidencia trazable para readiness.

## Estructura recomendada
- `Sprint_1/`
	- logs de ejecución
	- resultados de validación
	- capturas/salidas relevantes

## Pruebas mínimas Sprint 1
1. Resolución DNS interna.
2. Proxy respondiendo y enrutando servicio DMZ.
3. WebGoat DMZ accesible.
4. FTP anónimo DMZ operativo.
5. AD/LDAP en Zona 3 operativo.
6. DVWA en Zona 3 accesible.
7. FTP autenticado en Zona 3 operativo.

## Convención de evidencia
- Incluir fecha/hora y responsable en cada archivo.
- Mantener relación `requisito -> prueba -> resultado -> evidencia`.
