import {Component, inject, Inject, OnInit, PLATFORM_ID} from '@angular/core';
import {DoctorInfoSection} from '../doctor-info-section/doctor-info-section';
import {Footer} from '../../../shared-components/footer/footer';
import {ActivatedRoute, Router, RouterLink, RouterLinkActive, RouterOutlet} from '@angular/router';
import {DoctorReview} from '../doctor-review/doctor-review';
import {DoctorsService} from '../../../services/doctors-service';
import {isPlatformBrowser, Location} from '@angular/common';

@Component({
  selector: 'app-doctor-profile',
  imports: [
    DoctorInfoSection,
    Footer,
    RouterLink,
    RouterOutlet,
    RouterLinkActive,
    DoctorReview
  ],
  templateUrl: './doctor-profile.html',
  styleUrl: './doctor-profile.css',
})
export class DoctorProfile implements OnInit {
  doctorId: string|null = null;
  doctorData: any
  private location = inject(Location);
  private returnUrl: any;

  constructor(private route: ActivatedRoute, private doctorService: DoctorsService,
              @Inject(PLATFORM_ID) private platformId: Object,
              private router: Router) {}

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    const navigation = this.router.getCurrentNavigation();
    this.returnUrl = navigation?.extras.state?.['returnUrl'] || '/';
    this.route.paramMap.subscribe(params => {
      this.doctorId = params.get('id');
      this.getDoctorById(params.get('id'));
    });
  }
  getDoctorById(id:any){
    this.doctorService.getDoctorById(id).subscribe({
      next: data => {
        this.doctorData = data.data.profile;
        this.doctorService.setDoctorData(this.doctorData);
      }
    })
  }
  goBack() {
    this.router.navigateByUrl(this.returnUrl);
  }
}
