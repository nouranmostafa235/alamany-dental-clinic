import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {AppointmentStepperService} from '../services/appointment-stepper-service';

export const appointmentStepsGuard: CanActivateFn = (route, state) => {
  const wizard = inject(AppointmentStepperService);
  const router = inject(Router);
  if (!wizard['isBrowser']) return true;
  const path = route.routeConfig?.path ?? '';
  const requestedStep = Number(path);

  const currentStep = wizard.getStep();
  if (requestedStep > currentStep) {
    router.navigate([`/book-appointment/${currentStep}`]);
    return false;
  }
  return true;
};
