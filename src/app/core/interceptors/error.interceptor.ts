import { Injectable } from '@angular/core';
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NotificationService } from '../services/notification.service';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private notify: NotificationService) {}

  intercept(req: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    return next.handle(req).pipe(
      catchError((err: HttpErrorResponse) => {
        const msg = this.extractMessage(err);
        this.notify.error(msg);
        return throwError(() => err);
      })
    );
  }

  private extractMessage(err: HttpErrorResponse): string {
    if (err.error && typeof err.error === 'object') {
      // backend validation: {field: message} or {mensaje: "..."}
      if (err.error.mensaje) return String(err.error.mensaje);
      const values = Object.values(err.error);
      if (values.length) return String(values[0]);
    }
    if (err.status === 0) return 'No se pudo conectar al servidor (¿backend encendido?)';
    return err.message || 'Ocurrió un error inesperado';
  }
}
