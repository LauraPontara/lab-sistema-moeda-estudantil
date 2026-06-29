export function semesterCode(date: Date): string {
  const month = date.getUTCMonth() + 1;
  const semester = month <= 6 ? 1 : 2;
  return `${date.getUTCFullYear()}-${semester}`;
}
