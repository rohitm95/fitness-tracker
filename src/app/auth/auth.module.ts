import { NgModule } from '@angular/core';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    SharedModule,
    AuthRoutingModule,
  ],
  exports: [],
  declarations: [LoginComponent, SignupComponent],
})
export class AuthModule {}
