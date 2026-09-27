export interface EvaluacionResultado {
  indicador: string;
  valor_z: string;
  clasificacion: string;
  nivel_alerta: string;
}

export interface EvaluacionReporte {
  resumen_clinico: string;
  resumen_familiar: string;
}

export interface EvaluacionResponse {
  id: string;
  codigo_caso: string;
  estado: string;
  alerta_critica: boolean;
  resultados?: EvaluacionResultado[];
  reporte?: EvaluacionReporte;
  reporte_pdf_url?: string | null;
  reporte_familiar_pdf_url?: string | null;
}
