import { CONFIG } from './config.js';
import { MockMetricsProvider } from './providers/MockMetricsProvider.js';
import { HttpMetricsProvider } from './providers/HttpMetricsProvider.js';
import { MetricsService } from './services/MetricsService.js';
import { DashboardView } from './ui/DashboardView.js';

const PROVIDERS = {
  mock: () => new MockMetricsProvider(),
  http: () => new HttpMetricsProvider({ url: CONFIG.apiUrl })
};

function createProvider(name) {
  const factory = PROVIDERS[name] ?? PROVIDERS.mock;
  return factory();
}

function main() {
  const providerName = CONFIG.metricsProvider;
  const view = new DashboardView(document);

  view.setDemoMode(providerName === 'mock');
  view.setConnectionState('connecting');

  const provider = createProvider(providerName);
  const service = new MetricsService(provider, {
    intervalMs: CONFIG.refreshInterval
  });

  service.subscribe(({ snapshot, error }) => {
    if (snapshot) {
      view.setConnectionState('connected');
      view.update(snapshot);
      return;
    }

    view.showError(error?.message ?? 'Error desconocido al obtener métricas');
  });

  service.start();
}

main();
