const PADDING = { top: 16, right: 16, bottom: 26, left: 44 };
const GRID_DIVISIONS = 4;

function readCssColor(variable, fallback) {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(variable)
    .trim();
  return value || fallback;
}

/**
 * Gráfica de tráfico (download / upload) dibujada con Canvas API.
 * Conserva los últimos `maxPoints` registros y se adapta a su contenedor.
 */
export class TrafficChart {
  #canvas;
  #ctx;
  #maxPoints;
  #points = [];
  #width = 0;
  #height = 0;
  #colors;
  #resizeObserver;

  constructor(canvas, { maxPoints = 60 } = {}) {
    if (!canvas) throw new Error('TrafficChart: se requiere un canvas');

    this.#canvas = canvas;
    this.#ctx = canvas.getContext('2d');
    this.#maxPoints = maxPoints;
    this.#colors = {
      download: readCssColor('--color-cyan', '#55ead4'),
      upload: readCssColor('--color-yellow', '#f3e600'),
      grid: readCssColor('--color-border', '#1c1c1c'),
      axis: readCssColor('--color-text-dim', '#5a5a5a')
    };

    this.#resizeObserver = new ResizeObserver(() => this.#resize());
    this.#resizeObserver.observe(canvas.parentElement ?? canvas);
    this.#resize();
  }

  push({ download, upload }) {
    this.#points.push({ download, upload });
    if (this.#points.length > this.#maxPoints) {
      this.#points.shift();
    }
    this.render();
  }

  clear() {
    this.#points = [];
    this.render();
  }

  destroy() {
    this.#resizeObserver.disconnect();
  }

  render() {
    const ctx = this.#ctx;
    if (!ctx || this.#width === 0) return;

    ctx.clearRect(0, 0, this.#width, this.#height);

    const plot = {
      x: PADDING.left,
      y: PADDING.top,
      width: this.#width - PADDING.left - PADDING.right,
      height: this.#height - PADDING.top - PADDING.bottom
    };

    if (plot.width <= 0 || plot.height <= 0) return;

    const maxValue = this.#niceMax();
    this.#drawGrid(plot, maxValue);

    if (this.#points.length > 0) {
      const offset = this.#maxPoints - this.#points.length;
      this.#drawSeries(plot, maxValue, 'download', offset);
      this.#drawSeries(plot, maxValue, 'upload', offset);
    }
  }

  #niceMax() {
    const peak = this.#points.reduce(
      (max, point) => Math.max(max, point.download, point.upload),
      0
    );
    const rounded = Math.ceil(peak / 10) * 10;
    return Math.max(rounded, 10);
  }

  #drawGrid(plot, maxValue) {
    const ctx = this.#ctx;
    ctx.lineWidth = 1;
    ctx.font = '10px "Cascadia Mono", Consolas, monospace';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= GRID_DIVISIONS; i += 1) {
      const ratio = i / GRID_DIVISIONS;
      const y = plot.y + plot.height * ratio;
      const value = Math.round(maxValue * (1 - ratio));

      ctx.strokeStyle = this.#colors.grid;
      ctx.beginPath();
      ctx.moveTo(plot.x, y);
      ctx.lineTo(plot.x + plot.width, y);
      ctx.stroke();

      ctx.fillStyle = this.#colors.axis;
      ctx.textAlign = 'right';
      ctx.fillText(`${value}`, plot.x - 8, y);
    }

    ctx.fillStyle = this.#colors.axis;
    ctx.textAlign = 'left';
    ctx.fillText('Mbps', plot.x, this.#height - 8);
  }

  #drawSeries(plot, maxValue, key, offset) {
    const ctx = this.#ctx;
    const stepX = plot.width / (this.#maxPoints - 1);
    const toX = (index) => plot.x + (offset + index) * stepX;
    const toY = (value) =>
      plot.y + plot.height - (value / maxValue) * plot.height;

    ctx.beginPath();
    this.#points.forEach((point, index) => {
      const x = toX(index);
      const y = toY(point[key]);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.lineWidth = 2;
    ctx.lineJoin = 'round';
    ctx.strokeStyle = this.#colors[key];
    ctx.stroke();

    const firstX = toX(0);
    const lastX = toX(this.#points.length - 1);
    ctx.lineTo(lastX, plot.y + plot.height);
    ctx.lineTo(firstX, plot.y + plot.height);
    ctx.closePath();
    ctx.fillStyle = `${this.#colors[key]}22`;
    ctx.fill();
  }

  #resize() {
    const parent = this.#canvas.parentElement ?? this.#canvas;
    const rect = parent.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;

    this.#width = Math.max(1, Math.round(rect.width));
    this.#height = Math.max(1, Math.round(rect.height));

    this.#canvas.width = Math.round(this.#width * dpr);
    this.#canvas.height = Math.round(this.#height * dpr);
    this.#canvas.style.width = `${this.#width}px`;
    this.#canvas.style.height = `${this.#height}px`;

    this.#ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    this.render();
  }
}
