import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Proyecto } from '../../../../shared/models/proyecto.model';

export interface ProyectoDialogData {
  proyecto?: Proyecto;
}

const ESTADOS = ['PLANIFICADO','EN_PROGRESO','COMPLETADO','PAUSADO'];

@Component({
  selector: 'app-proyecto-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.proyecto ? 'Editar proyecto' : 'Nuevo proyecto' }}</h2>

    <form [formGroup]="form" mat-dialog-content>
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre" />
        <mat-error *ngIf="form.controls['nombre'].invalid && form.controls['nombre'].touched">
          El nombre es obligatorio (máx 100).
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Descripción</mat-label>
        <textarea matInput rows="3" formControlName="descripcion"></textarea>
        <mat-error *ngIf="form.controls['descripcion'].invalid && form.controls['descripcion'].touched">
          Máx 500 caracteres.
        </mat-error>
      </mat-form-field>

      <div class="grid">
        <mat-form-field appearance="outline">
          <mat-label>Fecha inicio</mat-label>
          <input matInput [matDatepicker]="dp1" formControlName="fechaInicio" />
          <mat-datepicker-toggle matIconSuffix [for]="dp1"></mat-datepicker-toggle>
          <mat-datepicker #dp1></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Fecha fin</mat-label>
          <input matInput [matDatepicker]="dp2" formControlName="fechaFin" />
          <mat-datepicker-toggle matIconSuffix [for]="dp2"></mat-datepicker-toggle>
          <mat-datepicker #dp2></mat-datepicker>
        </mat-form-field>
      </div>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Estado</mat-label>
        <mat-select formControlName="estado">
          <mat-option *ngFor="let e of estados" [value]="e">{{ e }}</mat-option>
        </mat-select>
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
export class ProyectoDialogComponent {
  form: FormGroup;
  estados = ESTADOS;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<ProyectoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ProyectoDialogData
  ) {
    this.form = this.fb.group({
      nombre: [data.proyecto?.nombre ?? '', [Validators.required, Validators.maxLength(100)]],
      descripcion: [data.proyecto?.descripcion ?? '', [Validators.maxLength(500)]],
      fechaInicio: [data.proyecto?.fechaInicio ? new Date(data.proyecto.fechaInicio) : null],
      fechaFin: [data.proyecto?.fechaFin ? new Date(data.proyecto.fechaFin) : null],
      estado: [data.proyecto?.estado ?? 'PLANIFICADO', [Validators.required]]
    });
  }

  close(): void {
    this.ref.close();
  }

  submit(): void {
    if (this.form.invalid) return;
    const raw = this.form.value;
    // Convert Date -> YYYY-MM-DD string expected by backend (LocalDate)
    const toIso = (d: Date | null) => d ? d.toISOString().slice(0,10) : null;

    this.ref.close({
      nombre: raw.nombre,
      descripcion: raw.descripcion || null,
      fechaInicio: toIso(raw.fechaInicio),
      fechaFin: toIso(raw.fechaFin),
      estado: raw.estado
    });
  }
}
