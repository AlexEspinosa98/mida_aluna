export interface Alimento {
  id: number;
  nombre: string;
  grupo: string;
  region_especifica: string;
  disponible: boolean;
  porcion_g: string;
  calorias_kcal: string;
  proteina_g: string;
  carbohidratos_g: string;
  grasa_g: string;
  notas: string;
  unidad_casera: string;
  cantidad_casera: string;
  descripcion_casera: string;
  // Calculados por el backend, de solo lectura.
  porcion_texto: string;
  calorias_por_porcion: string;
}

export type AlimentoPayload = Omit<Alimento, "id" | "porcion_texto" | "calorias_por_porcion">;

export interface AlimentoFilters {
  grupo?: string;
  region_especifica?: string;
  disponible?: string;
  nombre?: string;
}
