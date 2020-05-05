import React from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import Button from './Button';
import { Modal, Row, Col, ButtonToolbar, Form } from 'react-bootstrap';

import '../../lib/styles/style.css';

import art from '../../images/art.PNG';
import calendar from '../../images/calendar.PNG';
import coffee from '../../images/coffee.PNG';
import dining from '../../images/dining.PNG';
import football from '../../images/football.PNG';
import music from '../../images/music.PNG';
import pencil from '../../images/pencil.PNG';
import pill from '../../images/pill.PNG';
import timer from '../../images/timer.PNG';
import water from '../../images/water.PNG';
import pi from '../../images/pi.PNG';
import star from '../../images/star.PNG';

const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin-top: 1rem;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  text-align: center;
  font-size: 0.875rem;
  margin-top: 1rem;
`;

const ModalTest = ({form, onChange, onSubmit, error, icon, habitName}) => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <ButtonToolbar>
      <Button
        className={"px-1"}
        style={{margin:'0px', padding:'0px', backgroundColor:'rgba(131,164,183,0.53)',  borderRadius:15, fontSize:10}}
        onClick={() => setModalShow(true)}>수정</Button>
        {/* {modalShow ?  */}
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered>
            <Modal.Header closeButton>
              <Modal.Title id="contained-modal-title-vcenter">
                습관 수정하기
              </Modal.Title>
            </Modal.Header>
            <Form onSubmit={onSubmit}>
              <Modal.Body>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>습관명</Form.Label>
                      <StyledInput
                        autoComplete="habitName"
                        name="habitName"
                        placeholder={habitName}
                        onChange={onChange}
                        value={form.habitName}
                        required/>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <Form.Group>
                      <Form.Label>아이콘</Form.Label>
                      <Form
                        name="habitIconId"
                        onChange={onChange}
                        value={form.habitIconId}
                        required>
                        <Row>
                          <Col>
                            <input type="radio" value="1" name="habitIconId" checked/>
                              <img src={art} alt="art_icon"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="2" name="habitIconId"/>
                              <img src={calendar} alt="calendar_icon"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="3" name="habitIconId"/>
                              <img src={coffee} alt="coffee_icon"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="4" name="habitIconId"/>
                              <img src={dining} alt="dining_icon"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="5" name="habitIconId"/>
                              <img src={football} alt="football_icon"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="6" name="habitIconId"/>
                              <img src={music} alt="music_icon"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="7" name="habitIconId"/>
                              <img src={pencil} alt="pencil_icon"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="8" name="habitIconId"/>
                              <img src={pill} alt="pill_icon"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="9" name="habitIconId"/>
                              <img src={timer} alt="timer_icon"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="10" name="habitIconId"/>
                              <img src={water} alt="water_icon"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="11" name="habitIconId"/>
                              <img src={pi} alt="etc_icon1"></img>
                          </Col>
                          <Col>
                            <input type="radio" value="12" name="habitIconId"/>
                              <img src={star} alt="etc_icon2"></img>
                          </Col>
                        </Row>
                      </Form>
                    </Form.Group>
                  </Col>
                </Row>
                {error && <ErrorMessage>{error}</ErrorMessage>}
              </Modal.Body>
              <Modal.Footer>
                  <Button onClick={function() {setModalShow(false);}}>저장하기</Button>
              </Modal.Footer>
            </Form>
          </Modal>
          {/* </Modal> : ''} */}
    </ButtonToolbar>
  );
}

export default ModalTest;