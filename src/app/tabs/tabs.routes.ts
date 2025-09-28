import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'tab1',
        loadComponent: () =>
          import('../tab1/tab1.page').then((m) => m.Tab1Page),
      },
      {
        path: 'tab5',
        loadComponent: () => 
          import('../tab5/tab5.page').then((m) => m.Tab5Page),
      },
      {
        path: 'tab6',
        loadComponent: () => 
          import('../tab6/tab6.page').then((m) => m.Tab6Page),
      },
      {
        path: '',
        redirectTo: 'tab1',
        pathMatch: 'full',
      },
    ],
  },
];
