import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { jwtVerify } from 'jose';
import { projects } from '@/data/projects';
import { PM_COOKIE } from '@/lib/pm-auth';
import type { Project } from '@/data/projects';

const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? 'fallback-dev-secret-change-me'
);

async function isPMAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const token = cookieStore.get(PM_COOKIE)?.value;
  if (!token) return false;
  try {
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}

function statusBadge(status: Project['status']) {
  if (status === 'active') return { emoji: '🟢', label: 'Active', cls: 'bg-green-500/20 text-green-300 border-green-500/30' };
  if (status === 'paused') return { emoji: '🟡', label: 'Paused', cls: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' };
  return { emoji: '⚪', label: 'Planning', cls: 'bg-gray-500/20 text-gray-300 border-gray-500/30' };
}

function taskIcon(status: string) {
  if (status === 'done') return '✅';
  if (status === 'in-progress') return '🔄';
  return '☐';
}

export default async function PMDashboardPage() {
  const authed = await isPMAuthenticated();
  if (!authed) redirect('/pm-dashboard/login');

  const today = new Date().toLocaleDateString('it-IT', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main className="min-h-screen bg-gray-950 text-white font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-950/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Mission Control 🎩</h1>
            <p className="text-xs text-gray-400 capitalize">{today}</p>
          </div>
          <a
            href="/"
            className="text-sm text-gray-400 hover:text-white transition-colors"
          >
            ← AgentPick
          </a>
        </div>
      </header>

      {/* Kanban grid */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {projects.map((project) => {
            const badge = statusBadge(project.status);
            const done = project.tasks.filter((t) => t.status === 'done').length;
            const total = project.tasks.length;
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;

            return (
              <div
                key={project.id}
                className="rounded-2xl bg-gray-900 border border-white/5 flex flex-col overflow-hidden"
              >
                {/* Card header */}
                <div className="p-5 border-b border-white/5">
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="text-base font-bold text-white">{project.name}</h2>
                    <span className={`flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-medium border ${badge.cls}`}>
                      {badge.emoji} {badge.label}
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>{done}/{total} task</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-gray-800 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-purple-500 to-blue-500 transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Task list */}
                <ul className="p-4 space-y-2 flex-1">
                  {project.tasks.map((task) => (
                    <li key={task.id} className="flex items-start gap-2.5 group">
                      <span className="mt-0.5 text-base leading-none flex-shrink-0">
                        {taskIcon(task.status)}
                      </span>
                      <span
                        className={`text-sm leading-snug ${
                          task.status === 'done'
                            ? 'line-through text-gray-500'
                            : 'text-gray-300'
                        }`}
                      >
                        {task.title}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
