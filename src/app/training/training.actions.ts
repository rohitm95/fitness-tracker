import { createAction, props } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLE_TRAININGS = createAction(
  '[Training] Set Available Trainings',
  props<{ payload: Exercise[] }>()
);
export const SET_FINISHED_TRAININGS = createAction(
  '[Training] Set Finished Trainings',
  props<{ payload: Exercise[] }>()
);
export const START_TRAINING = createAction(
  '[Training] Start Training',
  props<{ payload: string }>()
);
export const STOP_TRAINING = createAction('[Training] Stop Training');
