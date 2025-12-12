import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { TareasRoutingModule } from './tareas-routing.module';
import { TareasPageComponent } from './pages/tareas-page/tareas-page.component';
import { TareaDialogComponent } from './components/tarea-dialog/tarea-dialog.component';

@NgModule({
  declarations: [
    TareasPageComponent,
    TareaDialogComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    TareasRoutingModule
  ]
})
export class TareasModule {}
