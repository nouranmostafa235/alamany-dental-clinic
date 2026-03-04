import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [

  // ✅ Safe to prerender — fully static, no API/auth needed
  { path: 'home',         renderMode: RenderMode.Prerender },
  { path: 'login',        renderMode: RenderMode.Prerender },
  { path: 'blog-posts',   renderMode: RenderMode.Prerender },
  { path: 'verify-email', renderMode: RenderMode.Prerender },

  // 🔄 Dynamic — SSR on request (has :id param)
  { path: 'doctor-profile/:id',                renderMode: RenderMode.Server },
  { path: 'doctor-profile/:id/material',       renderMode: RenderMode.Server },
  { path: 'doctor-profile/:id/office-hours',   renderMode: RenderMode.Server },
  { path: 'doctor-profile/:id/previous-cases', renderMode: RenderMode.Server },

  // 🔐 Auth-protected admin — SSR on request
  { path: 'admin',                              renderMode: RenderMode.Server },
  { path: 'admin/doctors',                      renderMode: RenderMode.Server },
  { path: 'admin/patients',                     renderMode: RenderMode.Server },
  { path: 'admin/appointments',                 renderMode: RenderMode.Server },
  { path: 'admin/appointments/confirmed',       renderMode: RenderMode.Server },
  { path: 'admin/appointments/cancelled',       renderMode: RenderMode.Server },
  { path: 'admin/appointments/pending',         renderMode: RenderMode.Server },
  { path: 'admin/blog-posts',                   renderMode: RenderMode.Server },
  { path: 'admin/services-management',          renderMode: RenderMode.Server },
  { path: 'admin/messages-management',          renderMode: RenderMode.Server },

  // 📅 Booking flow — API-dependent, SSR on request
  { path: 'book-appointment',   renderMode: RenderMode.Server },
  { path: 'book-appointment/1', renderMode: RenderMode.Server },
  { path: 'book-appointment/2', renderMode: RenderMode.Server },
  { path: 'book-appointment/3', renderMode: RenderMode.Server },
  { path: 'book-appointment/4', renderMode: RenderMode.Server },
  { path: 'book-appointment/5', renderMode: RenderMode.Server },

  // 📝 Other dynamic pages
  { path: 'sign-up',      renderMode: RenderMode.Server },
  { path: 'patient-info', renderMode: RenderMode.Server },

  // ⚠️ Fallback — MUST be Server, not Prerender
  { path: '**',           renderMode: RenderMode.Server },
];
