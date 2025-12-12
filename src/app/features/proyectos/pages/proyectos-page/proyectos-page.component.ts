import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { ProyectoService } from '../../services/proyecto.service';
import { Proyecto } from '../../../../shared/models/proyecto.model';
import { ProyectoDialogComponent } from '../../components/proyecto-dialog/proyecto-dialog.component';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';

@Component({
  selector: 'app-proyectos-page',
  template: `
    <div class="page">
      <div class="header">
        <h1>Proyectos</h1>
        <button mat-flat-button color="primary" (click)="openCreate()">
          <mat-icon>add</mat-icon>
          Nuevo
        </button>
      </div>

      <mat-card>
        <div class="table-wrap">
          <table mat-table [dataSource]="data" class="mat-elevation-z0">

            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef>ID</th>
              <td mat-cell *matCellDef="let p">{{p.id}}</td>
            </ng-container>

            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef>Nombre</th>
              <td mat-cell *matCellDef="let p">{{p.nombre}}</td>
            </ng-container>

            <ng-container matColumnDef="estado">
              <th mat-header-cell *matHeaderCellDef>Estado</th>
              <td mat-cell *matCellDef="let p">{{p.estado}}</td>
            </ng-container>

            <ng-container matColumnDef="fechas">
              <th mat-header-cell *matHeaderCellDef>Fechas</th>
              <td mat-cell *matCellDef="let p">
                {{p.fechaInicio || '—'}} → {{p.fechaFin || '—'}}
              </td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let p" class="actions">
                <button mat-icon-button (click)="openEdit(p)" aria-label="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="confirmDelete(p)" aria-label="Eliminar">
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
    .table-wrap{overflow:auto}
    table{width:100%}
    .actions{display:flex;gap:6px}
  `]
})
export class ProyectosPageComponent implements OnInit {
  displayedColumns: string[] = ['id','nombre','estado','fechas','acciones'];
  data: Proyecto[] = [];
  total = 0;
  page = 0;
  size = 10;

  constructor(
    private proyectoService: ProyectoService,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {}

  ngOnInit(): void { this.load(); }

  load(): void {
    this.proyectoService.listar(this.page, this.size).subscribe(res => {
      this.data = res.content;
      this.total = res.totalElements;
    });
  }

  onPage(e: PageEvent): void {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.load();
  }

  openCreate(): void {
    const ref = this.dialog.open(ProyectoDialogComponent, { width: '600px', data: {} });
    ref.afterClosed().subscribe(val => {
      if (!val) return;
      this.proyectoService.crear(val).subscribe(() => {
        this.notify.success('Proyecto creado');
        this.load();
      });
    });
  }

  openEdit(proyecto: Proyecto): void {
    const ref = this.dialog.open(ProyectoDialogComponent, { width: '600px', data: { proyecto } });
    ref.afterClosed().subscribe(val => {
      if (!val) return;
      this.proyectoService.actualizar(proyecto.id, val).subscribe(() => {
        this.notify.success('Proyecto actualizado');
        this.load();
      });
    });
  }

  confirmDelete(proyecto: Proyecto): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { title: 'Eliminar proyecto', message: `¿Eliminar el proyecto "${proyecto.nombre}"?` }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.proyectoService.eliminar(proyecto.id).subscribe(() => {
        this.notify.success('Proyecto eliminado');
        this.load();
      });
    });
  }
}
