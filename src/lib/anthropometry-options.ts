// Valores exactos que acepta el backend (contrato JSON de POST /api/v1/evaluaciones/).
export const SEXO_OPTIONS = [
  { value: "masculino", label: "Masculino" },
  { value: "femenino", label: "Femenino" },
];

// El backend solo reconoce estos 3 valores para paciente.etnia (kogui/arhuaco/ninguna).
export const PUEBLO_INDIGENA_OPTIONS = [
  { value: "kogui", label: "Kággaba (Kogi)" },
  { value: "arhuaco", label: "Iku (Arhuaco)" },
  { value: "ninguna", label: "Ninguna / No aplica" },
];

export const DEPARTAMENTO_OPTIONS = [
  { value: "magdalena", label: "Magdalena" },
  { value: "cesar", label: "Cesar" },
  { value: "guajira", label: "La Guajira" },
];

// Lengua principal disponible según el pueblo indígena seleccionado.
// La primera opción de cada lista es la lengua propia del pueblo (default al cambiar de pueblo).
// lengua_principal es texto libre para el backend (sin tabla de valores válidos):
// estas listas son solo sugerencias de UI por pueblo, no restricciones del contrato.
export const LENGUA_OPTIONS_BY_PUEBLO: Record<string, { value: string; label: string }[]> = {
  kogui: [
    { value: "kaggaba", label: "Kággaba (Kogi)" },
    { value: "espanol", label: "Español" },
    { value: "bilingue", label: "Bilingüe Kággaba - Español" },
    { value: "otra", label: "Otra lengua serrana" },
  ],
  arhuaco: [
    { value: "iku", label: "Ikʉ (Arhuaco)" },
    { value: "espanol", label: "Español" },
    { value: "bilingue", label: "Bilingüe Ikʉ - Español" },
    { value: "otra", label: "Otra lengua serrana" },
  ],
  ninguna: [
    { value: "espanol", label: "Español" },
    { value: "otra", label: "Otra lengua" },
  ],
};

export function getLenguaOptions(puebloIndigena: string) {
  return LENGUA_OPTIONS_BY_PUEBLO[puebloIndigena] ?? LENGUA_OPTIONS_BY_PUEBLO.ninguna;
}

// El backend solo acepta de_pie/acostado (alias "pie" aceptado tal cual); sin opción "no reportado".
export const TIPO_MEDICION_TALLA_OPTIONS = [
  { value: "acostado", label: "Longitud acostado (lactantes / menor 2 años)" },
  { value: "pie", label: "Talla de pie" },
];

export const TRI_STATE_OPTIONS = [
  { value: "no_reportado", label: "No reportado" },
  { value: "si", label: "Sí" },
  { value: "no", label: "No" },
];

export const NIVEL_ACTIVIDAD_OPTIONS = [
  { value: "bajo", label: "Bajo / reposo obligado" },
  { value: "moderado", label: "Moderado" },
  { value: "alto", label: "Alto" },
];

export const STEPS = [
  { id: "sec-identificacion", label: "Identificación", hint: "Código y caso" },
  { id: "sec-menor", label: "Datos Menor", hint: "Territorio y linaje" },
  { id: "sec-mediciones", label: "Mediciones", hint: "Antropometría" },
  { id: "sec-calidad", label: "Calidad", hint: "Instrumentos" },
  { id: "sec-signos", label: "Signos Clínicos", hint: "Alertas médicas" },
  { id: "sec-alimentacion", label: "Alimentación", hint: "Chagra y dieta" },
  { id: "sec-actividad", label: "Actividad Física", hint: "Movimiento" },
  { id: "sec-contexto", label: "Contexto", hint: "Familia y Mamo" },
];

export const SYMPTOMS: { key: string; label: string; icon: string }[] = [
  { key: "signoFatiga", label: "Fatiga", icon: "bedtime" },
  { key: "signoDecaimiento", label: "Decaimiento", icon: "sentiment_dissatisfied" },
  { key: "signoFiebre", label: "Fiebre", icon: "device_thermostat" },
  { key: "signoDiarrea", label: "Diarrea", icon: "water_drop" },
  { key: "signoVomito", label: "Vómito", icon: "sick" },
  { key: "signoPerdidaPeso", label: "Pérdida de peso reciente", icon: "trending_down" },
  { key: "signoRechazoAlimento", label: "Rechazo al alimento", icon: "no_meals" },
  { key: "signoDeshidratacion", label: "Deshidratación", icon: "opacity" },
  { key: "signoDificultadRespiratoria", label: "Dificultad respiratoria", icon: "pulmonology" },
];
