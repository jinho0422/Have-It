import React, { Component } from 'react';
import {Row, Col, Container, Button} from 'react-bootstrap';
import { Fade } from 'react-reveal';
import Chart from "react-google-charts";
import ReactSpeedometer from "react-d3-speedometer"
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

import * as API from "../../lib/api/FrontQuery";
import Clock from '../mainMode/Clock2';

export default class CushionData extends Component {
    state = {
        // seletedId: 0,
        isTrue: false,
        dollSet: [],
        selectedDollData: [],
        graphData : [],
        today: {
            date: '',
            id: 0,
            middle_:0,
            front_: 0,
            back_: 0,
            left_: 0,
            right_: 0,
            left_twisted_: 0,
            right_twisted_: 0,
            total: 0,
            percentage: 0,
            comment: '',
        },
        date: {
            year: (new Date()).getFullYear(),
            month: (new Date()).getMonth()+1,
            // date: (new Date()).getDate(),
        },
        flag: false,
        prev: false,
        mode: 'cushion',
    };

    // componentDidUpdate() {
    //     if (this.state.flag === this.state.prev){
    //         // this.getDollSet();
    //         // this.getCushionData();
    //         this.getCushionMonthlyData();
    //     }
    // }

    componentDidMount() {
        this.getDollSet();
        this.makeCushionIcon();
    }

    timeout;

    getCushionData = async () => {
        try{
            // const res = await API.getMonthlyTotalData({year: this.state.today.year, month: this.state.today.month});
            const res = await API.getCushionDailyData({dollId: this.state.selectedDollData.id});
            // console.log(this.state.selectedDollData);
            const cushion = res.data.data;
            let message = '';
            let total = (
              cushion.middle_ + cushion.front_ + cushion.back_ + cushion.left_ + cushion.right_
              + cushion.left_twisted_ + cushion.right_twisted_ );

            let percentage = (cushion.middle_ / total) * 100;
            percentage = Number(percentage.toFixed(3));
            // console.log(percentage);

            if ( percentage <= 20) {
                message = '건강 적신호!! 자세에도 신경써주세요!'
            } else if (20 < percentage <= 40) {
                message = '허리가 아파해요! 인형과 함께 더 노력해볼까요!'
            } else if (40 < percentage <= 60) {
                message = '좋아요~ 조금 더 노력해 볼까요?'
            } else if (60 < percentage <= 80) {
                message = '좋아요!! 잘 하고 있어요~~'
            } else if ( 80 <= percentage) {
                message = '대단해요! 바른 자세를 유지하고 있네요!'
            }

            this.setState({
                today: {
                    date: res.data.date,
                    id: cushion.id,
                    middle_: cushion.middle_,
                    front_: cushion.front_,
                    back_: cushion.back_,
                    left_: cushion.left_,
                    right_: cushion.right_,
                    left_twisted_: cushion.left_twisted_,
                    right_twisted_: cushion.right_twisted_,
                    total: total,
                    percentage: percentage,
                    comment: message,
                }
            });

        } catch(e) {
            console.log(e)
        }

        if (this.state.flag === this.state.prev) {
            this.setState({flag: !this.state.flag})
        }
    };

    getCushionMonthlyData = async () => {
        try {
            const res = await API.getCushionMonthlyData({
                dollId: this.state.selectedDollData.id,
                year: this.state.date.year,
                month: this.state.date.month});

            const tempMonth = res.data.graphData;
            const graphData = [
                ["날짜", "정자세", "앞쪽", "뒤쪽", "오른쪽", "왼쪽", "오른다리꼼", "왼다리꼼"],
            ];
            const lastday = res.data.date;

            for (let i=1; i<=lastday; i++) {

                if (tempMonth[i].data) {
                    graphData.push([
                        `${i}일`,
                        tempMonth[i].data.middle_,
                        tempMonth[i].data.front_,
                        tempMonth[i].data.back_,
                        tempMonth[i].data.right_,
                        tempMonth[i].data.left_,
                        tempMonth[i].data.right_twisted_,
                        tempMonth[i].data.left_twisted_,
                    ])
                } else {
                    graphData.push([
                        `${i}일`,
                        0, 0, 0, 0, 0, 0, 0
                    ])
                }
            }
            await this.setState({
                graphData: graphData,
            });

        } catch (error) {
            console.log(error);
        }
        if (this.state.flag === this.state.prev) {
            this.setState({flag: !this.state.flag})
        }
    };

    getDollSet = async () => {
        try {
            const res = await API.getCushionDoll();

            if (res.data.cushionSet && res.data.cushionSet.length) {
                await this.setState({
                    dollSet: res.data.cushionSet,
                    selectedDollData: res.data.cushionSet[0],
                    isTrue: true,
                });
                this.getCushionData();
                this.getCushionMonthlyData();
            }

        } catch (error) {
            console.log(error);
        }
    };

    makeCushionIcon() {
        const doll = [];
        const temp = ["outline-primary", "outline-secondary", "outline-success", "outline-warning", "outline-info", "outline-dark", "outline-danger"];
        let i = 0;

        for (const data of this.state.dollSet) {
            // console.log(data.dollName);
            doll.push(
              <Button
                variant= {temp[i%7]}
                style={{margin: 2}}
                onClick={function() {
                    this.setState({selectedDollData: data});
                }.bind(this)}>
                  {data.dollName}
              </Button>
            );
            i++
        }
        if (doll) return doll
    };

    changeMonth(n) {
        // console.log(n);
        let month = this.state.date.month;
        if (n) {
            month += 1;
        } else {
            month -= 1;
        }
        // console.log(month);
        if (month < 1) {
            this.setState({
                date: {
                    month: 12,
                    year: this.state.date.year - 1,
                }
            })
        } else if (month > 12) {
            this.setState({
                date: {
                    month: 1,
                    year: this.state.date.year + 1,
                }
            })
        } else {
            this.setState({
                date: {
                    month: month,
                    year: this.state.date.year
                }
            });
        }
    };


