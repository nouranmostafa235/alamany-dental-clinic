import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import {DoctorsService} from '../../../services/doctors-service';
import {MatFormField, MatOption, MatSelect} from '@angular/material/select';
import {Specialization} from '../../../enums/specialization';
import {NgxMatTimepickerModule} from 'ngx-mat-timepicker';
import {MatInput} from '@angular/material/input';
import {MaterialCategory} from '../../../enums/material-category';
import {CroppedResult, ImageAdjuster} from '../../../shared-components/image-adjuster/image-adjuster';

@Component({
  selector: 'app-create-doctor',
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormField,
    MatSelect,
    MatOption,
    NgxMatTimepickerModule,
    MatInput,
    ImageAdjuster
  ],
  templateUrl: './create-doctor.html',
  styleUrl: './create-doctor.css',
})
export class CreateDoctor implements OnInit{
  steps = [
    'Personal Info',
    'Professional',
    'Certification',
    'Materials',
    'Office Hours'
  ];
  days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  specializationList = Object.values(Specialization);
  materialCategories = Object.values(MaterialCategory);
  showImageAdjuster = signal(false);
  picturePreview = signal<string | null>(null);

  rawImageSrc: string | null = null;
  currentStep = signal(0);

  progressPercentage = computed(() =>
    ((this.currentStep()+1) / this.steps.length) * 100
  );
  createDoctorForm: FormGroup
  doctorService = inject(DoctorsService);
  constructor(private fb: FormBuilder) {
    this.createDoctorForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl(''),
        phone: new FormControl(''),
        picture: new FormControl(),
      }),
      professionalInfo: this.fb.group({
        yearsOfExperience: new FormControl(''),
        specialization: this.fb.control([]),
        licenseNumber: new FormControl('DDS-1439856'),
        bio: new FormControl(''),
      }),
      certificates: this.fb.array([]),
      materials: this.fb.array([]),
      officeHours: this.fb.array([]),
    })
  }
  ngOnInit() {
    this.addCertificate();
    this.addMaterial();
    this.addOfficeHours()
  }
  isStepValid(): boolean {

    const key = Object.keys(this.createDoctorForm.controls)[this.currentStep()];

    const group = this.createDoctorForm.get(key) as FormGroup;

    group.markAllAsTouched();

    return group.valid;
  }
  nextStep() {
    console.log(this.isStepValid())
    if (this.isStepValid())
      this.currentStep.update(s => s + 1);
  }
  previousStep() {
    this.currentStep.update(s => s - 1);
  }
  createDoctor() {

    const formData = this.buildFormData();

    this.doctorService.createDoctor(formData).subscribe({
      next: res => console.log(res),
      error: err => console.error(err)
    });

  }
  onPictureChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;

    // Instead of setting directly, open the adjuster
    this.showImageAdjuster.set(true);

    // Pass raw file to adjuster via a temp src
    const reader = new FileReader();
    reader.onload = (e) => {
      this.rawImageSrc = e.target?.result as string;
    };
    reader.readAsDataURL(file);
    // const file = event.target.files[0];
    // this.createDoctorForm
    //   .get('personalInfo.picture')
    //   ?.setValue(file);
  }
  onImageCropped(result: CroppedResult) {
    // Set the cropped File into the form
    this.createDoctorForm
      .get('personalInfo.picture')
      ?.setValue(result.file);

    // Show preview
    this.picturePreview.set(result.base64);
    this.showImageAdjuster.set(false);
  }
  onCertificateFileChange(event: any, index: number) {
    const file = event.target.files[0];
    this.certificates.at(index)
      .get('certificateFile')
      ?.setValue(file);
  }
  onImageCancelled() {
    this.showImageAdjuster.set(false);
  }
  onMaterialFileChange(event: any, index: number) {
    const file = event.target.files[0];
    this.material.at(index)
      .get('material')
      ?.setValue(file);
  }
  createCertificate(): FormGroup {
    return this.fb.group({
      name: [''],
      issueDate: [''],
      certificateFile: [null]
    });
  }
  get certificates(): FormArray {
    return this.createDoctorForm.get('certificates') as FormArray;
  }
  addCertificate() {
    this.certificates.push(this.createCertificate());
  }
  removeCertificate(index: number) {
    this.certificates.removeAt(index);
  }
  createMaterial(): FormGroup {
    return this.fb.group({
      category: [''],
      brand: [''],
      material: [null]
    });
  }
  get material(): FormArray {
    return this.createDoctorForm.get('materials') as FormArray;
  }
  addMaterial() {
    this.material.push(this.createMaterial());
  }
  removeMaterial(index: number) {
    this.material.removeAt(index);
  }
  createOfficeHour(): FormGroup {
    return this.fb.group({
      day: [''],
      open: [''],
      close: ['']
    });
  }
  get officeHours(): FormArray {
    return this.createDoctorForm.get('officeHours') as FormArray;
  }
  addOfficeHours() {
    this.officeHours.push(this.createOfficeHour());
  }
  removeOfficeHour(index: number) {
    this.officeHours.removeAt(index);
  }
  buildFormData(): FormData {

    const formData = new FormData();

    const personal = this.createDoctorForm.value.personalInfo;
    const professional = this.createDoctorForm.value.professionalInfo;
    const certificates = this.createDoctorForm.value.certificates;
    const materials = this.createDoctorForm.value.materials;
    const officeHours = this.createDoctorForm.value.officeHours

    // Personal Info
    formData.append('firstName', personal.firstName);
    formData.append('lastName', personal.lastName);
    formData.append('email', personal.email);
    formData.append('phone', personal.phone);

    if (personal.picture)
      formData.append('picture', personal.picture);

    // Professional Info
    formData.append('licenseNumber', professional.licenseNumber);
    formData.append('bio', professional.bio);
    formData.append('yearsOfExperience', professional.yearsOfExperience);

    formData.append(
      'specialization',
      JSON.stringify(professional.specialization)
    );

    // Certificates
    certificates.forEach((cert: any, index : number) => {
      if (cert.certificateFile) {
        formData.append(
          `certificateData[${index}]`,
          JSON.stringify({ name: cert.name, issueDate: cert.issueDate })
        );
      }
    });

    certificates.forEach((cert: any) => {
      if (cert.certificateFile) {
        formData.append('certificates', cert.certificateFile);
      }
    });

    //material
    materials.forEach((mat: any, index: number) => {

        formData.append(
          `materialData[${index}]`,
          JSON.stringify({ category: mat.category, brand: mat.brand })
        );

    });

    materials.forEach((mat: any) => {
      if (mat.material) {
        formData.append('materials', mat.material);
      }
    });

    formData.append(
      'officeHours',
      JSON.stringify(
        officeHours.map((oh: any) => ({
          day: oh.day,
          open: oh.open,
          close: oh.close,
        }))
      )
    );
    return formData;
  }

}
