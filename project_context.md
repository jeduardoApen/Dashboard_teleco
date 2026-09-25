Quiero que desarrolles un dashboard web para un proyecto universitario de telecomunicaciones denominado:

"CyberNet - Internet Prepago"

OBJETIVO

Crear un dashboard de monitoreo de red sencillo, visualmente atractivo y fácil de mantener.

Debe estar desarrollado principalmente con:

- HTML5
- CSS3
- JavaScript Vanilla
- ES Modules

NO utilizar:

- React
- Vue
- Angular
- Next.js
- TypeScript
- Tailwind
- Bootstrap
- frameworks frontend
- bundlers innecesarios

Debe poder ejecutarse mediante un servidor HTTP estático.

--------------------------------------------------
ARQUITECTURA
--------------------------------------------------

Aplicar principios SOLID de forma pragmática.

NO sobrearquitecturar el proyecto.

Utilizar separación de responsabilidades mediante módulos ES6.

Propuesta de estructura:

dashboard/
│
├── index.html
│
├── assets/
│   ├── css/
│   │   ├── variables.css
│   │   ├── reset.css
│   │   ├── layout.css
│   │   └── components.css
│   │
│   └── js/
│       ├── app.js
│       ├── config.js
│       │
│       ├── domain/
│       │   └── MetricSnapshot.js
│       │
│       ├── providers/
│       │   ├── MockMetricsProvider.js
│       │   └── HttpMetricsProvider.js
│       │
│       ├── services/
│       │   └── MetricsService.js
│       │
│       ├── ui/
│       │   ├── DashboardView.js
│       │   └── TrafficChart.js
│       │
│       └── utils/
│           └── formatters.js
│
└── README.md

Aplicar:

S - Cada clase/módulo tendrá una responsabilidad definida.

O - Debe ser posible agregar nuevos proveedores de métricas sin modificar
el dashboard.

L - Los proveedores de métricas deben poder intercambiarse.

I - Mantener contratos pequeños y sencillos.

D - MetricsService no debe depender directamente de MockMetricsProvider.
Debe recibir el proveedor por inyección de dependencia.

--------------------------------------------------
PROVEEDORES
--------------------------------------------------

Implementar:

1. MockMetricsProvider

Debe generar información para demostrar el sistema:

- latencia
- download Mbps
- upload Mbps
- cantidad de usuarios activos
- uptime
- estado de Internet
- estado de pfSense
- estado del Portal Cautivo

Actualizar aproximadamente cada 2 segundos.

Los valores deben cambiar suavemente y no saltar de manera absurda.

2. HttpMetricsProvider

Debe estar preparado para posteriormente consultar:

GET /api/metrics

Formato esperado:

{
    "timestamp": "2026-09-25T10:00:00",
    "latency": 18,
    "download": 24.5,
    "upload": 7.2,
    "activeUsers": 4,
    "uptime": 86400,
    "services": {
        "internet": true,
        "pfsense": true,
        "portal": true
    }
}

No es necesario implementar el backend todavía.

El proveedor debe manejar:

- errores HTTP
- timeout
- pérdida de conexión
- respuestas inválidas

--------------------------------------------------
DISEÑO
--------------------------------------------------

Crear una interfaz estilo Cyberpunk empresarial.

Paleta obligatoria:

Amarillo Cyberpunk:
#F3E600

Rojo Carmesí:
#C5003C

Burdeos:
#880425

Cian / Turquesa Neón:
#55EAD4

Negro Profundo:
#000000

Utilizar variables CSS:

--color-yellow
--color-red
--color-burgundy
--color-cyan
--color-black

El negro debe ser el fondo predominante.

Usar los colores neón como acentos.

Evitar exagerar con animaciones.

El resultado debe verse profesional y tecnológico, no como un videojuego.

--------------------------------------------------
ELEMENTOS DEL DASHBOARD
--------------------------------------------------

Header:

CYBERNET
NETWORK CONTROL CENTER

Mostrar indicador:

DEMO MODE

cuando se esté utilizando MockMetricsProvider.

Crear tarjetas para:

Internet
pfSense
Portal Cautivo

Cada tarjeta debe indicar:

ONLINE
OFFLINE

Crear tarjetas de métricas:

Latencia
Download
Upload
Usuarios activos
Uptime

Ejemplo:

LATENCIA
18 ms

DOWNLOAD
24.7 Mbps

UPLOAD
7.8 Mbps

USUARIOS
4

--------------------------------------------------
GRÁFICA
--------------------------------------------------

Crear una gráfica de tráfico en tiempo real.

Debe mostrar los últimos 60 registros.

Mostrar:

Download
Upload

Preferiblemente utilizar Canvas API directamente.

Evitar dependencias externas si no son necesarias.

--------------------------------------------------
ESTADO DE SERVICIOS
--------------------------------------------------

Agregar tabla:

Servicio | Estado | Latencia

Internet
pfSense
Portal Cautivo

Estados visuales:

ONLINE
OFFLINE
WARNING

--------------------------------------------------
RESPONSIVE
--------------------------------------------------

Debe funcionar correctamente en:

1920x1080
1366x768
tablets
teléfonos

Utilizar CSS Grid y Flexbox.

--------------------------------------------------
ACCESIBILIDAD
--------------------------------------------------

Agregar:

aria-label cuando corresponda
contraste suficiente
HTML semántico
navegación lógica

--------------------------------------------------
REGLAS DE DESARROLLO
--------------------------------------------------

No colocar todo el código JavaScript en app.js.

No colocar todos los estilos en un único archivo.

No utilizar variables globales innecesarias.

No utilizar onclick="" dentro del HTML.

Utilizar addEventListener.

Utilizar async/await para llamadas HTTP.

Utilizar try/catch donde corresponda.

Documentar únicamente código que realmente lo necesite.

No llenar el proyecto de comentarios innecesarios.

--------------------------------------------------
ENTREGA
--------------------------------------------------

Generar todos los archivos completos.

El proyecto debe funcionar primero utilizando MockMetricsProvider.

Agregar en config.js una opción:

export const CONFIG = {
    metricsProvider: 'mock',
    refreshInterval: 2000,
    apiUrl: '/api/metrics'
};

Debe ser posible posteriormente cambiar:

metricsProvider: 'mock'

por:

metricsProvider: 'http'

sin modificar el resto del sistema.

Crear un README.md corto indicando:

- cómo ejecutar
- arquitectura
- cómo cambiar de mock a API
- estructura del proyecto

Antes de finalizar revisa:

- errores en consola
- imports
- rutas
- responsive
- separación SOLID
- accesibilidad
- código duplicado

No agregues funcionalidades que no hayan sido solicitadas.