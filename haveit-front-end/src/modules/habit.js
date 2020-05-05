import { createAction, handleActions } from 'redux-actions';
import produce from 'immer';
import { takeLatest } from 'redux-saga/effects';
import createHabitSaga, { createHabitRequestActionTypes } from '../lib/createHabitSaga';
import * as habitAPI from '../lib/api/FrontQuery';

const HABIT_CHANGE_FIELD = 'habit/HABIT_CHANGE_FIELD';
const HABIT_INITIALIZE_FORM = 'habit/HABIT_INITIALIZE_FORM';

const [HABIT, HABIT_SUCCESS, HABIT_FAILURE] = createHabitRequestActionTypes(
  'habit/HABIT'
);

const [CHANGEHABIT, CHANGEHABIT_SUCCESS, CHANGEHABIT_FAILURE] = createHabitRequestActionTypes(
  'habit/CHANGEHABIT'
);


export const habitChangeField = createAction(
  HABIT_CHANGE_FIELD,
  ({ form, key, value }) => ({
    form, // test
    key, // habitName, habitIconId
    value // 실제 바꾸려는 값
  })
);

export const habitInitializeForm = createAction(HABIT_INITIALIZE_FORM, form => form); // test

export const habitRegister = createAction(HABIT, ({ habitName, habitIconId }) => ({
    habitName,
    habitIconId
}));

export const changeHabitName = createAction(CHANGEHABIT, ({ habitName, habitIconId, habitId }) => ({
  habitName,
  habitIconId,
  habitId
}))


const habitRegisterSaga = createHabitSaga(HABIT, habitAPI.postHabit);

const changeHabitNameSaga = createHabitSaga(CHANGEHABIT, habitAPI.changeHabitName);

export function* habitSaga() {
  yield takeLatest(HABIT, habitRegisterSaga);
  yield takeLatest(CHANGEHABIT, changeHabitNameSaga);
}


const initialState = {
  habitRegister: {
    habitName: '',
    habitIconId: '',
  },
  changeHabit: {
    habitName: '',
    habitIconId: '',
  },
  giveData: null,
  giveError: null,
};

const habit = handleActions(
  {
    [HABIT_CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
      produce(state, draft => {
        draft[form][key] = value; // 예: state.register.username을 바꾼다
      }),
    [HABIT_INITIALIZE_FORM]: (state, { payload: form }) => ({
      ...state,
      [form]: initialState[form],
      giveError: null // 폼 전환 시 회원 인증 에러 초기화
    }),
    // 회원가입 성공
    [HABIT_SUCCESS]: (state, { payload: giveData }) => ({
      ...state,
      giveError: null,
      giveData
    }),
    // 회원가입 실패
    [HABIT_FAILURE]: (state, { payload: error }) => ({
      ...state,
      giveError: error
    }),
    [CHANGEHABIT_SUCCESS]: (state, { payload: giveData }) => ({
      ...state,
      giveError: null,
      giveData
    }),
    [CHANGEHABIT_FAILURE]: (state, { payload: error }) => ({
      ...state,
      giveError: error
    }),
  },
  initialState
);

export default habit;
