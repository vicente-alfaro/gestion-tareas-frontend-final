import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProyectosPageComponent } from './pages/proyectos-page/proyectos-page.component';

const routes: Routes = [
  { path: '', component: ProyectosPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProyectosRoutingModule {}
