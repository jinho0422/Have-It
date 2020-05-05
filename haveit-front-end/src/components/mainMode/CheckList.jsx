import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import update from 'react-addons-update';
import { FaHeart, FaRegHeart, FaRegSave, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { AiOutlineEdit } from "react-icons/ai";



import Calendar from '../../effects/Calendar';
import LineGraph from '../../effects/LineGraph';
import BarBefore from '../information/BarBefore';
import BarAfter from '../information/BarAfter';
import * as API from '../../lib/api/FrontQuery'

const colors = ['rgb(46,51,91)', 'rgb(75,65,102)', 'rgb(169,93,104)', 'rgb(115,78,109)', 'rgb(102,48,71)',
    'rgb(164,163,164)', 'rgb(234,128,68)', 'rgb(196,101,92)', 'rgb(128,57,69)',
    'rgb(40,33,64)', "rgb(152,90,100)"];

export default class CheckList extends Component {
    state = {
        dataLine: {
            labels: ["1일", "10일", "20일", `${new Date((new Date()).getFullYear(), (new Date()).getMonth()+1, 0).getDate()}일`],
            datasets: [
                {
                    label: "목표 횟수",
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: "rgba(225, 204, 230, 0.3)",
                    borderColor: "rgb(74,75,102)",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgb(205, 130, 158)",
                    pointBackgroundColor: "rgb(255, 255, 255)",
                    pointBorderWidth: 2,
                    pointHoverRadius: 1,
                    pointHoverBackgroundColor: "rgba(0, 0, 0, 0.6)",
                    pointHoverBorderColor: "rgba(220,220,220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: []
                },
                {
                    label: "달성 횟수",
                    fill: true,
                    lineTension: 0.3,
                    backgroundColor: "rgba(197,138,153,0.38)",
                    borderColor: "#c58a99",
                    borderCapStyle: "butt",
                    borderDash: [],
                    borderDashOffset: 0.0,
                    borderJoinStyle: "miter",
                    pointBorderColor: "rgb(205, 130, 158)",
                    pointBackgroundColor: "rgb(255, 255, 255)",
                    pointBorderWidth: 2,
                    pointHoverRadius: 1,
                    pointHoverBackgroundColor: "rgba(0, 0, 0, 0.6)",
                    pointHoverBorderColor: "rgba(220, 220, 220,1)",
                    pointHoverBorderWidth: 2,
                    pointRadius: 1,
                    pointHitRadius: 10,
                    data: []
                },
            ]
        },
        selectedData: [],
        dailyHabitData: [],
        alarmSet: [],
        selectedId: this.props.selectedHabitId,
        flag: false,
        prev: false,
        selectedDay: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
            date: new Date().getDate()
        },
        selectedDayForLineGraph: {
            year: new Date().getFullYear(),
            month: new Date().getMonth() + 1,
        },
        goalHabit: [],
        realHabit: [],
        animation: 'activated',
        canEditFlag: false,
        doneAndTotal: {
            monthDone: null,
            monthTotal: null,
        },
    }

    componentDidMount() {
        this.getCalendarData();
        this.changeLineGraph();
        this.getAlarmSet();
    }

    componentWillReceiveProps() {
        this.setState({flag: !this.state.flag})
        // this.setState({animation: 'activated'});
    }

    componentDidUpdate() {
        if (this.state.flag === this.state.prev) {
            this.getCalendarData();
            this.changeLineGraph();
            this.setState({animation: 'activated'});
            this.setState({flag: !this.state.flag});
            this.getAlarmSet();
        }
    }

    timeout;

    deactivation(_mode) {
        clearTimeout(this.timeout);

        if (_mode === 'activated') {
            this.timeout = setTimeout(function() {
                this.setState({animation:'deactivated'})
            }.bind(this), 2000);
        }
    }

    color = colors[Math.floor(this.rateOfAchievement(this.state.doneAndTotal.monthDone, this.state.doneAndTotal.monthTotal) / 10)];
    getCalendarData = async() =>{
        try {
            const res = await API.getMonthlyDataDetail({habitId: this.props.selectedHabitId, year: this.state.selectedDay.year, month:this.state.selectedDay.month})
            this.setState({selectedData: res.data.data.habit})
            this.setState({dailyHabitData: res.data.data.habit.habitName})
            const {graphData} = res.data
            let totalGraphData = [];
            let realGraphData = [];
            const lastDay = (new Date(this.state.selectedDay.year, this.state.selectedDay.month, 0).getDate())

            for (let day=1;  day<=lastDay; day ++) {
                totalGraphData.push(graphData[day].achievementData.dailyTotal)
                realGraphData.push(graphData[day].achievementData.dailyDone)
            }

            this.setState({
                goalHabit: totalGraphData,
                realHabit: realGraphData
            })
        } catch (e) {
            console.log(e)
        }

        // if (this.state.flag === this.state.prev) {
        //     this.setState({flag: !this.state.flag})
        // }
    }

    getAlarmSet = async() => {
        const habitRes = await API.getDailyOneHabitDetail({habitId: this.props.selectedHabitId, year: this.state.selectedDay.year, month: this.state.selectedDay.month, day: this.state.selectedDay.date})
        this.setState({alarmSet: habitRes.data.alarmSet})
    }

    changeDetailInfo = async(dataId) => {
        try{
            await API.changeDetailInfo({dataId: dataId})
            this.getAlarmSet()
            this.makeDetailList()
        } catch(e) {
                // return <Alert severity="error">This is an error alert — check it out!</Alert>
            alert('미래에 울릴 알람에 대한 완료/미완료는 수정이 불가능 합니다.')
        }
    }

    makeDetailList(habit, alarmSet) {
        let returnList = [];
        let temp = [];
            if (alarmSet) {
                for (const alarm of alarmSet) {
                    if (this.state.canEditFlag) {
                        alarm.is_done ?
                        temp.push(
                            <Col className="mx-2 my-1">
                                <FaHeart onClick={function() {
                                    this.changeDetailInfo(alarm.id);
                                    this.getAlarmSet();
                                }.bind(this)} style={{color:"red", cursor:'pointer', margin:3}} />
                                    {alarm.time}
                            </Col>
                        ) :
                        temp.push(
                            <Col className="mx-2 my-1">
                                <FaRegHeart onClick={function() {
                                    this.changeDetailInfo(alarm.id);
                                    this.getAlarmSet();
                                }.bind(this)} style={{color:"pink", cursor:'pointer', margin:3}} />
                                {alarm.time}
                            </Col>
                        )
                    } else {
                        alarm.is_done?
                        temp.push(
                            <Col className="mx-2 my-1">
                                <FaHeart style={{color:"red"}} /> {alarm.time}
                            </Col>
                        ) :
                        temp.push(
                            <Col className="mx-2 my-1">
                                <FaRegHeart style={{color:"red"}} /> {alarm.time}
                            </Col>
                        )
                    }
                }
                returnList.push(
                    <>
                        <Row className="mx-2 my-1">
                            <Col id="col-list" md='auto'>
                                {habit}
                            </Col>
                        </Row>
                        <Row>
                            {temp}
                        </Row>
                    </>
                )
            }
        return returnList
    }

    rateOfAchievement (nowDone, nowTotal) {
        let result = 100;

        if (nowTotal) {
            const tempResult = nowDone/nowTotal*100
            result = Math.round(tempResult)
        }

        return result
    }

    changeLineGraph = async () => {
        try {
            const res = await API.getMonthlyDataDetail({habitId: this.props.selectedHabitId, year: this.state.selectedDayForLineGraph.year, month: this.state.selectedDayForLineGraph.month });
            this.setState({doneAndTotal:{
                monthDone: res.data.data.habit.monthDone,
                monthTotal: res.data.data.habit.monthTotal
            }})
            const graphData = res.data.graphData
            let totalGraphData = [];
            let realGraphData = [];
            let days = [];
            const lastDay = (new Date(this.state.selectedDayForLineGraph.year, this.state.selectedDayForLineGraph.month, 0).getDate())
            
            for (let day=1; day<=lastDay; day++) {
                if (graphData && graphData[day]) {
                    totalGraphData.push(graphData[day].achievementData.dailyTotal)
                    realGraphData.push(graphData[day].achievementData.dailyDone)
                    days.push(`${day}일`)
                }
            }
    
            this.setState({
                dataLine: {
                    ...this.state.dataLine,
                    labels: days,
                    datasets: update(
                        this.state.dataLine.datasets,
                        {
                            [0]: {
                                data: {$set: totalGraphData}
                            },
                            [1]: {
                                data: {$set: realGraphData}
                            }
                        }
                    )
                }
            })
        } catch(e) {
            console.log(e)
        }
    }

    changeMonth(n) {
        let month = this.state.selectedDayForLineGraph.month;
        if (n) {
            month += 1;
        } else {
            month -= 1;
        }
        if (month < 1) {
            this.setState({
                selectedDayForLineGraph: {
                    month: 12,
                    year: this.state.selectedDayForLineGraph.year - 1,
                }
            })
        } else if (month > 12) {
            this.setState({
                selectedDayForLineGraph: {
                    month: 1,
                    year: this.state.selectedDayForLineGraph.year + 1,
                }
            })
        } else {
            this.setState({
                selectedDayForLineGraph: {
                    month: month,
                    year: this.state.selectedDayForLineGraph.year
                }
            });
        }
    };

    render () {
        return(
            <>
                <Container id="habit-css-data" className="p-5">
                    <Row>
                        <h3 style={{paddingLeft:"10px", fontFamily:'-apple-system, BlinkMacSystemFont, "Nanum Gothic", "Helvetica Neue", Helvetica, Arial, sans-serif'
                        }}>
                            {this.state.selectedDayForLineGraph.year}년 {this.state.selectedDayForLineGraph.month}월 달성률<br/>
                        </h3>                    </Row>
                    <Row id="col-habit" className="justify-content-md-center">
                        <Col xs="3" className="py-5 my-4 px-4">
                            {this.state.animation === 'activated' ?
                                <BarBefore rate={this.rateOfAchievement(this.state.doneAndTotal.monthDone, this.state.doneAndTotal.monthTotal)} color={this.color}/>:
                                <BarAfter rate={this.rateOfAchievement(this.state.doneAndTotal.monthDone, this.state.doneAndTotal.monthTotal)} habitName={this.state.selectedData.habitName} icon={this.props.icon} color={this.color} flag={0}/>}
                            {this.deactivation(this.state.animation)}
                        </Col>
                        <Col xs="8" className="pl-5">
                            <Row>
                                <Col lg="1" md="1" sm="1" xl="1" xs="1">
                                    <FaChevronLeft style={{cursor: "pointer"}} onClick={ async () => {
                                        await this.changeMonth(0);
                                        await this.changeLineGraph();
                                        this.setState({animation: 'activated'});
                                    }} />
                                </Col>
                                <Col lg="10" md="10" sm="10" xl="10" xs="10">
                                    <LineGraph dataLine={this.state.dataLine}/>
                                </Col>
                                <Col lg="1" md="1" sm="1" xl="1" xs="1">
                                    <FaChevronRight style={{cursor:"pointer"}} onClick={ async () => {
                                        await this.changeMonth(1);
                                        await this.changeLineGraph();
                                        this.setState({animation: 'activated'});
                                    }} />
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <Container id="habit-css-data" className="justify-content-md-center py-2 my-3" md='auto' style={{display:'flex', textAlign: "center"}}>
                    <Row className="justify-content-md-center p-2" md='auto' style={{display:'flex', textAlign: "center"}}>
                        <Col className="justify-content-md-center" md='auto' style={{display:'flex', textAlign: "center"}}>
                            <Calendar selectDay={function(today) {
                                this.setState({
                                    selectedDay: {
                                        year: today.getFullYear(),
                                        month: today.getMonth() + 1,
                                        date: today.getDate()
                                    }
                                });
                                this.setState({flag: !this.state.flag})
                            }.bind(this)}/>
                        </Col>
                        <Col id="col-habit" className="justify-content-md-center px-3" md='auto' style={{display:'flex', textAlign: "center"}}>
                            <Container>
                                <Row className="justify-content-md-center mb-3" md='auto' style={{display:'flex', textAlign: "center", fontWeight:'bold'}}>
                                    {`${this.state.selectedDay.year}년 ${this.state.selectedDay.month}월 ${this.state.selectedDay.date}일`}
                                </Row>
                                <Row>
                                    <Col className="justify-content-md-center align-items-center" md='auto' style={{display:'flex', textAlign: "center", fontSize:15}}>
                                        목표 횟수
                                    </Col>
                                    <Col className="justify-content-md-center" md='auto' style={{display:'flex', textAlign: "center", fontWeight:'bold'}}>
                                        {this.state.goalHabit[this.state.selectedDay.date - 1]}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="justify-content-md-center align-items-center" md='auto' style={{display:'flex', textAlign: "center", fontSize:15}}>
                                        달성 횟수
                                    </Col>
                                    <Col className="justify-content-md-center" md='auto' style={{display:'flex', textAlign: "center", fontWeight:'bold'}}>
                                        {this.state.realHabit[this.state.selectedDay.date - 1]}
                                    </Col>
                                </Row>
                                <Row>
                                    <Col className="justify-content-md-center align-items-center" md='auto' style={{display:'flex', textAlign: "center", fontSize:15}}>
                                        달성률
                                    </Col>
                                    <Col className="justify-content-md-center" md='auto' style={{display:'flex', textAlign: "center", fontWeight:'bold'}}>
                                        {this.state.goalHabit[this.state.selectedDay.date - 1] > 0 ? 
                                            `${Math.floor(this.state.realHabit[this.state.selectedDay.date - 1] * 100 / this.state.goalHabit[this.state.selectedDay.date - 1])}%`
                                            : '일정이 설정되지 않았습니다.'}
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>
                </Container>
                {this.state.alarmSet.length ?
                <Container id="habit-css-data" className="p-5">
                    <FaHeart style={{color:"red", margin:5}} /> : 완료
                    <FaRegHeart style={{color:"red", margin:5}} /> : 미완료
                    {!this.state.canEditFlag?
                    <>
                        <AiOutlineEdit style={{cursor: "pointer", fontSize:25, color:"grey", margin:5}} onClick={function() {
                            this.setState({canEditFlag: true})
                        }.bind(this)} /> : 수정
                    </> :
                    <>
                        <FaRegSave style={{cursor: "pointer", fontSize:25, color:"grey", margin: 5}} onClick={function() {
                            this.getCalendarData();
                            this.setState({canEditFlag:false});
                            this.setState({flag: !this.state.flag});
                        }.bind(this)} /> : 저장
                    </>}
                    <Row>
                        <Col>
                            <Container style={{backgroundColor:"#ffffff", fontcolor:"#000000", padding: '5px', borderRadius:'10px'}}>
                                {this.makeDetailList(this.state.dailyHabitData, this.state.alarmSet)}
                            </Container>
                        </Col>
                    </Row>
                </Container>:
                ''
                }
                
            </>
        )
    }
}