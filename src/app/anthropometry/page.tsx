"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  SectionCard,
  TextField,
  TextAreaField,
  SelectField,
  ToggleField,
  SymptomCard,
} from "@/components/form/fields";
import Stepper from "@/components/form/Stepper";
import { AnthropometryFormData, DEMO_FORM, EMPTY_FORM } from "@/types/anthropometry";
import {
  SEXO_OPTIONS,
  PUEBLO_INDIGENA_OPTIONS,
  DEPARTAMENTO_OPTIONS,
  getLenguaOptions,
  TIPO_MEDICION_TALLA_OPTIONS,
  TRI_STATE_OPTIONS,
  NIVEL_ACTIVIDAD_OPTIONS,
  SYMPTOMS,
} from "@/lib/anthropometry-options";
import { generateCaseCode } from "@/lib/generate-case-code";
import AuthGuard from "@/components/AuthGuard";
import { useAuth } from "@/context/AuthContext";
import { apiFetch, UnauthorizedError } from "@/lib/api";

type SubmitState = "idle" | "sending" | "success" | "error";

function AnthropometryForm() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState<AnthropometryFormData>(EMPTY_FORM);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [toast, setToast] = useState<string | null>(null);

  // El código se genera solo en el cliente (UUID) para evitar un desajuste de hidratación
  // entre el render de servidor y el del navegador.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setForm((prev) => (prev.codigoCaso ? prev : { ...prev, codigoCaso: generateCaseCode() }));
  }, []);

  function set<K extends keyof AnthropometryFormData>(key: K, value: AnthropometryFormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function showToast(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(null), 3200);
  }

  function fillDemo() {
    setForm({ ...DEMO_FORM, codigoCaso: generateCaseCode() });
    showToast("Formulario completado con datos de prueba");
  }

  function regenerateCode() {
    const code = generateCaseCode();
    set("codigoCaso", code);
    showToast(`Código regenerado: ${code}`);
  }

  function handlePuebloChange(pueblo: string) {
    const lenguaOptions = getLenguaOptions(pueblo);
    setForm((prev) => ({ ...prev, puebloIndigena: pueblo, lenguaPrincipal: lenguaOptions[0].value }));
  }

  function saveDraft() {
    try {
      window.localStorage.setItem("mida-anthropometry-draft", JSON.stringify(form));
      showToast("Borrador guardado en este dispositivo");
    } catch {
      showToast("No se pudo guardar el borrador");
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitState("sending");
    try {
      const res = await apiFetch("/api/v1/evaluaciones/", user?.token ?? null, {
        method: "POST",
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      setSubmitState("success");
      showToast("Reporte biocultural generado correctamente");
    } catch (err) {
      if (err instanceof UnauthorizedError) {
        logout();
        router.replace("/medical-access");
        return;
      }
      console.error(err);
      setSubmitState("error");
      showToast("No se pudo enviar el reporte. Intente nuevamente.");
    }
  }

  return (
    <div className="w-full">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-space-sm bg-primary text-on-primary px-space-md py-space-sm rounded-xl shadow-xl">
          <span className="material-symbols-outlined text-title-md text-primary-fixed">
            check_circle
          </span>
          <span className="font-body text-label-lg">{toast}</span>
        </div>
      )}

      <div className="w-full max-w-6xl mx-auto px-gutter py-space-lg flex flex-col gap-space-lg">
        {/* Hero */}
        <div className="w-full bg-surface-container-low rounded-2xl p-space-md lg:p-space-lg shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-space-xs max-w-2xl">
            <div className="flex flex-wrap items-center gap-space-xs text-tertiary-container">
              <span className="material-symbols-outlined text-title-md">eco</span>
              <span className="font-body text-label-sm uppercase tracking-wider">
                Protocolo Biocultural Kággaba · Sierra Nevada
              </span>
            </div>
            <h1 className="font-heading text-headline-lg text-primary tracking-tight">
              Nuevo reporte antropométrico
            </h1>
            <p className="font-body text-body-md text-on-surface-variant">
              Completa los datos. Los campos marcados con <span className="text-error">*</span> son obligatorios.
            </p>
          </div>
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-space-sm w-full lg:w-auto">
            <button
              type="button"
              onClick={fillDemo}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-space-xs bg-surface-container-highest hover:bg-surface-dim text-primary font-body text-label-lg px-space-md py-space-sm rounded-lg transition-colors shadow-sm"
            >
              <span className="material-symbols-outlined text-title-md text-tertiary-container">
                auto_fix_high
              </span>
              <span>Rellenar con datos de prueba</span>
            </button>
          </div>
        </div>

        <Stepper />

        <form onSubmit={handleSubmit} className="flex flex-col gap-space-lg w-full">
          {/* 1. Identificación */}
          <SectionCard
            id="sec-identificacion"
            step={1}
            totalSteps={8}
            title="1. Identificación del caso"
            description="Datos administrativos del reporte"
          >
            <TextField
              id="codigoCaso"
              label="Código del caso"
              required
              value={form.codigoCaso}
              onChange={(v) => set("codigoCaso", v)}
              placeholder="ej. KAG-2024-0581"
              hint="Generado automáticamente (serial de fecha/hora + UUID). Anonimizado según mandato de guardia indígena."
              className="md:col-span-4"
              titleSize
            />
            <TextField
              id="fechaReporte"
              label="Fecha del reporte"
              type="date"
              required
              value={form.fechaReporte}
              onChange={(v) => set("fechaReporte", v)}
              hint="Fecha de registro en la plataforma."
              className="md:col-span-4"
            />
            <TextField
              id="objetivoReporte"
              label="Objetivo del PDF"
              value={form.objetivoReporte}
              onChange={(v) => set("objetivoReporte", v)}
              placeholder="ej. Seguimiento nutricional bimensual"
              hint="Campo abierto: determina el nivel de síntesis ALUNA IA."
              className="md:col-span-4"
            />
            <div className="md:col-span-12 flex justify-end -mt-2">
              <button
                type="button"
                onClick={regenerateCode}
                className="text-tertiary-container hover:text-primary font-body text-label-sm flex items-center gap-0.5"
              >
                <span className="material-symbols-outlined text-sm">refresh</span> Regenerar código
              </button>
            </div>
          </SectionCard>

          {/* 2. Datos del menor */}
          <SectionCard
            id="sec-menor"
            step={2}
            totalSteps={8}
            title="2. Datos del menor"
            description="Información personal, cultural y territorial"
            dotColor="bg-secondary"
          >
            <TextField
              id="nombres"
              label="Nombres"
              value={form.nombres}
              onChange={(v) => set("nombres", v)}
              placeholder="ej. Samin K."
              className="md:col-span-6"
            />
            <TextField
              id="edad"
              label="Edad"
              type="number"
              required
              value={form.edad}
              onChange={(v) => set("edad", v)}
              placeholder="24"
              min={0}
              unit="meses"
              hint="Siempre en meses (0-5 años)."
              className="md:col-span-3"
            />
            <SelectField
              id="sexo"
              label="Sexo"
              value={form.sexo}
              onChange={(v) => set("sexo", v as AnthropometryFormData["sexo"])}
              options={SEXO_OPTIONS}
              className="md:col-span-3"
            />
            <SelectField
              id="puebloIndigena"
              label="Pueblo indígena"
              required
              value={form.puebloIndigena}
              onChange={handlePuebloChange}
              options={PUEBLO_INDIGENA_OPTIONS}
              className="md:col-span-4"
            />
            <TextField
              id="comunidad"
              label="Comunidad o asentamiento"
              value={form.comunidad}
              onChange={(v) => set("comunidad", v)}
              placeholder="ej. Seykúkui, Mamankana, Cherúa"
              className="md:col-span-4"
            />
            <SelectField
              id="departamento"
              label="Departamento"
              required
              value={form.departamento}
              onChange={(v) => set("departamento", v)}
              options={DEPARTAMENTO_OPTIONS}
              className="md:col-span-4"
            />
            <TextField
              id="municipio"
              label="Municipio"
              value={form.municipio}
              onChange={(v) => set("municipio", v)}
              placeholder="ej. Santa Marta / Ciénaga"
              className="md:col-span-6"
            />
            <TextField
              id="cuidadorPrincipal"
              label="Cuidador principal"
              value={form.cuidadorPrincipal}
              onChange={(v) => set("cuidadorPrincipal", v)}
              placeholder="ej. Madre (Saga) / Abuela"
              className="md:col-span-6"
            />
            <SelectField
              id="lenguaPrincipal"
              label="Lengua principal"
              value={form.lenguaPrincipal}
              onChange={(v) => set("lenguaPrincipal", v)}
              options={getLenguaOptions(form.puebloIndigena)}
              hint="Se actualiza según el pueblo indígena seleccionado."
              className="md:col-span-12"
            />
            <ToggleField
              id="requiereMediacionCultural"
              title="Requiere mediación cultural"
              description="Genera automáticamente las recomendaciones familiares en lengua Kággaba y en términos de armonización territorial."
              checked={form.requiereMediacionCultural}
              onChange={(v) => set("requiereMediacionCultural", v)}
              icon="record_voice_over"
              className="md:col-span-12"
            />
          </SectionCard>

          {/* 3. Mediciones antropométricas */}
          <SectionCard
            id="sec-mediciones"
            step={3}
            totalSteps={8}
            title="3. Mediciones antropométricas"
            description="Mediciones tomadas en campo"
            dotColor="bg-tertiary-container"
          >
            <TextField
              id="pesoKg"
              label="Peso (kg)"
              type="number"
              required
              value={form.pesoKg}
              onChange={(v) => set("pesoKg", v)}
              placeholder="11.45"
              step="0.01"
              min="2"
              max="35"
              unit="kg"
              hint="Resolución 100g"
              className="md:col-span-4"
              titleSize
            />
            <TextField
              id="tallaCm"
              label="Talla (cm)"
              type="number"
              required
              value={form.tallaCm}
              onChange={(v) => set("tallaCm", v)}
              placeholder="84.5"
              step="0.1"
              min="40"
              max="130"
              unit="cm"
              hint="Resolución 1mm"
              className="md:col-span-4"
              titleSize
            />
            <SelectField
              id="tipoMedicionTalla"
              label="Tipo de medición de talla"
              value={form.tipoMedicionTalla}
              onChange={(v) => set("tipoMedicionTalla", v as AnthropometryFormData["tipoMedicionTalla"])}
              options={TIPO_MEDICION_TALLA_OPTIONS}
              className="md:col-span-4"
            />
            <TextField
              id="muacCm"
              label="Perímetro braquial MUAC (cm)"
              type="number"
              value={form.muacCm}
              onChange={(v) => set("muacCm", v)}
              placeholder="13.2"
              step="0.1"
              unit="cm"
              className="md:col-span-4"
            />
            <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
              <TextField
                id="perimetroCefalico"
                label="Perímetro cefálico (cm)"
                type="number"
                value={form.perimetroCefalico}
                onChange={(v) => set("perimetroCefalico", v)}
                placeholder="47.5"
                step="0.1"
              />
              <TextField
                id="perimetroCintura"
                label="Perímetro cintura (cm)"
                type="number"
                value={form.perimetroCintura}
                onChange={(v) => set("perimetroCintura", v)}
                placeholder="46.0"
                step="0.1"
              />
              <TextField
                id="perimetroCadera"
                label="Perímetro cadera (cm)"
                type="number"
                value={form.perimetroCadera}
                onChange={(v) => set("perimetroCadera", v)}
                placeholder="48.0"
                step="0.1"
              />
            </div>
            <TextField
              id="fechaMedicion"
              label="Fecha de medición"
              type="date"
              required
              value={form.fechaMedicion}
              onChange={(v) => set("fechaMedicion", v)}
              className="md:col-span-6"
            />
            <ToggleField
              id="edemaBilateral"
              title="Edema bilateral"
              description="Signo patognomónico de desnutrición aguda severa (Kwashiorkor)."
              checked={form.edemaBilateral}
              onChange={(v) => set("edemaBilateral", v)}
              icon="warning"
              variant="error"
              className="md:col-span-6"
            />
          </SectionCard>

          {/* 4. Calidad de medición */}
          <SectionCard
            id="sec-calidad"
            step={4}
            totalSteps={8}
            title="4. Calidad de medición"
            description="Validación de instrumentos y procedimiento"
            dotColor="bg-primary-container"
          >
            <SelectField
              id="balanzaCalibrada"
              label="Balanza calibrada"
              value={form.balanzaCalibrada}
              onChange={(v) => set("balanzaCalibrada", v as AnthropometryFormData["balanzaCalibrada"])}
              options={TRI_STATE_OPTIONS}
              className="md:col-span-6"
            />
            <SelectField
              id="medicionRepetida"
              label="Medición repetida"
              value={form.medicionRepetida}
              onChange={(v) => set("medicionRepetida", v as AnthropometryFormData["medicionRepetida"])}
              options={TRI_STATE_OPTIONS}
              className="md:col-span-6"
            />
            <TextAreaField
              id="observacionesCalidad"
              label="Observaciones de calidad"
              value={form.observacionesCalidad}
              onChange={(v) => set("observacionesCalidad", v)}
              placeholder="ej. Medición tomada en bohío tradicional con piso de madera irregular..."
              className="md:col-span-12"
            />
          </SectionCard>

          {/* 5. Signos clínicos */}
          <SectionCard
            id="sec-signos"
            step={5}
            totalSteps={8}
            title="5. Signos clínicos"
            description="Marca los signos presentes al momento de la medición"
            dotColor="bg-error"
          >
            <div className="md:col-span-12 grid grid-cols-2 sm:grid-cols-3 gap-space-sm">
              {SYMPTOMS.map((s) => (
                <SymptomCard
                  key={s.key}
                  id={s.key}
                  label={s.label}
                  icon={s.icon}
                  checked={Boolean(form[s.key as keyof AnthropometryFormData])}
                  onChange={(v) => set(s.key as keyof AnthropometryFormData, v as never)}
                />
              ))}
            </div>
            <TextAreaField
              id="observacionesSignos"
              label="Observaciones de signos clínicos"
              value={form.observacionesSignos}
              onChange={(v) => set("observacionesSignos", v)}
              className="md:col-span-12"
            />
          </SectionCard>

          {/* 6. Alimentación */}
          <SectionCard
            id="sec-alimentacion"
            step={6}
            totalSteps={8}
            title="6. Alimentación"
            description="Hábitos y restricciones alimentarias"
            dotColor="bg-tertiary"
          >
            <TextField
              id="numeroComidas"
              label="Número de comidas al día"
              type="number"
              value={form.numeroComidas}
              onChange={(v) => set("numeroComidas", v)}
              min={1}
              max={8}
              className="md:col-span-4"
              titleSize
            />
            <SelectField
              id="accesoAguaSegura"
              label="Acceso a agua segura"
              value={form.accesoAguaSegura}
              onChange={(v) => set("accesoAguaSegura", v as AnthropometryFormData["accesoAguaSegura"])}
              options={TRI_STATE_OPTIONS}
              className="md:col-span-4"
            />
            <TextField
              id="cambiosAlimentacion"
              label="Cambios recientes en alimentación"
              value={form.cambiosAlimentacion}
              onChange={(v) => set("cambiosAlimentacion", v)}
              placeholder="ej. Cosecha baja de frijol, sequía"
              className="md:col-span-4"
            />
            <TextAreaField
              id="alimentosFrecuentes"
              label="Alimentos frecuentes"
              value={form.alimentosFrecuentes}
              onChange={(v) => set("alimentosFrecuentes", v)}
              hint="Separar por comas o saltos de línea"
              className="md:col-span-6"
            />
            <TextAreaField
              id="alimentosEscasos"
              label="Alimentos escasos"
              value={form.alimentosEscasos}
              onChange={(v) => set("alimentosEscasos", v)}
              hint="Separar por comas o saltos de línea"
              className="md:col-span-6"
            />
            <TextField
              id="restriccionesCulturales"
              label="Restricciones culturales o familiares"
              value={form.restriccionesCulturales}
              onChange={(v) => set("restriccionesCulturales", v)}
              className="md:col-span-12"
            />
          </SectionCard>

          {/* 7. Actividad física */}
          <SectionCard
            id="sec-actividad"
            step={7}
            totalSteps={8}
            title="7. Actividad física"
            description="Movimiento y limitaciones del menor"
            dotColor="bg-secondary-container"
          >
            <SelectField
              id="nivelActividad"
              label="Nivel de actividad"
              value={form.nivelActividad}
              onChange={(v) => set("nivelActividad", v as AnthropometryFormData["nivelActividad"])}
              options={NIVEL_ACTIVIDAD_OPTIONS}
              className="md:col-span-4"
            />
            <TextAreaField
              id="actividadesDiarias"
              label="Actividades diarias"
              value={form.actividadesDiarias}
              onChange={(v) => set("actividadesDiarias", v)}
              hint="Separar por comas o saltos de línea"
              className="md:col-span-8"
            />
            <TextAreaField
              id="limitaciones"
              label="Limitaciones"
              value={form.limitaciones}
              onChange={(v) => set("limitaciones", v)}
              className="md:col-span-12"
            />
          </SectionCard>

          {/* 8. Contexto familiar y territorial */}
          <SectionCard
            id="sec-contexto"
            step={8}
            totalSteps={8}
            title="8. Contexto familiar y territorial"
            description="Antecedentes y condiciones del entorno"
            dotColor="bg-surface-tint"
          >
            <SelectField
              id="antecedentesBajaTalla"
              label="Antecedentes familiares de baja talla"
              value={form.antecedentesBajaTalla}
              onChange={(v) => set("antecedentesBajaTalla", v as AnthropometryFormData["antecedentesBajaTalla"])}
              options={TRI_STATE_OPTIONS}
              className="md:col-span-3"
            />
            <SelectField
              id="hermanosBajaTalla"
              label="Otros hermanos con baja talla"
              value={form.hermanosBajaTalla}
              onChange={(v) => set("hermanosBajaTalla", v as AnthropometryFormData["hermanosBajaTalla"])}
              options={TRI_STATE_OPTIONS}
              className="md:col-span-3"
            />
            <SelectField
              id="inseguridadAlimentaria"
              label="Inseguridad alimentaria reportada"
              value={form.inseguridadAlimentaria}
              onChange={(v) => set("inseguridadAlimentaria", v as AnthropometryFormData["inseguridadAlimentaria"])}
              options={TRI_STATE_OPTIONS}
              className="md:col-span-3"
            />
            <SelectField
              id="dificultadAccesoSalud"
              label="Dificultad de acceso a servicios de salud"
              value={form.dificultadAccesoSalud}
              onChange={(v) => set("dificultadAccesoSalud", v as AnthropometryFormData["dificultadAccesoSalud"])}
              options={TRI_STATE_OPTIONS}
              className="md:col-span-3"
            />
            <TextAreaField
              id="observacionesFamilia"
              label="Observaciones de familia"
              value={form.observacionesFamilia}
              onChange={(v) => set("observacionesFamilia", v)}
              rows={3}
              className="md:col-span-6"
            />
            <TextAreaField
              id="observacionesAutoridadTradicional"
              label="Observaciones de autoridad tradicional"
              value={form.observacionesAutoridadTradicional}
              onChange={(v) => set("observacionesAutoridadTradicional", v)}
              rows={3}
              className="md:col-span-6"
            />
          </SectionCard>

          {/* CARE banner */}
          <div className="w-full bg-surface-container-low rounded-2xl p-space-md flex flex-col md:flex-row items-center justify-between gap-space-md shadow-sm">
            <div className="flex items-center gap-space-md">
              <div className="w-12 h-12 rounded-xl bg-tertiary-container flex items-center justify-center text-on-primary shrink-0">
                <span className="material-symbols-outlined text-headline-sm">shield</span>
              </div>
              <div className="flex flex-col">
                <span className="font-heading text-title-md text-primary">
                  Custodia soberana de datos (Principios CARE)
                </span>
                <span className="font-body text-body-sm text-on-surface-variant max-w-xl">
                  Este registro queda custodiado bajo soberanía del Cabildo Gobernador Kággaba. No se
                  comercializará ni compartirá con terceros sin aval explícito de la asamblea comunitaria.
                </span>
              </div>
            </div>
            <div className="flex items-center gap-space-xs flex-wrap justify-center">
              <span className="px-space-sm py-1 bg-surface-container-highest rounded-lg font-body text-label-sm text-on-surface">
                C · Beneficio Colectivo
              </span>
              <span className="px-space-sm py-1 bg-surface-container-highest rounded-lg font-body text-label-sm text-on-surface">
                A · Autoridad
              </span>
              <span className="px-space-sm py-1 bg-surface-container-highest rounded-lg font-body text-label-sm text-on-surface">
                R · Resp.
              </span>
              <span className="px-space-sm py-1 bg-surface-container-highest rounded-lg font-body text-label-sm text-on-surface">
                E · Ética
              </span>
            </div>
          </div>

          {/* Footer actions */}
          <div className="w-full bg-surface-container-lowest rounded-2xl p-space-lg shadow-md flex flex-col lg:flex-row items-center justify-between gap-space-md">
            <div className="flex flex-col text-center lg:text-left">
              <span className="font-heading text-title-md text-primary">
                ¿Listo para procesar la valoración?
              </span>
              <span className="font-body text-body-sm text-on-surface-variant">
                ALUNA IA generará la curva Z-Score adaptativa y el informe intercultural descargable.
              </span>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-space-sm w-full lg:w-auto">
              <button
                type="button"
                onClick={saveDraft}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-xs bg-surface-container hover:bg-surface-container-high text-on-surface font-body text-label-lg px-space-lg py-space-sm rounded-lg transition-colors shadow-sm"
              >
                <span className="material-symbols-outlined text-title-md text-on-surface-variant">
                  save
                </span>
                <span>Guardar borrador</span>
              </button>
              <button
                type="submit"
                disabled={submitState === "sending"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-space-sm bg-primary hover:bg-primary-container text-on-primary font-heading text-headline-sm px-space-xl py-space-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60"
              >
                <span className="material-symbols-outlined text-headline-sm text-secondary-fixed">
                  biotech
                </span>
                <span>{submitState === "sending" ? "Generando..." : "Generar reporte"}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AnthropometryPage() {
  return (
    <AuthGuard>
      <AnthropometryForm />
    </AuthGuard>
  );
}
