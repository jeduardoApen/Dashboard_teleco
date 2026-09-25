/**
 * Orquesta la obtención periódica de métricas y notifica a los suscriptores.
 * El proveedor se recibe por inyección de dependencia (DIP).
 */
export class MetricsService {
  #provider;
  #intervalMs;
  #timerId = null;
  #inFlight = false;
  #listeners = new Set();

  constructor(provider, { intervalMs = 2000 } = {}) {
    if (!provider || typeof provider.getMetrics !== 'function') {
      throw new Error('MetricsService: proveedor de métricas inválido');
    }
    this.#provider = provider;
    this.#intervalMs = intervalMs;
  }

  subscribe(listener) {
    this.#listeners.add(listener);
    return () => this.#listeners.delete(listener);
  }

  async start() {
    if (this.#timerId !== null) return;
    await this.refresh();
    this.#timerId = setInterval(() => this.refresh(), this.#intervalMs);
  }

  stop() {
    if (this.#timerId !== null) {
      clearInterval(this.#timerId);
      this.#timerId = null;
    }
  }

  async refresh() {
    if (this.#inFlight) return;
    this.#inFlight = true;

    try {
      const snapshot = await this.#provider.getMetrics();
      this.#emit({ snapshot, error: null });
    } catch (error) {
      this.#emit({ snapshot: null, error });
    } finally {
      this.#inFlight = false;
    }
  }

  #emit(event) {
    for (const listener of this.#listeners) {
      listener(event);
    }
  }
}
