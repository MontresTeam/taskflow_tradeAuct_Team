import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { portalApi, type ProjectMapping } from '../../lib/api';
import { FiArrowLeft, FiSend } from 'react-icons/fi';

const ALL_TYPES = ['bug', 'feature', 'suggestion', 'concern', 'other'];
const PRIORITIES = ['low', 'medium', 'high', 'critical'];

export default function NewRequest() {
  const { token } = useAuth();
  const navigate = useNavigate();

  const [mappings, setMappings] = useState<ProjectMapping[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [projectsError, setProjectsError] = useState('');

  const [projectId, setProjectId] = useState('');
  const [title, setTitle] = useState('');
  const [type, setType] = useState('');
  const [priority, setPriority] = useState('medium');
  const [description, setDescription] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    setLoadingProjects(true);
    portalApi.listProjects(token).then((res) => {
      setLoadingProjects(false);
      if (res.success && res.data) {
        const active = res.data.mappings.filter((m) => m.status === 'active');
        setMappings(active);
        if (active.length === 1) setProjectId(active[0].projectId._id);
      } else {
        setProjectsError((res as { message?: string }).message ?? 'Failed to load projects');
      }
    });
  }, [token]);

  const selectedMapping = mappings.find((m) => m.projectId._id === projectId);
  const allowedTypes =
    selectedMapping && selectedMapping.allowedRequestTypes.length > 0
      ? ALL_TYPES.filter((t) => selectedMapping.allowedRequestTypes.includes(t))
      : ALL_TYPES;

  // Reset type if it's no longer allowed after project change
  useEffect(() => {
    if (type && !allowedTypes.includes(type)) {
      setType('');
    }
  }, [projectId, allowedTypes, type]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!token) return;
    if (!projectId || !title.trim() || !type || !priority || !description.trim()) {
      setError('Please fill in all required fields.');
      return;
    }
    setError('');
    setSubmitting(true);
    const res = await portalApi.createRequest(
      { projectId, title: title.trim(), description: description.trim(), type, priority },
      token
    );
    setSubmitting(false);
    if (res.success && res.data) {
      navigate(`/portal/requests/${res.data.request._id}`);
    } else {
      setError((res as { message?: string }).message ?? 'Failed to submit request');
    }
  }

  const labelClass = 'block text-sm font-medium text-[color:var(--text-primary)] mb-1.5';
  const inputClass =
    'w-full rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-page)] px-4 py-3 text-sm text-[color:var(--text-primary)] placeholder-[color:var(--text-muted)] transition focus:border-[color:var(--accent)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/30';

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-6">
        <button
          type="button"
          onClick={() => navigate('/portal/requests')}
          className="flex items-center gap-2 text-sm text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] transition mb-4"
        >
          <FiArrowLeft /> Back to Requests
        </button>
        <h1 className="text-xl font-semibold text-[color:var(--text-primary)]">Submit New Request</h1>
        <p className="text-sm text-[color:var(--text-muted)] mt-1">
          Describe your request and our team will review it.
        </p>
      </div>

      <div className="max-w-2xl">
        {loadingProjects ? (
          <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-12 text-center text-[color:var(--text-muted)] animate-pulse">
            Loading projects…
          </div>
        ) : projectsError ? (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-6 text-sm text-red-400">
            {projectsError}
          </div>
        ) : mappings.length === 0 ? (
          <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-12 text-center text-sm text-[color:var(--text-muted)]">
            No active projects are mapped to your organisation. Contact your administrator.
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-6 space-y-5"
          >
            {error && (
              <div className="rounded-lg border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-400">
                {error}
              </div>
            )}

            {/* Project */}
            <div>
              <label className={labelClass}>
                Project <span className="text-red-400">*</span>
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                required
                className={inputClass}
              >
                <option value="">Select a project…</option>
                {mappings.map((m) => (
                  <option key={m.projectId._id} value={m.projectId._id}>
                    {m.projectId.name} ({m.projectId.key})
                  </option>
                ))}
              </select>
            </div>

            {/* Title */}
            <div>
              <label className={labelClass}>
                Title <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                placeholder="Brief summary of your request"
                className={inputClass}
              />
            </div>

            {/* Type + Priority */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Type <span className="text-red-400">*</span>
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                  required
                  disabled={!projectId}
                  className={`${inputClass} disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  <option value="">Select type…</option>
                  {allowedTypes.map((t) => (
                    <option key={t} value={t}>
                      {t.charAt(0).toUpperCase() + t.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Priority <span className="text-red-400">*</span>
                </label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                  required
                  className={inputClass}
                >
                  {PRIORITIES.map((p) => (
                    <option key={p} value={p}>
                      {p.charAt(0).toUpperCase() + p.slice(1)}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className={labelClass}>
                Description <span className="text-red-400">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                rows={6}
                placeholder="Provide detailed information about your request…"
                className={`${inputClass} resize-y`}
              />
            </div>

            {/* Submit */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate('/portal/requests')}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="btn-primary flex items-center gap-2"
              >
                <FiSend />
                {submitting ? 'Submitting…' : 'Submit Request'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
