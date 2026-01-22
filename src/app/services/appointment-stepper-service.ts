import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {isPlatformBrowser} from '@angular/common';
import {Router} from '@angular/router';

export interface AppointmentSteps {
  step: number;
  lastAction?: string;
}
@Injectable({
  providedIn: 'root',
})
export class AppointmentStepperService {
  private readonly KEY = 'appointment_state';
  private isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) platformId: Object , private router: Router) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  private defaultState: AppointmentSteps = { step: 1 };

  private get state(): AppointmentSteps {
    if (!this.isBrowser) return this.defaultState;
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : this.defaultState;
  }

  private set state(value: AppointmentSteps) {
    if (!this.isBrowser) return;
    sessionStorage.setItem(this.KEY, JSON.stringify(value));
  }

  getStep(): number {
    return this.state.step;
  }

  getAction(): string | undefined {
    return this.state.lastAction;
  }
  setStep(step: number) {
    this.state = {
      ...this.state,
      step : step
    }
  }
  next(action: string, step: number) {
    this.state = {
      step: step ?? this.state.step + 1,
      lastAction: action
    };
  }
  back() {
    console.log(this.state.step)
    this.state = {
      ...this.state,
      step: Math.max(1, this.state.step - 1)
    };
  }
  reset() {
    if (this.isBrowser) sessionStorage.removeItem(this.KEY);
  }
}
