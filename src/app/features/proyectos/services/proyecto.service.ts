import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import { Proyecto } from '../../../shared/models/proyecto.model';
import { PageResponse } from '../../../shared/models/page.model';

@Injectable({ providedIn: 'root' })
export class ProyectoService {
  private apiUrl = `${API_CONFIG.baseUrl}/proyectos`;

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 10): Observable<PageResponse<Proyecto>> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<PageResponse<Proyecto>>(this.apiUrl, { params });
  }

  obtener(id: number): Observable<Proyecto> {
    return this.http.get<Proyecto>(`${this.apiUrl}/${id}`);
  }

  crear(proyecto: Omit<Proyecto, 'id'>): Observable<Proyecto> {
    return this.http.post<Proyecto>(this.apiUrl, proyecto);
  }

  actualizar(id: number, proyecto: Omit<Proyecto, 'id'>): Observable<Proyecto> {
    return this.http.put<Proyecto>(`${this.apiUrl}/${id}`, proyecto);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
