import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {routeAnimation} from '../../router-animation';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
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
