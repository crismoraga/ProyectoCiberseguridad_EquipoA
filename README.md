<div align="center">

# 🛡️ Blue Team Defensivo / Red Team Ofensivo - Laboratorio de Ciberseguridad

![Cybersecurity Banner](https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1500&auto=format&fit=crop)

**Equipo A - Infraestructura Perimetral y de Aplicación**
*Construyendo redes resistentes, observando, y defendiendo los activos digitales de nuestra organización.*

[![Framework: Docker](https://img.shields.io/badge/Docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)
[![Network: Firewall](https://img.shields.io/badge/Security-Firewall-red?style=for-the-badge&logo=pfSense&logoColor=white)](#)
[![Web App: React](https://img.shields.io/badge/Kanban-React_SPA-blue?style=for-the-badge&logo=react)](#)
[![Deployment: Vercel](https://img.shields.io/badge/Platform-Vercel-black?style=for-the-badge&logo=vercel)](#)

---

</div>

## 📌 Visión General del Proyecto

Este repositorio representa el trabajo coordinado del **Equipo A** en el diseño, despliegue y análisis de una infraestructura de red segura en 3 capas fundamentales. Contiene todos los artefactos, scripts, políticas de seguridad y la documentación necesarias para desplegar un entorno aislado, defendiendo los servicios internos y gestionando las vulnerabilidades intencionadas en aplicaciones como DVWA y WebGoat.

### 👥 Cuadro de Mando del Equipo A

| Rol | Miembro | Tareas Clave y Objetivos | Correo Electrónico |
| :---: | :--- | :--- | :--- |
| **👑 Líder** | **Cristóbal A. Moraga** | Gestión general, coordinación, validación de infra, soporte al despliegue | cristobal.moragag@usm.cl |
| **💻 Coder** | **Sergio N. Ehlen** | Scripts de aprovisionamiento, Dockerfiles, automatización, Proxy/DNS | sergio.ehlen@usm.cl |
| **🗡️ Hunter** | **Lucas M. Petit** | Pruebas ofensivas, simulación de intrusión, análisis de vectores DMZ/NAT | lucas.petit@usm.cl |
| **🐞 QA** | **Catalina A. González**| Verificación de hardening, aseguramiento de reglas de firewall y flujos | catalina.gonzalezo@usm.cl |
| **✍️ Writter** | **Daniela I. Stuven** | Documentación de arquitectura, registro de actas, reportes ejecutivos | daniela.stuven@usm.cl |

<br/>

## 🏗️ Topología y Capas a Cargo

Nuestra misión prioritaria abarca **3 Zonas** de red críticas, cada una con un propósito y segmentación IP estricta.

### Zona 1: Pública / NAT (`200.1.6.0/24`)
- **Objetivo**: Proveer un punto de entrada simulado a la red corporativa. Traducción de acceso externo a interno.
- **Acciones Clave**: 
  - 🌐 Router/FW perimetral con NAT.
  - 🔄 Proxy (Squid/NGINX) estructurado.
  - 🗺️ Servidor DNS Interno (Bind9).
  - 🛡️ Reglas perimetrales de Entrada/Salida.

### Zona 2: DMZ (`10.1.2.0/24`)
- **Objetivo**: Zona Desmilitarizada para alojar servicios expuestos al exterior limitando el impacto interno.
- **Acciones Clave**: 
  - 🐐 Despliegue de WebGoat en Docker.
  - 🌐 Nginx/Apache configurados para responder peticiones externas.
  - 📁 Servidor FTP anónimo (vsftpd).
  - 🔒 Hardening e inspección de tráfico con firewall interno.

### Zona 3: Aplicaciones (`10.2.3.0/24`)
- **Objetivo**: Protección de software interno utilizado por empleados corporativos.
- **Acciones Clave**: 
  - 🛑 Despliegue contenedorizado de DVWA.
  - 📁 Servidor web interno & FTP con autenticación.
  - 🔑 Integración de LDAP / Active Directory básico.
  - 📜 Políticas estructuradas de acceso basado en Rol.

<br/>

## 📁 Estructura del Repositorio

El repositorio ha sido diseñado bajo lógica corporativa para separar roles y dominios de conocimientos:

```text
📦 ProyectoCiberseguridad_EquipoA
 ┣ 📂 docs                   # (Writter - Daniela) Documentación, manuales, arquitectura.
 ┣ 📂 infra                  # (Coder & Lider - Sergio/Cristóbal) Dockerfiles, Nginx conf, Bind9, etc.
 ┣ 📂 security_tests         # (Hunter - Lucas) Scripts de ataque, Nmap, Metasploit, vulnerabilidades
 ┣ 📂 qa_testing             # (QA - Catalina) Scripts de testeo de reglas, checklists de hardening
 ┣ 📂 kanban-board           # App SPA en React/Vite para gestión de proyecto interactiva
 ┗ 📜 README.md              # Documentación central
```

<br/>

## 🚀 Despliegue del Tablero Kanban

El equipo cuenta con una **Aplicación Web Interactiva** diseñada a medida como Tablero Kanban de nivel Enterprise para hacer seguimiento en tiempo real de los avances, tareas, logros y sub-tareas.

### Características del Tablero
✨ Tarjetas *Drag & Drop*
✨ Sistema de Prioridades (Alta, Media, Baja) y Asignaciones
✨ Animaciones (Framer Motion) y logros visuales estilo *gamification*
✨ Persistencia en LocalStorage (Estado del proyecto en vivo)

**Pasos de despliegue en Vercel:**
1. Navega hacia la carpeta `kanban-board` en la terminal.
2. Ejecuta `npm run build`
3. Utiliza la Vercel CLI o conecta el repositorio en la consola de vercel.com para hacer el deploy automático.

## ✅ Estado de Cumplimiento (pdf_lab / Readiness)

El repositorio del **Equipo A** queda alineado para Sprint 0 y Sprint 1 con foco en zonas:

- **Pública/NAT** (`200.1.6.0/24`)
- **DMZ** (`10.1.2.0/24`)
- **Aplicaciones** (`10.2.3.0/24`)

### Sprint 0 (Readiness A)

- Acta de constitución
- Roles y RACI
- Backlog inicial
- Topología propuesta
- **Listado de herramientas**
- Checklist de instalación

### Sprint 1 (Readiness B/Cierre)

- Infraestructura de 3 zonas lista para despliegue físico
- Baseline de puertos/usuarios/configuración
- Checklist de hardening inicial
- Estructura de evidencia técnica trazable
- Informe de readiness actualizado

## 🧭 Arranque rápido en sala (3 PCs + red física)

1. Configurar switch/router/firewall siguiendo `docs/Guia_Red_Fisica_Router_Switch_Firewall.md`.
2. Ajustar `.env` por host/zona (`infra/Publica`, `infra/DMZ`, `infra/Aplicaciones`).
3. Levantar contenedores con `docker compose` según `docs/Guia_Despliegue_3PC_Docker.md`.
4. Ejecutar checklist operativo en `docs/Guia_Checklist_Readiness_Operativo.md`.
5. Guardar evidencias en `qa_testing/Sprint_1/` y `security_tests/Sprint_1/`.

---

> *"En la defensa perimetral no existe el 100% seguro, pero sí existe el 100% preparado."* — Equipo A