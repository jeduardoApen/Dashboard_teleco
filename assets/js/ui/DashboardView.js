import { TrafficChart } from './TrafficChart.js';
import {
  formatLatency,
  formatMbps,
  formatUsers,
  formatUptime,
  formatTime
} from '../utils/formatters.js';

const STATUS_LABELS = {
  online: 'ONLINE',
  warning: 'WARNING',
  offline: 'OFFLINE'
};

const CONNECTION_LABELS = {
  connected: 'CONNECTED',
  connecting: 'CONNECTING',
  disconnected: 'DISCONNECTED'
};

const SERVICES = ['internet', 'pfsense', 'portal'];

/**
 * Vista del dashboard. Traduce MetricSnapshot a DOM y administra
 * los estados de interfaz (conexión, modo demo, servicios).
 */
export class DashboardView {
  #els;
  #chart;
  #serviceCards = new Map();
  #tableRows = new Map();
  #connectionState = null;

  constructor(root = document) {
    this.#els = {
      demoBadge: root.getElementById('demo-badge'),
      connectionBadge: root.getElementById('connection-badge'),
      notice: root.getElementById('connection-notice'),
      noticeMessage: root.getElementById('connection-notice-message'),
      lastUpdate: root.getElementById('last-update'),
      latency: root.getElementById('metric-latency'),
      download: root.getElementById('metric-download'),
      upload: root.getElementById('metric-upload'),
      users: root.getElementById('metric-users'),
      uptime: root.getElementById('metric-uptime')
    };

    SERVICES.forEach((service) => {
      this.#serviceCards.set(
        service,
        root.querySelector(`.status-card[data-service="${service}"]`)
      );
    });

    root.querySelectorAll('#services-table-body tr[data-service]').forEach((row) => {
      this.#tableRows.set(row.dataset.service, row);
    });

    this.#chart = new TrafficChart(root.getElementById('traffic-chart'));
  }

  setDemoMode(enabled) {
    this.#els.demoBadge.hidden = !enabled;
  }

  setConnectionState(state) {
    if (state === this.#connectionState) return;
    this.#connectionState = state;

    const badge = this.#els.connectionBadge;
    badge.textContent = CONNECTION_LABELS[state] ?? CONNECTION_LABELS.connecting;
    badge.classList.remove('badge--online', 'badge--warning', 'badge--offline');
    badge.classList.add(
      state === 'connected'
        ? 'badge--online'
        : state === 'connecting'
          ? 'badge--warning'
          : 'badge--offline'
    );
  }

  update(snapshot) {
    this.#els.latency.textContent = formatLatency(snapshot.latency);
    this.#els.download.textContent = formatMbps(snapshot.download);
    this.#els.upload.textContent = formatMbps(snapshot.upload);
    this.#els.users.textContent = formatUsers(snapshot.activeUsers);
    this.#els.uptime.textContent = formatUptime(snapshot.uptime);
    this.#els.lastUpdate.textContent = `Última actualización ${formatTime(snapshot.timestamp)}`;

    SERVICES.forEach((service) => {
      const status = snapshot.serviceStatus(service);
      this.#renderServiceCard(service, status);
      this.#renderServiceRow(service, status, snapshot.latency);
    });

    this.#chart.push(snapshot);
    this.#hideNotice();
  }

  showError(message) {
    this.#els.noticeMessage.textContent = message;
    this.#els.notice.hidden = false;
    this.setConnectionState('disconnected');
  }

  #renderServiceCard(service, status) {
    const card = this.#serviceCards.get(service);
    if (!card) return;

    card.dataset.state = status;
    const badge = card.querySelector('[data-role="status"]');
    const detail = card.querySelector('[data-role="detail"]');

    this.#applyBadge(badge, status);
    detail.textContent =
      status === 'offline'
        ? 'Sin respuesta'
        : status === 'warning'
          ? 'Latencia elevada'
          : 'Operativo';
  }

  #renderServiceRow(service, status, latency) {
    const row = this.#tableRows.get(service);
    if (!row) return;

    row.dataset.state = status;
    this.#applyBadge(row.querySelector('[data-role="status"]'), status);
    row.querySelector('[data-role="latency"]').textContent =
      status === 'offline' ? '—' : formatLatency(latency);
  }

  #applyBadge(badge, status) {
    if (!badge) return;
    badge.textContent = STATUS_LABELS[status] ?? STATUS_LABELS.offline;
    badge.classList.remove('badge--online', 'badge--warning', 'badge--offline');
    badge.classList.add(`badge--${status}`);
  }

  #hideNotice() {
    this.#els.notice.hidden = true;
  }
}
