export function toAppRelativeUrl(url?: string): string {
  if (!url) return '';
  const value = String(url).trim();
  if (!value) return '';
  if (/^https?:\/\//i.test(value)) {
    try {
      const parsed = new URL(value);
      return `${parsed.pathname || '/'}${parsed.search || ''}${parsed.hash || ''}`;
    } catch {
      return value;
    }
  }
  return value;
}
