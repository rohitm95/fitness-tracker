import { Injectable, inject } from '@angular/core';
import { AuthData } from './auth-data.model';
import { Router } from '@angular/router';
import {
  Auth,
  authState,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from '@angular/fire/auth';
import { TrainingService } from '../training/training.service';
import { UIService } from '../shared/ui.service';
import { Store } from '@ngrx/store';
import * as fromRoot from '../app.reducer';
import { START_LOADING, STOP_LOADING } from '../shared/ui.actions';
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED } from './auth.actions';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth: Auth = inject(Auth);
  authState$ = authState(this.auth);

  constructor(
    private router: Router,
    private trainingService: TrainingService,
    private uiService: UIService,
    private store: Store<fromRoot.State>
  ) {}

  registerUser(authData: AuthData) {
    this.store.dispatch(START_LOADING());
    createUserWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
        this.store.dispatch(STOP_LOADING());
      })
      .catch((error) => {
        this.store.dispatch(STOP_LOADING());
        this.uiService.showSnackbar(error.message, null, 3000);
      });
  }

  login(authData: AuthData) {
    this.store.dispatch(START_LOADING());
    signInWithEmailAndPassword(this.auth, authData.email, authData.password)
      .then((result) => {
        this.store.dispatch(STOP_LOADING());
      })
      .catch((error) => {
        // console.log(error);
        if (
          error.message === 'Firebase: Error (auth/invalid-login-credentials).'
        ) {
          this.store.dispatch(STOP_LOADING());
          this.uiService.showSnackbar('Invalid login credentials', null, 3000);
        } else {
          this.store.dispatch(STOP_LOADING());
          this.uiService.showSnackbar(error.message, null, 3000);
        }
      });
  }

  logout() {
    signOut(this.auth);
  }

  initAuthListener() {
    this.authState$.subscribe((user) => {
      if (user) {
        this.store.dispatch(SET_AUTHENTICATED());
        this.router.navigate(['/training']);
      } else {
        this.trainingService.cancelSubscriptions();
        this.store.dispatch(SET_UNAUTHENTICATED());
        this.router.navigate(['/login']);
      }
    });
  }
}
