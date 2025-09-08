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
  {
    path: 'tab8',
    loadComponent: () => import('./tab8/tab8.page').then( m => m.Tab8Page)
  },
  {
    path: 'tab9',
    loadComponent: () => import('./tab9/tab9.page').then( m => m.Tab9Page)
  },
  {
    path: 'tab10',
    loadComponent: () => import('./tab10/tab10.page').then( m => m.Tab10Page)
  },
  {
    path: 'tab11',
    loadComponent: () => import('./tab11/tab11.page').then( m => m.Tab11Page)
  },
  {
    path: 'tab12',
    loadComponent: () => import('./tab12/tab12.page').then( m => m.Tab12Page)
  },
  {
    path: 'tab-more',
    loadComponent: () => import('./tab-more/tab-more.page').then( m => m.TabMorePage)
  },



];
