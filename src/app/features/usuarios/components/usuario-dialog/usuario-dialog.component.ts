import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Usuario } from '../../../../shared/models/usuario.model';

export interface UsuarioDialogData {
  usuario?: Usuario;
}

@Component({
  selector: 'app-usuario-dialog',
  template: `
    <h2 mat-dialog-title>{{ data.usuario ? 'Editar usuario' : 'Nuevo usuario' }}</h2>

    <form [formGroup]="form" (ngSubmit)="submit()" mat-dialog-content>
      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Nombre</mat-label>
        <input matInput formControlName="nombre" />
        <mat-error *ngIf="form.controls['nombre'].invalid && form.controls['nombre'].touched">
          El nombre es obligatorio (máx 100).
        </mat-error>
      </mat-form-field>

      <mat-form-field appearance="outline" class="w-100">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" />
        <mat-error *ngIf="form.controls['email'].invalid && form.controls['email'].touched">
          Email inválido.
        </mat-error>
      </mat-form-field>
    </form>

    <div mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cancelar</button>
      <button mat-flat-button color="primary" [disabled]="form.invalid" (click)="submit()">
        Guardar
      </button>
    </div>
  `,
  styles: [`.w-100{width:100%}`]
})
export class UsuarioDialogComponent {
  form: FormGroup;

  constructor(
    private fb: FormBuilder,
    private ref: MatDialogRef<UsuarioDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UsuarioDialogData
  ) {
    this.form = this.fb.group({
      nombre: [data.usuario?.nombre ?? '', [Validators.required, Validators.maxLength(100)]],
      email: [data.usuario?.email ?? '', [Validators.required, Validators.email, Validators.maxLength(150)]]
    });
  }

  close(): void {
    this.ref.close();
  }

  submit(): void {
    if (this.form.invalid) return;
    this.ref.close(this.form.value);
  }
}
