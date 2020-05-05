import React, { Component } from 'react';
import {Row, Col, Container, Button, Jumbotron} from 'react-bootstrap';
import Fade from 'react-reveal/Fade';

import CurrentDate from '../information/CurrentDate';
import TodayList from './TodayList';
import Hover from '../../effects/Hover';
import * as API from '../../lib/api/FrontQuery';
import * as userAPI from '../../lib/api/auth';

import '../../lib/styles/style.css';
import Clock from '../mainMode/Clock';
// import '../../lib/styles/style.css';

export default class TodayPage extends Component {
    state = {
        datas: [],
        more: false,
        size:'',
        hover: {
            show: false,
            habitId: '',
            x: '', 
            y: ''
        },
    };

    componentDidMount() {
        this.getData();
        this.checkAndRedirect();
    }

    getData = async () => {
        const res = await API.getToday();
        this.setState({datas: res.data});
        this.setState({size: res.data.habitSet.length});
    };

    checkAndRedirect = async() => {
        try{
            await userAPI.check()
        } catch (e) {
            window.location='/'
        }
    };

    makeList() {
        let ret = [];
        let habitId = '';
        let habitIcon = '';
        const size = this.state.size;
        
        for (let j = 0; j < (size / 5); j++) {
            if (j && !this.state.more) break;
            
            let fiveHabits = [];

            for (let i=0; i<5; i++) {
                let currHabit, truncatedHabitName = [];

                if (i + j * 5 < size) {
                    currHabit = this.state.datas.habitSet[i + j * 5].habitName;
                    habitId = this.state.datas.habitSet[i + j * 5].id;
                    habitIcon = this.state.datas.habitSet[i + j * 5].habit_icon.icon;

                    for (let k=0; k<12 && k<currHabit.length; k++) {
                        truncatedHabitName.push(currHabit[k]);
                    }

                    if (truncatedHabitName.length > 10) {
                        truncatedHabitName[10] = truncatedHabitName[11] = '.';
                    }
                }

                if (j * 5 + i < size) {
                    fiveHabits.push(<Col>
                        <TodayList
                            showHover={function(value, x, y, id) {
                                this.setState({
                                    hover: {
                                        show: value,
                                        habitId: id,
                                        x: x,
                                        y: y
                                    }
                                });
                            }.bind(this)}
                            habitName={truncatedHabitName}
                            habitId={habitId}
                            habitIcon={habitIcon}
                            achievementData={this.state.datas.achievementData[habitId]}/>
                        </Col>);
                } else {
                    fiveHabits.push(<Col></Col>);
                }
            }

            ret.push(
                <Fade><div id='habit-css-black' className="justify-content-center mt-3">
                    <Row>
                    {fiveHabits}
                    </Row>
                </div></Fade>)
        }
        
        return ret;
    };

    render() {
        return (
            <>
                {this.state.hover.show ? 
                    <Hover
                        x={this.state.hover.x}
                        y={this.state.hover.y}
                        id={this.state.hover.habitId}/> : ''}
                <Fade>
                    <Container
                      className="justify-content-center pt-5 mt-5 mb-0 font-weight-light"
                      style={{display:'flex', alignItems:'center', height:120, fontSize:40, mg:0, color:'white',
                          fontFamily:'-apple-system, BlinkMacSystemFont, "Nanum Gothic", "Helvetica Neue", Helvetica, Arial, sans-serif'
                      }}>
                        <CurrentDate/>
                    </Container>
                    <Container
                      className="justify-content-center"
                      // id='time'
                      style={{display:'flex', alignItems:'center', height:170, fontSize:140, color:'white',
                      fontFamily:'-apple-system, BlinkMacSystemFont, "Neue Haas Grotesk Text Pro", "Helvetica Neue", Helvetica, Arial, sans-serif'
                      }}>
                        <div>
                            <Clock>
                            </Clock>
                        </div>
                    </Container>
                    <Container>
                        {this.state.datas.message ? this.makeList() :
                          <Row className="justify-content-center mt-3 pb-5">
                              <Jumbotron id='habit-css-full'>
                                  <h4 className="display-5" style={{display:'flex', color:'white',}}
                                  >Hello, {window.sessionStorage.getItem('user')}</h4>
                                  <hr className="my-2" style={{backgroundColor: "#eeeeee"}}></hr>
                                  {this.state.datas.messageSecond ?
                                      <h5 style={{display:'flex', color:'#ababab',}}>오늘 설정해 둔 알람이 없습니다.</h5> :
                                      <h5 style={{display:'flex', color:'#ababab',}}>아직 등록 된 습관이 없습니다.</h5>
                                  }
                                  {this.state.datas.messageSecond ?
                                      <h6 style={{display:'flex', color:'#ababab',}}
                                      >습관을 생성하고, 인형에 울릴 알람을 설정해주세요. 알람을 수행하면 화면에 달성률이 나타납니다.</h6> :
                                      <h6 style={{display:'flex', color:'#ababab',}}
                                      >인형을 등록하고, 습관과 알람을 생성해주세요. 알람을 수행하면 화면에 달성률이 나타납니다.</h6>
                                  }
                                  {this.state.datas.messageSecond ?
                                      <a className="btn btn-sm btn-secondary" role="button" onClick={this.props.changeModeSetting}>알람 설정하러 가기</a> :
                                      <a className="btn btn-sm btn-secondary" role="button" onClick={this.props.changeModeMy}>인형 등록하러 가기</a>
                                  }
                              </Jumbotron>
                          </Row>
                        }
                        {this.state.size > 5 ?
                            <Row className="justify-content-center mt-5 pb-5">
                                <Button
                                  id='habit-css-full'
                                  onClick={function() {
                                        this.setState({more:!this.state.more})
                                    }.bind(this)}
                                    style={{border:'none', fontWeight:'bold', color:'rgba(255, 255, 255, 0.75'}}
                                    color='primary'>
                                    {this.state.more ? '접기' : '더 보기'}
                                </Button>
                            </Row> : ''}
                    </Container>
                </Fade>
            </>
        );
    }
}