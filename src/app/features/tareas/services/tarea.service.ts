import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import { Tarea } from '../../../shared/models/tarea.model';
import { PageResponse } from '../../../shared/models/page.model';

@Injectable({ providedIn: 'root' })
export class TareaService {
  private apiUrl = `${API_CONFIG.baseUrl}/tareas`;

  constructor(private http: HttpClient) {}

  listar(
    page = 0,
    size = 10,
    estado?: string,
    prioridad?: string,
    proyectoId?: number
  ): Observable<PageResponse<Tarea>> {
    let params = new HttpParams().set('page', page).set('size', size);
    if (estado) params = params.set('estado', estado);
    if (prioridad) params = params.set('prioridad', prioridad);
    if (proyectoId != null) params = params.set('proyectoId', proyectoId);
    return this.http.get<PageResponse<Tarea>>(this.apiUrl, { params });
  }

  obtener(id: number): Observable<Tarea> {
    return this.http.get<Tarea>(`${this.apiUrl}/${id}`);
  }

  crear(tarea: Omit<Tarea, 'id'>): Observable<Tarea> {
    return this.http.post<Tarea>(this.apiUrl, tarea);
  }

  actualizar(id: number, tarea: Omit<Tarea, 'id'>): Observable<Tarea> {
    return this.http.put<Tarea>(`${this.apiUrl}/${id}`, tarea);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
