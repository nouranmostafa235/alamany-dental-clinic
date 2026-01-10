import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {routeAnimation} from '../../router-animation';
import {LoadingScreen} from './shared-components/loading-screen/loading-screen';
import {BookNowSection} from './home-page/book-now-section/book-now-section';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoadingScreen],
  templateUrl: './app.html',
  styleUrl: './app.css',
  animations: [routeAnimation]
})
export class App {

  prepareRoute(outlet: RouterOutlet) {
    return outlet?.activatedRouteData?.['animation'];
  }
  protected readonly title = signal('alamany-dental-clinic');
}
