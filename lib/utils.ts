export function deslugify(slug: string): string {
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function calculatePercentage(open: number, total: number) {
  return Math.round((open / total) * 100);
}
