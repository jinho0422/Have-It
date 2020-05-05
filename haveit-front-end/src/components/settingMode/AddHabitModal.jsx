import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ButtonToolbar } from 'react-bootstrap';
import { habitChangeField, habitInitializeForm, habitRegister } from '../../modules/habit';

import AddHabitModalContents from './AddHabitModalContents';

import '../../lib/styles/style.css';

const AddHabitModal = ({ changeFlag }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, giveData, giveError } = useSelector(({ habit }) => ({
    form: habit.habitRegister,
    giveData: habit.giveData,
    giveError: habit.giveError,
  }));

  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, name } = e.target;
    dispatch(
      habitChangeField({
        form: 'habitRegister',
        key: name,
        value,
      })
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    // console.log(e)
    
    
    const { habitName, habitIconId } = form;

    dispatch(habitRegister({ habitName, habitIconId }));

    dispatch(
      habitChangeField({
        form: 'habitRegister',
        key: 'habitName',
        value: null
      })
    );

    dispatch(
      habitChangeField({
        form: 'habitRegister',
        key: 'habitIconId',
        value: null
      })
    );
    
    changeFlag();
  };

  useEffect(() => {
    dispatch(habitInitializeForm('habit'));
  }, [dispatch]);

  useEffect(() => {
      if (giveError) {
          setError('실패');
          return;
      }
  }, [giveError]);

  
  return(
      <ButtonToolbar>
          <AddHabitModalContents 
            type='habit' 
            form={form}
            onChange={onChange} 
            onSubmit={onSubmit} 
            error={error}/>
      </ButtonToolbar>
  );
}

export default AddHabitModal;