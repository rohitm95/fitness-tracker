import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from '../auth.service';
import { UIService } from 'src/app/shared/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });
  hide = true;
  isLoading = false;
  private loadingSubs: Subscription;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private uiService: UIService
  ) {}

  ngOnInit(): void {
    this.loadingSubs = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  ngOnDestroy(): void {
    if (this.loadingSubs) {
      this.loadingSubs.unsubscribe();
    }
  }

  get controls() {
    return this.loginForm.controls;
  }

  login(formData: FormGroup) {
    this.authService.login({
      email: formData.value.email,
      password: formData.value.password,
    });
  }
}
