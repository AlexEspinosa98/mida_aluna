import { STEPS } from "@/lib/anthropometry-options";

export default function Stepper() {
  return (
    <div className="w-full bg-surface-container rounded-2xl p-space-md overflow-x-auto shadow-sm">
      <div className="min-w-[860px] flex items-center justify-between gap-space-xs">
        {STEPS.map((step, index) => (
          <div key={step.id} className="flex items-center flex-1">
            <a
              href={`#${step.id}`}
              className="flex-1 flex flex-col items-center group text-center cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-surface-container-highest text-primary flex items-center justify-center font-body text-label-md mb-space-xs group-hover:bg-primary-container group-hover:text-on-primary transition-colors">
                {index + 1}
              </div>
              <span className="font-body text-label-sm text-on-surface">{step.label}</span>
              <span className="font-body text-body-sm text-on-surface-variant text-[11px]">
                {step.hint}
              </span>
            </a>
            {index < STEPS.length - 1 && (
              <div className="w-6 h-0.5 bg-outline-variant mx-1 shrink-0" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
