import {Component, inject} from '@angular/core';
import {LoadingService} from '../../services/loading-service';

@Component({
  selector: 'app-loading-screen',
  imports: [],
  templateUrl: './loading-screen.html',
  styleUrl: './loading-screen.css',
})
export class LoadingScreen {
  loading= inject(LoadingService);
  constructor(private loadingService:LoadingService) {
    console.log(this.loading)
  }

}
