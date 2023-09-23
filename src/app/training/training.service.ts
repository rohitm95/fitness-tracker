import { Injectable } from '@angular/core';
import { Exercise } from './exercise.model';
import { Subject, map, Subscription } from 'rxjs';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  exerciseChanged = new Subject<Exercise>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercises: Exercise[] = [];
  private runningExercise!: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercises() {
    this.fbSubs.push(
      this.db
        .collection('availableExercises')
        .snapshotChanges()
        .pipe(
          map((docArray) =>
            docArray.map((c) => {
              return {
                id: c.payload.doc.id,
                name: c.payload.doc.data()['name'],
                duration: c.payload.doc.data()['duration'],
                calories: c.payload.doc.data()['calories'],
              };
            })
          )
        )
        .subscribe({
          next(exercises: Exercise[]) {
            this.availableExercises = exercises;
            this.exercisesChanged.next([...this.availableExercises]);
          },
          // error(err) {
          //   // console.log(err);
          // },
        })
    );
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
    this.fbSubs.push(
      this.db
        .collection('finishedExercises')
        .valueChanges()
        .subscribe({
          next(exercises: Exercise[]) {
            this.finishedExercisesChanged.next(exercises);
          },
          // error(err) {},
        })
    );
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  cancelSubscriptions() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDatabase(exercise: Exercise) {
    this.db.collection('finishedExercises').add(exercise);
  }
}
