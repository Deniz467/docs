import {useState} from "react";

export default function NormalDistributionGraph() {
  const [mu, setMu] = useState(0);
  const [sigma, setSigma] = useState(1.0);

  const xMinDomain = -4;
  const xMaxDomain = 4;

  const svgXMin = 40;
  const svgXMax = 360;
  const svgYBase = 170;
  const svgYTop = 40;

  // Punkte der Dichtefunktion berechnen
  const points = [];
  const steps = 200;

  let maxY = 0;

  for (let i = 0; i <= steps; i++) {
    const x =
        xMinDomain + ((xMaxDomain - xMinDomain) * i) / steps;

    const y =
        (1 / (sigma * Math.sqrt(2 * Math.PI))) *
        Math.exp(-Math.pow(x - mu, 2) / (2 * sigma * sigma));

    if (y > maxY) {
      maxY = y;
    }
    points.push({x, y});
  }

  const toSvgX = (x) =>
      svgXMin +
      ((x - xMinDomain) / (xMaxDomain - xMinDomain)) *
      (svgXMax - svgXMin);

  const toSvgY = (y) =>
      svgYBase -
      (y / maxY) * (svgYBase - svgYTop);

  const pathD =
      points
      .map((p, idx) => {
        const X = toSvgX(p.x);
        const Y = toSvgY(p.y);
        return `${idx === 0 ? "M" : "L"} ${X} ${Y}`;
      })
      .join(" ") + ` L ${svgXMax} ${svgYBase} L ${svgXMin} ${svgYBase} Z`;

  const ticks = [-3, -2, -1, 0, 1, 2, 3];

  return (
      <div
          className="p-4 mb-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 not-prose">
        <div className="flex flex-col gap-4">
          <div>
            <p className="text-sm text-zinc-700 dark:text-zinc-200 mb-1">
              Interaktive Normalverteilung – passe Mittelwert μ und
              Standardabweichung σ an.
            </p>
            <br/>
            <p className="text-xs text-zinc-500 dark:text-zinc-400">
              Aktuell: μ = {mu.toFixed(1)}, σ = {sigma.toFixed(1)}
            </p>
          </div>

          <svg viewBox="0 0 400 230" className="w-full h-auto">
            {/* Hintergrund */}
            <rect
                x={svgXMin}
                y={svgYTop}
                width={svgXMax - svgXMin}
                height={svgYBase - svgYTop}
                className="fill-zinc-50 dark:fill-zinc-900"
            />

            {/* Kurvenfläche */}
            <path
                d={pathD}
                className="fill-emerald-100 dark:fill-emerald-900/50"
            />

            {/* Kurvenlinie */}
            <path
                d={pathD}
                className="stroke-emerald-600 dark:stroke-emerald-400"
                fill="none"
                strokeWidth="2.5"
            />

            {/* x-Achse */}
            <line
                x1={svgXMin}
                y1={svgYBase}
                x2={svgXMax}
                y2={svgYBase}
                className="stroke-zinc-500 dark:stroke-zinc-400"
                strokeWidth="1"
            />

            {/* Hilfslinie bei μ */}
            <line
                x1={toSvgX(mu)}
                y1={svgYBase}
                x2={toSvgX(mu)}
                y2={svgYTop}
                className="stroke-emerald-500 dark:stroke-emerald-300"
                strokeWidth="1"
                strokeDasharray="4 4"
            />

            {/* Ticks und Beschriftung auf der x-Achse */}
            {ticks.map((t) => (
                <g key={t}>
                  <line
                      x1={toSvgX(t)}
                      y1={svgYBase}
                      x2={toSvgX(t)}
                      y2={svgYBase + (t === 0 ? 10 : 6)}
                      className="stroke-zinc-500 dark:stroke-zinc-400"
                      strokeWidth={t === 0 ? 1.5 : 1}
                  />
                  <text
                      x={toSvgX(t)}
                      y={svgYBase + 22}
                      textAnchor="middle"
                      className="fill-zinc-800 dark:fill-zinc-100 text-[10px]"
                  >
                    {t === 0 ? "μ" : t}
                  </text>
                </g>
            ))}
          </svg>

          {/* Slider */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-200">
                Mittelwert μ
              </label>
              <input
                  type="range"
                  min={-2}
                  max={2}
                  step={0.1}
                  value={mu}
                  onChange={(e) => setMu(parseFloat(e.target.value))}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-200 dark:bg-zinc-700 accent-emerald-600"
              />
              <div
                  className="flex justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
                <span>-2</span>
                <span>0</span>
                <span>+2</span>
              </div>
            </div>

            <div className="space-y-1">
              <label
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-200">
                Standardabweichung σ
              </label>
              <input
                  type="range"
                  min={0.5}
                  max={2.5}
                  step={0.1}
                  value={sigma}
                  onChange={(e) =>
                      setSigma(parseFloat(e.target.value) || 0.5)
                  }
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer bg-zinc-200 dark:bg-zinc-700 accent-emerald-600"
              />
              <div
                  className="flex justify-between text-[10px] text-zinc-500 dark:text-zinc-400">
                <span>0,5</span>
                <span>1,5</span>
                <span>2,5</span>
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};