import React, { Component } from 'react';
import { Button, Row, Modal, Col, Container } from 'react-bootstrap';
import EditRoutineModalContents from './EditRoutineModalContents';

import * as API from '../../lib/api/FrontQuery';

import '../../lib/styles/style.css'

export default class EditRoutineModal extends Component {

    state = {
        show:false,
        nextShow: false,
        datas: '',
        selectedDollId: '',
        startHour: null,
        startMin: null,
        weekId: null,
        repeat: null,
        endHour: null,
        endMin: null,
        isAmStart: null,
        isAmEnd: null,
        habitNotiId: null,
    }

    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        const res = await API.getHabitForModify({habitId: this.props.habitId});
        this.setState({datas: res.data.data});
    }

    changeData (data, dollId) {
        this.setState({selectedDollId: dollId})
        if (Number(data.time.slice(0, 2))>12) {
            this.setState({isAmStart: 0})
            this.setState({startHour: Number(data.time.slice(0, 2))-12});
        } else if (Number(data.time.slice(0, 2)) === 12) {
            this.setState({isAmStart: 0})
            this.setState({startHour: 12});
        } else {
            this.setState({isAmStart: 1})
            this.setState({startHour: Number(data.time.slice(0, 2))});
        }
        this.setState({startMin: Number(data.time.slice(3))})
        this.setState({weekId: data.weekId})
        this.setState({repeat: data.repeat});
        if (data.repeat) {
            this.setState({endMin: Number(data.endTime.slice(3))});
            if (Number(data.endTime.slice(0, 2)) > 12) {
                this.setState({isAmEnd: 0})
                this.setState({endHour: Number(data.endTime.slice(0, 2))-12});
            } else if (Number(data.endTime.slice(0, 2)) === 12) {
                this.setState({isAmEnd: 0})
                this.setState({endHour: 12});
            } else {
                this.setState({isAmEnd: 1})
                this.setState({endHour: Number(data.endTime.slice(0, 2))});
            }
        }
        this.setState({habitNotiId: data.id})
        this.setState({show: false})
        this.setState({nextShow: true}) 
    }

    makeNextModal() {
        let closeNextModal = () => this.setState({nextShow:false});

        return (
            <EditRoutineModalContents
                startHour={this.state.startHour}
                startMin={this.state.startMin}
                habitNotiId={this.state.habitNotiId}
                habitId={this.props.habitId}
                weekId={this.state.weekId}
                repeat={this.state.repeat}
                endHour={this.state.endHour}
                endMin={this.state.endMin}
                isAmEnd={this.state.isAmEnd}
                isAmStart={this.state.isAmStart}
                selectedDollId={this.state.selectedDollId}
                size={this.props.size}
                title={`${this.props.habitName} 일정 변경`}
                show={this.state.nextShow}
                onHide={closeNextModal}
                changeSettingList={this.props.changeSettingList}
            />
        )
    }

    checkState() {
        if (this.state.nextShow) {
            return(this.makeNextModal())
        }
    }

    deleteRequest = async(habitId, dataId) => {
        try {
            await API.deleteHabitDetail({habitId: habitId, notificationId: dataId});
        } catch (e) {
            alert(e.response.data.message)
        }
    }

    dataList() {
        let temp = [];
        const dollLength = window.sessionStorage.getItem('dollLength');
        let dollIds = [];
        for (let i=0; i<dollLength; i++) {
            dollIds.push(window.sessionStorage.getItem(`dollId${i}`));
        }
        for (let i=0; i<dollLength; i++) {
            if (this.state.datas[dollIds[i]]) {
                temp.push(
                    <Row>
                        <Col md='auto' className="justify-content-md-center" style={{margin:3, fontWeight:'bold', backgroundColor:'ivory'}}>
                            {window.sessionStorage.getItem(`dollId${i}Name`)}
                        </Col>
                    </Row>
                )
                for (const data of this.state.datas[dollIds[i]]) {
                    temp.push(
                        <Row>
                            <Col md='auto' className="justify-content-md-center" style={{margin:3, fontWeight:'bold', backgroundColor:'white'}}>
                                {data.time}
                            </Col>
                            <Col md='auto' className="justify-content-md-center" style={{margin:3, backgroundColor:'white'}}>
                                {data.repeat ? data.endTime+'시까지 '+data.repeat+'분 간격으로 반복' : '반복 없음'}
                            </Col>
                            <Col md='auto' style={{margin:3}}>
                                <Button id="button-day" style={{margin:3}} onClick={function() {
                                    this.changeData(data, dollIds[i])
                                }.bind(this)}>수정
                                </Button>
                                <Button id="button-day" style={{margin:3}} onClick={function() {
                                    // API.deleteHabitDetail({habitId: this.props.habitId, notificationId: data.id});
                                    this.deleteRequest(this.props.habitId, data.id)
                                    this.setState({show: false});
                                    this.props.changeSettingList();
                                }.bind(this)}>삭제</Button>
                            </Col>
                        </Row>
                    )
                }
            }
        }
        
        return temp;
    }

    render() {
        let closeModal = () => this.setState({show:false});

        return(
            <div md="auto" className="justify-content-md-center" style={{display:'flex', alignItems:'center'}}>
                <Button
                    id='button-day'
                    variant='primary'
                    style={{color:this.props.color, width:this.props.width, fontWeight:'bold'}}
                    onClick={function() {
                        this.setState({show:!this.state.show});
                        this.getData();
                    }.bind(this)}
                >변경</Button>
                <Modal
                    show={this.state.show}
                    onHide={closeModal}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered>
                    <Modal.Header className="justify-content-md-center">
                        <Modal.Title id="contained-modal-title-vcenter">
                            {this.props.habitName} 일정 변경
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Row className="justify-content-md-center">
                            <Col md='auto'>
                                <Container className="justify-content-md-center">
                                    {this.dataList()}
                                </Container>
                            </Col>
                        </Row>
                    </Modal.Body>
                </Modal>
                {this.checkState()}
            </div>
        );
    }
}