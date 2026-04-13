'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Trash2,
  Edit,
  ChevronDown,
  ChevronRight,
  Search,
  Filter,
  Clock,
  CheckCircle2,
  Circle,
  X,
  Target,
  LayoutDashboard,
  ListTodo,
  LogOut,
  ArrowUpDown,
  AlertTriangle,
  ChevronUp,
  Menu,
} from 'lucide-react';
import { Task, SubTask, TaskStatus } from '@/lib/types';
import { initialTasks, statusColors } from '@/lib/data';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'reema-tasks';
const AUTH_KEY = 'reema-auth';
const ALL_STATUSES: TaskStatus[] = [
  'New',
  'In progress',
  'Carried fwd',
  'Due',
  'Scheduled',
  'On hold',
  'Done',
];

type SortField = 'deadline' | 'owner' | 'status';
type SortDir = 'asc' | 'desc';

// Owner avatar colors
const ownerColors: Record<string, string> = {
  Reema: 'bg-teal-600',
  Jacek: 'bg-indigo-600',
  'J + R + Gosia': 'bg-rose-600',
  Team: 'bg-amber-600',
};

function getOwnerColor(owner: string): string {
  return ownerColors[owner] || 'bg-gray-500';
}

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
}

// ---------------------------------------------------------------------------
// Persistence helpers
// ---------------------------------------------------------------------------

function loadTasks(): Task[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Task[];
      return parsed.map((t) => ({
        ...t,
        deadlineDate: t.deadlineDate ? new Date(t.deadlineDate) : null,
      }));
    }
  } catch {
    // ignore
  }
  return initialTasks;
}

function saveTasks(tasks: Task[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

// ---------------------------------------------------------------------------
// Sidebar Component
// ---------------------------------------------------------------------------

function Sidebar({
  mobileOpen,
  onCloseMobile,
}: {
  mobileOpen: boolean;
  onCloseMobile: () => void;
}) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem(AUTH_KEY);
    localStorage.removeItem('reema-user');
    router.push('/');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
    { label: 'Tasks', icon: ListTodo, href: '/tasks', active: true },
  ];

  const sidebarContent = (
    <div className="flex h-full flex-col bg-[#1a3a2a] text-white">
      {/* Brand */}
      <div className="flex items-center gap-3 border-b border-white/10 px-5 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10">
          <Target className="h-5 w-5 text-amber-400" strokeWidth={1.8} />
        </div>
        <div>
          <h2 className="text-sm font-bold tracking-tight">Action Tracker</h2>
          <p className="text-[11px] text-white/40">Reema&apos;s workspace</p>
        </div>
        {/* Mobile close */}
        <button
          onClick={onCloseMobile}
          className="ml-auto rounded-lg p-1.5 text-white/40 hover:bg-white/10 hover:text-white lg:hidden"
          aria-label="Close sidebar"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              router.push(item.href);
              onCloseMobile();
            }}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
              item.active
                ? 'bg-white/15 text-white shadow-sm'
                : 'text-white/60 hover:bg-white/8 hover:text-white'
            }`}
          >
            <item.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Logout */}
      <div className="border-t border-white/10 p-3">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-white/50 transition-all hover:bg-red-500/15 hover:text-red-300"
        >
          <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:block lg:w-60">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={onCloseMobile}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 250 }}
              className="fixed inset-y-0 left-0 z-50 w-60 lg:hidden"
            >
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

// ---------------------------------------------------------------------------
// Status Badge
// ---------------------------------------------------------------------------

function StatusBadge({
  status,
  onClick,
  compact,
}: {
  status: TaskStatus;
  onClick?: () => void;
  compact?: boolean;
}) {
  const colors = statusColors[status] || 'bg-gray-100 text-gray-700 border-gray-200';
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center rounded-full border font-medium transition-all hover:shadow-sm ${colors} ${
        compact ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs'
      } ${onClick ? 'cursor-pointer hover:brightness-95' : 'cursor-default'}`}
    >
      {status}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Owner Avatar
// ---------------------------------------------------------------------------

