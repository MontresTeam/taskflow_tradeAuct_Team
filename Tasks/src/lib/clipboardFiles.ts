/**
 * Files from drag-and-drop or paste. Browsers often expose pasted images only via
 * `clipboardData.items`, not `files`.
 */
export function getFilesFromDataTransfer(data: DataTransfer | null): File[] {
  if (!data) return [];
  if (data.files && data.files.length > 0) {
    return Array.from(data.files);
  }
  const items = data.items;
  if (!items?.length) return [];
  const out: File[] = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file') {
      const f = item.getAsFile();
      if (f) out.push(f);
    }
  }
  return out;
}
