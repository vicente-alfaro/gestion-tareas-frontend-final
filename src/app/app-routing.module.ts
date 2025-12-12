import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },

  {
    path: 'dashboard',
    loadChildren: () => import('./features/dashboard/dashboard.module').then(m => m.DashboardModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./features/usuarios/usuarios.module').then(m => m.UsuariosModule)
  },
  {
    path: 'proyectos',
    loadChildren: () => import('./features/proyectos/proyectos.module').then(m => m.ProyectosModule)
  },
  {
    path: 'tareas',
    loadChildren: () => import('./features/tareas/tareas.module').then(m => m.TareasModule)
  },

  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
