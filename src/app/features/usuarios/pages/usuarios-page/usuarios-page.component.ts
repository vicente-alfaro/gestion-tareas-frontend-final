import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { UsuarioService } from '../../services/usuario.service';
import { Usuario } from '../../../../shared/models/usuario.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { NotificationService } from '../../../../core/services/notification.service';
import { UsuarioDialogComponent } from '../../components/usuario-dialog/usuario-dialog.component';

@Component({
  selector: 'app-usuarios-page',
  template: `
    <div class="page">
      <div class="header">
        <h1>Usuarios</h1>
        <button mat-flat-button color="primary" (click)="openCreate()">
          <mat-icon>person_add</mat-icon>
          Nuevo
        </button>
      </div>

      <mat-card>
        <div class="table-wrap">
          <table mat-table [dataSource]="data" matSort (matSortChange)="onSort($event)" class="mat-elevation-z0">
            <ng-container matColumnDef="id">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>ID</th>
              <td mat-cell *matCellDef="let u">{{u.id}}</td>
            </ng-container>

            <ng-container matColumnDef="nombre">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Nombre</th>
              <td mat-cell *matCellDef="let u">{{u.nombre}}</td>
            </ng-container>

            <ng-container matColumnDef="email">
              <th mat-header-cell *matHeaderCellDef mat-sort-header>Email</th>
              <td mat-cell *matCellDef="let u">{{u.email}}</td>
            </ng-container>

            <ng-container matColumnDef="acciones">
              <th mat-header-cell *matHeaderCellDef>Acciones</th>
              <td mat-cell *matCellDef="let u" class="actions">
                <button mat-icon-button (click)="openEdit(u)" aria-label="Editar">
                  <mat-icon>edit</mat-icon>
                </button>
                <button mat-icon-button color="warn" (click)="confirmDelete(u)" aria-label="Eliminar">
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
export class UsuariosPageComponent implements OnInit {
  displayedColumns: string[] = ['id','nombre','email','acciones'];
  data: Usuario[] = [];
  total = 0;
  page = 0;
  size = 10;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.usuarioService.listar(this.page, this.size).subscribe(res => {
      this.data = res.content;
      this.total = res.totalElements;
    });
  }

  onPage(e: PageEvent): void {
    this.page = e.pageIndex;
    this.size = e.pageSize;
    this.load();
  }

  onSort(_s: Sort): void {
    // Backend no soporta sort por ahora en endpoints (Pageable sí, pero no lo enviamos).
    // Se puede extender para enviar sort si lo necesitas.
  }

  openCreate(): void {
    const ref = this.dialog.open(UsuarioDialogComponent, { width: '420px', data: {} });
    ref.afterClosed().subscribe(val => {
      if (!val) return;
      this.usuarioService.crear(val).subscribe(() => {
        this.notify.success('Usuario creado');
        this.load();
      });
    });
  }

  openEdit(usuario: Usuario): void {
    const ref = this.dialog.open(UsuarioDialogComponent, { width: '420px', data: { usuario } });
    ref.afterClosed().subscribe(val => {
      if (!val) return;
      this.usuarioService.actualizar(usuario.id, val).subscribe(() => {
        this.notify.success('Usuario actualizado');
        this.load();
      });
    });
  }

  confirmDelete(usuario: Usuario): void {
    const ref = this.dialog.open(ConfirmDialogComponent, {
      width: '420px',
      data: { title: 'Eliminar usuario', message: `¿Eliminar a "${usuario.nombre}"?` }
    });
    ref.afterClosed().subscribe(ok => {
      if (!ok) return;
      this.usuarioService.eliminar(usuario.id).subscribe(() => {
        this.notify.success('Usuario eliminado');
        this.load();
      });
    });
  }
}
