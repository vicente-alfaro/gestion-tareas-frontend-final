import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ProyectoService } from '../../../proyectos/services/proyecto.service';
import { UsuarioService } from '../../../usuarios/services/usuario.service';
import { Proyecto } from '../../../../shared/models/proyecto.model';
import { Usuario } from '../../../../shared/models/usuario.model';
import { Tarea } from '../../../../shared/models/tarea.model';

export interface TareaDialogData {
  tarea?: Tarea;
}

const ESTADOS = ['PENDIENTE','EN_PROGRESO','COMPLETADA','CANCELADA'];
const PRIORIDADES = ['BAJA','MEDIA','ALTA'];

@Component({
  selector: 'app-tarea-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.tarea ? 'Editar tarea' : 'Nueva tarea' }}</h2>

    <form [formGroup]="form" mat-dialog-content>
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Título</mat-label>
        <input matInput formControlName="titulo" />
        <mat-error *ngIf="form.controls['titulo'].invalid && form.controls['titulo'].touched">
          El título es obligatorio (máx 150).
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Descripción</mat-label>
        <textarea matInput rows="3" formControlName="descripcion"></textarea>
        <mat-error *ngIf="form.controls['descripcion'].invalid && form.controls['descripcion'].touched">
          Máx 1000 caracteres.
        </mat-error>
      </mat-form-field>

      <div class="grid">
        <mat-form-field appearance="outline">
          <mat-label>Estado</mat-label>
          <mat-select formControlName="estado">
            <mat-option *ngFor="let e of estados" [value]="e">{{e}}</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Prioridad</mat-label>
          <mat-select formControlName="prioridad">
            <mat-option *ngFor="let p of prioridades" [value]="p">{{p}}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="grid">
        <mat-form-field appearance="outline">
          <mat-label>Proyecto</mat-label>
          <mat-select formControlName="proyectoId">
            <mat-option *ngFor="let p of proyectos" [value]="p.id">{{p.nombre}}</mat-option>
          </mat-select>
          <mat-error *ngIf="form.controls['proyectoId'].invalid && form.controls['proyectoId'].touched">
            Selecciona un proyecto.
          </mat-error>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Asignar a usuario</mat-label>
          <mat-select formControlName="usuarioId">
            <mat-option [value]="null">Sin asignar</mat-option>
            <mat-option *ngFor="let u of usuarios" [value]="u.id">{{u.nombre}}</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Fecha de vencimiento</mat-label>
        <input matInput [matDatepicker]="dp" formControlName="fechaVencimiento" />
        <mat-datepicker-toggle matIconSuffix [for]="dp"></mat-datepicker-toggle>
        <mat-datepicker #dp></mat-datepicker>
      </mat-form-field>
    </form>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="submit()">Guardar</button>
    </div>
  `,
  styles: [`
    .w-100{width:100%}
    .grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
    @media (max-width: 720px){.grid{grid-template-columns:1fr}}
  `]
})
export class TareaDialogComponent implements OnInit {
  form: FormGroup;
  estados = ESTADOS;
  prioridades = PRIORIDADES;

  proyectos: Proyecto[] = [];
  usuarios: Usuario[] = [];

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<TareaDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TareaDialogData,
    private proyectoService: ProyectoService,
    private usuarioService: UsuarioService
  ) {
    this.form = this.fb.group({
      titulo: [data.tarea?.titulo ?? '', [Validators.required, Validators.maxLength(150)]],
      descripcion: [data.tarea?.descripcion ?? '', [Validators.maxLength(1000)]],
      estado: [data.tarea?.estado ?? 'PENDIENTE', [Validators.required]],
      prioridad: [data.tarea?.prioridad ?? 'MEDIA', [Validators.required]],
      proyectoId: [data.tarea?.proyectoId ?? null, [Validators.required]],
      usuarioId: [data.tarea?.usuarioId ?? null],
      fechaVencimiento: [data.tarea?.fechaVencimiento ? new Date(data.tarea.fechaVencimiento) : null]
    });
  }

  ngOnInit(): void {
    this.proyectoService.listar(0, 200).subscribe(res => this.proyectos = res.content);
    this.usuarioService.listar(0, 200).subscribe(res => this.usuarios = res.content);
  }

  close(): void { this.ref.close(); }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.value;
    const toIso = (d: Date | null) => d ? d.toISOString().slice(0,10) : null;

    this.ref.close({
      titulo: raw.titulo,
      descripcion: raw.descripcion || null,
      estado: raw.estado,
      prioridad: raw.prioridad,
      proyectoId: raw.proyectoId,
      usuarioId: raw.usuarioId,
      fechaVencimiento: toIso(raw.fechaVencimiento)
    });
  }
}
