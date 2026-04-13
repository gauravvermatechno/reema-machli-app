export type TaskStatus = 'Done' | 'In progress' | 'New' | 'Carried fwd' | 'Due' | 'Scheduled' | 'On hold';

export interface SubTask {
  id: string;
  title: string;
  hoursRequired: number;
  completed: boolean;
}

export interface Task {
  id: string;
  owner: string;
  action: string;
  deadline: string;
  deadlineDate: Date | null;
  status: TaskStatus;
  subtasks: SubTask[];
}

export interface Quote {
  text: string;
  author: string;
  role: string;
  imageUrl: string;
  gradient: string;
  emoji: string;
}

export const OWNERS = ['Reema', 'Jacek', 'J + R + Gosia', 'Team'] as const;
