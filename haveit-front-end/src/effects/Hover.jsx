import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';

import * as API from '../lib/api/FrontQuery';

export default class Hover extends Component {
    state = {
        data: []
    }

    componentDidMount() {
        this.getData();
    }

    getData = async() => {
        const res = await API.getHabitToday({ habitId:this.props.id });
        this.setState({data: res.data.data});
    }

    makeList() {
        let ret = [], past = [], future = [];
        const data = this.state.data;
        
        if (data.length === 0) return;
        ret.push(<Row className="lead mb-2" style={{color:'rgba(0,0,0,0.73)', fontWeight: 'bold'}}>{data.alarmSet.habitName}</Row>);
        ret.push(<Row style={{color:'rgba(46,1,32,0.7)'}}>▪ 지나간 알림</Row>);

        for (let i=0; i<data.alarmSet.pastAlarm.length; i++) {
            const curr = data.alarmSet.pastAlarm; 
            const color = curr[i].is_done ? '#0F3759' : '#F28F38';
            past.push(<Col md='auto' className="pr-0" style={{color: color}}>{curr[i].time}</Col>);
            // console.log(curr[i]);
        }

        ret.push(<Row style={{borderBottom:'0.5px solid rgba(0, 0, 0, 0.7)'}}>{past}</Row>);

        ret.push(<Row className="mt-1" style={{color:'rgba(46,1,32,0.7)'}}>▪ 예정된 알림</Row>)
        
        for (let i=0; i<data.alarmSet.futureAlarm.length; i++) {
            const curr = data.alarmSet.futureAlarm;
            const color = 'grey';
            future.push(<Col md='auto' className="pr-0" style={{color: color}}>{curr[i].time}</Col>);
            // console.log(curr[i]);
        }
        
        ret.push(<Row>{future}</Row>);
        
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