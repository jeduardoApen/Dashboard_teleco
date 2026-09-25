import { MetricSnapshot } from '../domain/MetricSnapshot.js';

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

const walk = (value, step, min, max) =>
  clamp(value + (Math.random() * 2 - 1) * step, min, max);

/**
 * Genera métricas simuladas con variaciones suaves (random walk)
 * para poder demostrar el dashboard sin backend.
 */
export class MockMetricsProvider {
  #latency = 18;
  #download = 24.5;
  #upload = 7.2;
  #activeUsers = 4;
  #bootTime = Date.now();
  #services = { internet: true, pfsense: true, portal: true };

  async getMetrics() {
    this.#advance();
    return new MetricSnapshot({
      timestamp: new Date(),
      latency: this.#latency,
      download: this.#download,
      upload: this.#upload,
      activeUsers: Math.round(this.#activeUsers),
      uptime: (Date.now() - this.#bootTime) / 1000,
      services: { ...this.#services }
    });
  }

  #advance() {
    this.#latency = walk(this.#latency, 4, 6, 130);
    this.#download = walk(this.#download, 1.8, 2, 95);
    this.#upload = walk(this.#upload, 0.9, 0.5, 45);
    this.#activeUsers = walk(this.#activeUsers, 0.5, 0, 40);

    this.#services.internet = this.#nextState(this.#services.internet);
    this.#services.pfsense = this.#nextState(this.#services.pfsense);
    this.#services.portal = this.#nextState(this.#services.portal);
  }

  #nextState(isOnline) {
    if (isOnline) return Math.random() > 0.004;
    return Math.random() < 0.3;
  }
}
