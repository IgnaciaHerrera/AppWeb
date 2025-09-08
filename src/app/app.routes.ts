import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'detalle-ficha/:rut',
    loadComponent: () =>
      import('./detalle-ficha/detalle-ficha.page').then(
        (m) => m.DetalleFichaPage
      ),
  },
  {
    path: 'pacientes-actuales',
    loadComponent: () => import('./pacientes-actuales/pacientes-actuales.page').then( m => m.PacientesActualesPage)
  },

];
