import React, { Component } from 'react'
import { Container, Modal, Button, Row, Col, Form, ButtonToolbar } from 'react-bootstrap';
import * as API from '../../lib/api/FrontQuery';

const dayOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default class EditRoutineModalContents extends Component {
	state = {
		startHour: this.props.startHour,
		startMin: this.props.startMin,
		weekId: this.props.weekId,
		repeat: this.props.repeat,
		endHour: this.props.endHour,
		endMin: this.props.endMin,
		dollId: this.props.selectedDollId,
		isAmStart: this.props.isAmStart,
		isAmEnd: this.props.isAmEnd,
		habitNotiId: this.props.habitNotiId,
		error: null,
	}


	hourList(max) {
		let ret = [];
		for (let i=0; i<=max; i++) ret.push(<option>{i}</option>)
		return ret;
	}

	minuteList() {
		let ret = [];
		for (let i=0; i<60; i+=5) ret.push(<option>{i}</option>)
		return ret;
	}

	iterList() {
		let ret = [];
		ret.push(<option>없음</option>);
		ret.push(<option>{5}</option>);
		ret.push(<option>{10}</option>);
		ret.push(<option>{15}</option>);
		ret.push(<option>{30}</option>);
		ret.push(<option>{60}</option>);
		return ret;
	}

	makeDollForm() {
		let ret = [];
		const dollLength = window.sessionStorage.getItem('dollLength');
		for (let i = 0; i<dollLength; ++i) {
			let dollId = window.sessionStorage.getItem(`dollId${i}`);
			let dollName = window.sessionStorage.getItem(`dollId${i}Name`);
			ret.push(<option value={dollId}>{dollName}</option>);
		}
		return ret;
	}

	amPmStartList() {
		let ret = [];
		ret.push(<option value={1}>오전</option>);
		ret.push(<option value={0}>오후</option>);
		return ret;
	}

	amPmEndList() {
		let ret = [];
		ret.push(<option value={1}>오전</option>);
		ret.push(<option value={0}>오후</option>);
		return ret;
	}

	printWeek() {
        let ret = [];
        
        for (let i=0; i<7; i++) {
			let color = i === 6 ? 'blue' : i === 0 ? 'red' : 'black';
			let backColor = this.state.weekId & (1 << i) ? 'white' : 'lightgrey';
			let opacity = this.state.weekId & (1 << i) ? 1 : 0.3;

            ret.push(<Col md="auto" style={{padding:5, width:40}}>
                <ButtonToolbar>
                    <Button
						key={i}
                        id='button-day'
                        variant='primary'
                        style={{color:color, opacity:opacity, width:30, padding:0, fontWeight:'bold', backgroundColor:backColor}}
                        onClick={function() {
							if (this.state.weekId & (1 << i)) this.setState({weekId:(this.state.weekId & ~(1 << i))});
							else this.setState({weekId:(this.state.weekId | (1 << i))});
                        }.bind(this)}
                    >{dayOfWeek[i]}</Button>
                </ButtonToolbar></Col>
            );
		}

		let weekDayFlag = false, weekDayBit = this.state.weekId;
		for (let i=1; i<=5; i++) if (!(this.state.weekId & (1 << i))) weekDayFlag = true;
		let weekDayOpacity = weekDayFlag ? 0.3 : 1;

		ret.push(<Col md="auto" style={{marginLeft:20, padding:5, width:55}}>
			<ButtonToolbar>
				<Button
					id='button-day'
					variant='primary'
					style={{color:'black', opacity:weekDayOpacity, width:80, padding:0, fontWeight:'bold'}}
					onClick={function() {
						if (weekDayFlag) for (let i=1; i<=5; i++) weekDayBit |= (1 << i);
						else for (let i=1; i<=5; i++) weekDayBit &= ~(1 << i);
						this.setState({weekId:weekDayBit});
					}.bind(this)}
				>평일</Button>
			</ButtonToolbar></Col>
		);

		let weekEndFlag = false, weekEndBit = this.state.weekId;
		for (let i=0; i<7; i+=6) if (!(this.state.weekId & (1 << i))) weekEndFlag = true;
		let weekEndOpacity = weekEndFlag ? 0.3 : 1;

		ret.push(<Col md="auto" style={{padding:5, width:55}}>
			<ButtonToolbar>
				<Button
					id='button-day'
					variant='primary'
					style={{color:'red', opacity:weekEndOpacity, width:80, padding:0, fontWeight:'bold'}}
					onClick={function() {
						if (weekEndFlag) for (let i=0; i<7; i+=6) weekEndBit |= (1 << i);
						else for (let i=0; i<7; i+=6) weekEndBit &= ~(1 << i);
						this.setState({weekId:weekEndBit});
					}.bind(this)}
				>주말</Button>
			</ButtonToolbar></Col>
		);

		return ret;
	}

	handleStartHourChange(event) {
		this.setState({startHour: event.target.value});
	}

	handleStartMinChange(event) {
		this.setState({startMin: event.target.value})
	}
	
	handleIsAmStartChange(event) {
		this.setState({isAmStart: event.target.value})
	}	

	handleIsAmEndChange(event) {
		this.setState({isAmEnd: event.target.value})
	}

	handleRepeatChange(event) {
		this.setState({repeat: event.target.value})
	}

	handleEndHourChange(event) {
		this.setState({endHour: event.target.value})
	}

	handleEndMinChange(event) {
		this.setState({endMin: event.target.value})
	}

	handleDollIdChange(event) {
		this.setState({dollId: event.target.value})
	}

    getData = async () => {
        let res = await API.getHabitNoti();
        let { habit } = res.data;
    
        if (JSON.stringify(habit) !== JSON.stringify(this.state.habit)) {
            this.setState({habit: habit});
		}
		
        if (this.state.prev !== this.state.flag) {
            this.setState({ flag:!this.state.flag });
        }
	};
	
	requestAndGetMessage = async (habitId, habitNotiId, time, weekId, repeat, dollId, endTime) => {
		try {
			await API.changeHabitNoti({ habitId, habitNotiId, time, weekId, repeat, dollId, endTime });
			this.props.changeSettingList();
		} catch (e) {
			alert(e.response.data.response)
		}
	}

	handleSubmit(e) {
		e.preventDefault();
		const isAmStartInt = Number(this.state.isAmStart);
		const startHourInt= Number(this.state.startHour);
		const startMinInt = Number(this.state.startMin);

		const isAmEndInt = Number(this.state.isAmEnd);
		const endHourInt= Number(this.state.endHour);
		const endMinInt = Number(this.state.endMin);

		let finalStartTime = startHourInt;
		let finalStartMin = startMinInt;

		let finalEndTime = endHourInt;
		let finalEndMin = endMinInt;

		if (startHourInt < 10) {
			if (isAmStartInt) {
				finalStartTime = '0' + startHourInt
			} else {
				finalStartTime = startHourInt + 12
			}
		} else {
			if (!isAmStartInt) {
				if (startHourInt === 12){
					finalStartTime = 12
				} else {
					finalStartTime = startHourInt + 12
				}
			}
		}

		if (startMinInt < 10) {
			finalStartMin = '0' + startMinInt
		}

		if (endHourInt < 10) {
			if (isAmEndInt) {
				finalEndTime = '0' + endHourInt
			} else {
				finalEndTime = endHourInt + 12
			}
		} else {
			if (!isAmEndInt) {
				if (endHourInt === 12) {
					finalEndTime = 12
				} else {
					finalEndTime = endHourInt + 12
				}
			}
		}

		if (endMinInt < 10) {
			finalEndMin = '0' + endMinInt
		}

		const totalStartTime = `${finalStartTime}:${finalStartMin}`
		let totalEndTime = `${finalEndTime}:${finalEndMin}`

		// 요일이 0일 때와 시작시간 종료시간 검증, 반복을 안 할 때

		let Flag = true

		if (this.state.weekId < 1) {
			alert('알람이 울릴 요일을 선택하셔야 합니다.');
			Flag = false;
		}

		if (this.state.repeat !== 0) {
			if (Number(finalStartTime) > Number(finalEndTime)) {
				alert('종료시간이 시작시간보다 빠를 수 없습니다.');
				Flag = false;
			} 
			else if (Number(finalStartTime) === Number(finalEndTime)) {
				if (Number(this.state.startMin) > Number(this.state.endMin)) {
					alert('종료시간이 시작시간보다 빠를 수 없습니다.');
					Flag = false;
				}
			}
		}

		if (this.state.repeat === 0) {
			if (Number(this.state.endHour) || Number(this.state.endMin)) {
				alert('반복을 설정하지 않으실 경우, 종료시간을 지정하실 수 없습니다.');
				Flag = false;
			}
		}

		if (this.state.repeat === 0) {
			totalEndTime = null
		}

		if (Flag){
			this.requestAndGetMessage(this.props.habitId, this.state.habitNotiId, totalStartTime, this.state.weekId, this.state.repeat, this.state.dollId, totalEndTime)
			this.props.onHide();
		};
		
		
		this.props.changeSettingList();
	};
	
	render() {
		return (
			<Modal
				{...this.props}
				size={this.props.size}
				aria-labelledby="contained-modal-title-vcenter"
				centered>
				<Modal.Header className="justify-content-md-center">
					<Modal.Title id="contained-modal-title-vcenter">
						{this.props.title}
					</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Row className="justify-content-md-center">
						<Col md='auto'>
							<Form onSubmit={(e) => {this.handleSubmit(e)}}>
								<Container className="justify-content-md-center">
									<Row>
										<Col style={{padding:0}}>
											<Form.Group>
												<Form.Label>기기명</Form.Label>
												<Form.Control
													as="select"
													name="Machine"
													value={this.state.dollId}
													onChange={(e) => {this.handleDollIdChange(e)}}
													required>
													{this.makeDollForm()}
												</Form.Control>
											</Form.Group>
										</Col>
									</Row>
									<Row>
										<Col md={3} style={{padding:0, marginRight:10}}>
											<Form.Group>
												<Form.Label>오전 / 오후</Form.Label>
												<Form.Control
													as="select"
													name="StartAMPM"
													value={this.state.isAmStart}
													onChange={(e) => {this.handleIsAmStartChange(e)}}
													required>
													{this.amPmStartList()}
												</Form.Control>
											</Form.Group>
										</Col>
										<Col style={{padding:0, marginRight:10}}>
											<Form.Group>
												<Form.Label>시</Form.Label>
												<Form.Control
													as="select"
													name="StartHour"
													value={this.state.startHour}
													onChange={(e) => {this.handleStartHourChange(e)}}
													required>
													{this.hourList(12)}
												</Form.Control>
											</Form.Group>
										</Col>
										<Col style={{padding:0, marginRight:10}}>
											<Form.Group>
												<Form.Label>분에 시작</Form.Label>
												<Form.Control
													as="select"
													name="StartMinute"
													value={this.state.startMin}
													onChange={(e) => {this.handleStartMinChange(e)}}
													required>
													{this.minuteList()}
												</Form.Control>
											</Form.Group>
										</Col>
										<Col style={{padding:0}}>
											<Form.Group>
												<Form.Label>분마다 반복</Form.Label>
												<Form.Control
													as="select"
													name="IterHour"
													value={this.state.repeat}
													onChange={(e) => {this.handleRepeatChange(e)}}
													required>
													{this.iterList()}
												</Form.Control>
											</Form.Group>
										</Col>
									</Row>
									<Row>
										<Col style={{padding:0, marginRight:10}}>
											<Form.Group>
												<Form.Label>오전 / 오후</Form.Label>
												<Form.Control
													as="select"
													name="EndAMPM"
													value={this.state.isAmEnd}
													onChange={(e) => {this.handleIsAmEndChange(e)}}
													required>
													{this.amPmEndList()}
												</Form.Control>
											</Form.Group>
										</Col>
										<Col style={{padding:0, marginRight:10}}>
											<Form.Group>
												<Form.Label>시</Form.Label>
												<Form.Control
													as="select"
													name="EndHour"
													value={this.state.endHour}
													onChange={(e) => {this.handleEndHourChange(e)}}
													required>
													{this.hourList(12)}
												</Form.Control>
											</Form.Group>
										</Col>
										<Col style={{padding:0}}>
											<Form.Group>
												<Form.Label>분에 종료</Form.Label>
												<Form.Control
													as="select"
													name="EndMinute"
													value={this.state.endMin}
													onChange={(e) => {this.handleEndMinChange(e)}}
													required>
													{this.minuteList()}
												</Form.Control>
											</Form.Group>
										</Col>
									</Row>
									<Row>
										<Form.Group controlId="Day">
											<Form.Label>요일</Form.Label>
											<Col style={{display:'flex', padding:0}}>{this.printWeek()}</Col>
										</Form.Group>
									</Row>
									<Row className="justify-content-md-center"> 
										<Form.Group style={{margin:5}}>
											<Button type="submit">저장</Button>
										</Form.Group>
										<Form.Group style={{margin:5}}>
											<Button onClick={function() {
												this.props.onHide();
											}.bind(this)}>닫기</Button>
										</Form.Group>
									</Row>
								</Container>
							</Form>
						</Col>
					</Row>
				</Modal.Body>
			</Modal>
		);
	}
}
