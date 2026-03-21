import {Component, inject, signal} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {routeAnimation} from '../../router-animation';
import {LoadingScreen} from './shared-components/loading-screen/loading-screen';
import {BookNowSection} from './pages/home-pages/book-now-section/book-now-section';
import {LoadingOverlayService} from './services/loading-over-lay-service';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [routeAnimation]
})
export class App {
  private loadingOverlay = inject(LoadingOverlayService);
  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
  protected readonly title = signal('alamany-dental-clinic');
}
