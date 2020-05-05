import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonToolbar } from 'react-bootstrap';
import { habitChangeField, habitInitializeForm, changeHabitName } from '../../modules/habit';

import EditHabitModalContents from './EditHabitModalContents';

import '../../lib/styles/style.css';

const EditHabitModal = ({ icon, habitId, habitName, changeFlag, changeSettingPageFlag }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, giveData, giveError } = useSelector(({ habit }) => ({
    form: habit.changeHabit,
    giveData: habit.giveData,
    giveError: habit.giveError,
  }));

  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    // console.log(value)
    // console.log(name)
    dispatch(
      habitChangeField({
        form: 'changeHabit',
        key: name,
        value,
      })
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    
    const { habitName, habitIconId } = form;

    dispatch(changeHabitName({ habitName, habitIconId, habitId }));

    dispatch(
      habitChangeField({
        form: 'changeHabit',
        key: 'habitName',
        value: null
      })
    );

    dispatch(
      habitChangeField({
        form: 'changeHabit',
        key: 'habitIconId',
        value: null
      })
    );
    
    changeFlag();
    changeSettingPageFlag();
  };

  useEffect(() => {
    dispatch(habitInitializeForm('changeHabit'));
  }, [dispatch]);

  useEffect(() => {
      if (giveError) {
          setError('실패');
          return;
      }
  }, [giveError]);

  
  return(
      <ButtonToolbar>
        <EditHabitModalContents 
          type='changeHabit' 
          form={form}
          onChange={onChange} 
          onSubmit={onSubmit} 
          error={error}
          icon={icon}
          habitId={habitId}
          habitName={habitName}/>
      </ButtonToolbar>
  );
}

export default EditHabitModal;