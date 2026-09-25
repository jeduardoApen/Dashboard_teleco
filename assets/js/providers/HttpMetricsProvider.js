import { MetricSnapshot } from '../domain/MetricSnapshot.js';

export class MetricsError extends Error {
  constructor(code, message) {
    super(message);
    this.name = 'MetricsError';
    this.code = code;
  }
}

/**
 * Proveedor HTTP. Consulta GET {apiUrl} y normaliza la respuesta a MetricSnapshot.
 * Maneja errores HTTP, timeout, pérdida de conexión y respuestas inválidas.
 */
export class HttpMetricsProvider {
  #url;
  #timeout;

  constructor({ url, timeout = 6000 } = {}) {
    if (!url) throw new Error('HttpMetricsProvider: se requiere "url"');
    this.#url = url;
    this.#timeout = timeout;
  }

  async getMetrics() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.#timeout);

    try {
      let response;
      try {
        response = await fetch(this.#url, {
          signal: controller.signal,
          headers: { Accept: 'application/json' }
        });
      } catch (error) {
        if (error.name === 'AbortError') {
          throw new MetricsError(
            'timeout',
            `Timeout: sin respuesta en ${this.#timeout} ms`
          );
        }
        throw new MetricsError(
          'connection',
          'Pérdida de conexión con el servidor de métricas'
        );
      }

      if (!response.ok) {
        throw new MetricsError(
          'http',
          `Error HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ''}`
        );
      }

      return await this.#toSnapshot(response);
    } finally {
      clearTimeout(timeoutId);
    }
  }

  async #toSnapshot(response) {
    let data;
    try {
      data = await response.json();
    } catch {
      throw new MetricsError('invalid', 'Respuesta inválida: el cuerpo no es JSON');
    }

    try {
      return MetricSnapshot.from(data);
    } catch (error) {
      throw new MetricsError('invalid', `Respuesta inválida: ${error.message}`);
    }
  }
}
