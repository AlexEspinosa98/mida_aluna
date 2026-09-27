export interface EvaluacionListItem {
  id: string;
  codigo_caso: string;
  paciente_nombre: string;
  paciente_etnia: string;
  fecha_evaluacion: string;
  estado: string;
  alerta_critica: boolean;
  nivel_alerta_maximo: string | null;
  reporte_pdf_url: string | null;
  reporte_familiar_pdf_url: string | null;
  creado_en: string;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface EvaluacionListFilters {
  estado?: string;
  alerta_critica?: string;
  codigo_caso?: string;
  paciente?: string;
  fecha_desde?: string;
  fecha_hasta?: string;
  page?: number;
}