function OwnerAvatar({ owner, size = 'md' }: { owner: string; size?: 'sm' | 'md' }) {
  const initials = owner
    .split(/[\s+]/)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
  const dim = size === 'sm' ? 'h-7 w-7 text-[10px]' : 'h-8 w-8 text-xs';
  return (
    <div
      className={`${dim} flex shrink-0 items-center justify-center rounded-full font-bold text-white shadow-sm ${getOwnerColor(
        owner,
      )}`}
      title={owner}
    >
      {initials}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Delete Confirmation Modal
// ---------------------------------------------------------------------------

function DeleteConfirmModal({
  taskAction,
  onConfirm,
  onCancel,
}: {
  taskAction: string;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-6 shadow-xl"
      >
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
            <AlertTriangle className="h-5 w-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Delete Task</h3>
        </div>
        <p className="mb-1 text-sm text-gray-600">Are you sure you want to delete this task?</p>
        <p className="mb-6 line-clamp-2 text-sm font-medium text-gray-800">
          &ldquo;{taskAction}&rdquo;
        </p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Add/Edit Task Modal
// ---------------------------------------------------------------------------

function TaskModal({
  task,
  onSave,
  onClose,
}: {
  task: Task | null; // null = new task
  onSave: (task: Task) => void;
  onClose: () => void;
}) {
  const isEdit = task !== null;
  const [owner, setOwner] = useState(task?.owner ?? '');
  const [action, setAction] = useState(task?.action ?? '');
  const [deadline, setDeadline] = useState(task?.deadline ?? '');
  const [deadlineDateStr, setDeadlineDateStr] = useState(
    task?.deadlineDate ? task.deadlineDate.toISOString().split('T')[0] : '',
  );
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'New');
  const [subtasks, setSubtasks] = useState<SubTask[]>(task?.subtasks ?? []);
  const [newSubTitle, setNewSubTitle] = useState('');
  const [newSubHours, setNewSubHours] = useState('');

  const addSubtask = () => {
    if (!newSubTitle.trim()) return;
    setSubtasks((prev) => [
      ...prev,
      {
        id: generateId(),
        title: newSubTitle.trim(),
        hoursRequired: parseFloat(newSubHours) || 0,
        completed: false,
      },
    ]);
    setNewSubTitle('');
    setNewSubHours('');
  };

  const removeSubtask = (id: string) => {
    setSubtasks((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    if (!owner.trim() || !action.trim()) return;
    const saved: Task = {
      id: task?.id ?? generateId(),
      owner: owner.trim(),
      action: action.trim(),
      deadline: deadline.trim(),
      deadlineDate: deadlineDateStr ? new Date(deadlineDateStr) : null,
      status,
      subtasks,
    };
    onSave(saved);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] flex items-start justify-center overflow-y-auto bg-black/50 p-4 pt-[5vh]"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-lg rounded-2xl border border-gray-200 bg-white shadow-xl"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {isEdit ? 'Edit Task' : 'Add New Task'}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="space-y-4 px-6 py-5">
          {/* Owner */}
          <div>
            <label
              htmlFor="task-owner"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Owner
            </label>
            <input
              id="task-owner"
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="e.g. Reema"
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Action */}
          <div>
            <label
              htmlFor="task-action"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Action
            </label>
            <textarea
              id="task-action"
              value={action}
              onChange={(e) => setAction(e.target.value)}
              rows={3}
              placeholder="Describe the task..."
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
            />
          </div>

          {/* Deadline row */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="task-deadline-label"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Deadline Label
              </label>
              <input
                id="task-deadline-label"
                type="text"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
                placeholder="e.g. w/c 14 Apr"
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
            <div>
              <label
                htmlFor="task-deadline-date"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500"
              >
                Exact Date
              </label>
              <input
                id="task-deadline-date"
                type="date"
                value={deadlineDateStr}
                onChange={(e) => setDeadlineDateStr(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label
              htmlFor="task-status"
              className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-gray-500"
            >
              Status
            </label>
            <select
              id="task-status"
              value={status}
              onChange={(e) => setStatus(e.target.value as TaskStatus)}
              className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 outline-none transition-colors focus:border-teal-500 focus:bg-white focus:ring-2 focus:ring-teal-500/20"
            >
              {ALL_STATUSES.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          {/* Subtasks */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">
              Subtasks
            </p>
            {subtasks.length > 0 && (
              <div className="mb-3 space-y-2">
                {subtasks.map((st) => (
                  <div
                    key={st.id}
                    className="flex items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2"
                  >
                    <span className="flex-1 text-sm text-gray-700">{st.title}</span>
                    <span className="shrink-0 text-xs text-gray-400">{st.hoursRequired}h</span>
                    <button
                      onClick={() => removeSubtask(st.id)}
                      className="shrink-0 rounded p-1 text-gray-400 hover:bg-red-50 hover:text-red-500"
                      aria-label={`Remove subtask: ${st.title}`}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
            {/* Add subtask */}
            <div className="flex items-end gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  value={newSubTitle}
                  onChange={(e) => setNewSubTitle(e.target.value)}
                  placeholder="Subtask title"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSubtask();
                    }
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <div className="w-20">
                <input
                  type="number"
                  value={newSubHours}
                  onChange={(e) => setNewSubHours(e.target.value)}
                  placeholder="Hours"
                  step="0.5"
                  min="0"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addSubtask();
                    }
                  }}
                  className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                />
              </div>
              <button
                onClick={addSubtask}
                disabled={!newSubTitle.trim()}
                className="rounded-lg bg-teal-600 p-2 text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Add subtask"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-gray-100 px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={!owner.trim() || !action.trim()}
            className="rounded-xl bg-[#4a7c59] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d6a4a] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isEdit ? 'Update Task' : 'Create Task'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Inline Add Subtask
// ---------------------------------------------------------------------------

function InlineAddSubtask({ onAdd }: { onAdd: (title: string, hours: number) => void }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [hours, setHours] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) inputRef.current.focus();
  }, [open]);

  const handleAdd = () => {
    if (!title.trim()) return;
    onAdd(title.trim(), parseFloat(hours) || 0);
    setTitle('');
    setHours('');
  };

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="mt-2 flex items-center gap-1.5 text-xs font-medium text-teal-600 transition-colors hover:text-teal-700"
      >
        <Plus className="h-3.5 w-3.5" />
        Add subtask
      </button>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="mt-2 flex items-center gap-2"
    >
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd();
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder="Subtask title"
        className="flex-1 rounded-lg border border-gray-200 bg-white px-3 py-1.5 text-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
      />
      <input
        type="number"
        value={hours}
        onChange={(e) => setHours(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleAdd();
          if (e.key === 'Escape') setOpen(false);
        }}
        placeholder="Hrs"
        step="0.5"
        min="0"
        className="w-16 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500/20"
      />
      <button
        onClick={handleAdd}
        disabled={!title.trim()}
        className="rounded-lg bg-teal-600 p-1.5 text-white hover:bg-teal-700 disabled:opacity-40"
        aria-label="Add"
      >
        <Plus className="h-3 w-3" />
      </button>
      <button
        onClick={() => setOpen(false)}
        className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
        aria-label="Cancel"
      >
        <X className="h-3 w-3" />
      </button>
    </motion.div>
  );
}

// ---------------------------------------------------------------------------
// Task Row
// ---------------------------------------------------------------------------

function TaskRow({
  task,
  isExpanded,
  onToggleExpand,
  onToggleSubtask,
  onEdit,
  onDelete,
  onCycleStatus,
  onAddSubtask,
  rowIndex,
}: {
  task: Task;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onToggleSubtask: (subtaskId: string) => void;
  onEdit: () => void;
  onDelete: () => void;
  onCycleStatus: () => void;
  onAddSubtask: (title: string, hours: number) => void;
  rowIndex: number;
}) {
  const completedSubs = task.subtasks.filter((s) => s.completed).length;
  const totalSubs = task.subtasks.length;
  const completedHours = task.subtasks
    .filter((s) => s.completed)
    .reduce((sum, s) => sum + s.hoursRequired, 0);
  const totalHours = task.subtasks.reduce((sum, s) => sum + s.hoursRequired, 0);
  const progress = totalSubs > 0 ? (completedSubs / totalSubs) * 100 : 0;

  const isEven = rowIndex % 2 === 0;

  return (
    <div className="group">
      {/* Main row */}
      <motion.div
        layout
        className={`flex cursor-pointer items-center border-b border-gray-100 transition-colors hover:bg-teal-50/40 ${
          isEven ? 'bg-white' : 'bg-gray-50/50'
        } ${isExpanded ? 'bg-teal-50/30' : ''}`}
        onClick={onToggleExpand}
        role="row"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onToggleExpand();
          }
        }}
        aria-expanded={isExpanded}
      >
        {/* Expand icon */}
        <div className="flex w-10 shrink-0 items-center justify-center py-3 pl-2">
          <motion.div
            animate={{ rotate: isExpanded ? 90 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ChevronRight className="h-4 w-4 text-gray-400" />
          </motion.div>
        </div>

        {/* Owner */}
        <div className="flex w-28 shrink-0 items-center gap-2 py-3 pr-3 sm:w-36">
          <OwnerAvatar owner={task.owner} />
          <span className="hidden truncate text-sm font-medium text-gray-700 sm:block">
            {task.owner}
          </span>
        </div>

        {/* Action */}
        <div className="min-w-0 flex-1 py-3 pr-4">
          <p className="line-clamp-2 text-sm text-gray-800">{task.action}</p>
          {totalSubs > 0 && (
            <div className="mt-1.5 flex items-center gap-2">
              <div className="h-1.5 w-20 overflow-hidden rounded-full bg-gray-200">
                <motion.div
                  className="h-full rounded-full bg-teal-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <span className="text-[11px] text-gray-400">
                {completedSubs}/{totalSubs}
              </span>
            </div>
          )}
        </div>

        {/* Deadline */}
        <div className="hidden w-28 shrink-0 py-3 pr-3 md:block">
          <div className="flex items-center gap-1.5 text-sm text-gray-600">
            <Clock className="h-3.5 w-3.5 text-gray-400" />
            <span className="truncate">{task.deadline || '--'}</span>
          </div>
        </div>

        {/* Status */}
        <div className="hidden w-28 shrink-0 py-3 pr-3 sm:block">
          <StatusBadge status={task.status} />
        </div>

        {/* Actions */}
        <div className="flex w-24 shrink-0 items-center justify-end gap-1 py-3 pr-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCycleStatus();
            }}
            className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-all hover:bg-teal-50 hover:text-teal-600 group-hover:opacity-100"
            aria-label="Cycle status"
            title="Cycle status"
          >
            <ArrowUpDown className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-all hover:bg-blue-50 hover:text-blue-600 group-hover:opacity-100"
            aria-label="Edit task"
          >
            <Edit className="h-4 w-4" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete();
            }}
            className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </motion.div>

      {/* Expanded subtasks */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="border-b border-gray-100 bg-gray-50/70 px-4 py-3 pl-12 sm:pl-14">
              {/* Mobile-only status and deadline */}
              <div className="mb-3 flex flex-wrap items-center gap-3 sm:hidden">
                <StatusBadge status={task.status} compact />
                <div className="flex items-center gap-1.5 text-xs text-gray-500">
                  <Clock className="h-3 w-3" />
                  {task.deadline || 'No deadline'}
                </div>
              </div>

              {/* Progress summary */}
              {totalSubs > 0 && (
                <div className="mb-3 flex items-center gap-3">
                  <div className="h-2 flex-1 max-w-xs overflow-hidden rounded-full bg-gray-200">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-500"
                      initial={{ width: 0 }}
                      animate={{ width: `${progress}%` }}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                    />
                  </div>
                  <span className="text-xs font-medium text-gray-500">
                    {completedHours}/{totalHours} hours completed
                  </span>
                </div>
              )}

              {/* Subtask list */}
              {task.subtasks.length > 0 ? (
                <div className="space-y-1.5">
                  {task.subtasks.map((st, i) => (
                    <motion.div
                      key={st.id}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                        st.completed
                          ? 'bg-emerald-50/60'
                          : 'bg-white hover:bg-white/80'
                      }`}
                    >
                      <button
                        onClick={() => onToggleSubtask(st.id)}
                        className="shrink-0 transition-transform active:scale-90"
                        aria-label={st.completed ? `Mark "${st.title}" as incomplete` : `Mark "${st.title}" as complete`}
                      >
                        {st.completed ? (
                          <motion.div
                            initial={{ scale: 0.5 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', damping: 12, stiffness: 400 }}
                          >
                            <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                          </motion.div>
                        ) : (
                          <Circle className="h-5 w-5 text-gray-300 hover:text-teal-400" />
                        )}
                      </button>
                      <span
                        className={`flex-1 text-sm transition-all ${
                          st.completed
                            ? 'text-gray-400 line-through'
                            : 'text-gray-700'
                        }`}
                      >
                        {st.title}
                      </span>
                      <span className="flex shrink-0 items-center gap-1 text-xs text-gray-400">
                        <Clock className="h-3 w-3" />
                        {st.hoursRequired}h
                      </span>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-400 italic">No subtasks yet.</p>
              )}

              <InlineAddSubtask onAdd={onAddSubtask} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main Page
// ---------------------------------------------------------------------------

export default function TasksPage() {
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterOwner, setFilterOwner] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<string>('All');
  const [sortField, setSortField] = useState<SortField>('deadline');
  const [sortDir, setSortDir] = useState<SortDir>('asc');
  const [showFilters, setShowFilters] = useState(false);
  const [mobileSidebar, setMobileSidebar] = useState(false);

  // Modal state
  const [modalTask, setModalTask] = useState<Task | null | undefined>(undefined); // undefined = closed
  const [deleteTarget, setDeleteTarget] = useState<Task | null>(null);

  // Auth guard + initial load
  useEffect(() => {
    const auth = localStorage.getItem(AUTH_KEY);
    if (auth !== 'authenticated') {
      router.replace('/');
      return;
    }
    setTasks(loadTasks());
    setIsMounted(true);
  }, [router]);

  // Persist on every change
  const updateTasks = useCallback((updater: (prev: Task[]) => Task[]) => {
    setTasks((prev) => {
      const next = updater(prev);
      saveTasks(next);
      return next;
    });
  }, []);

  // Unique owners
  const owners = useMemo(() => {
    const set = new Set(tasks.map((t) => t.owner));
    return Array.from(set).sort();
  }, [tasks]);

  // Filtered + sorted tasks
  const filteredTasks = useMemo(() => {
    let result = [...tasks];

    // Search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (t) =>
          t.action.toLowerCase().includes(q) ||
          t.owner.toLowerCase().includes(q),
      );
    }

    // Owner filter
    if (filterOwner !== 'All') {
      result = result.filter((t) => t.owner === filterOwner);
    }

    // Status filter
    if (filterStatus !== 'All') {
      result = result.filter((t) => t.status === filterStatus);
    }

    // Sort
    result.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case 'deadline': {
          const aTime = a.deadlineDate?.getTime() ?? Infinity;
          const bTime = b.deadlineDate?.getTime() ?? Infinity;
          cmp = aTime - bTime;
          break;
        }
        case 'owner':
          cmp = a.owner.localeCompare(b.owner);
          break;
        case 'status': {
          const order = ALL_STATUSES;
          cmp = order.indexOf(a.status) - order.indexOf(b.status);
          break;
        }
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });

    return result;
  }, [tasks, searchQuery, filterOwner, filterStatus, sortField, sortDir]);

  // Handlers
  const toggleExpand = useCallback((id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  const toggleSubtask = useCallback(
    (taskId: string, subtaskId: string) => {
      updateTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                subtasks: t.subtasks.map((s) =>
                  s.id === subtaskId ? { ...s, completed: !s.completed } : s,
                ),
              }
            : t,
        ),
      );
    },
    [updateTasks],
  );

  const cycleStatus = useCallback(
    (taskId: string) => {
      updateTasks((prev) =>
        prev.map((t) => {
          if (t.id !== taskId) return t;
          const idx = ALL_STATUSES.indexOf(t.status);
          const nextStatus = ALL_STATUSES[(idx + 1) % ALL_STATUSES.length];
          return { ...t, status: nextStatus };
        }),
      );
    },
    [updateTasks],
  );

  const saveTask = useCallback(
    (task: Task) => {
      updateTasks((prev) => {
        const exists = prev.find((t) => t.id === task.id);
        if (exists) {
          return prev.map((t) => (t.id === task.id ? task : t));
        }
        return [...prev, task];
      });
      setModalTask(undefined);
    },
    [updateTasks],
  );

  const deleteTask = useCallback(
    (id: string) => {
      updateTasks((prev) => prev.filter((t) => t.id !== id));
      setDeleteTarget(null);
    },
    [updateTasks],
  );

  const addSubtaskToTask = useCallback(
    (taskId: string, title: string, hours: number) => {
      updateTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? {
                ...t,
                subtasks: [
                  ...t.subtasks,
                  {
                    id: generateId(),
                    title,
                    hoursRequired: hours,
                    completed: false,
                  },
                ],
              }
            : t,
        ),
      );
    },
    [updateTasks],
  );

  const toggleSort = useCallback((field: SortField) => {
    setSortField((prev) => {
      if (prev === field) {
        setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
        return prev;
      }
      setSortDir('asc');
      return field;
    });
  }, []);

  // Stats
  const stats = useMemo(() => {
    const total = tasks.length;
    const done = tasks.filter((t) => t.status === 'Done').length;
    const inProgress = tasks.filter((t) => t.status === 'In progress').length;
    const overdue = tasks.filter((t) => t.status === 'Due').length;
    return { total, done, inProgress, overdue };
  }, [tasks]);

  if (!isMounted) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <motion.div
          className="h-8 w-8 rounded-full border-2 border-gray-300 border-t-teal-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
        />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar
        mobileOpen={mobileSidebar}
        onCloseMobile={() => setMobileSidebar(false)}
      />

      {/* Main content */}
      <main className="flex-1 lg:ml-60">
        {/* Top bar */}
        <header className="sticky top-0 z-20 border-b border-gray-200 bg-white/80 backdrop-blur-md">
          <div className="flex items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
            {/* Mobile menu button */}
            <button
              onClick={() => setMobileSidebar(true)}
              className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
              aria-label="Open sidebar"
            >
              <Menu className="h-5 w-5" />
            </button>

            <div className="flex-1">
              <h1 className="text-xl font-bold tracking-tight text-gray-900 sm:text-2xl">
                Action Tracker
              </h1>
            </div>

            <button
              onClick={() => setModalTask(null)}
              className="flex items-center gap-2 rounded-xl bg-[#4a7c59] px-4 py-2 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#3d6a4a]"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Add Task</span>
            </button>
          </div>

          {/* Quick stats */}
          <div className="flex gap-4 overflow-x-auto border-t border-gray-100 px-4 py-2 sm:px-6 lg:px-8">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="h-2 w-2 rounded-full bg-gray-400" />
              <span className="font-medium">{stats.total}</span> total
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-medium">{stats.done}</span> done
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="h-2 w-2 rounded-full bg-blue-500" />
              <span className="font-medium">{stats.inProgress}</span> in progress
            </div>
            {stats.overdue > 0 && (
              <div className="flex items-center gap-1.5 text-xs text-gray-500">
                <div className="h-2 w-2 rounded-full bg-red-500" />
                <span className="font-medium">{stats.overdue}</span> due
              </div>
            )}
          </div>
        </header>

        {/* Controls */}
        <div className="px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            {/* Search */}
            <div className="relative max-w-md flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks..."
                className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-10 pr-4 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                aria-label="Search tasks"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded p-0.5 text-gray-400 hover:text-gray-600"
                  aria-label="Clear search"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Filter toggle + sort */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-sm font-medium transition-colors ${
                  showFilters || filterOwner !== 'All' || filterStatus !== 'All'
                    ? 'border-teal-200 bg-teal-50 text-teal-700'
                    : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Filter className="h-4 w-4" />
                Filters
                {(filterOwner !== 'All' || filterStatus !== 'All') && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-teal-600 text-[10px] font-bold text-white">
                    {(filterOwner !== 'All' ? 1 : 0) +
                      (filterStatus !== 'All' ? 1 : 0)}
                  </span>
                )}
              </button>

              {/* Sort buttons */}
              <div className="flex rounded-xl border border-gray-200 bg-white">
                {(['deadline', 'owner', 'status'] as SortField[]).map(
                  (field) => (
                    <button
                      key={field}
                      onClick={() => toggleSort(field)}
                      className={`flex items-center gap-1 px-3 py-2 text-xs font-medium capitalize transition-colors first:rounded-l-xl last:rounded-r-xl ${
                        sortField === field
                          ? 'bg-gray-100 text-gray-900'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {field === 'deadline' ? 'Due Date' : field}
                      {sortField === field &&
                        (sortDir === 'asc' ? (
                          <ChevronUp className="h-3 w-3" />
                        ) : (
                          <ChevronDown className="h-3 w-3" />
                        ))}
                    </button>
                  ),
                )}
              </div>
            </div>
          </div>

          {/* Filter row */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col gap-3 pt-3 sm:flex-row sm:items-end">
                  {/* Owner filter */}
                  <div>
                    <label
                      htmlFor="filter-owner"
                      className="mb-1 block text-xs font-semibold uppercase tracking-wider text-gray-500"
                    >
                      Owner
                    </label>
                    <select
                      id="filter-owner"
                      value={filterOwner}
                      onChange={(e) => setFilterOwner(e.target.value)}
                      className="rounded-xl border border-gray-200 bg-white px-3 py-2 text-sm outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                    >
                      <option value="All">All Owners</option>
                      {owners.map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Status filter pills */}
                  <div className="flex-1">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">
                      Status
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        onClick={() => setFilterStatus('All')}
                        className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                          filterStatus === 'All'
                            ? 'bg-gray-800 text-white'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        All
                      </button>
                      {ALL_STATUSES.map((s) => {
                        const colors =
                          statusColors[s] || 'bg-gray-100 text-gray-700';
                        const isActive = filterStatus === s;
                        return (
                          <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`rounded-full border px-3 py-1 text-xs font-medium transition-all ${
                              isActive
                                ? `${colors} ring-2 ring-offset-1 ring-gray-300`
                                : `${colors} opacity-60 hover:opacity-100`
                            }`}
                          >
                            {s}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Clear filters */}
                  {(filterOwner !== 'All' || filterStatus !== 'All') && (
                    <button
                      onClick={() => {
                        setFilterOwner('All');
                        setFilterStatus('All');
                      }}
                      className="shrink-0 text-xs font-medium text-teal-600 hover:text-teal-700"
                    >
                      Clear all
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Table */}
        <div className="px-4 pb-8 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            {/* Table header */}
            <div className="flex items-center border-b border-gray-200 bg-[#4a7c59] text-white">
              <div className="w-10 shrink-0 py-3 pl-2" />
              <div className="w-28 shrink-0 py-3 pr-3 text-xs font-semibold uppercase tracking-wider sm:w-36">
                Owner
              </div>
              <div className="min-w-0 flex-1 py-3 pr-4 text-xs font-semibold uppercase tracking-wider">
                Action
              </div>
              <div className="hidden w-28 shrink-0 py-3 pr-3 text-xs font-semibold uppercase tracking-wider md:block">
                Deadline
              </div>
              <div className="hidden w-28 shrink-0 py-3 pr-3 text-xs font-semibold uppercase tracking-wider sm:block">
                Status
              </div>
              <div className="w-24 shrink-0 py-3 pr-3 text-right text-xs font-semibold uppercase tracking-wider">
                Actions
              </div>
            </div>

            {/* Task rows */}
            {filteredTasks.length > 0 ? (
              filteredTasks.map((task, i) => (
                <TaskRow
                  key={task.id}
                  task={task}
                  rowIndex={i}
                  isExpanded={expandedIds.has(task.id)}
                  onToggleExpand={() => toggleExpand(task.id)}
                  onToggleSubtask={(subtaskId) =>
                    toggleSubtask(task.id, subtaskId)
                  }
                  onEdit={() => setModalTask(task)}
                  onDelete={() => setDeleteTarget(task)}
                  onCycleStatus={() => cycleStatus(task.id)}
                  onAddSubtask={(title, hours) =>
                    addSubtaskToTask(task.id, title, hours)
                  }
                />
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <Search className="mb-3 h-8 w-8" />
                <p className="text-sm font-medium">No tasks found</p>
                <p className="text-xs">Try adjusting your search or filters.</p>
              </div>
            )}
          </div>

          {/* Results count */}
          <p className="mt-3 text-xs text-gray-400">
            Showing {filteredTasks.length} of {tasks.length} tasks
          </p>
        </div>
      </main>

      {/* Modals */}
      <AnimatePresence>
        {modalTask !== undefined && (
          <TaskModal
            task={modalTask}
            onSave={saveTask}
            onClose={() => setModalTask(undefined)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {deleteTarget && (
          <DeleteConfirmModal
            taskAction={deleteTarget.action}
            onConfirm={() => deleteTask(deleteTarget.id)}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
