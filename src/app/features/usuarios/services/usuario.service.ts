import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import { Usuario } from '../../../shared/models/usuario.model';
import { PageResponse } from '../../../shared/models/page.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private apiUrl = `${API_CONFIG.baseUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 10): Observable<PageResponse<Usuario>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Usuario>>(this.apiUrl, { params });
  }

  obtener(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(`${this.apiUrl}/${id}`);
  }

  crear(usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    return this.http.post<Usuario>(this.apiUrl, usuario);
  }

  actualizar(id: number, usuario: Omit<Usuario, 'id'>): Observable<Usuario> {
    return this.http.put<Usuario>(`${this.apiUrl}/${id}`, usuario);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
