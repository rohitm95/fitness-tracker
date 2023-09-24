import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
  MAT_MOMENT_DATE_ADAPTER_OPTIONS,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import 'moment/locale/en-in';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'en-in' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class SignupComponent implements OnInit, OnDestroy {
  maxDate: any;
  isLoading = false;
  private loadingSubs: Subscription;

  constructor(
    @Inject(MAT_DATE_LOCALE) private _locale: string,
    private authService: AuthService,
    private uiService: UIService
  ) {}

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.maxDate = new Date();
    this.maxDate.setFullYear(this.maxDate.getFullYear() - 18);
  }

  ngOnDestroy(): void {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

  getDateFormatString(): string {
    return 'DD/MM/YYYY';
  }

  onSubmit(form: NgForm) {
    this.authService.registerUser({
      email: form.value.email,
      password: form.value.password,
    });
  }
}
