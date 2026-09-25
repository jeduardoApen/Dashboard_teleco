const pad = (value) => String(value).padStart(2, "0");

export function formatLatency(milliseconds) {
  if (!Number.isFinite(milliseconds)) return "--";
  return `${Math.round(milliseconds)} ms`;
}

export function formatMbps(value) {
  if (!Number.isFinite(value)) return "--";
  return `${value.toFixed(1)} Mbps`;
}

export function formatUsers(count) {
  if (!Number.isFinite(count)) return "--";
  return `${Math.round(count)}`;
}

export function formatTime(timestamp) {
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return "--";
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

export function formatUptime(seconds) {
  if (!Number.isFinite(seconds) || seconds < 0) return "--";

  const total = Math.floor(seconds);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m`;
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`;
  return `${minutes}m ${secs}s`;
}
