export function isNightTime(): boolean {
  const hour = new Date().getHours();
  // Night defined as 7:00 PM (19:00) to 7:00 AM (07:00)
  return hour >= 19 || hour < 7;
}

export function formatTimeRange(): string {
  return "10:00 AM - 11:00 PM";
}