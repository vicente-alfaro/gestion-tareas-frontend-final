import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { UsuariosRoutingModule } from './usuarios-routing.module';
import { UsuariosPageComponent } from './pages/usuarios-page/usuarios-page.component';
import { UsuarioDialogComponent } from './components/usuario-dialog/usuario-dialog.component';

@NgModule({
  declarations: [
    UsuariosPageComponent,
    UsuarioDialogComponent
  ],
  imports: [
    SharedModule,
    ReactiveFormsModule,
    UsuariosRoutingModule
  ]
})
export class UsuariosModule {}
