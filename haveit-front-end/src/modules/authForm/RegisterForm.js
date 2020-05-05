import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { changeField, initializeForm, register } from '../../modules/auth';
import AuthForm from '../../components/auth/AuthForm';
import { check } from '../../modules/user';
import { withRouter } from 'react-router-dom';

const RegisterForm = ({ history }) => {
  const [error, setError] = useState(null);
  const dispatch = useDispatch();
  const { form, auth, authError, user } = useSelector(({ auth, user }) => ({
    form: auth.register,
    auth: auth.auth,
    authError: auth.authError,
    user: user.user
  }));
  // 인풋 변경 이벤트 핸들러
  const onChange = e => {
    const { value, id } = e.target;
    dispatch(
      changeField({
        form: 'register',
        key: id,
        value
      }),
    );
  };

  // 폼 등록 이벤트 핸들러
  const onSubmit = e => {
    e.preventDefault();
    const { userName, password, passwordConfirm, email, nickName } = form;
    // 하나라도 비어있다면
    if ([userName, password, passwordConfirm, email, nickName].includes('')) {
      setError('빈 칸을 모두 입력하세요.');
      return;
    }
    // userName 4~15자 설정
    if (userName.length < 4 || userName.length > 16) {
      setError('아이디는 4자 이상 15자 이하여야 합니다.')
      return;
    }
    // 이메일 형식 검증
    if (email.indexOf('@') === -1 || email.indexOf('.') === -1) {
      setError('이메일 형식이 올바르지 않습니다.')
      return;
    }
    // 비밀번호가 일치하지 않는다면
    if (password !== passwordConfirm) {
      setError('비밀번호가 일치하지 않습니다.');
      dispatch(changeField({ form: 'register', key: 'password', value: '' }));
      dispatch(
        changeField({ form: 'register', key: 'passwordConfirm', value: '' }),
      );
      return;
    }
    dispatch(register({ userName, password, email, nickName }));
  };

  // 컴포넌트가 처음 렌더링 될 때 form 을 초기화함
  useEffect(() => {
    dispatch(initializeForm('register'));
  }, [dispatch]);

  // 회원가입 성공 / 실패 처리
  useEffect(() => {
    if (authError) {
      // 계정명이 이미 존재할 때
      if (authError.response.status === 400) {
        // setError('이미 존재하는 계정명입니다.');
        setError(authError.response.data.message);
        return;
      }
      // 기타 이유
      setError('회원가입 실패');
      return;
    }

    if (auth) {
      // console.log('회원가입 성공');
      // console.log(auth);
      dispatch(check());
      // console.log(user)
    }
  }, [auth, authError, dispatch]);

  // user 값이 잘 설정되었는지 확인
  useEffect(() => {
    if (user) {
      // console.log(user)
      history.push('/main'); // 홈 화면으로 이동
      try {
        window.sessionStorage.setItem('user', user.user.userName);
      } catch (e) {
        console.log('sessionStorage is not working');
      }
    }
  }, [history, user]);

  return (
    <AuthForm
      type="register"
      form={form}
      onChange={onChange}
      onSubmit={onSubmit}
      error={error}
    />
  );
};

export default withRouter(RegisterForm);