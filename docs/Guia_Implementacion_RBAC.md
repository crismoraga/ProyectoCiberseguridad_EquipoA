# 🛡️ Guía Operativa: Implementación de Políticas de Acceso por Rol (RBAC)

**Destinatario:** Administradores de Seguridad Blue Team (Equipo A)
**Objetivo:** Transicionar el Directorio Activo de un contenedor "en blanco" a un sistema de Roles Corporativos, e inyectar un filtro estricto al Servidor FTP Autenticado para que demuestre segregación de accesos (Acceso Denegado a roles no autorizados).

Sigan este manual para cumplir con el 100% de la rúbrica sobre control de accesos lógicos (Access Control).

---

## FASE 1: Creación de Grupos y Usuarios en AD (Samba)

Una vez que el contendor de la Zona 3 `ad_zona3` (Samba) esté corriendo sano y operativo, ejecuten estos pasos dentro del servidor Linux físico para inyectar a los empleados falsos.

### 1. Entrar a la consola de administración del AD
Abran la terminal y conéctense al interior del contenedor Samba:
```bash
docker exec -it ad_zona3 bash
```

### 2. Crear los Roles Corporativos (Grupos RBAC)
Usemos la herramienta nativa `samba-tool` para crear dos roles ficticios y organizativos opuestos:
```bash
samba-tool group add "Finanzas"
samba-tool group add "TI"
```

### 3. Crear los Empleados (Usuarios)
Crearemos dos usuarios de prueba. 
*(Nota: Como su `.env` tiene `NOCOMPLEXITY=true`, usaremos contraseñas sencillas para facilitar el trabajo del Red Team).*
```bash
samba-tool user create juan.perez corporativo123 --given-name="Juan" --surname="Perez"
samba-tool user create ana.hacker P@ssw0rd123 --given-name="Ana" --surname="Hacker"
```

### 4. Asignar Empleados a sus Respectivos Roles (El Core de RBAC)
Ahora asignamos a Juan al departamento de "Finanzas" y a Ana al departamento de "TI".
```bash
samba-tool group addmembers "Finanzas" "juan.perez"
samba-tool group addmembers "TI" "ana.hacker"
```
*(Salgan del contenedor escribiendo `exit`)*.

---

## FASE 2: Forzar el Cumplimiento del Rol en el Servidor FTP

Este es el paso vital. Actualmente su archivo `pureftpd-ldap.conf` está programado en "Modo Libre"; es decir, deja entrar **a cualquiera** que exista en el Directorio Activo. Alguien de TI podría robar los balances financieros del servidor FTP. Para el evaluador, esto no es RBAC.

Para que RBAC funcione, vamos a configurar el FTP para que rechace automáticamente y le tire la puerta en la cara a cualquier usuario que intente loguearse y NO pertenezca al rol "Finanzas".

### El Ajuste del Filtro LDAP
Abran su archivo de configuración estático ubicado en:
`PROYECTO/infra/Aplicaciones/configs/pureftpd-ldap.conf`

Vayan directamente a la **Línea 10**.

**Bórrenla y reemplácenla exactamente por esto:**
```properties
LDAPFilter (&(sAMAccountName=\L)(memberOf=CN=Finanzas,CN=Users,DC=equipoa,DC=local))
```

> **¿Qué hace este código mágico?**
> Le dice al servidor FTP: "Cuando Juan o Ana pongan sus credenciales, ve a preguntarle al Active Directory en la Zona 3. Diles que pasen **ÚNICA Y EXCLUSIVAMENTE** si la contraseña es correcta *Y* si el empleado tiene la tarjeta de membresía del grupo `Finanzas` colgada al cuello."

---

## FASE 3: Demostración Final (The Audit Proof)

Cuando llegue la hora de presentar el laboratorio al profesor, tú o tu Red Team harán esta demostración en vivo de simulación de roles para sacarse un 10 cerrado:

1. Abran el software FileZilla o la terminal FTP e intenten loguearse como el usuario `ana.hacker` (Rol de TI).
2. **El Servidor responderá: Error 530 Login Authentication Failed.** (Ana existe y su clave es correcta, ¡pero no tiene permiso de rol!).
3. Luego loguéense con el usuario `juan.perez` (Rol de Finanzas).
4. **El Servidor responderá: 230 User logged in, proceed.**

**¡Validación Completa!** Con este archivo y esos 4 comandos, acaban de demostrar control de accesos basado en membresía de grupos en Linux Active Directory; una habilidad altamente valorada en la industria de infraestructuras críticas.
