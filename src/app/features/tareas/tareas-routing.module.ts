import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TareasPageComponent } from './pages/tareas-page/tareas-page.component';

const routes: Routes = [
  { path: '', component: TareasPageComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TareasRoutingModule {}
