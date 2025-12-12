import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { TareasPorEstado } from '../../../../shared/models/dashboard.model';

@Component({
  selector: 'app-dashboard-page',
  template: `
    <div class="page">
      <div class="header">
        <h1>Dashboard</h1>
      </div>

      <div class="cards" *ngIf="data.length; else empty">
        <mat-card class="card" *ngFor="let item of data">
          <div class="kpi">
            <div class="label">{{ item.estado }}</div>
            <div class="value">{{ item.cantidad }}</div>
          </div>
        </mat-card>
      </div>

      <ng-template #empty>
        <mat-card>
          <p>No hay datos aún. Crea tareas para ver el resumen por estado.</p>
        </mat-card>
      </ng-template>

      <mat-card *ngIf="data.length">
        <h2 class="sub">Tareas por estado</h2>
        <table mat-table [dataSource]="data" class="mat-elevation-z0">
          <ng-container matColumnDef="estado">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let r">{{r.estado}}</td>
          </ng-container>

          <ng-container matColumnDef="cantidad">
            <th mat-header-cell *matHeaderCellDef>Cantidad</th>
            <td mat-cell *matCellDef="let r">{{r.cantidad}}</td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="cols"></tr>
          <tr mat-row *matRowDef="let row; columns: cols;"></tr>
        </table>
      </mat-card>
    </div>
  `,
  styles: [`
    .page{display:flex;flex-direction:column;gap:16px}
    .header{display:flex;align-items:center;justify-content:space-between}
    .cards{display:grid;grid-template-columns:repeat(4,minmax(160px,1fr));gap:12px}
    .card{padding:14px}
    .kpi{display:flex;flex-direction:column;gap:6px}
    .label{font-size:13px;opacity:.8}
    .value{font-size:28px;font-weight:700}
    .sub{margin:0 0 12px 0}
    @media (max-width: 900px){.cards{grid-template-columns:repeat(2,minmax(160px,1fr))}}
    @media (max-width: 520px){.cards{grid-template-columns:1fr}}
    table{width:100%}
  `]
})
export class DashboardPageComponent implements OnInit {
  data: TareasPorEstado[] = [];
  cols = ['estado','cantidad'];

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    this.dashboardService.tareasPorEstado().subscribe(res => this.data = res);
  }
}
