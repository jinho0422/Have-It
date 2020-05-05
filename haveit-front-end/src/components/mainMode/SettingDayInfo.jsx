import React, { Component } from 'react';
import { Container, Col, Row } from 'react-bootstrap';

import '../../lib/styles/style.css';
import EditAlarmModal from '../settingMode/EditAlarmModal';
import AddRoutineModal from '../settingMode/AddRoutineModal';
import DollList from './DollList';

const dayOfWeekKor = ['일', '월', '화', '수', '목', '금', '토', '전체'];

export default class SettingDayInfo extends Component {
    componentDidUpdate () {
        this.makeAlarms(Number(this.props.day));
    }
    
    makeAlarms(weekNumber) {
        let ret = [], cnt = 0;
        
        for (let j=0; j<this.props.dollIds.length; j++) { // doll에 대한 데이터
            if (this.props.doll !== 'All' && this.props.dollIds[j] !== this.props.doll) continue;

            let temp = [];
            let dollId = this.props.dollIds[j];
            
            for (let i=0; i<this.props.datas[dollId].length; i++) {
                let curr = this.props.datas[dollId][i];

                if (curr.weekId & (1 << weekNumber)) {
                    let time = Number(curr.time.replace(":", ""));
                    
                    temp.push(
                        <Col 
                            md='auto' 
                            id="col-habit-box" 
                            className="justify-content-md-center m-1 py-0 px-2"
                            onMouseEnter={function(e) {
                                this.props.showHover(true, e.pageX, e.pageY, this.props.habitId, curr.id, curr.weekId, curr.repeat, curr.time, curr.endTime);
                            }.bind(this)}
                            onMouseLeave={function(e) {
                                this.props.showHover(false, 0, 0, null, null, null, null, null, null);
                            }.bind(this)}
                            style={{display:'flex', alignItems:'center', fontSize:15}}>
                            {time > 1259 ? 
                                'PM ' + Math.floor(time / 100 - 12) + ":" + (Math.floor(time % 100) < 10 ? '0' : '') + Math.floor(time % 100) :
                                'AM ' + Math.floor(time / 100) + ":" + (Math.floor(time % 100) < 10 ? '0' : '') + Math.floor(time % 100)}
                            <EditAlarmModal
                                data={curr}
                                dollId={dollId}
                                habitId={this.props.habitId}
                                habitName={this.props.habitName}
                                changeFlag={this.props.changeFlag}/>
                        </Col>
                    )
                }
            }

            if (temp.length) cnt += 1;

            ret.push(
                <Row>
                    <>
                        {temp.length ? 
                            <Row id="col-habit-dim" className="mx-2 my-1">
                                <Col md='auto' className="justify-content-md-center">
                                    {window.sessionStorage.getItem(`dollId${j}Name`)}
                                </Col>
                                {temp}
                            </Row> : 
                        ''}
                    </>
                </Row>
            )
        }

        
        return cnt ? ret : null;
    }

    makeFullAlarms(weekNumber) {
        let ret = [];

        if (weekNumber === 7) {
            for (let i=1; i<=7; i++) {
                let tmp = this.makeAlarms(i % 7);
                
                if (tmp) {
                    ret.push(
                        <Col id="setting-day-info-list" className="py-2 my-1">
                            <Container>
                                <Row style={{fontSize:15, fontWeight:'bold'}}>{dayOfWeekKor[i % 7] + '요일'}</Row>
                                {this.makeAlarms(i % 7)}
                            </Container>
                        </Col>
                    )
                }
            }
        } else {
            ret.push(this.makeAlarms(weekNumber));
        }

        return ret;
    }

    render() {
        return (
            <Col id="col-list" className="mx-4 py-3">
                <Container>
                    <Row className="pt-1 pb-4" style={{fontWeight: 'bold'}}>
                        <Col md='auto' className="justify-content-md-center m-0"
                            style={{display:'flex', alignItems:'center', fontSize: 20, textDecorationLine: 'underline'}}>
                            {this.props.habitName}
                        </Col>
                        <Col md='auto' className="justify-content-md-center"
                            style={{display:'flex', alignItems:'center', color: 'grey'}}>
                            {dayOfWeekKor[this.props.day]}{Number(this.props.day) !== 7 ? '요일' : ''}
                        </Col>
                        <Col md='auto' className="justify-content-md-center" style={{display:'flex', alignItems:'center'}}>
                            <AddRoutineModal
                                habitId={this.props.habitId}
                                changeFlag={this.props.changeFlag}/>
                        </Col>
                        <Col className="justify-content-md-center" style={{display:'flex', alignItems:'center'}}>
                            <DollList
                                changeDoll={this.props.changeDoll}/>
                        </Col>
                    </Row>
                    {this.makeFullAlarms(Number(this.props.day))}
                </Container>
            </Col>
        )
    }
}
