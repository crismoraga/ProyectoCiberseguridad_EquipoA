import type { Task, TeamMember } from './types';

export const teamMembers: TeamMember[] = [
  { name: 'Cristobal', role: 'Líder', avatar: '👑', color: 'bg-yellow-500/20 text-yellow-300' },
  { name: 'Sergio', role: 'Coder', avatar: '💻', color: 'bg-blue-500/20 text-blue-300' },
  { name: 'Lucas', role: 'Hunter', avatar: '🗡️', color: 'bg-red-500/20 text-red-300' },
  { name: 'Catalina', role: 'Integrador/QA', avatar: '🛡️', color: 'bg-emerald-500/20 text-emerald-300' },
  { name: 'Daniela', role: 'Writer', avatar: '✍️', color: 'bg-purple-500/20 text-purple-300' }
];

export const initialTasks: Task[] = [
  {
    id: 's0-1',
    title: 'Organizaciòn y Setup Inicial',
    description: 'Definir acta de constitucion, roles, tablero Kanban y documentar topologia base.',
    priority: 'Critical',
    assignees: ['Cristobal'],
    status: 'done',
    comments: 0,
    tags: ['Readiness', 'Planning', 'Sprint-0'],
    sprint: 'Sprint 0: Readiness A',
    subTasks: [
      { id: 's0-1-1', title: 'Crear Acta de Constitucion', done: true },
      { id: 's0-1-2', title: 'Asignar Roles del Equipo', done: true },
      { id: 's0-1-3', title: 'Configurar Repositorio Base', done: true },
      { id: 's0-1-4', title: 'Dibujar Topologia Inicial', done: true }
    ]
  },
  {
    id: 's0-2',
    title: 'Checklist de Herramientas Ofensivas y Defensivas',
    description: 'Investigar y definir stack principal de herramientas autorizadas (Nmap, Burp, Wireshark, etc).',
    priority: 'High',
    assignees: ['Lucas', 'Sergio'],
    status: 'in-progress',
    comments: 2,
    tags: ['Tools', 'Research', 'Sprint-0'],
    sprint: 'Sprint 0: Readiness A',
    subTasks: [
      { id: 's0-2-1', title: 'Listado de escaneres', done: true },
      { id: 's0-2-2', title: 'Plataformas defensivas y firewalls', done: false }
    ]
  },
  {
    id: 's1-1',
    title: 'Despliegue del Laboratorio en Docker (6 Zonas)',
    description: 'Levantar contenedores Docker, establecer red aislada y validar conectividad.',
    priority: 'Critical',
    assignees: ['Sergio'],
    status: 'todo',
    comments: 4,
    tags: ['Infra', 'Docker', 'Sprint-1'],
    sprint: 'Sprint 1: Readiness B',
    subTasks: [
      { id: 's1-1-1', title: 'Configurar redes puras (6 zonas)', done: false },
      { id: 's1-1-2', title: 'Levantar WebGoat, crAPI, DVWA y Juice Shop', done: false }
    ]
  },
  {
    id: 's1-2',
    title: 'Baseline y Documentacion Base',
    description: 'Registrar inventario de puertos, servicios iniciales e informe de readiness.',
    priority: 'High',
    assignees: ['Daniela', 'Catalina'],
    status: 'todo',
    comments: 1,
    tags: ['Docs', 'Baseline', 'Sprint-1'],
    sprint: 'Sprint 1: Readiness B',
    subTasks: [
      { id: 's1-2-1', title: 'Inventario de activos', done: false },
      { id: 's1-2-2', title: 'Reporte Readiness Finalizado', done: false }
    ]
  },
  {
    id: 's2-1',
    title: 'Reconocimiento y Superficie de Ataque',
    description: 'Mapear exposicion actual en zonas perimetrales. Hallar debilidades con escaneos exhaustivos.',
    priority: 'Critical',
    assignees: ['Lucas', 'Cristobal'],
    status: 'todo',
    comments: 0,
    tags: ['Recon', 'RedTeam', 'Sprint-2'],
    sprint: 'Sprint 2: Reconocimiento',
    subTasks: [
      { id: 's2-1-1', title: 'Escaneo de puertos TCP/UDP (Nmap)', done: false },
      { id: 's2-1-2', title: 'Identificacion de servicios vulnerables y banners', done: false }
    ]
  },
  {
    id: 's3-1',
    title: 'Aplicar Hardening y Reglas de Segmentacion',
    description: 'Bloquear puertos, eliminar servicios innecesarios, fortificar hosts y contenedores.',
    priority: 'High',
    assignees: ['Sergio', 'Catalina'],
    status: 'todo',
    comments: 0,
    tags: ['Hardening', 'BlueTeam', 'Sprint-3'],
    sprint: 'Sprint 3: Hardening',
    subTasks: [
      { id: 's3-1-1', title: 'Cerrar puertos no esenciales', done: false },
      { id: 's3-1-2', title: 'Deshabilitar accesos root/anonimos', done: false },
      { id: 's3-1-3', title: 'Validar funcionalidad (QA) de servicios legitimos', done: false }
    ]
  },
  {
    id: 's4-1',
    title: 'Ejecucion Ofensiva Controlada (Pentest)',
    description: 'Probar exploits sobre zonas aisladas para validar controles aplicados en Sprint 3.',
    priority: 'Critical',
    assignees: ['Lucas'],
    status: 'todo',
    comments: 6,
    tags: ['Pentest', 'RedTeam', 'Sprint-4'],
    sprint: 'Sprint 4: Ofensiva',
    subTasks: [
      { id: 's4-1-1', title: 'Validar inyeccion SQL / XSS (OWASP)', done: false },
      { id: 's4-1-2', title: 'Lograr acceso inicial no privilegiado (Foothold)', done: false },
      { id: 's4-1-3', title: 'Registrar toda evidencia como Hunter', done: false }
    ]
  },
  {
    id: 's5-1',
    title: 'Deteccion, Monitoreo y Respuesta a Incidentes',
    description: 'Revisar logs y definir alertas. Analizar SIEM/IDS para detectar los ataques ejecutados.',
    priority: 'High',
    assignees: ['Sergio', 'Daniela'],
    status: 'todo',
    comments: 0,
    tags: ['SIEM', 'Logs', 'Sprint-5'],
    sprint: 'Sprint 5: Deteccion',
    subTasks: [
      { id: 's5-1-1', title: 'Correlacionar eventos de red y host', done: false },
      { id: 's5-1-2', title: 'Generar Informe de Incidente y Trazabilidad', done: false }
    ]
  }
];
