import type { Member, Task } from './types';

interface TeamMember {
  name: Member;
  role: 'Lider' | 'Coder' | 'Hunter' | 'QA' | 'Writter';
  avatar: string;
}

export const initialTasks: Task[] = [
  // Zona 1
  {
    id: 't-1',
    title: 'Configurar firewall perimetral (NAT)',
    description: 'Establecer router perimetral con reglas NAT en el segmento 200.1.6.0/24.',
    priority: 'Critical',
    assignees: ['Cristobal', 'Sergio'],
    status: 'todo',
    comments: 2,
    tags: ['NAT', 'Firewall', 'Zona1'],
    subTasks: [
      { id: 't1-s1', title: 'Diseñar tabla de traducción NAT', done: true },
      { id: 't1-s2', title: 'Aplicar reglas egress/ingress', done: false },
      { id: 't1-s3', title: 'Validar rutas hacia DMZ', done: false },
    ]
  },
  {
    id: 't-2',
    title: 'Servidor DNS interno (Bind9)',
    description: 'Instalar y configurar Bind9 para resolucion de zonas.',
    priority: 'High',
    assignees: ['Sergio'],
    status: 'todo',
    comments: 0,
    tags: ['DNS', 'Bind9', 'Zona1'],
    subTasks: [
      { id: 't2-s1', title: 'Configurar zona directa', done: true },
      { id: 't2-s2', title: 'Configurar zona reversa', done: false },
    ]
  },
  // Zona 2
  {
    id: 't-3',
    title: 'Desplegar WebGoat',
    description: 'Levantar contenedor Docker con WebGoat en puerto 8080.',
    priority: 'Medium',
    assignees: ['Sergio'],
    status: 'in-progress',
    comments: 1,
    tags: ['Docker', 'WebGoat', 'DMZ'],
    subTasks: [
      { id: 't3-s1', title: 'Crear docker-compose de servicio', done: true },
      { id: 't3-s2', title: 'Aplicar network DMZ', done: true },
      { id: 't3-s3', title: 'Exponer puerto 8080 con reverse proxy', done: false },
    ]
  },
  {
    id: 't-4',
    title: 'Hardening basico Expuestos',
    description: 'Asegurar Nginx/Apache y FTP anonimo (vsftpd).',
    priority: 'High',
    assignees: ['Catalina', 'Lucas'],
    status: 'todo',
    comments: 3,
    tags: ['Hardening', 'Nginx', 'vsftpd'],
    subTasks: [
      { id: 't4-s1', title: 'Deshabilitar métodos HTTP inseguros', done: false },
      { id: 't4-s2', title: 'Restringir FTP anónimo por origen', done: false },
      { id: 't4-s3', title: 'Ejecutar checklist CIS básico', done: false },
    ]
  },
  // Zona 3
  {
    id: 't-5',
    title: 'Desplegar DVWA (Docker)',
    description: 'Implementar Damn Vulnerable Web App en entorno de Aplicaciones.',
    priority: 'Critical',
    assignees: ['Cristobal'],
    status: 'todo',
    comments: 0,
    tags: ['DVWA', 'Docker', 'Zona3'],
    subTasks: [
      { id: 't5-s1', title: 'Crear volumen persistente de DB', done: false },
      { id: 't5-s2', title: 'Aislar red interna de aplicación', done: false },
    ]
  },
  {
    id: 't-6',
    title: 'Politicas de acceso LDAP',
    description: 'Configurar roles y AD basico para acceso interno.',
    priority: 'Medium',
    assignees: ['Sergio', 'Catalina'],
    status: 'todo',
    comments: 0,
    tags: ['LDAP', 'AD', 'RBAC'],
    subTasks: [
      { id: 't6-s1', title: 'Definir matriz de permisos por rol', done: true },
      { id: 't6-s2', title: 'Implementar grupo BlueTeam-Operators', done: false },
      { id: 't6-s3', title: 'Validar login por rol en servicio interno', done: false },
    ]
  }
];

export const teamMembers: TeamMember[] = [
  { name: 'Cristobal', role: 'Lider', avatar: '👑' },
  { name: 'Sergio', role: 'Coder', avatar: '💻' },
  { name: 'Lucas', role: 'Hunter', avatar: '🗡️' },
  { name: 'Catalina', role: 'QA', avatar: '🐞' },
  { name: 'Daniela', role: 'Writter', avatar: '✍️' }
];