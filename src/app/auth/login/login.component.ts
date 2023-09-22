import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup = new FormGroup({
    email: new FormControl(''),
    password: new FormControl('')
  })
  hide = true;

  constructor(
    fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  get controls() {
    return this.loginForm.controls;
  }

  login(formData: FormGroup) {
    this.authService.login({
      email: formData.value.email,
      password: formData.value.password
    })
  }

}
