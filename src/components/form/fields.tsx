import { ReactNode } from "react";

const inputBase =
  "w-full bg-surface-container-low text-on-surface font-body text-body-md px-space-md py-space-sm rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary shadow-inner placeholder:text-on-surface-variant/60";

interface FieldShellProps {
  label: string;
  htmlFor: string;
  required?: boolean;
  hint?: string;
  suffix?: ReactNode;
  className?: string;
  children: ReactNode;
}

export function FieldShell({
  label,
  htmlFor,
  required,
  hint,
  suffix,
  className,
  children,
}: FieldShellProps) {
  return (
    <div className={`flex flex-col gap-space-xs ${className ?? ""}`}>
      <label
        htmlFor={htmlFor}
        className="font-body text-label-lg text-on-surface flex items-center justify-between"
      >
        <span>
          {label} {required && <span className="text-error">*</span>}
        </span>
        {suffix}
      </label>
      {children}
      {hint && (
        <span className="font-body text-body-sm text-on-surface-variant">
          {hint}
        </span>
      )}
    </div>
  );
}

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "number" | "date";
  required?: boolean;
  placeholder?: string;
  hint?: string;
  unit?: string;
  min?: string | number;
  max?: string | number;
  step?: string | number;
  className?: string;
  titleSize?: boolean;
}

export function TextField({
  id,
  label,
  value,
  onChange,
  type = "text",
  required,
  placeholder,
  hint,
  unit,
  min,
  max,
  step,
  className,
  titleSize,
}: TextFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} required={required} hint={hint} className={className}>
      <div className="relative">
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          placeholder={placeholder}
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputBase} ${titleSize ? "font-heading text-title-md" : ""} ${unit ? "pr-12" : ""}`}
        />
        {unit && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 font-body text-label-md text-on-surface-variant">
            {unit}
          </span>
        )}
      </div>
    </FieldShell>
  );
}

interface TextAreaFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  hint?: string;
  rows?: number;
  className?: string;
  required?: boolean;
}

export function TextAreaField({
  id,
  label,
  value,
  onChange,
  placeholder,
  hint,
  rows = 2,
  className,
  required,
}: TextAreaFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} hint={hint} className={className} required={required}>
      <textarea
        id={id}
        name={id}
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      />
    </FieldShell>
  );
}

interface SelectOption {
  value: string;
  label: string;
}

interface SelectFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  hint?: string;
  className?: string;
}

export function SelectField({
  id,
  label,
  value,
  onChange,
  options,
  required,
  hint,
  className,
}: SelectFieldProps) {
  return (
    <FieldShell label={label} htmlFor={id} required={required} hint={hint} className={className}>
      <select
        id={id}
        name={id}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputBase}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FieldShell>
  );
}

interface ToggleFieldProps {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  icon?: string;
  variant?: "primary" | "error";
  className?: string;
}

export function ToggleField({
  id,
  title,
  description,
  checked,
  onChange,
  icon,
  variant = "primary",
  className,
}: ToggleFieldProps) {
  const accent = variant === "error" ? "peer-checked:bg-error" : "peer-checked:bg-primary-container";
  const iconColor = variant === "error" ? "text-error" : "text-tertiary-container";

  return (
    <div
      className={`p-space-md bg-surface-container rounded-xl flex items-center justify-between gap-space-md ${className ?? ""}`}
    >
      <div className="flex items-start gap-space-sm">
        {icon && (
          <span className={`material-symbols-outlined text-headline-sm mt-0.5 ${iconColor}`}>
            {icon}
          </span>
        )}
        <div>
          <span className="font-body text-label-lg text-on-surface block">{title}</span>
          <span className="font-body text-body-sm text-on-surface-variant">{description}</span>
        </div>
      </div>
      <label htmlFor={id} className="relative inline-flex items-center cursor-pointer shrink-0">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only peer"
        />
        <div
          className={`w-11 h-6 bg-surface-container-highest peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all ${accent}`}
        />
      </label>
    </div>
  );
}

interface SymptomCardProps {
  id: string;
  label: string;
  icon: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export function SymptomCard({ id, label, icon, checked, onChange }: SymptomCardProps) {
  return (
    <label
      htmlFor={id}
      className={`flex items-center justify-between p-space-md rounded-xl cursor-pointer transition-all ${
        checked ? "bg-primary-container/15 ring-1 ring-primary-container" : "bg-surface-container-low hover:bg-surface-container"
      }`}
    >
      <div className="flex items-center gap-space-sm">
        <span className="material-symbols-outlined text-title-md text-on-surface-variant">
          {icon}
        </span>
        <span className="font-body text-label-lg text-on-surface">{label}</span>
      </div>
      <input
        id={id}
        name={id}
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="w-5 h-5 accent-primary-container rounded cursor-pointer"
      />
    </label>
  );
}

interface SectionCardProps {
  id: string;
  step: number;
  totalSteps: number;
  title: string;
  description: string;
  dotColor?: string;
  children: ReactNode;
}

export function SectionCard({
  id,
  step,
  totalSteps,
  title,
  description,
  dotColor = "bg-primary",
  children,
}: SectionCardProps) {
  return (
    <section
      id={id}
      className="bg-surface-container-lowest rounded-2xl p-space-lg shadow-sm flex flex-col gap-space-md scroll-mt-28"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-xs">
        <div className="flex items-center gap-space-sm">
          <span className={`w-3 h-3 rounded-full ${dotColor}`} />
          <div>
            <h2 className="font-heading text-headline-md text-primary">{title}</h2>
            <p className="font-body text-body-sm text-on-surface-variant">{description}</p>
          </div>
        </div>
        <span className="font-body text-label-sm bg-surface-container text-tertiary-container px-space-sm py-1 rounded-full uppercase self-start sm:self-auto">
          Fase {step}/{totalSteps}
        </span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-12 gap-space-md">{children}</div>
    </section>
  );
}
