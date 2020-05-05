import React, { Component } from 'react';
import { Button, ButtonToolbar, Container, Row, Col } from 'react-bootstrap';

import SettingDayInfo from './SettingDayInfo';
import SettingHabitInfo from './SettingHabitInfo';
import { MdLocalCafe, MdLocalDining, MdTimer } from "react-icons/md";
import { FaRegCalendarAlt, FaItunesNote, FaPencilAlt, FaPills, FaRaspberryPi, FaRegStar } from "react-icons/fa";
import { IoMdBrush, IoIosFootball, IoIosWater } from "react-icons/io";

import * as API from '../../lib/api/FrontQuery';

import 'bootstrap/dist/css/bootstrap.min.css';
import '../../lib/styles/style.css';

const dayOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S', 'All'];

export default class SettingList extends Component {
    state = {
        show: false,
        day: '',
        doll: 'All',
        datas: [],
        dollIds: [],
        flag: false,
        prev: false
    }


    componentDidUpdate() {
        if (this.state.flag === this.state.prev) {
            this.getData(); 
        }
    }

    componentDidMount() {
        this.getDollId();
    }

    getData = async () => {
        const res = await API.getHabitForModify({habitId: this.props.habitId});
        this.setState({datas: res.data.data});
        if (this.state.flag === this.state.prev) {
            this.setState({flag: !this.state.flag});
        }
    }

    getDollId () {
        const dollLength = window.sessionStorage.getItem('dollLength');
        let dollIds = [];
        for (let i=0; i<dollLength; i++) dollIds.push(window.sessionStorage.getItem(`dollId${i}`));
        this.setState({dollIds: dollIds});
    }

    printWeek () {
        let ret = [];

        for (let i=0; i<=6; i++) {
            let color = i === 6 ? 'blue' : i === 0 ? 'red' : 'black';
            color = this.props.weekId & (1 << i) ? color : 'rgba(75,75,75,0.53)';

            ret.push(<Col md="auto" className="px-0 mx-1" style={{display:'flex', alignItems:'center'}}>
                <ButtonToolbar key={i}>
                    <Button
                        className="justify-content-md-center" 
                        id='button-day'
                        variant='primary'
                        style={{color:color,
                            width:30, fontWeight:'bold'}}
                        onClick={function() {
                            if (this.state.show) {
                                if (this.state.day === i) {
                                    this.setState({show: !this.state.show});
                                } else this.setState({
                                    day: i
                                });
                            } else {
                                this.setState({
                                    show: !this.state.show,
                                    day: i
                                });
                            };
                        }.bind(this)}
                    >{dayOfWeek[i]}</Button>
                </ButtonToolbar></Col>
            );
        }

        ret.push(<Col md="auto" className="px-0 mx-1" style={{display:'flex', alignItems:'center'}}>
            <ButtonToolbar key={7}>
                <Button
                    className="justify-content-md-center"
                    id='button-day'
                    variant='primary'
                    style={{color:"black", width:30, fontWeight:'bold'}}
                    onClick={function() {
                        if (this.state.show) {
                            if (this.state.day === 7) {
                                this.setState({show: !this.state.show});
                            } else this.setState({
                                day: 7
                            });
                        } else {
                            this.setState({
                                show: !this.state.show,
                                day: 7
                            });
                        };
                    }.bind(this)}
                >{dayOfWeek[7]}</Button>
            </ButtonToolbar></Col>
        )

        return ret;
    }

    makeIcon() {
        if (this.props.icon === 'IoMdBrush') {
            return <IoMdBrush style={{marginRight:2}}/>
        } else if (this.props.icon === 'FaRegCalendarAlt') {
            return <FaRegCalendarAlt style={{marginRight:2}}/>
        } else if (this.props.icon === 'MdLocalCafe') {
            return <MdLocalCafe style={{marginRight:2}}/>
        } else if (this.props.icon === 'MdLocalDining') {
            return <MdLocalDining style={{marginRight:2}}/>
        } else if (this.props.icon === 'IoIosFootball') {
            return <IoIosFootball style={{marginRight:2}}/>
        } else if (this.props.icon === 'FaItunesNote') {
            return <FaItunesNote style={{marginRight:2}}/>
        } else if (this.props.icon === 'FaPencilAlt') {
            return <FaPencilAlt style={{marginRight:2}}/>
        } else if (this.props.icon === 'FaPills') {
            return <FaPills style={{marginRight:2}}/>
        } else if (this.props.icon === 'MdTimer') {
            return <MdTimer style={{marginRight:2}}/>
        } else if (this.props.icon === 'IoIosWater') {
            return <IoIosWater style={{marginRight:2}}/>
        } else if (this.props.icon === 'FaRaspberryPi') {
            return <FaRaspberryPi style={{marginRight:2}}/>
        } else if (this.props.icon === 'FaRegStar') {
            return <FaRegStar style={{marginRight:2}}/>
        }
    }

