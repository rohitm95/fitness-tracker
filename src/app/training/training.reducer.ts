import {
  createFeatureSelector,
  createReducer,
  createSelector,
  on,
} from '@ngrx/store';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';
import {
  SET_AVAILABLE_TRAININGS,
  SET_FINISHED_TRAININGS,
  START_TRAINING,
  STOP_TRAINING,
} from './training.actions';

export interface TrainingState {
  availableExercises: Exercise[];
  finishedExercises: Exercise[];
  activeTraining: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

export const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null,
};

export const trainingReducer = createReducer(
  initialState,
  on(SET_AVAILABLE_TRAININGS, (state, { payload }) => ({
    ...state,
    availableExercises: payload,
  })),
  on(SET_FINISHED_TRAININGS, (state, { payload }) => ({
    ...state,
    finishedExercises: payload,
  })),
  on(START_TRAINING, (state, { payload }) => ({
    ...state,
    activeTraining: {
      ...state.availableExercises.find((ex) => ex.id === payload),
    },
  })),
  on(STOP_TRAINING, (state) => ({ ...state, activeTraining: null }))
);

export const getTrainingState =
  createFeatureSelector<TrainingState>('training');

export const getAvavilableExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.availableExercises
);
export const getFinishedExercises = createSelector(
  getTrainingState,
  (state: TrainingState) => state.finishedExercises
);
export const getActiveTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining
);
export const getIsTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining != null
);
