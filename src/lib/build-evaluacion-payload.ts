import { AnthropometryFormData } from "@/types/anthropometry";

/** Quita claves con string vacío para no mandar "" en un DecimalField opcional (400 en Django). */
function omitEmptyStrings<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== "")) as Partial<T>;
}

/**
 * Arma el payload anidado de POST /api/v1/evaluaciones/ a partir del estado plano del
 * formulario. Los nombres y valores siguen el contrato JSON fijado por el backend (HU-1 a
 * HU-8): sexo/tipo_medicion_talla/etnia van en los valores nativos que el backend ya acepta
 * como alias (ver anthropometry-options.ts), no hace falta traducirlos acá.
 */
export function buildEvaluacionPayload(form: AnthropometryFormData) {
  return {
    codigo_caso: form.codigoCaso,
    fecha_reporte: form.fechaReporte,
    objetivo_reporte: form.objetivoReporte,
    notas_administrativas: form.notasAdministrativas,

    paciente: omitEmptyStrings({
      nombres: form.nombres,
      apellidos: form.apellidos,
      etnia: form.puebloIndigena,
      comunidad_asentamiento: form.comunidad,
      municipio: form.municipio,
      departamento: form.departamento,
      cuidador_principal: form.cuidadorPrincipal,
      lengua_principal: form.lenguaPrincipal,
      requiere_mediacion_cultural: form.requiereMediacionCultural,
    }),

    sexo: form.sexo,
    fecha_evaluacion: form.fechaMedicion,
    edad_meses: form.edad,
    peso_kg: form.pesoKg,
    talla_cm: form.tallaCm,
    tipo_medicion_talla: form.tipoMedicionTalla,
    edema_bilateral: form.edemaBilateral,
    ...omitEmptyStrings({
      perimetro_cefalico_cm: form.perimetroCefalico,
      perimetro_braquial_cm: form.muacCm,
      perimetro_cintura_cm: form.perimetroCintura,
      perimetro_cadera_cm: form.perimetroCadera,
    }),

    calidad_medicion: {
      balanza_calibrada: form.balanzaCalibrada,
      instrumentos_validados: form.instrumentosValidados,
      medicion_repetida: form.medicionRepetida,
      observaciones: form.observacionesCalidad,
    },

    signos_clinicos: {
      fatiga: form.signoFatiga,
      decaimiento: form.signoDecaimiento,
      fiebre: form.signoFiebre,
      diarrea: form.signoDiarrea,
      vomito: form.signoVomito,
      perdida_peso_reciente: form.signoPerdidaPeso,
      rechazo_alimento: form.signoRechazoAlimento,
      deshidratacion: form.signoDeshidratacion,
      dificultad_respiratoria: form.signoDificultadRespiratoria,
      observaciones: form.observacionesSignos,
    },

    habitos_alimentarios: {
      numero_comidas_dia: Number(form.numeroComidas) || 0,
      alimentos_frecuentes: form.alimentosFrecuentes,
      alimentos_escasos: form.alimentosEscasos,
      cambios_recientes_alimentacion: form.cambiosAlimentacion,
      restricciones_culturales_familiares: form.restriccionesCulturales,
      acceso_agua_segura: form.accesoAguaSegura,
    },

    actividad_fisica: {
      nivel_actividad: form.nivelActividad,
      actividades_diarias: form.actividadesDiarias,
      limitaciones: form.limitaciones,
    },

    contexto_familiar: {
      antecedentes_familiares_baja_talla: form.antecedentesBajaTalla,
      hermanos_baja_talla: form.hermanosBajaTalla,
      inseguridad_alimentaria_reportada: form.inseguridadAlimentaria,
      dificultad_acceso_salud: form.dificultadAccesoSalud,
      observaciones_familia: form.observacionesFamilia,
      observaciones_autoridad_tradicional: form.observacionesAutoridadTradicional,
    },
  };
}
