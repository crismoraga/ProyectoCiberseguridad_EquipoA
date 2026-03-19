import type { Task, TeamMember } from './types';

export const teamMembers: TeamMember[] = [
  { name: 'Cristobal', role: 'Líder', avatar: '👑', color: 'bg-yellow-500/20 text-yellow-300' },
  { name: 'Sergio', role: 'Coder', avatar: '💻', color: 'bg-blue-500/20 text-blue-300' },
  { name: 'Lucas', role: 'Hunter', avatar: '🗡️', color: 'bg-red-500/20 text-red-300' },
  { name: 'Catalina', role: 'Integrador/QA', avatar: '🛡️', color: 'bg-emerald-500/20 text-emerald-300' },
  { name: 'Daniela', role: 'Writer', avatar: '✍️', color: 'bg-purple-500/20 text-purple-300' },
  { name: 'Todos', role: 'Equipo', avatar: '👥', color: 'bg-indigo-500/20 text-indigo-300' }
];

export const initialTasks: Task[] = [
  {
    id: 't-pdf-1',
    title: 'Instalación de Docker',
    description: 'Asegurar que todos los participantes tienen Docker instalado y funcional.',
    priority: 'Critical',
    assignees: ['Todos'],
    status: 'done',
    comments: [],
    tags: ['Docker', 'Infra'],
    sprint: 'Sprint 1',
    subTasks: [
      { id: 's-pdf-1-1', title: 'Instalar Docker Desktop/Engine', done: true },
    ]
  },
  {
    id: 't-pdf-2',
    title: 'Revisión funcionamiento máquinas Kali',
    description: 'Se revisa que todas las máquinas Kali funcionen correctamente.',
    priority: 'Critical',
    assignees: ['Todos'],
    status: 'in-progress',
    comments: [],
    tags: ['Kali', 'OS'],
    sprint: 'Sprint 1',
    subTasks: [
      { id: 's-pdf-2-1', title: 'Verificar networking de VM', done: true },
      { id: 's-pdf-2-2', title: 'Actualizar dependencias Kali', done: false },
    ]
  },
  {
    id: 't-pdf-3',
    title: 'Investigar conveniencia para DNS',
    description: 'Buscar conveniencia entre poner DNS con Nginx o en una máquina virtual.',
    priority: 'Medium',
    assignees: ['Lucas'],
    status: 'todo',
    comments: [],
    tags: ['DNS', 'Research'],
    subTasks: []
  },
  {
    id: 't-pdf-4',
    title: 'Definición escala de virtualización',
    description: 'Se define estructura de arquitectura: Cada elemento de la infraestructura tiene su propio Docker. Pro: Más robusto. Contra: Toma más tiempo configurarlo.',
    priority: 'High',
    assignees: ['Cristobal'],
    status: 'done',
    comments: [
      { id: 'c-1', author: 'Cristobal', text: 'Se decidió separar por microservicios en Docker', createdAt: new Date().toISOString() }
    ],
    tags: ['Arch', 'Docker'],
    subTasks: []
  },
  {
    id: 't-pdf-5',
    title: 'Investigar framework aplicación web',
    description: 'Investigar si usar NGINX, React u otro para aplicación web interna.',
    priority: 'Medium',
    assignees: ['Sergio'],
    status: 'in-progress',
    comments: [],
    tags: ['Web', 'Research'],
    subTasks: []
  },
  {
    id: 's2-1',
    title: 'Reconocimiento y Superficie de Ataque',
    description: 'Mapear exposición actual en zonas perimetrales. Hallar debilidades con escaneos exhaustivos.',
    priority: 'Critical',
    assignees: ['Lucas', 'Cristobal'],
    status: 'todo',
    comments: [],
    tags: ['Recon', 'RedTeam', 'Sprint-2'],
    sprint: 'Sprint 2: Reconocimiento',
    subTasks: [
      { id: 's2-1-1', title: 'Escaneo de puertos TCP/UDP (Nmap)', done: false },
      { id: 's2-1-2', title: 'Identificación de servicios vulnerables y banners', done: false }
    ]
  },
  {
    id: 's3-1',
    title: 'Aplicar Hardening y Reglas de Segmentación',
    description: 'Bloquear puertos, eliminar servicios innecesarios, fortificar hosts y contenedores.',
    priority: 'High',
    assignees: ['Sergio', 'Catalina'],
    status: 'todo',
    comments: [],
    tags: ['Hardening', 'BlueTeam', 'Sprint-3'],
    sprint: 'Sprint 3: Hardening',
    subTasks: [
      { id: 's3-1-1', title: 'Cerrar puertos no esenciales', done: false },
      { id: 's3-1-2', title: 'Deshabilitar accesos root/anónimos', done: false },
      { id: 's3-1-3', title: 'Validar funcionalidad (QA) de servicios legítimos', done: false }
    ]
  },
  {
    id: 's4-1',
    title: 'Ejecución Ofensiva Controlada (Pentest)',
    description: 'Probar exploits sobre zonas aisladas para validar controles aplicados en Sprint 3.',
    priority: 'Critical',
    assignees: ['Lucas'],
    status: 'todo',
    comments: [],
    tags: ['Pentest', 'RedTeam', 'Sprint-4'],
    sprint: 'Sprint 4: Ofensiva',
    subTasks: [
      { id: 's4-1-1', title: 'Validar inyección SQL / XSS (OWASP)', done: false },
      { id: 's4-1-2', title: 'Lograr acceso inicial no privilegiado (Foothold)', done: false },
      { id: 's4-1-3', title: 'Registrar toda evidencia como Hunter', done: false }
    ]
  },
  {
    id: 's5-1',
    title: 'Detección, Monitoreo y Respuesta a Incidentes',
    description: 'Revisar logs y definir alertas. Analizar SIEM/IDS para detectar los ataques ejecutados.',
    priority: 'High',
    assignees: ['Sergio', 'Daniela'],
    status: 'todo',
    comments: [],
    tags: ['SIEM', 'Logs', 'Sprint-5'],
    sprint: 'Sprint 5: Detección',
    subTasks: [
      { id: 's5-1-1', title: 'Correlacionar eventos de red y host', done: false },
      { id: 's5-1-2', title: 'Generar Informe de Incidente y Trazabilidad', done: false }
    ]
  }
];
