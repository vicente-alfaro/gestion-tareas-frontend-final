export interface Proyecto {
  id: number;
  nombre: string;
  descripcion?: string;
  fechaInicio?: string;
  fechaFin?: string;
  estado?: string;
}

export interface ProyectoPaginado {
  content: Proyecto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
