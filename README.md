# CyberNet · Internet Prepago

Dashboard de monitoreo de red para un proyecto universitario de telecomunicaciones.

Construido con **HTML5, CSS3, JavaScript Vanilla y ES Modules**, sin frameworks ni
bundlers. Funciona sobre cualquier servidor HTTP estático.

## Cómo ejecutar

El proyecto usa módulos ES, por lo que debe servirse por HTTP (no abrir el
`index.html` con `file://`).

```bash
# Opción 1: Python
python -m http.server 8080

# Opción 2: Node
npx serve .

# Opción 3: extensiones tipo Live Server de VS Code
```

Luego abre `http://localhost:8080/`. Por defecto arranca en **modo demo** con
`MockMetricsProvider`, y verás el indicador `DEMO MODE`.

## Arquitectura

Separación de responsabilidades con módulos ES6 y SOLID de forma pragmática:

- **domain** — `MetricSnapshot`: modelo inmutable y validado de una lectura.
- **providers** — origen de datos. Implementan el mismo contrato
  `getMetrics(): Promise<MetricSnapshot>`, por lo que son intercambiables (LSP).
- **services** — `MetricsService`: consulta periódica y notificación a
  suscriptores. Recibe el proveedor por inyección de dependencia (DIP).
- **ui** — `DashboardView` (DOM) y `TrafficChart` (Canvas API).
- **utils** — funciones puras de formato.
- **config.js** — configuración central.
- **app.js** — composition root: construye e inyecta las dependencias.

```
teleco/
├── index.html
├── assets/
│   ├── css/
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── layout.css
│   │   └── components.css
│   └── js/
│       ├── app.js
│       ├── config.js
│       ├── domain/MetricSnapshot.js
│       ├── providers/MockMetricsProvider.js
│       ├── providers/HttpMetricsProvider.js
│       ├── services/MetricsService.js
│       ├── ui/DashboardView.js
│       ├── ui/TrafficChart.js
│       └── utils/formatters.js
└── README.md
```

Para añadir un proveedor nuevo basta con implementar `getMetrics()` y registrarlo
en el mapa `PROVIDERS` de `app.js`, sin tocar la vista ni el servicio.

## Cambiar de mock a API

Edita `assets/js/config.js`:

```js
export const CONFIG = {
  metricsProvider: 'http', // antes: 'mock'
  refreshInterval: 2000,
  apiUrl: '/api/metrics'
};
```

El `HttpMetricsProvider` consulta `GET /api/metrics` y espera:

```json
{
  "timestamp": "2026-09-25T10:00:00",
  "latency": 18,
  "download": 24.5,
  "upload": 7.2,
  "activeUsers": 4,
  "uptime": 86400,
  "services": { "internet": true, "pfsense": true, "portal": true }
}
```

Maneja errores HTTP, timeout, pérdida de conexión y respuestas inválidas; la
interfaz muestra el estado de conexión y el mensaje de error correspondiente.
No se requiere backend para la demo.
