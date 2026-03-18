import type { Task } from './types';

export const initialTasks: Task[] = [
  // Zona 1
  {
    id: 't-1',
    title: 'Configurar firewall perimetral (NAT)',
    description: 'Establecer router perimetral con reglas NAT en el segmento 200.1.6.0/24.',
    priority: 'Critical',
    assignees: ['Cristobal', 'Sergio'],
    status: 'todo',
    comments: 2
  },
  {
    id: 't-2',
    title: 'Servidor DNS interno (Bind9)',
    description: 'Instalar y configurar Bind9 para resolucion de zonas.',
    priority: 'High',
    assignees: ['Sergio'],
    status: 'todo',
    comments: 0
  },
  // Zona 2
  {
    id: 't-3',
    title: 'Desplegar WebGoat',
    description: 'Levantar contenedor Docker con WebGoat en puerto 8080.',
    priority: 'Medium',
    assignees: ['Sergio'],
    status: 'in-progress',
    comments: 1
  },
  {
    id: 't-4',
    title: 'Hardening basico Expuestos',
    description: 'Asegurar Nginx/Apache y FTP anonimo (vsftpd).',
    priority: 'High',
    assignees: ['Catalina', 'Lucas'],
    status: 'todo',
    comments: 3
  },
  // Zona 3
  {
    id: 't-5',
    title: 'Desplegar DVWA (Docker)',
    description: 'Implementar Damn Vulnerable Web App en entorno de Aplicaciones.',
    priority: 'Critical',
    assignees: ['Cristobal'],
    status: 'todo',
    comments: 0
  },
  {
    id: 't-6',
    title: 'Politicas de acceso LDAP',
    description: 'Configurar roles y AD basico para acceso interno.',
    priority: 'Medium',
    assignees: ['Sergio', 'Catalina'],
    status: 'todo',
    comments: 0
  }
];

export const teamMembers = [
  { name: 'Cristobal', role: 'Lider', avatar: '👑' },
  { name: 'Sergio', role: 'Coder', avatar: '💻' },
  { name: 'Lucas', role: 'Hunter', avatar: '🗡️' },
  { name: 'Catalina', role: 'QA', avatar: '🐞' },
  { name: 'Daniela', role: 'Writter', avatar: '✍️' }
];