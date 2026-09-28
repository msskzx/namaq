const KIND_COLOR = {
  person: { light: 'rgba(241, 242, 180, 0.8)', dark: 'rgba(55, 65, 81, 0.8)' },
  title: { light: 'rgba(199, 210, 254, 0.9)', dark: 'rgba(79, 70, 229, 0.85)' },
  battle: { light: 'rgba(253, 230, 138, 0.9)', dark: 'rgba(180, 83, 9, 0.85)' },
  event: { light: 'rgba(153, 246, 228, 0.9)', dark: 'rgba(13, 148, 136, 0.85)' },
} as const;

export function kindFillColor(kind: string, isDark: boolean): string {
  return KIND_COLOR[kind as keyof typeof KIND_COLOR]?.[isDark ? 'dark' : 'light'] ?? KIND_COLOR.person[isDark ? 'dark' : 'light'];
}
