import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TareaService } from '../../services/tarea.service';
import { Tarea } from '../../../../shared/models/tarea.model';
import { ProyectoService } from '../../../proyectos/services/proyecto.service';
import { Proyecto } from '../../../../shared/models/proyecto.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { TareaDialogComponent } from '../../components/tarea-dialog/tarea-dialog.component';

const ESTADOS = ['','PENDIENTE','EN_PROGRESO','COMPLETADA','CANCELADA'];
const PRIORIDADES = ['','BAJA','MEDIA','ALTA'];

@Component({
  selector: 'app-tareas-page',
  template: `
    <div class="page">
      <div class="header">
        <h1>Tareas</h1>
        <button mat-flat-button color="primary" (click)="openCreate()">
          <mat-icon>add_task</mat-icon>
          Nueva
        </button>
      </div>

      <mat-card>
        <form [formGroup]="filters" class="filters" (ngSubmit)="applyFilters()">
          <mat-form-field appearance="outline">
            <mat-label>Estado</mat-label>
            <mat-select formControlName="estado">
              <mat-option *ngFor="let e of estados" [value]="e">{{e || 'Todos'}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Prioridad</mat-label>
            <mat-select formControlName="prioridad">
              <mat-option *ngFor="let p of prioridades" [value]="p">{{p || 'Todas'}}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Proyecto</mat-label>
            <mat-select formControlName="proyectoId">
              <mat-option [value]="null">Todos</mat-option>
              <mat-option *ngFor="let p of proyectos" [value]="p.id">{{p.nombre}}</mat-option>
            </mat-select>
          </mat-form-field>

          <div class="filter-actions">
            <button mat-stroked-button type="button" (click)="resetFilters()">Limpiar</button>
            <button mat-flat-button color="primary" type="submit">Aplicar</button>
          </div>
        </form>
      </mat-card>

      <mat-card>
        <div class="table-wrap">
          <table mat-table [dataSource]="data" class="mat-elevation-z0">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let t">{{t.id}}</td>
            </ng-container>

            <ng-container matColumnDef="titulo">
              <th mat-header-cell *matHeaderCellDef>Título</th>
              <td mat-cell *matCellDef="let t">{{t.titulo}}</td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let t">{{t.estado}}</td>
            </ng-container>

            <ng-container matColumnDef="prioridad">
              <th mat-header-cell *matHeaderCellDef>Prioridad</th>
              <td mat-cell *matCellDef="let t">{{t.prioridad}}</td>
            </ng-container>

            <ng-container matColumnDef="proyecto">
              <th mat-header-cell *matHeaderCellDef>Proyecto</th>
              <td mat-cell *matCellDef="let t">{{t.proyectoNombre || t.proyectoId}}</td>
            </ng-container>

            <ng-container matColumnDef="usuario">
              <th mat-header-cell *matHeaderCellDef>Asignado</th>
              <td mat-cell *matCellDef="let t">{{t.usuarioNombre || '—'}}</td>
            </ng-container>

            <ng-container matColumnDef="venc">
              <th mat-header-cell *matHeaderCellDef>Venc.</th>
              <td mat-cell *matCellDef="let t">{{t.fechaVencimiento || '—'}}</td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let t" class="actions">
                <button mat-icon-button (click)="openEdit(t)" aria-label="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="confirmDelete(t)" aria-label="Eliminar">
                  <mat-icon>delete</mat-icon>
                </button>
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
          </table>

          <mat-paginator
            [length]="total"
            [pageIndex]="page"
            [pageSize]="size"
            [pageSizeOptions]="[5,10,20]"
            (page)="onPage($event)">
          </mat-paginator>
        </div>
      </mat-card>
    </div>
  `,
  styles: [`
    .page{display:flex;flex-direction:column;gap:16px}
    .header{display:flex;align-items:center;justify-content:space-between}
    .filters{display:grid;grid-template-columns:repeat(3, minmax(160px, 1fr)) auto;gap:12px;align-items:end}
    .filter-actions{display:flex;gap:10px;justify-content:flex-end}
    @media (max-width: 900px){.filters{grid-template-columns:1fr;}.filter-actions{justify-content:flex-start}}
    .table-wrap{overflow:auto}
    table{width:100%}
    .actions{display:flex;gap:6px}
  `]
})
export class TareasPageComponent implements OnInit {
  displayedColumns: string[] = ['id','titulo','estado','prioridad','proyecto','usuario','venc','acciones'];
  data: Tarea[] = [];
  total = 0;
  page = 0;
  size = 10;

  filtrosAplicados: {estado?: string; prioridad?: string; proyectoId?: number | null} = {};

  proyectos: Proyecto[] = [];
  filters: FormGroup;

  estados = ESTADOS;
  prioridades = PRIORIDADES;

  constructor(
    private fb: FormBuilder,
    private tareaService: TareaService,
    private proyectoService: ProyectoService,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {
    this.filters = this.fb.group({
      estado: [''],
      prioridad: [''],
      proyectoId: [null]
    });
  }

  ngOnInit(): void {
    this.proyectoService.listar(0, 200).subscribe(res => this.proyectos = res.content);
    this.load();
  }

  load(): void {
    const { estado, prioridad, proyectoId } = this.filtrosAplicados;
    this.tareaService.listar(this.page, this.size, estado, prioridad, proyectoId ?? undefined).subscribe(res => {
      this.data = res.content;
      this.total = res.totalElements;
    });
  }

  onPage(e: PageEvent): void {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.load();
  }

  applyFilters(): void {
    const v = this.filters.value;
    this.filtrosAplicados = {
      estado: v.estado || undefined,
      prioridad: v.prioridad || undefined,
      proyectoId: v.proyectoId
    };
    this.page = 0;
    this.load();
  }

  resetFilters(): void {
    this.filters.reset({estado:'', prioridad:'', proyectoId: null});
    this.filtrosAplicados = {};
    this.page = 0;
    this.load();
  }

  openCreate(): void {
    const ref = this.dialog.open(TareaDialogComponent, { width: '700px', data: {} });
    ref.afterClosed().subscribe(val => {
      if (!val) return;
      this.tareaService.crear(val).subscribe(() => {
        this.notify.success('Tarea creada');
        this.load();
      });
    });
  }

  openEdit(tarea: Tarea): void {
    const ref = this.dialog.open(TareaDialogComponent, { width: '700px', data: { tarea } });
    ref.afterClosed().subscribe(val => {
      if (!val) return;
      this.tareaService.actualizar(tarea.id, val).subscribe(() => {
        this.notify.success('Tarea actualizada');
        this.load();
      });
    });
  }

  confirmDelete(tarea: Tarea): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { title: 'Eliminar tarea', message: `¿Eliminar la tarea "${tarea.titulo}"?` }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.tareaService.eliminar(tarea.id).subscribe(() => {
        this.notify.success('Tarea eliminada');
        this.load();
      });
    });
  }
}