    toggleHabitStatus = async(habitId) => {
        try{
            API.toggleHabitStatus({ habitId: habitId });
        } catch(e) {
            alert(e.response.data.message)
        }
    }

    deleteHabit = async(habitId) => {
        try{
            API.deleteHabit({ habitId: habitId });
        } catch(e) {
            alert(e.response.data.message)
        }
    }

    render() {
        return (
            <Container>
                <Row className='my-2' md='auto' style={{fontWeight:'bold'}}>
                    <Col xs="1" md="1" lg="1" id="col-habit" className="justify-content-md-center">
                        {this.makeIcon()}
                    </Col>
                    <Col style={{display:'flex', alignItems:'center'}}>
                        <SettingHabitInfo
                            habitName={this.props.habitName}
                            icon={this.props.icon}
                            habitId={this.props.habitId}
                            changeFlag={function() {
                                this.setState({flag: !this.state.flag})
                            }.bind(this)}
                            changeSettingPageFlag={this.props.changeFlag}/>
                    </Col>
                    <Col style={{display:'flex', alignItems:'center'}} id="col-habit" className="justify-content-md-center px-0 mx-3">
                        {this.printWeek()}
                    </Col>
                    <Col xs="1" md="1" style={{display:'flex', alignItems:'center'}} id="col-habit" className="justify-content-md-center">
                        D+{this.props.record}
                    </Col>
                    <Col xs="1" md='1' style={{display:'flex', alignItems:'center'}} id="col-habit" className="px-0 mx-3">
                        <Container>
                            <Row md='auto' className="px-1" style={{display:'flex', alignItems:'center'}}>
                                <Col md="auto" className="mx-1 px-0" style={{display:'flex', alignItems:'center'}}>
                                    <Button className="justify-content-md-center" id="button-day"
                                        style={{display:'flex', alignItems:'center', width:30}}
                                        onClick={function(e) {
                                        e.preventDefault();
                                        if (window.confirm(this.props.option? '습관을 비활성화 시키겠습니까? 설정 변경을 위해 인형이 정상적으로 작동하는 것을 확인해주세요.'
                                            : "습관을 활성화 시키겠습니까? 설정 변경을 위해 인형이 정상적으로 작동하는 것을 확인해주세요.")) {
                                            // API.toggleHabitStatus({ habitId: this.props.habitId });
                                            this.toggleHabitStatus(this.props.habitId);
                                            this.props.changeFlag();
                                        }}.bind(this)}>
                                        {this.props.option ? '‖' : '▶'}
                                    </Button>
                                </Col>
                                <Col className="mx-1 px-0" md="auto" style={{display:'flex', alignItems:'center'}}>
                                    <Button id="button-day" style={{width:30}} onClick={function(e) {
                                        e.preventDefault();
                                        if (window.confirm("습관을 삭제하시겠습니까? 습관 삭제를 위해 인형이 정상적으로 작동하는 것을 확인해주세요.")) {
                                            // API.deleteHabit({ habitId: this.props.habitId });
                                            this.deleteHabit(this.props.habitId);
                                            this.props.changeFlag();
                                        }}.bind(this)}>
                                        ×
                                    </Button>
                                </Col>
                            </Row>
                        </Container>
                    </Col>
                </Row>
                <Row>
                    {this.state.show ? 
                    <SettingDayInfo 
                        habitId={this.props.habitId}
                        habitName={this.props.habitName} 
                        day={this.state.day}
                        dollIds={this.state.dollIds}
                        doll={this.state.doll}
                        datas={this.state.datas}
                        showHover={this.props.showHover}
                        changeFlag={function() {
                            this.setState({flag: !this.state.flag})
                        }.bind(this)}
                        changeDoll={function(doll) {
                            this.setState({doll: doll})
                        }.bind(this)}/> : ''}
                </Row>  
            </Container>
        );
    }
}
