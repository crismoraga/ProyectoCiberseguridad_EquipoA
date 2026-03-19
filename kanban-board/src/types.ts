export type Priority = 'Low' | 'Medium' | 'High' | 'Critical';
export type Status = 'todo' | 'in-progress' | 'review' | 'done';
export type Member = 'Cristobal' | 'Sergio' | 'Lucas' | 'Catalina' | 'Daniela';
export type Role = 'Líder' | 'Coder' | 'Hunter' | 'Writer' | 'Integrador/QA';

export interface TeamMember {
  name: Member;
  role: Role;
  avatar: string;
  color: string;
}

export interface SubTask {
  id: string;
  title: string;
  done: boolean;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  priority: Priority;
  assignees: Member[];
  status: Status;
  comments: number;
  tags: string[];
  subTasks: SubTask[];
  sprint?: string;
}