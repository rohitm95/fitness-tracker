import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { StopTrainingComponent } from './current-training/stop-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { TrainingComponent } from './training.component';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { SharedModule } from '../shared/shared.module';
import { TrainingRoutingModule } from './training-routing.module';

@NgModule({
  imports: [
    ReactiveFormsModule,
    AngularFirestoreModule,
    SharedModule,
    TrainingRoutingModule,
  ],
  exports: [],
  declarations: [
    StopTrainingComponent,
    NewTrainingComponent,
    CurrentTrainingComponent,
    PastTrainingComponent,
    TrainingComponent,
  ],
})
export class TrainingModule {}
