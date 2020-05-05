import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import auth, { authSaga } from './auth';
import loading from './loading';
import user, { userSaga } from './user';
import habit, { habitSaga } from './habit';

const rootReducer = combineReducers({
  auth,
  loading,
  user,
  habit,
});

export function* rootSaga() {
  yield all([authSaga(), userSaga(), habitSaga()]);
}

export default rootReducer;
