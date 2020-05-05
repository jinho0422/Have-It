import React, { Component } from 'react';
import { Modal, Button, Toast } from 'react-bootstrap';
import * as API from '../../lib/api/FrontQuery';


export default class AddNotdoContents extends Component {

  state = {
    datas: [],
    selectedDay: {
      year: new Date().getFullYear(),
      month: new Date().getMonth() + 1,
      Minute : new Date().getMinutes(),
      Hour: new Date().getHours(),
  }
  }

  componentDidMount() {
    this.getData();
  }

  getData = async () => {
    const res = await API.getNodo();
    this.setState({ datas: res.data });
  };

  func() {
    let ret = [];
    let noName = [];
    let noTime = [];
    
  
    
    if (this.state.datas.length === 0) {
      return;
    }
  
    for (let i  = 0; i < this.state.datas.missedNoti.length; i++) {
      noName.push((Object(Object(this.state.datas.missedNoti)[i])["noti_detail.habitName"]))
      noTime.push((Object(Object(this.state.datas.missedNoti)[i])["time"]))
    }




    for (let i = 0; i < this.state.datas.missedNoti.length; i++) {
      let time=noTime[i].split(':');
      const show = true;
     
      time[0] = Number(time[0]);
      time[1] = Number(time[1]);
   
      ret.push(
        
        <Toast onClose = {show} >
        <Toast.Header>
          <img src="holder.js/20x20?text=%20" className="rounded mr-2" alt="" />
          <strong className="mr-auto"><h5>{noName[i]}</h5></strong>
          <small> <h5> { (this.state.selectedDay.Hour - time[0]) *60 + (this.state.selectedDay.Minute - time[1]) }분 전</h5></small>
        </Toast.Header>
      <Toast.Body><h4>{noName[i]}를 수정?</h4></Toast.Body>
      </Toast>
      ) 
    

    }
    return ret;
  }

  render() {

 
    return (
      <>
        <Modal
          {...this.props}
          size={70}
          aria-labelledby="contained-modal-title-vcenter"
          centered>

          <Modal.Header>
            <Modal.Title id="contained-modal-title-vcenter" >
              {this.props.title}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {this.state.datas.missedNoti ? this.func() : ''}

          </Modal.Body>

          <Button onClick={function () {
            this.props.onHide();

          }.bind(this)}>닫기</Button>
        </Modal>
      </>
    )
  }
}