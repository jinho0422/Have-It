import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { changeField, initializeForm, login } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../modules/user';

const LoginForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.login,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user,
  }));
  
  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, id } = e.target;
    dispatch(
      changeField({
        form: 'login',
        key: id,
        value,
      }),
      );
    };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const { userName, password } = form;
    dispatch(login({ userName, password }));
  };

  // 컴포넌트가 처음 렌더링 될 때 form 을 초기화함
  useEffect(() => {
    dispatch(initializeForm('login'));
    dispatch(check());
    if (user) {
      // console.log(user)
      history.push('/main');
      try {
        window.sessionStorage.setItem('user', user.user.userName);
        // window.sessionStorage.setItem('dolls', user.user.dolls);
        // console.log(user.user.dolls)
        // dollId 와 dollName 저장
        let dollLength = 0;
        for (let doll of user.user.dolls) {
          // console.log(doll)
          // console.log(dollLength)
          window.sessionStorage.setItem('dollId'+dollLength, doll.id);
          window.sessionStorage.setItem('dollId'+dollLength+'Name', doll.dollName);
          ++dollLength
        } 
        window.sessionStorage.setItem('dollLength', dollLength);
      } catch (e) {
        console.log('sessionStorage is not working');
      }
    }
  }, [dispatch, history, user]);

  useEffect(() => {
    if (authError) {
      // console.log('오류 발생');
      // console.log(authError);
      setError('로그인 실패');
      return;
    }
    
    if (auth) {
      // console.log(user)
      // console.log('로그인 성공');
      // console.log(auth)
      dispatch(check());
    }
  }, [auth, authError, dispatch]);

  useEffect(() => {
    if (user) {
      // console.log(user)
      history.push('/main');
      try {
        window.sessionStorage.setItem('user', user.user.userName);
        // window.sessionStorage.setItem('dolls', user.user.dolls);
        // console.log(user.user.dolls)
        // dollId 와 dollName 저장
        let dollLength = 0;
        for (let doll of user.user.dolls) {
          // console.log(doll)
          // console.log(dollLength)
          window.sessionStorage.setItem('dollId'+dollLength, doll.id);
          window.sessionStorage.setItem('dollId'+dollLength+'Name', doll.dollName);
          ++dollLength
        } 
        window.sessionStorage.setItem('dollLength', dollLength);
      } catch (e) {
        console.log('sessionStorage is not working');
      }
    }
  }, [history, user]);

  return (
    <AuthForm
      type="login"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default withRouter(LoginForm);