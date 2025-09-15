import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.routes').then((m) => m.routes),
  },
  {
    path: 'datos-personales',
    loadComponent: () => import('./datos-personales/datos-personales.page').then( m => m.DatosPersonalesPage)
  },
  {
    path: 'recetas-medicamentos',
    loadComponent: () => import('./recetas-medicamentos/recetas-medicamentos.page').then( m => m.RecetasMedicamentosPage)
  },
  {
    path: 'alergias',
    loadComponent: () => import('./alergias/alergias.page').then( m => m.AlergiasPage)
  },
  {
    path: 'diagnosticos',
    loadComponent: () => import('./diagnosticos/diagnosticos.page').then( m => m.DiagnosticosPage)
  },
  {
    path: 'historial',
    loadComponent: () => import('./historial/historial.page').then( m => m.HistorialPage)
  },
  {
    path: 'examenes',
    loadComponent: () => import('./examenes/examenes.page').then( m => m.ExamenesPage)
  },
  {
    path: 'procedimientos',
    loadComponent: () => import('./procedimientos/procedimientos.page').then( m => m.ProcedimientosPage)
  },
];
