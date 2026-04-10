# Matriz de Investigación y Vectores de Ataque (Red Team)

**Autor:** Lucas Petit (Hunter - Equipo A)
**Sprint:** 2 (Reconocimiento y Superficie de Ataque)

## 1. Aplicaciones Vulnerables Objetivo

### 1.1 WebGoat (Zona 2 - DMZ)
* **IP:** `10.1.2.2` (Ruteado vía Proxy `200.1.6.3/webgoat/`)
* **Puerto Interno:** `8080`
* **Vectores de Ataque Potenciales (OWASP Top 10 - 2025):**
  1. **A05:2025 - Injection (SQLi & Command Injection):** Explotación de campos de entrada no sanitizados para extraer datos de la BD o ejecutar comandos en el sistema. **(TTP Asociado: [T1190](https://attack.mitre.org/techniques/T1190/) - Exploit Public-Facing Application / [T1059](https://attack.mitre.org/techniques/T1059/) - Command and Scripting Interpreter)**.
  2. **A01:2025 - Broken Access Control (IDOR & Privilege Escalation):** Manipulación de parámetros de la aplicación web para acceder a información confidencial y elevar privilegios. **(TTP Asociado: [T1068](https://attack.mitre.org/techniques/T1068/) - Exploitation for Privilege Escalation)**.
  3. **A07:2025 - Authentication Failures:** Secuestro de sesiones, fuerza bruta de inicio de sesión y manipulación de firmas JWT. **(TTP Asociados: [T1110](https://attack.mitre.org/techniques/T1110/) - Brute Force / [T1539](https://attack.mitre.org/techniques/T1539/) - Steal Web Session Cookie / [T1606](https://attack.mitre.org/techniques/T1606/) - Forge Web Credentials)**.
  4. **A02:2025 - Security Misconfiguration (XXE):** Carga maliciosa de XML para forzar al servidor a interceptar o filtrar archivos locales como `/etc/passwd`. **(TTP Asociado: [T1213](https://attack.mitre.org/techniques/T1213/) - Data from Information Repositories)**.
  5. **A04:2025 - Cryptographic Failures:** Explotación de cifrado débil o codificaciones inseguras (ej. Base64) que las lecciones usan para proteger secretos. **(TTP Asociado: [T1552](https://attack.mitre.org/techniques/T1552/) - Unsecured Credentials)**.

### 1.2 DVWA (Damn Vulnerable Web App) (Zona 3 - Aplicaciones)
* **IP:** `10.2.3.2` (Ruteado vía Proxy `200.1.6.3/dvwa/`)
* **Puerto Interno:** `80`
* **Vectores de Ataque Potenciales (OWASP Top 10 - 2025):**
  1. **A07:2025 - Authentication Failures (Brute Force & Weak Sessions):** Uso de diccionarios y fuerza bruta contra el portal de login para adivinar contraseñas. **(TTP Asociado: [T1110](https://attack.mitre.org/techniques/T1110/) - Brute Force)**.
  2. **A05:2025 - Injection (Cross Site Scripting - XSS):** Inyección de payloads JavaScript (DOM, Reflected, Stored) para secuestrar cookies de usuarios autenticados. **(TTP Asociados: [T1190](https://attack.mitre.org/techniques/T1190/) - Exploit Public-Facing Application / [T1539](https://attack.mitre.org/techniques/T1539/) - Steal Web Session Cookie)**.
  3. **A05:2025 - Injection (Command & SQL Injection):** Inyección de comandos Bash (`&& cat /etc/passwd`) a nivel OS e inyecciones SQL para exfiltración del backend. **(TTP Asociados: [T1059](https://attack.mitre.org/techniques/T1059/) - Command and Scripting Interpreter / [T1213](https://attack.mitre.org/techniques/T1213/) - Data from Information Repositories)**.
  4. **A01:2025 - Broken Access Control (Insecure File Upload & CSRF):** Evasión de controles para subir *webshells* PHP maliciosas o forzar acciones de la víctima (CSRF). **(TTP Asociado: [T1505.003](https://attack.mitre.org/techniques/T1505/003/) - Server Software Component: Web Shell)**.

### 1.3 Servidor DNS Bind9 (Zona 1 - Pública)
* **IP:** `200.1.6.2`
* **Puerto:** `53` (TCP/UDP)
* **Vectores de Ataque Potenciales:**
  1. **A02:2025 - Security Misconfiguration (Zone Transfer):** Extracción completa de los registros DNS internos si el servidor no restringe quién puede solicitar una transferencia AXFR. Esto revelará toda la estructura interna a un atacante. **(TTP Asociado: [T1590.002](https://attack.mitre.org/techniques/T1590/002/) - Gather Victim Network Information: DNS)**.

### 1.4 Servidores FTP (Zona 2 - DMZ / Zona 3 - Aplicaciones)
* **IPs:** `10.1.2.4` (NATeado en `200.1.6.12`) y `10.2.3.4`
* **Puertos:** `21` y Rango Pasivo `30000-30010`
* **Vectores de Ataque Potenciales:**
  1. **A07:2025 - Authentication Failures (Anonymous Access / Brute Force):** Extracción de archivos sensibles a través de logins anónimos no restringidos y ataques de fuerza bruta (ej. usando THC-Hydra). **(TTP Asociado: [T1110](https://attack.mitre.org/techniques/T1110/) - Brute Force / [T1078.001](https://attack.mitre.org/techniques/T1078/001/) - Valid Accounts: Default Accounts)**.
  2. **A01:2025 - Broken Access Control (Path Traversal):** Escape del directorio raíz FTP (si no hay un `chroot` seguro configurado) para acceder o modificar archivos críticos del sistema operativo Linux anfitrión. **(TTP Asociado: [T1083](https://attack.mitre.org/techniques/T1083/) - File and Directory Discovery)**.

### 1.5 Active Directory / Samba LDAP (Zona 3 - Aplicaciones)
* **IP:** `10.2.3.5`
* **Puertos:** `389` (LDAP), `53` (DNS Interno)
* **Vectores de Ataque Potenciales:**
  1. **A02:2025 - Security Misconfiguration (Null Sessions / LDAP Enumeration):** Conexión no autenticada ("Null Session") o con usuarios de bajísimo privilegio para mapear todos los grupos, perfiles y políticas del dominio sin activar alarmas de intrusión. **(TTP Asociado: [T1087.002](https://attack.mitre.org/techniques/T1087/002/) - Account Discovery: Domain Account)**.
  2. **A07:2025 - Authentication Failures (Hardcoded Passwords / Password Spraying):** Aprovechamiento de las contraseñas base estáticas o intentos de inicio de sesión lateral usando claves débiles en servicios asociados al AD. **(TTP Asociado: [T1110.003](https://attack.mitre.org/techniques/T1110/003/) - Brute Force: Password Spraying)**.

## 2. Marco de Referencia General (MITRE ATT&CK)

### Tácticas de Reconocimiento y Acceso Inicial
* **[T1595](https://attack.mitre.org/techniques/T1595/) - Active Scanning (Reconnaissance):** Escaneo de puertos y descubrimiento de directorios/servicios vulnerables sobre la IP pública `200.1.6.3` y la aplicación WebGoat/DVWA usando herramientas del benchmark (ZAP, Nikto, Dirb).
* **[T1190](https://attack.mitre.org/techniques/T1190/) - Exploit Public-Facing Application (Initial Access):** Vector principal de acceso. Cubre el núcleo del OWASP Top 10 (SQLi, XXE, XSS) al aprovechar fallos lógicos en la aplicación expuesta (DMZ/Z3).

### Tácticas Post-Explotación (Asociadas a Vectores WebGoat/DVWA)
* **[T1059](https://attack.mitre.org/techniques/T1059/) - Command and Scripting Interpreter (Execution):** Materializado mediante Inyección de Comandos (OS Command Injection) y cargas maliciosas del WebGoat.
* **[T1068](https://attack.mitre.org/techniques/T1068/) - Exploitation for Privilege Escalation (Privilege Escalation):** Las lecciones de *Insecure Direct Object Reference (IDOR)* otorgan funciones administrativas sin autorización.
* **[T1110](https://attack.mitre.org/techniques/T1110/) - Brute Force (Credential Access):** Fuerza bruta activa contra los formularios de login HTML de ambas instancias vulnerables.
* **[T1539](https://attack.mitre.org/techniques/T1539/) - Steal Web Session Cookie / [T1606](https://attack.mitre.org/techniques/T1606/) - Forge Web Credentials (Credential Access):** Mapea perfectamente con ataques Cross-Site Scripting (XSS) y manipulación de JWT en las lecciones de WebGoat.
* **[T1213](https://attack.mitre.org/techniques/T1213/) - Data from Information Repositories (Collection):** Refleja la exfiltración masiva de tablas SQL post inyección (SQLi) exitosa.
