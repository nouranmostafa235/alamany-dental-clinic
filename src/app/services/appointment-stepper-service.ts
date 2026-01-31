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
  private readonly APPOINTMENT_TYPE = 'appointment_type';
  private readonly APPOINTMENT_SERVICE = 'appointment_service';
  private readonly DOCTOR = 'appointment_doctor';
  private readonly DOCTOR_IMAGE = 'appointment_image';
  private readonly APPOINTMENT_TIME = 'appointment_time';
  private isBrowser: boolean = false;
  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }
  private defaultState: AppointmentSteps = { step: 1 };

  private get appointmentType(): any {
    if (!this.isBrowser) return 'online';
    const raw = sessionStorage.getItem(this.APPOINTMENT_TYPE);
    return raw ? JSON.parse(raw) : 'online';
  }
  private get appointmentTime(): any {
    if (!this.isBrowser) return '';
    const raw = sessionStorage.getItem(this.APPOINTMENT_TIME);
    return raw ? JSON.parse(raw) : '';
  }
  private get doctor(): any {
    if (!this.isBrowser) return '';
    const raw = sessionStorage.getItem(this.DOCTOR);
    return raw ? JSON.parse(raw) : '';
  }
  private get doctorImage(): any {
    if (!this.isBrowser) return '';
    const raw = sessionStorage.getItem(this.DOCTOR_IMAGE);
    return raw ? JSON.parse(raw) : '';
  }
  private get appointmentService(): any {
    if (!this.isBrowser) return '';
    const raw = sessionStorage.getItem(this.APPOINTMENT_SERVICE);
    return raw ? JSON.parse(raw) : '';
  }
  private get state(): AppointmentSteps {
    if (!this.isBrowser) return this.defaultState;
    const raw = sessionStorage.getItem(this.KEY);
    return raw ? JSON.parse(raw) : this.defaultState;
  }

  private set appointmentType(value: string) {
    if (!this.isBrowser) return;
    sessionStorage.setItem(this.APPOINTMENT_TYPE, JSON.stringify(value));
  }
  private set appointmentTime(time: string) {
    if (!this.isBrowser) return;
    sessionStorage.setItem(this.APPOINTMENT_TIME, JSON.stringify(time));
  }
  private set doctor(value: string) {
    if (!this.isBrowser) return;
    sessionStorage.setItem(this.DOCTOR, JSON.stringify(value));
  }
  private set doctorImage(value: string) {
    if (!this.isBrowser) return;
    sessionStorage.setItem(this.DOCTOR_IMAGE, JSON.stringify(value));
  }
  private set appointmentService(value: string) {
    if (!this.isBrowser) return;
    sessionStorage.setItem(this.APPOINTMENT_SERVICE, JSON.stringify(value));
  }
  private set state(value: AppointmentSteps) {
    if (!this.isBrowser) return;
    sessionStorage.setItem(this.KEY, JSON.stringify(value));
  }

  getAppointmentType(){
    return this.appointmentType;
  }
  getAppointmentService(): any {
    return this.appointmentService;
  }
  getDoctor(): any {
    return this.doctor;
  }
  getDoctorImage(): any {
    return this.doctorImage;
  }
  getStep(): number {
    return this.state.step;
  }
  getAppointmentTime(): string {
    return this.appointmentTime;
  }
  getAction(): string | undefined {
    return this.state.lastAction;
  }
  setType(value: string) {
    this.appointmentType = value;
  }
  setDoctor(doctor: string) {
    this.doctor = doctor;
  }
  setDoctorImage(doctorImage: string) {
    this.doctorImage = doctorImage;
  }
  setAppointmentTime(time: string) {
    this.appointmentTime = time;
  }
  setService(service: string) {
    this.appointmentService = service;
  }
  setStep(step: number) {
    this.state = {
      ...this.state,
      step : step
    }
  }
  next(action: string, step: number , changeAction = true) {
    if(changeAction) {
      this.state = {
        step: step ?? this.state.step + 1,
        lastAction: action
      };
    }
    else {
      this.state = {
        ...this.state,
        step: step ?? this.state.step + 1,
      };
    }

  }
  back() {
    this.state = {
      ...this.state,
      step: Math.max(1, this.state.step - 1)
    };
  }
  reset() {
    if (this.isBrowser) sessionStorage.removeItem(this.KEY);
  }
}
