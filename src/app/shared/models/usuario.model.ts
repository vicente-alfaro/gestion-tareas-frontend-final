export interface Usuario {
  id: number;
  nombre: string;
  email: string;
}

export interface UsuarioPaginado {
  content: Usuario[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}