    render() {
        return(
          <>
              <Fade>
                  <Container className="py-5 px-4">
                      {this.state.isTrue ?
                              // <ButtonToolbar>
                              //     {this.makeCushionIcon()}
                              // </ButtonToolbar> :
                          <div style={{color:"#0e5891"}}>
                              <h1 className="display-4">{this.state.today.date}</h1>
                              <p className="lead">안녕하세요, {window.sessionStorage.getItem('user')}님! 지금 시각 <strong><Clock></Clock></strong>의 방석 데이터 입니다.</p>
                              <hr className="my-4"></hr>
                          </div> :
                          <div className="alert alert-light" role="alert">
                              <h4 className="alert-heading">등록된 기기가 없습니다!</h4>
                              <p></p>
                              <p style={{margin:0}}>HaveIt 에서는 인형과 연결할 수 있는 다양한 보조기구를 판매하고 있습니다.</p>
                              <p>자세교정을 돕는 추가 기기들을 연결하고 더 건강한 생활을 만들어가세요!</p>
                              <hr></hr>
                              <p className="mb-0">Help Desk: 02-3429-5041</p>
                              <p className="mb-0">평일 상담시간 : 09:00 ~ 18:00</p>
                          </div>
                      }
                  </Container>
              </Fade>


                  <Container>
                      {this.state.isTrue ?
                          <div className={"card m-3"}>
                              <div className={"card-header text-center"} style={{backgroundColor:"rgba(123,183,195,0.11)"}}><strong>{this.state.today.comment}</strong></div>
                              <div align={"center"}>
                                  <p style={{size: "0.3", color: "rgba(255,255,255,0)"}}>0</p>
                                  <ReactSpeedometer
                                      height={200}
                                      maxValue={100}
                                      segments={5}
                                      textColor={"grey"}
                                      startColor={"tomato"}
                                      endColor={"limegreen"}
                                      niddleHeightRatio={0.5}
                                      needleTransitionDuration={4000}
                                      needleTransition={"easeElastic"}
                                      value={this.state.today.percentage}
                                  />
                                  <p style={{size: "0.3", color: "rgba(111,111,111,0.82)"}}>전체 앉아있는 시간에서 정자세로 앉은 비율을 보여줍니다.</p>
                              </div>
                          </div> : <Row></Row>
                      }
                      {this.state.isTrue ?
                          <div className={"card m-3"} align={"center"}>
                              <Chart
                                  chartType="ColumnChart"
                                  width="100%"
                                  height="400px"
                                  data={[
                                      ["Element", "빈도", {role: "style"}, {
                                          sourceColumn: 0,
                                          role: 'annotation',
                                          type: 'string',
                                          calc: 'stringify',
                                      },],
                                      ["정자세", this.state.today.middle_, "#BF6989", null],
                                      ["앞쪽", this.state.today.front_, "#6878A6", null],
                                      ["뒤쪽", this.state.today.back_, "#8085A6", null],
                                      ["좌측", this.state.today.left_, "#AAADBF", null], // RGB value
                                      ["우측", this.state.today.right_, "#8E9EBF", null], // English color name
                                      ["오른다리꼼", this.state.today.right_twisted_, "#434A73", null],
                                      ["왼다리꼼", this.state.today.left_twisted_, "#585C73", null],
                                  ]}
                                  options={{
                                      bar: {groupWidth: '45%'},
                                      legend: {position: 'none'},
                                  }}
                              />
                              <p style={{size: "0.3", color: "rgba(111,111,111,0.82)"}}>오늘자 현재 시간까지의 자세입니다. 각 방향은 해당 측면으로 기울어져있음을 나타냅니다.</p>
                          </div>
                          : <Row></Row>
                      }
                      {this.state.isTrue ?
                          <div className={"card my-5 mx-3"}>
                              <div className={"card-header text-center"} style={{backgroundColor:"rgba(123,183,195,0.11)"}}>
                                  <strong>{this.state.date.year}년 {this.state.date.month}월</strong>
                              </div>
                              <div className={"py-5"}>
                                  <Row className={"text-center"}>
                                      <Col lg="1" md="1" sm="1" xl="1" xs="1">
                                          <FaChevronLeft style={{cursor: "pointer"}} onClick={ async () => {
                                              await this.changeMonth(0);
                                              await this.getCushionMonthlyData()
                                          }} />
                                      </Col>
                                      <Col lg="10" md="10" sm="10" xl="10" xs="10">
                                          <Chart
                                              chartType="Line"
                                              width="100%"
                                              height="400px"
                                              loader={<div>Loading Chart</div>}
                                              data={this.state.graphData}
                                              options={{
                                                  series: {
                                                      0: { color: '#BF6989' },
                                                      3: { color: '#6878A6' },
                                                      6: { color: '#8085A6' },
                                                      5: { color: '#AAADBF' },
                                                      4: { color: '#8E9EBF' },
                                                      2: { color: '#434A73' },
                                                      1: { color: '#585C73' },
                                                  }
                                              }}
                                          />
                                      </Col>
                                      <Col lg="1" md="1" sm="1" xl="1" xs="1">
                                          <FaChevronRight style={{cursor:"pointer"}} onClick={ async () => {
                                              await this.changeMonth(1);
                                              await this.getCushionMonthlyData()
                                          }} />
                                      </Col>
                                  </Row>
                              </div>
                          </div>: <Row></Row>
                      }
                  </Container>
              <Container className="pb-5"></Container>
          </>
        )
    }
}

