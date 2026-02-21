import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [

  {
    path: 'doctor-profile/:id',
    renderMode: RenderMode.Server
  },
  {
    path: 'doctor-profile/:id/material',
    renderMode: RenderMode.Server
  },
  {
    path: 'doctor-profile/:id/office-hours',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];
