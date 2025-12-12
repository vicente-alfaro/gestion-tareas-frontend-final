import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_CONFIG } from '../../../core/config/api.config';
import { TareasPorEstado } from '../../../shared/models/dashboard.model';

@Injectable({ providedIn: 'root' })
export class DashboardService {
  private apiUrl = `${API_CONFIG.baseUrl}/dashboard`;

  constructor(private http: HttpClient) {}

  tareasPorEstado(): Observable<TareasPorEstado[]> {
    return this.http.get<TareasPorEstado[]>(`${this.apiUrl}/tareas-por-estado`);
  }
}
