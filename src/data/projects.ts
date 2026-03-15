export type TaskStatus = 'todo' | 'in-progress' | 'done';
export type ProjectStatus = 'active' | 'paused' | 'planning';

export interface Task {
  id: string;
  title: string;
  status: TaskStatus;
}

export interface Project {
  id: string;
  name: string;
  status: ProjectStatus;
  tasks: Task[];
}

export const projects: Project[] = [
  {
    id: 'agentpick',
    name: 'AgentPick',
    status: 'active',
    tasks: [
      { id: 'ap-1', title: 'Fix footer inconsistente tra le pagine', status: 'todo' },
      { id: 'ap-2', title: 'Fix back navigation (esce dal sito)', status: 'todo' },
      { id: 'ap-3', title: 'Arricchire contenuti 5 listing esistenti', status: 'todo' },
      { id: 'ap-4', title: 'CTA utente più chiare su ogni pagina', status: 'todo' },
      { id: 'ap-5', title: 'Aggiungere 2 nuovi listing', status: 'todo' },
      { id: 'ap-6', title: 'Pubblicare 3 articoli blog SEO', status: 'todo' },
    ],
  },
  {
    id: 'il-referto',
    name: 'Il Referto',
    status: 'planning',
    tasks: [
      { id: 'ir-1', title: 'Michele registra dominio', status: 'todo' },
      { id: 'ir-2', title: 'Creare repo GitHub', status: 'todo' },
      { id: 'ir-3', title: 'Setup Next.js + Vercel', status: 'todo' },
      { id: 'ir-4', title: 'Integrazione API-Football', status: 'todo' },
      { id: 'ir-5', title: 'Schema DB Supabase', status: 'todo' },
      { id: 'ir-6', title: 'Pipeline AI: partita → articolo → pubblica', status: 'todo' },
      { id: 'ir-7', title: '10 articoli pilota', status: 'todo' },
    ],
  },
  {
    id: 'gioco-calcio',
    name: 'Gioco Calcio',
    status: 'planning',
    tasks: [
      { id: 'gc-1', title: 'Documento concept e regole core', status: 'todo' },
      { id: 'gc-2', title: 'Analisi competitor (Fantacalcio, Sorare, MPG)', status: 'todo' },
      { id: 'gc-3', title: 'Modello economico', status: 'todo' },
      { id: 'gc-4', title: 'Game design document', status: 'todo' },
      { id: 'gc-5', title: 'Mockup UI', status: 'todo' },
    ],
  },
];
