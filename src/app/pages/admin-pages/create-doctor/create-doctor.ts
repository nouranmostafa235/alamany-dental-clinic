import {Component, computed, Inject, inject, OnInit, signal} from '@angular/core';
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
import {CropResult, ImageAdjuster, ImageAdjusterResult} from '../../../shared-components/image-adjuster/image-adjuster';
import {ImagesAdjust} from '../../../services/images-adjust';
import {BlogPostEnum} from '../../../enums/blog-post-enum';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ToastrService} from 'ngx-toastr';


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
    ImageAdjuster,

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
    'Office Hours',
    'Previous Cases'
  ];
  prevCaseCategory = Object.values(BlogPostEnum)
  days = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  specializationList = Object.values(Specialization);
  materialCategories = Object.values(MaterialCategory);
  pictureOriginalPreview = signal<string | null>(null);  // full original
  pictureCroppedPreview  = signal<string | null>(null);  // cropped square
  avatarPreviewUrl = signal<string | null>(null);
  cropResult = signal<CropResult | null>(null);
  showImageAdjuster = signal(false);
  picturePreview = signal<string | null>(null);
  rawImageSrc: string | null = null;
  currentStep = signal(0);
  isEditMode = false;
  private doctorImages = inject(ImagesAdjust);
  progressPercentage = computed(() =>
    ((this.currentStep()+1) / this.steps.length) * 100
  );
  createDoctorForm: FormGroup
  doctorService = inject(DoctorsService);
  constructor(private fb: FormBuilder,private dialogRef: MatDialogRef<CreateDoctor>,
              @Inject(MAT_DIALOG_DATA) public data: any,private toaster: ToastrService) {
    this.createDoctorForm = this.fb.group({
      personalInfo: this.fb.group({
        firstName: new FormControl('',Validators.required),
        lastName: new FormControl('',Validators.required),
        email: new FormControl('',Validators.required),
        phone: new FormControl('',Validators.required),
        picture: new FormControl(),
      }),
      professionalInfo: this.fb.group({
        yearsOfExperience: new FormControl(''),
        specialization: this.fb.control([]),
        licenseNumber: new FormControl('', Validators.required),
        bio: new FormControl('',Validators.required),
      }),
      certificates: this.fb.array([]),
      materials: this.fb.array([]),
      officeHours: this.fb.array([],Validators.required),
      previousCases: this.fb.array([])
    })
  }
  ngOnInit() {
    if (this.data?.mode === 'edit') {
      this.isEditMode = true;
     this.patchForm(this.data?.service)
    }
    else {
      this.addCertificate();
      this.addMaterial();
      this.addOfficeHours();
      this.addPrevCase()
    }

  }
  isStepValid(): boolean {

    const key = Object.keys(this.createDoctorForm.controls)[this.currentStep()];

    const group = this.createDoctorForm.get(key) as FormGroup;

    group.markAllAsTouched();

    return group.valid;
  }
  nextStep() {
    if (this.isStepValid())
      this.currentStep.update(s => s + 1);
  }
  previousStep() {
    this.currentStep.update(s => s - 1);
  }
  createDoctor() {
    const formData = this.buildFormData();
    if(this.isEditMode){
      this.doctorService.updateDoctor(this.data.service._id,formData).subscribe({
        next: res => {
          this.dialogRef.close(true)
          this.toaster.success('Doctor updated successfully!', 'Success');
        },
        error: err =>{
          // this.toaster.success('Failed to update doctor. Please try again.', 'Error');
          this.dialogRef.close(true)
        }
      });
    }
  else {
      this.doctorService.createDoctor(formData).subscribe({
        next: res => {
          this.dialogRef.close(true)
          this.toaster.success('Doctor added successfully!', 'Success');
        },
        error: err =>{
          // this.toaster.success('Failed to add doctor. Please try again.', 'Error');
          this.dialogRef.close(true)
        }
      });
    }

  }
  // onPictureChange(event: any) {
  //   const file = event.target.files[0];
  //   if (!file) return;
  //
  //   // Instead of setting directly, open the adjuster
  //   this.showImageAdjuster.set(true);
  //
  //   // Pass raw file to adjuster via a temp src
  //   const reader = new FileReader();
  //   reader.onload = (e) => {
  //     this.rawImageSrc = e.target?.result as string;
  //   };
  //   reader.readAsDataURL(file);
  //   // const file = event.target.files[0];
  //   // this.createDoctorForm
  //   //   .get('personalInfo.picture')
  //   //   ?.setValue(file);
  // }
  onImageCropped(result: CropResult) {
    this.cropResult.set(result);
    this.avatarPreviewUrl.set(result.croppedPreviewUrl);
    // 1. Store original File in form → will be sent to API
    this.createDoctorForm
      .get('personalInfo.picture')
      ?.setValue(result.originalFile);

    // // 2. Store previews for display
    // this.doctorImages.setImages({
    //   originalFile:   result.originalFile,
    //   originalBase64: result.originalBase64,
    //   croppedBase64:  result.croppedBase64,
    //   croppedBlob:    result.croppedBlob,
    // });
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
  onBeforeCaseFileChange(event: any, index: number) {
    const file = event.target.files[0];
    this.prevCase.at(index)
      .get('beforePhoto')
      ?.setValue(file);
  }
  onAfterCaseFileChange(event: any, index: number) {
    const file = event.target.files[0];
    this.prevCase.at(index)
      .get('afterPhoto')
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
  createPrevCase(): FormGroup {
    return this.fb.group({
      beforePhoto: [null],
      afterPhoto: [null],
      title: [''],
      treatmentType:['']

    });
  }
  get prevCase(): FormArray {
    return this.createDoctorForm.get('previousCases') as FormArray;
  }
  addPrevCase() {
    this.prevCase.push(this.createPrevCase());
  }
  removePrevCase(index: number) {
    this.prevCase.removeAt(index);
  }
  buildFormData(): FormData {

    const formData = new FormData();

    const personal = this.createDoctorForm.value.personalInfo;
    const professional = this.createDoctorForm.value.professionalInfo;
    const certificates = this.createDoctorForm.value.certificates;
    const materials = this.createDoctorForm.value.materials;
    const officeHours = this.createDoctorForm.value.officeHours;
    const prevCase = this.createDoctorForm.value.previousCases

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
    prevCase.forEach((prev: any, index : number) => {
      if (prev.beforePhoto || prev.afterPhoto) {
        formData.append(
          `caseData[${index}]`,
          JSON.stringify({ title: prev.title, treatmentType: prev.treatmentType })
        );
      }
    });

    prevCase.forEach((prev: any) => {
      if (prev.beforePhoto) {
        formData.append('beforePhoto', prev.beforePhoto);
      }
    });
    prevCase.forEach((prev: any) => {
      if (prev.afterPhoto) {
        formData.append('afterPhoto', prev.afterPhoto);
      }
    });
    return formData;
  }
  patchForm(doctor: any) {
    // ── Personal Info ──────────────────────────────────────
    this.createDoctorForm.get('personalInfo')?.patchValue({
      firstName: doctor.firstName,
      lastName:  doctor.lastName,
      email:     doctor.email,
      phone:     doctor.phone,
    });

    // Show existing avatar
    if (doctor.picture) {
      this.avatarPreviewUrl.set(doctor.picture);
    }

    // ── Professional Info ──────────────────────────────────
    this.createDoctorForm.get('professionalInfo')?.patchValue({
      bio:               doctor.bio,
      specialization:    doctor.specialization ?? [],
      licenseNumber:     doctor.licenseNumber,
      yearsOfExperience: doctor.yearsOfExperience,
    });

    // ── Certificates ───────────────────────────────────────
    if (doctor.certificates?.length) {
      this.certificates.clear();
      doctor.certificates.forEach((cert: any) => {
        this.certificates.push(this.fb.group({
          name:            [cert.name],
          issueDate:       [cert.issueDate],
          certificateFile: [null]   // can't prefill file inputs
        }));
      });
    }

    // ── Materials ──────────────────────────────────────────
    if (doctor.materials?.length) {
      this.material.clear();
      doctor.materials.forEach((mat: any) => {
        this.material.push(this.fb.group({
          category: [mat.category],
          brand:    [mat.brand],
          material: [null]
        }));
      });
    }

    // ── Office Hours ───────────────────────────────────────
    if (doctor.officeHours?.length) {
      this.officeHours.clear();
      doctor.officeHours.forEach((oh: any) => {
        this.officeHours.push(this.fb.group({
          day:   [oh.day],
          open:  [oh.open],
          close: [oh.close]
        }));
      });
    }

    // ── Previous Cases ─────────────────────────────────────
    if (doctor.previousCases?.length) {
      this.prevCase.clear();
      doctor.previousCases.forEach((c: any) => {
        this.prevCase.push(this.fb.group({
          beforePhoto:   [null],
          afterPhoto:    [null],
          title:         [c.title],
          treatmentType: [c.treatmentType]
        }));
      });
    }
  }
}
