export interface Tarea {
  id: number;
  titulo: string;
  descripcion?: string;
  estado: 'PENDIENTE' | 'EN_PROGRESO' | 'COMPLETADA' | 'BLOQUEADA';
  prioridad: 'BAJA' | 'MEDIA' | 'ALTA';
  fechaCreacion?: string;
  fechaVencimiento?: string;
  proyectoId?: number;
  usuarioId?: number;
  proyectoNombre?: string;
  usuarioNombre?: string;
}

export interface TareaPaginada {
  content: Tarea[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
