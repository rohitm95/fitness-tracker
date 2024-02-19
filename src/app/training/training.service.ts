import { Injectable, inject } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject, Subscription, Observable, from } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { CollectionReference, Firestore, addDoc, collection, collectionData, getDocs } from '@angular/fire/firestore';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise!: Exercise;
  private fbSubs: Subscription[] = [];
  firestore: Firestore = inject(Firestore);
  finishedExercisesCollection: CollectionReference

  constructor(private uiService: UIService) {
    this.finishedExercisesCollection = collection(this.firestore, 'finishedExercises')
  }

  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    const availableExercisesCollection = from(getDocs(collection(this.firestore, 'availableExercises')));
    availableExercisesCollection
      .subscribe(
        (querySnapshot) => {
          let docs = querySnapshot.docs
          this.availableExercises = docs.map((doc) => {
            return {
              id: doc.id,
              name: doc.data()['name'],
              duration: doc.data()['duration'],
              calories: doc.data()['calories'],
            }
          })
          this.uiService.loadingStateChanged.next(false);
          this.exercisesChanged.next([...this.availableExercises]);
        },
        (error) => {
          this.uiService.loadingStateChanged.next(false);
          this.uiService.showSnackbar(
            'Failed to fetch the exercises, please try again later..',
            null,
            3000
          );
          this.exercisesChanged.next(null);
        }
      )
  }

  startExercise(selectedId: string) {
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date().getTime()})
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.exerciseChanged.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDataToDatabase({
      ...this.runningExercise,
      date: new Date().getTime(),
      state: 'completed',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  cancelExercise(progress: number) {
    this.addDataToDatabase({
      ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled',
    });
    this.runningExercise = null;
    this.exerciseChanged.next(null);
  }

  fetchCompletedOrCancelledExercises() {
    let finishedExercisesResult = collectionData(this.finishedExercisesCollection) as Observable<Exercise[]>;
    finishedExercisesResult
      .subscribe((exercises: Exercise[]) => {
        this.finishedExercisesChanged.next(exercises);
      })
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    addDoc(this.finishedExercisesCollection, exercise);
  }
}
