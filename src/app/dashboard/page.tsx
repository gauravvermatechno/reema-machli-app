'use client';

import { useEffect, useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  LayoutDashboard,
  ListTodo,
  LogOut,
  ClipboardList,
  CheckCircle2,
  Loader2,
  Clock,
  CalendarClock,
  User,
  Sparkles,
  Quote as QuoteIcon,
  Fish,
} from 'lucide-react';
import { TaskStatus } from '@/lib/types';
import { quotes, statusColors, statusEmoji } from '@/lib/data';
import { bengaliQuotes } from '@/lib/quotes';
import { useTasks } from '@/lib/useTasks';
import SwimmingFish from '@/components/SwimmingFish';

/* ------------------------------------------------------------------ */
/*  Helper: deterministic daily quote index                           */
/* ------------------------------------------------------------------ */
function dailyQuoteIndex(arrayLen: number): number {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return seed % arrayLen;
}

/* ------------------------------------------------------------------ */
/*  Animated progress ring                                            */
/* ------------------------------------------------------------------ */
function ProgressRing({
  percent,
  size = 220,
  strokeWidth = 16,
}: {
  percent: number;
  size?: number;
  strokeWidth?: number;
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (percent / 100) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      {/* Background circle */}
      <svg width={size} height={size} className="absolute -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#e2e8f0"
          strokeWidth={strokeWidth}
        />
      </svg>
      {/* Gradient definition + animated foreground */}
      <svg width={size} height={size} className="absolute -rotate-90">
        <defs>
          <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#059669" />
            <stop offset="50%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#34d399" />
          </linearGradient>
        </defs>
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="url(#progressGradient)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1.6, ease: 'easeOut' }}
        />
      </svg>
      {/* Center label */}
      <div className="relative z-10 flex flex-col items-center">
        <motion.span
          className="text-5xl font-extrabold text-teal-700"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          {Math.round(percent)}%
        </motion.span>
        <span className="text-sm text-slate-500 mt-1 font-medium">complete</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Stat card component                                               */
/* ------------------------------------------------------------------ */
function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  delay,
}: {
  label: string;
  value: string | number;
  icon: React.ElementType;
  accent: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.45, ease: 'easeOut' }}
      className="relative overflow-hidden rounded-2xl bg-white shadow-sm border border-slate-100 p-6 flex items-center gap-5 group hover:shadow-md transition-shadow"
    >
      <div className={`flex items-center justify-center w-14 h-14 rounded-xl ${accent}`}>
        <Icon className="w-7 h-7 text-white" />
      </div>
      <div>
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-3xl font-bold text-slate-800 mt-0.5">{value}</p>
      </div>
      {/* Decorative shimmer on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/*  Status badge                                                      */
/* ------------------------------------------------------------------ */
function StatusBadge({ status }: { status: TaskStatus }) {
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${statusColors[status]}`}
    >
      <span>{statusEmoji[status]}</span>
      {status}
    </span>
  );
}

/* ================================================================== */
/*  Main dashboard page                                               */
/* ================================================================== */
export default function DashboardPage() {
  const router = useRouter();
  const [isAuthed, setIsAuthed] = useState<boolean | null>(null);
  const { tasks, loading } = useTasks();
  const [activePath, setActivePath] = useState('/dashboard');

  /* ---- Auth guard ---- */
  useEffect(() => {
    const auth = localStorage.getItem('reema-auth');
    if (!auth) {
      router.replace('/');
    } else {
      setIsAuthed(true);
    }
  }, [router]);

  /* ---- Derived stats ---- */
  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((t) => t.status === 'Done').length;
    const inProgress = tasks.filter((t) => t.status === 'In progress').length;

    const allSubtasks = tasks.flatMap((t) => t.subtasks);
    const totalSubtasks = allSubtasks.length;
    const completedSubtasks = allSubtasks.filter((s) => s.completed).length;
    const hoursRemaining = allSubtasks
      .filter((s) => !s.completed)
      .reduce((sum, s) => sum + s.hoursRequired, 0);
    const percent = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;

    /* Status counts */
    const statusCounts: Record<string, number> = {};
    tasks.forEach((t) => {
      statusCounts[t.status] = (statusCounts[t.status] || 0) + 1;
    });

    /* Owner counts */
    const ownerCounts: Record<string, number> = {};
    tasks.forEach((t) => {
      ownerCounts[t.owner] = (ownerCounts[t.owner] || 0) + 1;
    });

    /* Upcoming deadlines */
    const upcoming = tasks
      .filter((t) => t.deadlineDate !== null && t.status !== 'Done')
      .sort((a, b) => (a.deadlineDate!.getTime() - b.deadlineDate!.getTime()))
      .slice(0, 5);

    return {
      total,
      completed,
      inProgress,
      hoursRemaining: hoursRemaining.toFixed(1),
      totalSubtasks,
      completedSubtasks,
      percent,
      statusCounts,
      ownerCounts,
      upcoming,
    };
  }, [tasks]);

  /* ---- Rotating quotes (change every 30s, 1 in 3 Bengali) ---- */
  const [topQuoteIdx, setTopQuoteIdx] = useState(() => dailyQuoteIndex(quotes.length));
  const [bottomQuoteIdx, setBottomQuoteIdx] = useState(() => (dailyQuoteIndex(quotes.length) + 7) % quotes.length);
  const [topBengaliIdx, setTopBengaliIdx] = useState(0);
  const [bottomBengaliIdx, setBottomBengaliIdx] = useState(Math.floor(bengaliQuotes.length / 2));
  const [tickCount, setTickCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTickCount((c) => c + 1);
      setTopQuoteIdx((prev) => (prev + 1) % quotes.length);
      setBottomQuoteIdx((prev) => (prev + 1) % quotes.length);
      setTopBengaliIdx((prev) => (prev + 1) % bengaliQuotes.length);
      setBottomBengaliIdx((prev) => (prev + 1) % bengaliQuotes.length);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Every 3rd tick, show a Bengali quote instead
  const isBengaliTick = tickCount % 3 === 2;
  const dailyQuote = isBengaliTick ? bengaliQuotes[topBengaliIdx] : quotes[topQuoteIdx];
  const inspirationalQuote = isBengaliTick ? bengaliQuotes[bottomBengaliIdx] : quotes[bottomQuoteIdx];

  /* ---- Logout ---- */
  function handleLogout() {
    localStorage.removeItem('reema-auth');
    router.replace('/');
  }

  /* ---- Loading guard ---- */
  if (isAuthed === null || loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
        >
          <Loader2 className="w-10 h-10 text-teal-600" />
        </motion.div>
      </div>
    );
  }

  /* ---- Navigation items ---- */
  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Tasks', href: '/tasks', icon: ListTodo },
  ];

  /* ---- Status color map for bar chart blocks ---- */
  const statusBlockColors: Record<string, string> = {
    'Done': 'bg-emerald-500',
    'In progress': 'bg-blue-500',
    'New': 'bg-purple-500',
    'Carried fwd': 'bg-amber-500',
    'Due': 'bg-red-500',
    'Scheduled': 'bg-cyan-500',
    'On hold': 'bg-gray-400',
  };

  const totalForBar = Object.values(stats.statusCounts).reduce((a, b) => a + b, 0);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <SwimmingFish />
      {/* ============ SIDEBAR ============ */}
      <aside className="w-64 shrink-0 bg-gradient-to-b from-teal-800 to-teal-950 text-white flex flex-col">
        {/* App name */}
        <div className="px-6 py-7 border-b border-teal-700/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
              <Fish className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Reema Machli</h1>
              <p className="text-xs text-teal-300/70">Task Tracker</p>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activePath === item.href;
            return (
              <button
                key={item.href}
                onClick={() => {
                  setActivePath(item.href);
                  if (item.href !== '/dashboard') router.push(item.href);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-white/15 text-white shadow-lg shadow-teal-900/20'
                    : 'text-teal-200 hover:bg-white/8 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.label}
                {isActive && (
                  <motion.div
                    layoutId="activeNav"
                    className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400"
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="px-4 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-teal-300 hover:bg-red-500/15 hover:text-red-300 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ============ MAIN CONTENT ============ */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-8">
          {/* ---- Top Bar ---- */}
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-800">
                  Welcome back, <span className="text-teal-700">Reema</span>
                </h2>
                <p className="text-slate-500 mt-1 text-sm">
                  {format(new Date(), 'EEEE, d MMMM yyyy')}
                </p>
              </div>
              <div className="max-w-md bg-teal-50 border border-teal-100 rounded-xl px-5 py-3 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={topQuoteIdx}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.5 }}
                  >
                <div className="flex items-start gap-2">
                  <Sparkles className="w-4 h-4 text-teal-500 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-teal-800 italic leading-relaxed">
                      &ldquo;{dailyQuote.text}&rdquo;
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <img
                        src={dailyQuote.imageUrl}
                        alt={dailyQuote.author}
                        className="w-10 h-10 rounded-full object-cover border-2 border-teal-200"
                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                      />
                      <p className="text-xs text-teal-600 font-medium">
                        -- {dailyQuote.author} {dailyQuote.emoji}
                      </p>
                    </div>
                  </div>
                </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>

          {/* ---- Stats Row ---- */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            <StatCard
              label="Total Tasks"
              value={stats.total}
              icon={ClipboardList}
              accent="bg-gradient-to-br from-teal-600 to-teal-700"
              delay={0.1}
            />
            <StatCard
              label="Completed"
              value={stats.completed}
              icon={CheckCircle2}
              accent="bg-gradient-to-br from-emerald-500 to-emerald-600"
              delay={0.2}
            />
            <StatCard
              label="In Progress"
              value={stats.inProgress}
              icon={Loader2}
              accent="bg-gradient-to-br from-blue-500 to-blue-600"
              delay={0.3}
            />
            <StatCard
              label="Hours Remaining"
              value={stats.hoursRemaining}
              icon={Clock}
              accent="bg-gradient-to-br from-amber-500 to-amber-600"
              delay={0.4}
            />
          </div>

          {/* ---- Progress + Status/Owner row ---- */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Progress ring */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col items-center justify-center"
            >
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-6">
                Overall Progress
              </h3>
              <ProgressRing percent={stats.percent} />
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="mt-6 text-sm text-slate-500 font-medium"
              >
                <span className="text-emerald-600 font-bold">{stats.completedSubtasks}</span> of{' '}
                <span className="font-bold text-slate-700">{stats.totalSubtasks}</span> subtasks
                completed
              </motion.p>
            </motion.div>

            {/* Status distribution + Owner */}
            <div className="lg:col-span-2 flex flex-col gap-6">
              {/* Tasks by Status */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-5">
                  Tasks by Status
                </h3>
                {/* Horizontal stacked bar */}
                <div className="flex rounded-full overflow-hidden h-5 mb-5">
                  {Object.entries(stats.statusCounts).map(([status, count]) => (
                    <motion.div
                      key={status}
                      initial={{ width: 0 }}
                      animate={{ width: `${(count / totalForBar) * 100}%` }}
                      transition={{ delay: 0.6, duration: 0.8, ease: 'easeOut' }}
                      className={`${statusBlockColors[status]} first:rounded-l-full last:rounded-r-full`}
                      title={`${status}: ${count}`}
                    />
                  ))}
                </div>
                {/* Legend */}
                <div className="flex flex-wrap gap-3">
                  {Object.entries(stats.statusCounts).map(([status, count]) => (
                    <div key={status} className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${statusBlockColors[status]}`} />
                      <span className="text-xs text-slate-600">
                        {status}{' '}
                        <span className="font-bold text-slate-800">({count})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Tasks by Owner */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6"
              >
                <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4">
                  Tasks by Owner
                </h3>
                <div className="space-y-3">
                  {Object.entries(stats.ownerCounts)
                    .sort(([, a], [, b]) => b - a)
                    .map(([owner, count], i) => (
                      <motion.div
                        key={owner}
                        initial={{ opacity: 0, x: -16 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 + i * 0.08 }}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-teal-50 flex items-center justify-center">
                            <User className="w-4 h-4 text-teal-600" />
                          </div>
                          <span className="text-sm font-medium text-slate-700">{owner}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{
                                width: `${(count / stats.total) * 100}%`,
                              }}
                              transition={{ delay: 0.8, duration: 0.7 }}
                              className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full"
                            />
                          </div>
                          <span className="text-sm font-bold text-slate-800 w-6 text-right">
                            {count}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                </div>
              </motion.div>
            </div>
          </div>

          {/* ---- Upcoming Deadlines ---- */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.55, duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8"
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">
                Upcoming Deadlines
              </h3>
              <CalendarClock className="w-5 h-5 text-slate-400" />
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table">
                <thead>
                  <tr className="text-left text-xs text-slate-400 uppercase tracking-wider border-b border-slate-100">
                    <th className="pb-3 pr-4 font-semibold">Owner</th>
                    <th className="pb-3 pr-4 font-semibold">Action</th>
                    <th className="pb-3 pr-4 font-semibold">Deadline</th>
                    <th className="pb-3 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {stats.upcoming.map((task, i) => (
                      <motion.tr
                        key={task.id}
                        initial={{ opacity: 0, x: -12 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.07 }}
                        className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors"
                      >
                        <td className="py-3.5 pr-4 font-medium text-slate-700">{task.owner}</td>
                        <td className="py-3.5 pr-4 text-slate-600 max-w-xs truncate">
                          {task.action.length > 70
                            ? task.action.slice(0, 70) + '...'
                            : task.action}
                        </td>
                        <td className="py-3.5 pr-4 text-slate-500 whitespace-nowrap">
                          {task.deadline}
                        </td>
                        <td className="py-3.5">
                          <StatusBadge status={task.status} />
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* ---- Inspirational Section ---- */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.6 }}
            className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-teal-700 via-emerald-700 to-teal-800 p-8 md:p-10 mb-8"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/3" />

            <AnimatePresence mode="wait">
              <motion.div
                key={bottomQuoteIdx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="relative z-10 flex items-start gap-6"
              >
                {/* Portrait */}
                <div className="shrink-0 hidden sm:block">
                  <div
                    className="w-24 h-24 rounded-full p-0.5"
                    style={{ background: `linear-gradient(135deg, var(--tw-gradient-stops))` }}
                  >
                    <div className="relative w-full h-full rounded-full overflow-hidden bg-teal-800">
                      <img
                        src={inspirationalQuote.imageUrl}
                        alt={inspirationalQuote.author}
                        className="w-full h-full object-cover rounded-full"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                          const fallback = e.currentTarget.nextElementSibling as HTMLElement;
                          if (fallback) fallback.style.display = 'flex';
                        }}
                      />
                      <div
                        className="absolute inset-0 items-center justify-center text-white text-2xl font-bold rounded-full bg-gradient-to-br from-teal-500 to-emerald-600"
                        style={{ display: 'none' }}
                      >
                        {inspirationalQuote.author.split(' ').map((w: string) => w[0]).join('')}
                      </div>
                    </div>
                  </div>
                </div>
                {/* Quote content */}
                <div className="flex-1 min-w-0">
                  <QuoteIcon className="w-10 h-10 text-emerald-300/40 mb-4" />
                  <blockquote className="text-2xl md:text-3xl font-light text-white/95 italic leading-relaxed max-w-3xl">
                    &ldquo;{inspirationalQuote.text}&rdquo;
                  </blockquote>
                  <div className="mt-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-white/15 flex items-center justify-center sm:hidden">
                      <Sparkles className="w-5 h-5 text-emerald-300" />
                    </div>
                    <div>
                      <p className="text-white font-semibold">{inspirationalQuote.author} {inspirationalQuote.emoji}</p>
                      <p className="text-emerald-300/80 text-sm">{inspirationalQuote.role}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
