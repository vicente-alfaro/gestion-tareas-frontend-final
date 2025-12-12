import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  constructor(private snackBar: MatSnackBar) {}

  success(message: string): void {
    this.snackBar.open(message, 'OK', { duration: 2500 });
  }

  error(message: string): void {
    this.snackBar.open(message, 'Cerrar', { duration: 6000 });
  }
}
