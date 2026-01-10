import {computed, Injectable, signal} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  private counter = signal(0);

  // derived signal: isLoading = true if any request is ongoing
  isLoading = computed(() => this.counter() > 0);

  // show increments counter
  show() {
    this.counter.update(v => v + 1);
  }

  // hide decrements counter safely
  hide() {
    this.counter.update(v => Math.max(0, v - 1));
  }
}
