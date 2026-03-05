import type { ReactNode } from 'react';

interface MetricCardProps {
  title: string;
  value: ReactNode;
  helperText?: string;
  icon?: ReactNode;
  loading?: boolean;
  className?: string;
}

export default function MetricCard({
  title,
  value,
  helperText,
  icon,
  loading = false,
  className = '',
}: MetricCardProps) {
  return (
    <div
      className={`rounded-2xl bg-[color:var(--bg-surface)] border border-[color:var(--border-subtle)] px-4 py-3 hover-elevated ${className}`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[11px] text-[color:var(--text-muted)] mb-1 uppercase tracking-wide">
            {title}
          </p>
          {loading ? (
            <div className="mt-1 h-5 w-16 rounded-full skeleton" />
          ) : (
            <p className="text-lg font-semibold text-[color:var(--text-primary)]">
              {value}
            </p>
          )}
          {helperText && (
            <p className="text-[11px] text-[color:var(--text-muted)] mt-0.5">
              {helperText}
            </p>
          )}
        </div>
        {icon && (
          <div className="shrink-0 text-[color:var(--accent-muted)]">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

