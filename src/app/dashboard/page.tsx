import Link from "next/link";

const METRICS = [
  {
    label: "Muestra activa en seguimiento",
    title: "Cohorte 0–5 años",
    value: "580",
    unit: "niños y niñas",
    icon: "groups",
  },
  {
    label: "Modelo biocultural MIDA",
    title: "Semáforo de estado",
    rows: [
      { text: "Adecuado", value: "428 (73.8%)", color: "text-status-ok" },
      { text: "En vigilancia", value: "112 (19.3%)", color: "text-status-watch" },
      { text: "Remisión territorial", value: "40 (6.9%)", color: "text-status-critical" },
    ],
    icon: "check_circle",
  },
  {
    label: "Brecha antropométrica",
    title: "Desviación OMS vs MIDA",
    value: "86",
    unit: "casos corregidos",
    icon: "insights",
  },
  {
    label: "Gobernanza indígena",
    title: "Principios C.A.R.E.",
    rows: [
      { text: "C · Colectivo", value: "100% verificado" },
      { text: "A · Autoridad", value: "Mamo Mayor" },
      { text: "R · Responsabilidad", value: "Acta cabildo #08-24" },
    ],
    icon: "shield",
  },
];

export default function DashboardPage() {
  return (
    <div className="w-full max-w-6xl mx-auto px-gutter py-space-lg flex flex-col gap-space-lg">
      <div className="w-full bg-surface-container-low rounded-2xl p-space-lg shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
        <div className="flex flex-col gap-space-xs max-w-2xl">
          <div className="flex items-center gap-space-xs text-tertiary-container">
            <span className="material-symbols-outlined text-title-md">monitoring</span>
            <span className="font-body text-label-sm uppercase tracking-wider">
              Observatorio Nutricional Biocultural · Cuencas Sagradas
            </span>
          </div>
          <h1 className="font-heading text-headline-lg text-primary tracking-tight">
            Monitoreo territorial del crecimiento infantil
          </h1>
          <p className="font-body text-body-md text-on-surface-variant">
            Seguimiento antropométrico diferencial y gobernanza de datos para la niñez Kággaba (0 a 5
            años) · Sierra Nevada de Santa Marta.
          </p>
        </div>
        <Link
          href="/anthropometry"
          className="inline-flex items-center justify-center gap-space-xs bg-primary hover:bg-primary-container text-on-primary font-body text-label-lg px-space-lg py-space-sm rounded-xl transition-colors shadow-md"
        >
          <span className="material-symbols-outlined text-title-md">add_circle</span>
          <span>Nueva valoración antropométrica</span>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {METRICS.map((m) => (
          <div
            key={m.title}
            className="bg-surface-container-lowest rounded-2xl p-space-md shadow-sm flex flex-col gap-space-sm"
          >
            <div className="flex items-center justify-between">
              <span className="font-body text-label-sm uppercase tracking-wider text-on-surface-variant">
                {m.label}
              </span>
              <span className="material-symbols-outlined text-title-md text-tertiary-container">
                {m.icon}
              </span>
            </div>
            <span className="font-heading text-title-md text-primary">{m.title}</span>
            {m.value && (
              <div className="flex items-baseline gap-space-xs">
                <span className="font-heading text-display-lg-mobile text-secondary tabular-nums">
                  {m.value}
                </span>
                <span className="font-body text-body-sm text-on-surface-variant">{m.unit}</span>
              </div>
            )}
            {m.rows && (
              <div className="flex flex-col gap-1 mt-1">
                {m.rows.map((r) => (
                  <div key={r.text} className="flex items-center justify-between font-body text-body-sm">
                    <span className={"text-on-surface-variant"}>{r.text}</span>
                    <span className={`font-medium ${"color" in r ? r.color : "text-on-surface"}`}>
                      {r.value}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-sm">
        <div className="flex items-center gap-space-sm">
          <span className="material-symbols-outlined text-headline-sm text-primary">show_chart</span>
          <h2 className="font-heading text-headline-md text-primary">
            Curva talla / edad: referencia Kággaba vs. OMS
          </h2>
        </div>
        <p className="font-body text-body-sm text-on-surface-variant max-w-2xl">
          Este panel se conectará al backend de valoraciones para graficar percentiles diferenciales
          MIDA frente al estándar OMS. Aún no hay una fuente de datos configurada.
        </p>
        <div className="h-64 rounded-xl bg-surface-container-low flex items-center justify-center text-on-surface-variant font-body text-body-sm">
          Datos de crecimiento no disponibles todavía
        </div>
      </div>
    </div>
  );
}
