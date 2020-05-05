import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Button from '../settingMode/Button';

/**
 * 템블릿 적용
 */

import { makeStyles } from "@material-ui/core/styles";

import styles from "./loginPageUi.js";
import GridContainer from "../grid/GridContainer.js";
import GridItem from "../grid/GridItem.js";
import Card from "../Card/Card.js";
import CardBody from "../Card/CardBody.js";
import CardHeader from "../Card/CardHeader.js";
import CardFooter from "../Card/CardFooter.js";
import CustomInput from "../CustomInput/CustomInput.js";



/**
 * 폼 하단에 로그인 혹은 회원가입 링크를 보여줌
 */
// const Footer = styled.div`
//   margin-top: 2rem;
//   text-align: right;
//   a {
//     color: ${palette.gray[6]};
//     text-decoration: underline;
//     &:hover {
//       color: ${palette.gray[9]};
//     }
//   }
// `;

const ButtonWithMarginTop = styled(Button)`
  margin-top: 1rem;
`;

const textMap = {
  login: '로그인',
  register: '회원가입'
};

/*
 * 에러를 보여줍니다
 */
const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.675rem;
  margin-top: 1rem;
`;


const useStyles = makeStyles(styles);

const AuthForm = ({ type, form, onChange, onSubmit, error }) => {
  const [cardAnimaton, setCardAnimation] = React.useState("cardHidden");
  setTimeout(function () {
    setCardAnimation("");
  }, 700);
  const text = textMap[type];
  const classes = useStyles();
  return (
    <div>
      <div
        className={classes.pageHeader}
        id={"bg-img"}
        // style={{
        //   backgroundImage: "url('http://bestanimations.com/Books/writing/hand-pencil-writing-seize-the-day-notebook-animated-gif.gif')",
        //   backgroundSize: "cover",
        //   backgroundPosition: "top center"
        // }}
      >

        <div className={classes.container}>
          <GridContainer>
            <GridItem xs={12} sm={12} md={5} lg={5} xl={5}>
              <Card className={classes[cardAnimaton]}>
                {/* <form className={classes.form}> */}
                  <CardHeader color="primary" className={classes.cardHeader}>
                    <h4 style={{ fontSize:30,
                      fontFamily: '-apple-system, BlinkMacSystemFont, "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, sans-serif'
                    }}>HaveIt</h4>
                  </CardHeader>
                  {/*<p className={classes.divider}></p>*/}
                  {/*<p>Sign in to HaveIt</p>*/}
                  <form onSubmit={onSubmit}>
                    <CardBody>
                      <CustomInput
                        labelText="아이디"
                        value={form.userName}
                        id="userName"
                        onChange={onChange}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "text",
                        }}
                      />
                      <CustomInput
                        labelText="비밀번호"
                        value={form.password}
                        id="password"
                        onChange={onChange}
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          type: "password"
                        }}
                      />
                      {type === 'register' && (
                        <>
                          <CustomInput
                            labelText="비밀번호 확인"
                            id="passwordConfirm"
                            type="password"
                            value = {form.passwordConfirm}
                            onChange={onChange}
                            formControlProps={{
                              fullWidth: true
                            }}
                            inputProps={{
                              type: "password",
                            }}
                          />
                          <CustomInput
                            labelText="이메일 주소"
                            id="email"
                            onChange={onChange}
                            value={form.email}
                            formControlProps={{
                              fullWidth: true
                            }}
                          />
                          <CustomInput
                            labelText="닉네임"
                            id="nickName"
                            onChange={onChange}
                            value={form.nickName}
                            formControlProps={{
                              fullWidth: true
                            }}
                          />
                        </>
                      )}
                      {error && <ErrorMessage>{error}</ErrorMessage>}
                      <ButtonWithMarginTop cyan fullWidth style={{ marginTop: '1rem', backgroundColor: '#A43EB8' }}>
                        {text}
                      </ButtonWithMarginTop>
                    </CardBody>
                  </form>


                  <CardFooter className={classes.cardFooter}>
                    {type === 'login' ? (
                      <Link to="/register" style={{ color: 'black' }}>
                        Go to Sign up
                    </Link>
                    )
                      : (
                        <Link to="/" style={{ color: 'black' }}>
                          Go to Sign in
                      </Link>
                      )}
                  </CardFooter>
                {/* </form> */}
              </Card>
            </GridItem>
          </GridContainer>
        </div>
        {/*<Footer whiteFont />*/}
      </div>
    </div>
  );
};

export default AuthForm;