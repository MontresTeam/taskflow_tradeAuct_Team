import { FaGoogle, FaMicrosoft } from 'react-icons/fa';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function OAuthButtons() {
  return (
    <div className="flex flex-col gap-3 w-full">
      <a
        href={`${API_BASE}/auth/oauth/google`}
        className="flex items-center justify-center gap-3 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-page)] px-4 py-3 text-sm font-medium text-[color:var(--text-primary)] transition hover:bg-[color:var(--bg-surface)]"
      >
        <FaGoogle className="text-base text-red-500" />
        Sign in with Google
      </a>
      <a
        href={`${API_BASE}/auth/oauth/microsoft`}
        className="flex items-center justify-center gap-3 rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-page)] px-4 py-3 text-sm font-medium text-[color:var(--text-primary)] transition hover:bg-[color:var(--bg-surface)]"
      >
        <FaMicrosoft className="text-base text-sky-500" />
        Sign in with Microsoft
      </a>
    </div>
  );
}
