import React, { Component } from 'react';
import { Container, Row } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';

import AddHabitModal from '../settingMode/AddHabitModal';
import SettingList from './SettingList';
import Hover from '../../effects/HoverSetting';

import * as API from '../../lib/api/FrontQuery';
import '../../lib/styles/style.css'

export default class SettingPage extends Component {
    state = {
        habit: [],
        flag: false,
        prev: false,
        hover: {
            show: false,
            habitId: '',
            x: '', 
            y: '',
            alarmId: '',
            weekId: '',
            repeat: '',
            time: '',
            endTime: null
        },
    };
    
    componentDidUpdate() {
        this.getData();
    }
    
    componentDidMount() {
        this.getData();
    }

    getData = async () => {
        let res = await API.getHabitNoti();
        let { habit } = res.data;
        
        if (JSON.stringify(habit) !== JSON.stringify(this.state.habit)) {
            this.setState({habit: habit});
        }

        if (this.state.prev === this.state.flag) {
            this.setState({ flag:!this.state.flag });
        }
    };

    mapData(datas) {
        return(
            datas.map((data) => {
                return (
                    <SettingList 
                        key={data.id}
                        record={data.d_day}
                        option={data.is_activated} 
                        habitId={data.id}
                        habitName={data.habitName}
                        weekId={data.weekId}
                        icon={data['habit_icon.icon']}
                        showHover={function(value, x, y, id, alarmId, weekId, repeat, time, endTime) {
                            if (repeat) {
                                this.setState({
                                    hover: {
                                        show: value,
                                        habitId: id,
                                        x: x,
                                        y: y,
                                        alarmId: alarmId,
                                        weekId: weekId,
                                        repeat: repeat,
                                        time: time,
                                        endTime: endTime
                                    }
                                })
                            } else {
                                this.setState({
                                    hover: {
                                        show: value,
                                        habitId: id,
                                        x: x,
                                        y: y,
                                        alarmId: alarmId,
                                        weekId: weekId,
                                        repeat: repeat,
                                        time: time,
                                        endTime: null
                                    }
                                })
                            }
                        }.bind(this)}
                        changeFlag={function() {
                            this.setState({flag:!this.state.flag})
                        }.bind(this)}
                    />
                );
            })
        );
    }

    render() {
        let runningDatas = [];
        let pausedDatas = [];
        
        const datas = this.state.habit;
        
        if (datas) {
            for (const data of datas) {
                if (data.is_activated === 1) runningDatas.push(data)
                else pausedDatas.push(data)
            };
        };

        let run = runningDatas.length ? this.mapData(runningDatas) : '';
        let pause = pausedDatas.length ? this.mapData(pausedDatas) : '';

        return (
            <>
                {this.state.hover.show ? 
                    <Hover
                        x={this.state.hover.x}
                        y={this.state.hover.y}
                        id={this.state.hover.habitId}
                        alarmId={this.state.hover.alarmId}
                        weekId={this.state.hover.weekId}
                        repeat={this.state.hover.repeat}
                        time={this.state.hover.time}
                        endTime={this.state.hover.endTime}
                        /> : ''}
                <Fade> 
                    <Container id="habit-css-blue" className="py-3 mt-5">
                        <h2 style={{fontWeight:'bold', paddingLeft:"10px"}}>Running</h2>
                        <p style={{paddingLeft:"10px", color:"rgba(126,126,126,0.77)"}}>활성화된 습관 목록을 보여줍니다. 요일별로 인형에 울릴 알람을 추가할 수 있습니다.</p>
                        {/*<Row>*/}
                            {run}
                        {/*</Row>*/}
                    </Container>
                    <Row className="justify-content-md-center">
                        <AddHabitModal // + button
                            size='md'
                            changeFlag={function() {
                                this.setState({flag:!this.state.flag})
                            }.bind(this)}/>
                    </Row>
                    <Container id="habit-css-red" className="py-3">
                        <h2 style={{fontWeight:'bold', paddingLeft:"10px"}}>Paused</h2>
                        <p style={{paddingLeft:"10px", color:"rgba(126,126,126,0.77)"}}>비활성화된 습관 목록을 보여줍니다.</p>
                        {/*<Row>*/}
                            {pause}
                        {/*</Row>*/}
                    </Container>
                    <Container className="pb-5"></Container>
                </Fade>
            </>
        )
    }
}
