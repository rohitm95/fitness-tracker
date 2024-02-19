import { Injectable, inject } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subscription, Observable, from, take } from 'rxjs';
import { UIService } from '../shared/ui.service';
import {
  CollectionReference,
  Firestore,
  addDoc,
  collection,
  collectionData,
  getDocs,
} from '@angular/fire/firestore';
import * as fromTraining from './training.reducer';
import { Store } from '@ngrx/store';
import { START_LOADING, STOP_LOADING } from '../shared/ui.actions';
import {
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING,
} from './training.actions';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private fbSubs: Subscription[] = [];
  firestore: Firestore = inject(Firestore);
  finishedExercisesCollection: CollectionReference;

  constructor(
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {
    this.finishedExercisesCollection = collection(
      this.firestore,
      'finishedExercises'
    );
  }

  fetchAvailableExercises() {
    this.store.dispatch(START_LOADING());
    const availableExercisesCollection = from(
      getDocs(collection(this.firestore, 'availableExercises'))
    );
    availableExercisesCollection.subscribe(
      (querySnapshot) => {
        let docs = querySnapshot.docs;
        this.availableExercises = docs.map((doc) => {
          return {
            id: doc.id,
            name: doc.data()['name'],
            duration: doc.data()['duration'],
            calories: doc.data()['calories'],
          };
        });
        this.store.dispatch(STOP_LOADING());
        this.store.dispatch(
          SET_AVAILABLE_TRAININGS({ payload: this.availableExercises })
        );
      },
      (error) => {
        this.store.dispatch(STOP_LOADING());
        this.uiService.showSnackbar(
          'Failed to fetch the exercises, please try again later..',
          null,
          3000
        );
      }
    );
  }

  startExercise(selectedId: string) {
    this.store.dispatch(START_TRAINING({ payload: selectedId }));
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((exercise) => {
        this.addDataToDatabase({
          ...exercise,
          date: new Date().getTime(),
          state: 'completed',
        });
        this.store.dispatch(STOP_TRAINING());
      });
  }

  cancelExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveTraining)
      .pipe(take(1))
      .subscribe((exercise) => {
        this.addDataToDatabase({
          ...exercise,
          duration: exercise.duration * (progress / 100),
          calories: exercise.calories * (progress / 100),
          date: new Date().getTime(),
          state: 'cancelled',
        });
        this.store.dispatch(STOP_TRAINING());
      });
  }

  fetchCompletedOrCancelledExercises() {
    let finishedExercisesResult = collectionData(
      this.finishedExercisesCollection
    ) as Observable<Exercise[]>;
    finishedExercisesResult.subscribe((exercises: Exercise[]) => {
      this.store.dispatch(SET_FINISHED_TRAININGS({ payload: exercises }));
    });
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    addDoc(this.finishedExercisesCollection, exercise);
  }
}
