import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { ProyectosRoutingModule } from './proyectos-routing.module';
import { ProyectosPageComponent } from './pages/proyectos-page/proyectos-page.component';
import { ProyectoDialogComponent } from './components/proyecto-dialog/proyecto-dialog.component';

@NgModule({
  declarations: [
    ProyectosPageComponent,
    ProyectoDialogComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    ProyectosRoutingModule
  ]
})
export class ProyectosModule {}
