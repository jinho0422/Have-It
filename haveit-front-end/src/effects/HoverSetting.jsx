import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';


export default class Hover extends Component {
  componentDidMount() {
    this.makeList();
  }
  makeList() {
    let ret = [];
    // console.log(this.props.data)
    const time = this.props.time.split([':']);
    // time.split[':']

    time[0] = Number(time[0])
    if (time[0] < 12) {
      if (this.props.repeat) {
        const endTime = this.props.time.split([':']);
        endTime[0] = Number(endTime[0])
        endTime[1] = Number(endTime[1])
        if (endTime[0] < 12) {
          ret.push(
            <>
              <Row>
                오전 {this.props.time} 부터 오전 {this.props.endTime} 까지
              </Row>
              <Row>
                {this.props.repeat}분 간격으로 알람이 울립니다.
              </Row>
            </>
          )
        } else {
          ret.push(
            <>
              <Row>
                오전 {this.props.time} 부터 오후 {this.props.endTime} 까지
              </Row>
              <Row>
                {this.props.repeat}분 간격으로 알람이 울립니다.
              </Row>
            </>
          )
        }
      } else {
        ret.push(
          <>
            <Row>
              오전 {this.props.time}에 알람이 한 번 울립니다.
            </Row>
          </>
        )
      }
    } else {
      if (this.props.repeat) {
        ret.push(
          <>
            <Row>
              오후 {this.props.time} 부터 오후 {this.props.endTime} 까지
            </Row>
            <Row>
              {this.props.repeat}분 간격으로 알람이 울립니다.
            </Row>
          </>
        )
      } else {
        ret.push(
          <>
            <Row>
              오후 {this.props.time}에 알람이 한 번 울립니다.
            </Row>
          </>
        )
      }
    }
    return ret;
  }
  render() {
    return(
      <Container
        className="p-1"
        style={{
          borderRadius: 15,
          zIndex:'9999',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          position: 'absolute',
          top: this.props.y,
          left: this.props.x,
          minWidth: 250,
          maxWidth: 300}}>
        <Row
          className="p-2 m-2"
          style={{
            borderRadius: 12,
            fontWeight: 'bold'}}>
          <Col className="p-0">
            <Container>
              {this.makeList()}
            </Container>
          </Col>
        </Row>
      </Container>
    )
  }
}