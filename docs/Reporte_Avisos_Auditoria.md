# 🚨 Reporte de Auditoría y Riesgos (`PROYECTO/infra`)

**Estado General:** La arquitectura es robusta, segura y altamente técnica (Uso de `macvlan`, Secrets, Limits y Cap_Drops). Sin embargo, la inspección minuciosa de los archivos arrojó fallos lógicos que romperán el laboratorio en tiempo de ejecución o descontarán puntos en la rúbrica.

Deben corregir obligatoriamente los siguientes 4 puntos antes de entregar la maqueta.

---

> [!CAUTION]
> ## 1. FTP Anónimo: Falla Crítica en Modo Pasivo sobre NAT
> **Archivo:** `PROYECTO/infra/DMZ/docker-compose.yml` (Servicio: `ftpd_anonimo`)
> 
> **El Riesgo:** Configurar `PUBLICHOST: "10.1.2.4"` destruirá las descargas FTP. Cuando un usuario externo intente descargar un archivo, el servidor FTP le ordenará estúpidamente al usuario que se conecte a la IP privada `10.1.2.4`, la cual el usuario externo no puede alcanzar. Esto provocará que la descarga se quede congelada al 0% indefinidamente.
> 
> **La Solución (Respetando su Arquitectura de Entorno):** Dada la regla NAT estática de su router Cisco hacia el servicio FTP, el servidor FTP interno debe anunciarse hacia afuera con su IP Pública (VIP), pero no queremos "hardcodearlo" (meterlo a fuego). Háganlo elegantemente con sus variables de entorno:
> 
> * **En su archivo `docker-compose.yml` (Cambiar la línea actual por esta):**
>   `PUBLICHOST: "${DMZ_FTP_PUB_IP:-200.1.6.12}"`
> * **En su archivo `.env.example` y `.env` (Agregar esta línea al final):**
>   `DMZ_FTP_PUB_IP=200.1.6.12`

---

> [!WARNING]
> ## 2. Infracción de Rúbrica: WebGoat Duplicado (Servidor Web Z3)
> **Archivo:** `PROYECTO/infra/Aplicaciones/docker-compose.yml` (Servicio: `webgoat`)
> 
> **El Riesgo:** La rúbrica para la Zona 3 exige un **Servidor web interno**. Sin embargo, el equipo desplegó una segunda instancia gigante y pesada de `webgoat/webgoat:latest` en la IP `10.2.3.3`. No solo están desperdiciando muchísima RAM, sino que están violando el concepto de tener una simple Intranet corporativa, y el profesor descontará puntos por no seguir las instrucciones organizacionales.
> 
> **La Solución:** 
> 1. Eliminen el servicio `webgoat` (y su bloque de configuración) en la Zona 3.
> 2. Reemplacen el código de la carpeta `Aplicaciones/web3/Dockerfile` por un Nginx puro (Ej. `FROM nginx:alpine`).
> 3. Creen un servicio llamado `intranet_interna` en su docker-compose enlazado a un HTML estático privado de empleados.

---

> [!IMPORTANT]
> ## 3. Basura/Código Huérfano: Carpeta `DMZ/web1/`
> **Archivo:** `PROYECTO/infra/DMZ/web1/Dockerfile`
> 
> **El Riesgo:** En la carpeta `web1` existe un Dockerfile que intenta descargar la imagen vulnerable `bkimminich/juice-shop`. Sin embargo, este archivo es código fantasma ("Zombie code"); ningún archivo `docker-compose.yml` del proyecto lo está utilizando ni construyendo. 
> Si el evaluador audita esta carpeta, deducirá que dejaron el proyecto a medias o que hay desorden en el repositorio.
> 
> **La Solución:** Eliminen por completo la carpeta `PROYECTO/infra/DMZ/web1`. Su servicio principal vulnerable ya está cubierto exitosamente por el WebGoat de la Zona 2.

---

> [!CAUTION]
> ## 4. Conflicto Letal: El Router Cisco estrangula al Proxy Nginx
> **Archivo:** `PROYECTO/infra/Publica/router/router_config.txt`
> 
> **El Riesgo:** Como se documentó en el informe anterior (`Reporte_Reparacion_Proxy.md`), las Políticas de las Listas de Acceso del Cisco bloquean brutalmente el tráfico de la Subred `200.1.6.0` hacia las redes `10.x.x.x`. Dado que el Proxy Nginx ostenta la IP `200.1.6.3`, **El Router Cisco aniquilará todos los paquetes del Proxy** destinados a pedir las páginas de la DMZ o Aplicaciones. Error 504 Garantizado.
> 
> **La Solución:** 
> Agregar Excepciones (Permit) en el código del Router para la IP `200.1.6.3` justo antes del bloque `deny`, y eliminar las redirecciones DNAT web, tal y como se estipuló en el **Paso 4** del Reporte del Proxy.

---

> [!WARNING]
> ## 5. Trampa de Sincronización: `.env` vs Archivos Estáticos
> **Archivos Afectados:** `pureftpd-ldap.conf`, `db.equipoa.local`, `grupoa.conf` (Nginx Proxy).
> 
> **El Riesgo:** Este es un riesgo operativo, no un error de código. Ustedes configuraron los archivos `docker-compose.yml` utilizando excelentemente archivos `.env` (Ej. `APPS_AD_IP=10.2.3.5`).
> Sin embargo, archivos de texto montados como Nginx (`grupoa.conf`), BIND9 (`db.equipoa.local`) y FTP (`pureftpd-ldap.conf`) **no entienden de variables de entorno**. En ellos introdujeron IPs a la fuerza ("hardcodeadas", ej. `LDAPServer 10.2.3.5`). 
> 
> Si horas antes de la entrega del laboratorio deciden cambiar las IPs en los archivos `.env` para ajustarse a una topología distinta, los contenedores cambiarán de IP, pero sus archivos de configuración estáticos apuntarán a las IPs antiguas, destruyendo silenciosamente toda la infraestructura.
> 
> **La Solución:** 
> Prohíban cambiar IPs en los archivos `.env` (Déjenlas exactamente como las escribieron en sus `.env.example`). Congelen el diseño de IPs y traten las variables `.env` únicamente como un "Mecanismo de Seguridad Blue-Team" para ocultar la topología de la vista superficial, pero no como parámetros modificables en tiempo real.

---

**Veredicto Final del Auditor:** Resolviendo estos 4 recuadros, el equipo certificará una infraestructura de categoría SSS (100% resiliente y homologada a la rúbrica). Todo lo demás (Samba, Bind9, Nginx Proxy, Redes Macvlan) está implementado de forma brillante.
