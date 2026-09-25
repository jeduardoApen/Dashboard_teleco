export const SERVICE_NAMES = Object.freeze({
  internet: "Internet",
  pfsense: "pfSense",
  portal: "Portal Cautivo",
});

const WARNING_LATENCY_MS = 80;

function toFiniteNumber(value, field) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    throw new TypeError(`MetricSnapshot: campo inválido "${field}"`);
  }
  return parsed;
}

function toBoolean(value) {
  return value === true;
}

export class MetricSnapshot {
  constructor({
    timestamp,
    latency,
    download,
    upload,
    activeUsers,
    uptime,
    services,
  }) {
    const parsedTimestamp = timestamp ? new Date(timestamp) : new Date();

    this.timestamp = Number.isNaN(parsedTimestamp.getTime())
      ? new Date()
      : parsedTimestamp;
    this.latency = toFiniteNumber(latency, "latency");
    this.download = toFiniteNumber(download, "download");
    this.upload = toFiniteNumber(upload, "upload");
    this.activeUsers = toFiniteNumber(activeUsers, "activeUsers");
    this.uptime = toFiniteNumber(uptime, "uptime");
    this.services = Object.freeze({
      internet: toBoolean(services?.internet),
      pfsense: toBoolean(services?.pfsense),
      portal: toBoolean(services?.portal),
    });

    Object.freeze(this);
  }

  /** Crea una instantánea a partir de una respuesta cruda (API / mock). */
  static from(data) {
    if (!data || typeof data !== "object") {
      throw new TypeError("MetricSnapshot: payload vacío o inválido");
    }
    return new MetricSnapshot(data);
  }

  serviceStatus(name) {
    if (!(name in this.services)) return "offline";
    if (!this.services[name]) return "offline";
    return this.latency >= WARNING_LATENCY_MS ? "warning" : "online";
  }

  get isHealthy() {
    return (
      this.services.internet && this.services.pfsense && this.services.portal
    );
  }
}
