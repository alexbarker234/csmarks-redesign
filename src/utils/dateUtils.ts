export function formatDate(date: Date): string {
  const hours = date.getHours() % 12 || 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const ampm = date.getHours() >= 12 ? "pm" : "am";
  const weekday = date.toLocaleString("en-US", { weekday: "short" });
  const day = date.getDate();
  const month = date.toLocaleString("en-US", { month: "short" });

  return `${hours}:${minutes}${ampm} ${weekday} ${getOrdinal(day)} ${month}`;
}

function getOrdinal(day: number): string {
  const suffixes = ["th", "st", "nd", "rd"];
  const value = day % 100;
  return day + (suffixes[(value - 20) % 10] || suffixes[value] || suffixes[0]);
}
