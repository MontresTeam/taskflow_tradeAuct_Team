export const CHART_COLORS = [
  '#4f46e5',
  '#0ea5e9',
  '#22c55e',
  '#f97316',
  '#e11d48',
  '#6366f1',
  '#a855f7',
];

export function getChartColor(index: number): string {
  return CHART_COLORS[index % CHART_COLORS.length];
}

