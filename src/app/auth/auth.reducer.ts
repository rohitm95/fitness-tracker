import { createReducer, on } from '@ngrx/store';
import { SET_AUTHENTICATED, SET_UNAUTHENTICATED } from './auth.actions';

export interface State {
  isAuthenticated: boolean;
}

export const initialState: State = {
  isAuthenticated: false,
};

export const authReducer = createReducer(
  initialState,
  on(SET_AUTHENTICATED, (state) => {
    return { isAuthenticated: true };
  }),
  on(SET_UNAUTHENTICATED, (state) => {
    return { isAuthenticated: false };
  })
);

export const getIsAuth = (state: State) => state.isAuthenticated;
