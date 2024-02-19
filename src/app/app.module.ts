import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MaterialModule } from './material.module';
import { WelcomeComponent } from './welcome/welcome.component';
import { HeaderComponent } from './navigation/header/header.component';
import { SidenavListComponent } from './navigation/sidenav-list/sidenav-list.component';
import { AuthModule } from './auth/auth.module';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { StoreModule } from '@ngrx/store';
import { reducers } from './app.reducer';

@NgModule({
  declarations: [
    AppComponent,
    WelcomeComponent,
    HeaderComponent,
    SidenavListComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    AuthModule,
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'ng-fitness-tracker-3d596',
        appId: '1:431799972321:web:d46c973aaa98d64533e2a0',
        storageBucket: 'ng-fitness-tracker-3d596.appspot.com',
        apiKey: 'AIzaSyAD9GYxS1Z54WOdgodbzIV_mAGz6jBEfqM',
        authDomain: 'ng-fitness-tracker-3d596.firebaseapp.com',
        messagingSenderId: '431799972321',
        measurementId: 'G-572YHGBN7E',
      })
    ),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    StoreModule.forRoot(reducers),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
