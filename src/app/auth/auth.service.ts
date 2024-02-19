import { Injectable, inject } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { Auth, authState, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  authChange = new Subject<boolean>();
  private isAuthenticated = false;
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);

  constructor(
    private router: Router,
    private trainingService: TrainingService,
    private uiService: UIService
  ) { }

  registerUser(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        this.uiService.loadingStateChanged.next(false);
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.uiService.loadingStateChanged.next(true);
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
        this.uiService.loadingStateChanged.next(false);
      })
      .catch((error) => {
        // console.log(error);
        if (
          error.message === 'Firebase: Error (auth/invalid-login-credentials).'
        ) {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar('Invalid login credentials', null, 3000);
        } else {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar(error.message, null, 3000);
        }
      });
  }

  logout() {
    signOut(this.auth);
  }

  isAuth() {
    return this.isAuthenticated;
  }

  initAuthListener() {
    this.authState$.subscribe((user) => {
      if (user) {
        this.isAuthenticated = true;
        this.authChange.next(true);
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.isAuthenticated = false;
        this.authChange.next(false);
        this.router.navigate(['/login']);
      }
    });
  }
}
