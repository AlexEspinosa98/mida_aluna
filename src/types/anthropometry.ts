export type TriState = "no_reportado" | "si" | "no";

export interface AnthropometryFormData {
  // 1. Identificación del caso
  codigoCaso: string;
  fechaReporte: string;
  objetivoReporte: string;
  notasAdministrativas: string;

  // 2. Datos del menor
  nombres: string;
  edad: string;
  sexo: "masculino" | "femenino" | "intersexual" | "no_reportado";
  puebloIndigena: string;
  comunidad: string;
  municipio: string;
  departamento: string;
  cuidadorPrincipal: string;
  lenguaPrincipal: string;
  requiereMediacionCultural: boolean;

  // 3. Mediciones antropométricas
  pesoKg: string;
  tallaCm: string;
  tipoMedicionTalla: "pie" | "acostado" | "no_reportado";
  muacCm: string;
  perimetroCefalico: string;
  perimetroCintura: string;
  perimetroCadera: string;
  edemaBilateral: boolean;
  fechaMedicion: string;

  // 4. Calidad de medición
  balanzaCalibrada: TriState;
  medicionRepetida: TriState;
  observacionesCalidad: string;

  // 5. Signos clínicos
  signoFatiga: boolean;
  signoDecaimiento: boolean;
  signoFiebre: boolean;
  signoDiarrea: boolean;
  signoVomito: boolean;
  signoPerdidaPeso: boolean;
  signoRechazoAlimento: boolean;
  signoDeshidratacion: boolean;
  signoDificultadRespiratoria: boolean;
  observacionesSignos: string;

  // 6. Alimentación
  numeroComidas: string;
  alimentosFrecuentes: string;
  alimentosEscasos: string;
  cambiosAlimentacion: string;
  restriccionesCulturales: string;
  accesoAguaSegura: TriState;

  // 7. Actividad física
  nivelActividad: "bajo" | "moderado" | "alto" | "no_reportado";
  actividadesDiarias: string;
  limitaciones: string;

  // 8. Contexto familiar y territorial
  antecedentesBajaTalla: TriState;
  hermanosBajaTalla: TriState;
  inseguridadAlimentaria: TriState;
  dificultadAccesoSalud: TriState;
  observacionesFamilia: string;
  observacionesAutoridadTradicional: string;
}

export const EMPTY_FORM: AnthropometryFormData = {
  codigoCaso: "",
  fechaReporte: "",
  objetivoReporte: "",
  notasAdministrativas: "",

  nombres: "",
  edad: "",
  sexo: "masculino",
  puebloIndigena: "kaggaba",
  comunidad: "",
  municipio: "",
  departamento: "magdalena",
  cuidadorPrincipal: "",
  lenguaPrincipal: "kaggaba",
  requiereMediacionCultural: false,

  pesoKg: "",
  tallaCm: "",
  tipoMedicionTalla: "pie",
  muacCm: "",
  perimetroCefalico: "",
  perimetroCintura: "",
  perimetroCadera: "",
  edemaBilateral: false,
  fechaMedicion: "",

  balanzaCalibrada: "no_reportado",
  medicionRepetida: "no_reportado",
  observacionesCalidad: "",

  signoFatiga: false,
  signoDecaimiento: false,
  signoFiebre: false,
  signoDiarrea: false,
  signoVomito: false,
  signoPerdidaPeso: false,
  signoRechazoAlimento: false,
  signoDeshidratacion: false,
  signoDificultadRespiratoria: false,
  observacionesSignos: "",

  numeroComidas: "3",
  alimentosFrecuentes: "",
  alimentosEscasos: "",
  cambiosAlimentacion: "",
  restriccionesCulturales: "",
  accesoAguaSegura: "no_reportado",

  nivelActividad: "moderado",
  actividadesDiarias: "",
  limitaciones: "",

  antecedentesBajaTalla: "no_reportado",
  hermanosBajaTalla: "no_reportado",
  inseguridadAlimentaria: "no_reportado",
  dificultadAccesoSalud: "no_reportado",
  observacionesFamilia: "",
  observacionesAutoridadTradicional: "",
};

export const DEMO_FORM: AnthropometryFormData = {
  codigoCaso: "KAG-2024-0581",
  fechaReporte: new Date().toLocaleDateString("es-CO"),
  objetivoReporte: "Seguimiento nutricional bimensual",
  notasAdministrativas:
    "Brigada territorial acompañada por cabildo local, comunidad de Seykúkui.",

  nombres: "Samin K. (Protegido por soberanía CARE)",
  edad: "24",
  sexo: "masculino",
  puebloIndigena: "kaggaba",
  comunidad: "Seykúkui",
  municipio: "Santa Marta",
  departamento: "magdalena",
  cuidadorPrincipal: "Madre (Saga)",
  lenguaPrincipal: "kaggaba",
  requiereMediacionCultural: true,

  pesoKg: "11.45",
  tallaCm: "84.5",
  tipoMedicionTalla: "pie",
  muacCm: "13.2",
  perimetroCefalico: "47.5",
  perimetroCintura: "46.0",
  perimetroCadera: "48.0",
  edemaBilateral: false,
  fechaMedicion: new Date().toISOString().split("T")[0],

  balanzaCalibrada: "si",
  medicionRepetida: "si",
  observacionesCalidad:
    "Medición tomada en bohío tradicional con piso de madera irregular; se usó base rígida nivelada. Niño cooperador.",

  signoFatiga: false,
  signoDecaimiento: false,
  signoFiebre: false,
  signoDiarrea: false,
  signoVomito: false,
  signoPerdidaPeso: false,
  signoRechazoAlimento: false,
  signoDeshidratacion: false,
  signoDificultadRespiratoria: false,
  observacionesSignos: "",

  numeroComidas: "3",
  alimentosFrecuentes:
    "Guineo verde, yuca dulce, malanga (ñame), frijol guajiro, plátano, leche materna.",
  alimentosEscasos: "Huevos de campo, pescado de cuenca baja, aguacate, cítricos de temporada.",
  cambiosAlimentacion: "Cosecha baja de frijol por sequía.",
  restriccionesCulturales:
    "Ayuno ritual orientado por el Mamo, exclusión temporal de carnes rojas o grasas externas.",
  accesoAguaSegura: "si",

  nivelActividad: "moderado",
  actividadesDiarias: "Juegos en bohío y patio, caminatas cortas con la madre.",
  limitaciones: "",

  antecedentesBajaTalla: "si",
  hermanosBajaTalla: "no",
  inseguridadAlimentaria: "no_reportado",
  dificultadAccesoSalud: "si",
  observacionesFamilia:
    "Comentarios de la madre sobre buen apetito, ánimo y destrezas al caminar en montaña.",
  observacionesAutoridadTradicional:
    "Petición de armonización espiritual (pagamento), consentimiento para derivación médica si fuere requerida.",
};
