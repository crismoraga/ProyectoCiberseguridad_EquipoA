# Benchmark de Herramientas y Mapa de Técnicas

**Autor:** Lucas Petit (Hunter - Equipo A)
**Sprint:** 2 (Reconocimiento y Superficie de Ataque)

---

## 1. Suite Ofensiva (Caja de Herramientas Kali Linux)

Para asegurar el éxito del equipo durante las pruebas contra nuestra propia infraestructura (y preparando escenarios para atacar al Equipo B), he consolidado este benchmark detallando el **por qué**, el **cómo** y la **técnica exacta (TTP de MITRE)** para que cualquier miembro del equipo pueda ejecutar el ataque fácilmente.

### A. Escaneo y Reconocimiento (Fase 1)

| Herramienta & TTP MITRE | Objetivo Técnico | Comando Operativo (Copy/Paste para ejecutar) | Justificación Estratégica (Hunter) |
|-------------------------|------------------|----------------------------------------------|------------------------------------|
| **Nmap** <br> *[T1595](https://attack.mitre.org/techniques/T1595/)* | Escaneo de Puertos y Servicios (IP Pública) | `nmap -sS -p- -sV -Pn 200.1.6.3` | Revela qué puertos tiene abiertos nuestro Firewall Cisco hacia el exterior. Usar `-sS` (TCP SYN) evita completar conexiones para evadir logs simples. |
| **Gobuster / Dirb** <br> *[T1595.003](https://attack.mitre.org/techniques/T1595/003/)* | Descubrimiento de Directorios Web Ocultos | `gobuster dir -u http://200.1.6.3/ -w /usr/share/wordlists/dirb/common.txt` | Identifica a ciegas las rutas (`/dvwa/`, `/webgoat/`, `/webint/`) que el Proxy Nginx intenta ocultar y redirigir. |
| **Dig / Nslookup** <br> *[T1590.002](https://attack.mitre.org/techniques/T1590/002/)* | Husmeo DNS (Contra Servidor Bind9: `200.1.6.2`) | `dig axfr @200.1.6.2 equipoa.local` | Intenta una "Transferencia de Zona completa". Si nuestro equipo o el rival la dejaron mal configurada, esta herramienta volcará TODAS las IPs secretas de las zonas DMZ y Apps de golpe. |
| **Enum4linux / Ldapsearch** <br> *[T1087.002](https://attack.mitre.org/techniques/T1087/002/)* | Enumeración de Active Directory / Samba LDAP | `enum4linux -a 10.2.3.5` <br> o <br> `ldapsearch -x -h 10.2.3.5 -s base` | Extrae sigilosamente toda la lista de usuarios, grupos y políticas del Active Directory usando sesiones LDAP nulas. Vital para descubrir atacables sin activar alarmas de autenticación fallida. |
| **Nikto / OWASP ZAP** <br> *[T1595.002](https://attack.mitre.org/techniques/T1595/002/)* | Escaneo de Vulnerabilidades Web Rápidas | `nikto -h http://200.1.6.3/dvwa/` | Descubre fallos base de OWASP (cabeceras HTTP vencidas o configuraciones XSS ausentes) antes de que intervengamos manualmente. |

### B. Intercepción y Explotación Temprana (Fase 2)

| Herramienta & TTP MITRE | Objetivo Técnico | Comando / Uso Práctico | Justificación Estratégica (Hunter) |
|-------------------------|------------------|-------------------------|------------------------------------|
| **Burp Suite** <br> *[T1190](https://attack.mitre.org/techniques/T1190/)* | Modificación "Man-In-The-Middle" (Tráfico HTTP) | *(Se usa activando el proxy 127.0.0.1:8080 en el navegador de la máquina atacante).* | **Vital.** Permite congelar el tráfico de WebGoat o DVWA. El operador modifica manualmente las solicitudes POST o las Cookies (elevando privilegios tipo IDOR) antes de que el servidor las reciba. |
| **SQLmap** <br> *[T1190](https://attack.mitre.org/techniques/T1190/) / [T1213](https://attack.mitre.org/techniques/T1213/)* | Inyección SQL y Sustracción Masiva de BD | `sqlmap -u "http://200.1.6.3/dvwa/vulnerabilities/sqli/?id=1&Submit=Submit" --cookie="PHPSESSID=tuSessionId" --dbs` | Automatiza el robo de la base de datos completa. Es necesario inyectarle la `--cookie` de sesión obtenida previamente, porque de lo contrario DVWA bloqueará al SQLmap. |
| **THC-Hydra** <br> *[T1110](https://attack.mitre.org/techniques/T1110/)* | Fuerza Bruta de Contraseñas (Login Web y FTP) | `hydra -l admin -P /usr/share/wordlists/rockyou.txt ftp://200.1.6.12` | Es la mejor herramienta para machacar cuentas SSH o el Servidor FTP (Pure-FTPd / vsftpd). Si los servicios no tienen control de intentos (Rate Limiting), Hydra encontrará la contraseña. |

---

## 2. Herramientas Recomendadas con IA (Reglas del Lab)
Conforme a las reglas y parámetros del laboratorio, el Red Team empleará metodologías con Inteligencia Artificial como catalizador:

* **Ingeniería de Prompts (ChatGPT/Claude):** En lugar de escribir código desde cero, el "Coder" empleará prompts validados. 
  * *Ejemplo Vibe Coding:* "Actúa como un Pentester. Dame un script ultra rústico en bash que acceda a todas las URLs listadas en `urls.txt` (que obtuvimos en gobuster) e intente enviar un payload `<script>alert(1)</script>` para automatizar el descubrimiento XSS."
* **Asistencia Rápida en Exfiltración:** Cuando los servidores de DVWA o WebGoat lancen códigos de fallas (Stack Traces y Excepciones de Java/PHP), volcaremos directamente dicho error en la interfaz de IA para identificar velozmente con qué motor de DB estamos lidiando (MySQL, SQLite) y generar un payload diseñado a la medida para evadir la sanitización.
