import { useState, useRef } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { portalApi, uploadFile } from '../../lib/api';
import { formatDateDDMMYYYY } from '../../lib/dateFormat';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

function getAvatarUrl(avatarUrl?: string): string | null {
  if (!avatarUrl) return null;
  const base = API_BASE.replace(/\/api\/?$/, '') || 'http://localhost:5000';
  return avatarUrl.startsWith('http') ? avatarUrl : `${base}${avatarUrl}`;
}

function getInitials(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function PortalProfile() {
  const { user, token, updateUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [editName, setEditName] = useState(user?.name || '');
  const [isEditingName, setIsEditingName] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const avatarValidTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

  async function handleAvatarFile(file: File) {
    if (!token || !user) return;
    if (!avatarValidTypes.includes(file.type)) {
      setError('Please upload a JPEG, PNG, GIF, or WebP image');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be under 2 MB');
      return;
    }
    setAvatarLoading(true);
    setError('');
    const res = await uploadFile(file, token);
    setAvatarLoading(false);
    if (res.success && res.data?.url) {
      const profileRes = await portalApi.updateMe({ avatarUrl: res.data.url }, token);
      if (profileRes.success && profileRes.data?.user) {
        updateUser(profileRes.data.user);
      }
    } else {
      setError((res as { message?: string }).message ?? 'Upload failed');
    }
  }

  function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = '';
    void handleAvatarFile(file);
  }

  async function handleRemoveAvatar() {
    if (!token || !user) return;
    setAvatarLoading(true);
    setError('');
    const res = await portalApi.updateMe({ avatarUrl: '' }, token);
    setAvatarLoading(false);
    if (res.success && res.data?.user) {
      updateUser(res.data.user);
    } else {
      setError((res as { message?: string }).message ?? 'Failed to remove avatar');
    }
  }

  async function handleSaveName() {
    if (!token || !user || editName.trim() === user.name) {
      setIsEditingName(false);
      return;
    }
    setLoading(true);
    setError('');
    const res = await portalApi.updateMe({ name: editName.trim() }, token);
    setLoading(false);
    if (res.success && res.data?.user) {
      updateUser(res.data.user);
      setIsEditingName(false);
    } else {
      setError((res as { message?: string }).message ?? 'Failed to update name');
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }
    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }
    if (!token) {
      setError('Not authenticated');
      return;
    }
    setLoading(true);
    const res = await portalApi.changePassword(currentPassword, newPassword, token);
    setLoading(false);
    if (res.success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setSuccess(true);
      // Clear the mustChangePassword flag so navigation is unlocked
      if (user) updateUser({ ...user, mustChangePassword: false });
    } else {
      setError((res as { message?: string }).message ?? 'Failed to change password');
    }
  }

  if (!user) return null;

  const avatarFullUrl = getAvatarUrl(user.avatarUrl);
  const initials = getInitials(user.name);

  return (
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <h1 className="text-2xl font-semibold text-[color:var(--text-primary)]">Profile</h1>
      {user.mustChangePassword && (
        <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-yellow-400 text-sm font-medium">
          You must change your password before accessing the portal. Please update it below.
        </div>
      )}

      <div className="rounded-2xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-6 sm:p-8 flex flex-col sm:flex-row items-center gap-6">
        <div className="relative group">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-[color:var(--bg-page)] border-2 border-[color:var(--border-subtle)] flex items-center justify-center text-2xl font-semibold text-[color:var(--text-muted)] shrink-0">
            {avatarFullUrl ? (
              <img src={avatarFullUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              initials
            )}
          </div>
          <div className="absolute inset-0 rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/gif,image/webp"
              className="hidden"
              onChange={handleAvatarUpload}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={avatarLoading}
              className="px-2 py-1 rounded bg-white text-black text-[10px] font-bold"
            >
              UPLOAD
            </button>
            {user.avatarUrl && (
              <button
                type="button"
                onClick={handleRemoveAvatar}
                disabled={avatarLoading}
                className="px-2 py-1 rounded bg-red-500 text-white text-[10px] font-bold"
              >
                REMOVE
              </button>
            )}
          </div>
        </div>

        <div className="flex-1 text-center sm:text-left">
          {isEditingName ? (
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="px-3 py-1.5 rounded-lg bg-[color:var(--bg-page)] border border-[color:var(--border-subtle)] text-[color:var(--text-primary)] focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/50"
              />
              <button onClick={handleSaveName} className="text-xs text-[color:var(--accent)] font-bold">SAVE</button>
              <button onClick={() => setIsEditingName(false)} className="text-xs text-[color:var(--text-muted)] font-bold">CANCEL</button>
            </div>
          ) : (
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h2 className="text-xl font-semibold text-[color:var(--text-primary)]">{user.name}</h2>
              <button onClick={() => setIsEditingName(true)} className="text-[color:var(--text-muted)] hover:text-[color:var(--text-primary)] transition">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
              </button>
            </div>
          )}
          <p className="text-sm text-[color:var(--text-muted)] mt-1">{user.email}</p>
          <div className="flex gap-2 mt-3 justify-center sm:justify-start">
             <span className="px-2 py-0.5 rounded bg-[color:var(--accent)]/10 text-[color:var(--accent)] text-[10px] font-bold uppercase tracking-wider">
               {user.isOrgAdmin ? 'Org Admin' : 'Member'}
             </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-6">
          <h2 className="text-base font-medium text-[color:var(--text-primary)] mb-4">Account details</h2>
          <dl className="space-y-4 text-sm">
            <div>
              <dt className="text-[color:var(--text-muted)] mb-0.5">Organisation ID</dt>
              <dd className="text-[color:var(--text-primary)] font-mono text-xs">{user.orgId}</dd>
            </div>
            <div>
              <dt className="text-[color:var(--text-muted)] mb-0.5">Account Status</dt>
              <dd className="text-emerald-400 font-medium">Active</dd>
            </div>
            {user.createdAt && (
              <div>
                <dt className="text-[color:var(--text-muted)] mb-0.5">Joined</dt>
                <dd className="text-[color:var(--text-primary)]">{formatDateDDMMYYYY(user.createdAt)}</dd>
              </div>
            )}
          </dl>
        </div>

        <div className="rounded-xl border border-[color:var(--border-subtle)] bg-[color:var(--bg-surface)] p-6">
          <h2 className="text-base font-medium text-[color:var(--text-primary)] mb-4">Change password</h2>
          <form onSubmit={handleChangePassword} className="space-y-4">
            {error && <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm">{error}</div>}
            {success && <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-sm">Updated successfully</div>}
            
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[color:var(--text-muted)] uppercase">Current password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg bg-[color:var(--bg-page)] border border-[color:var(--border-subtle)] text-[color:var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[color:var(--text-muted)] uppercase">New password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 rounded-lg bg-[color:var(--bg-page)] border border-[color:var(--border-subtle)] text-[color:var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/40"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-[color:var(--text-muted)] uppercase">Confirm new password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={8}
                className="w-full px-3 py-2 rounded-lg bg-[color:var(--bg-page)] border border-[color:var(--border-subtle)] text-[color:var(--text-primary)] text-sm focus:outline-none focus:ring-2 focus:ring-[color:var(--accent)]/40"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-2.5"
            >
              {loading ? 'Updating…' : 'Update password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
