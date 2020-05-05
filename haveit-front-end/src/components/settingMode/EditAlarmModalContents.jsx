import React, { Component } from 'react'
import { Container, Modal, Button, Row, Col, Form, ButtonToolbar } from 'react-bootstrap';
import * as API from '../../lib/api/FrontQuery';

const dayOfWeek = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

export default class EditAlarmModalContents extends Component {
	state = {
		habitId: this.props.habitId,
		dollId: this.props.dollId,
		habitName: this.props.habitName,
		weekId: this.props.data.weekId,
		alarmId: this.props.data.id,
		startAMPM: Math.floor(Number(this.props.data.time.replace(":", "")) / 100) > 12 ? 0 : 1,
		startHour: Math.floor(Number(this.props.data.time.replace(":", "")) / 100) > 12 ? Math.floor(Number(this.props.data.time.replace(":", "")) / 100) - 12 : Math.floor(Number(this.props.data.time.replace(":", "")) / 100),
		startMinute: Number(this.props.data.time.replace(":", "")) % 100,
		endAMPM: this.props.data.endTime !== null ? (Math.floor(Number(this.props.data.endTime.replace(":", "")) / 100) > 12 ? 0 : 1) : '',
		endHour: this.props.data.endTime !== null ? (Math.floor(Number(this.props.data.endTime.replace(":", "")) / 100) > 12 ? Math.floor(Number(this.props.data.endTime.replace(":", "")) / 100) - 12: Math.floor(Number(this.props.data.endTime.replace(":", "")) / 100)) : '',
		endMinute: this.props.data.endTime !== null ? Number(this.props.data.endTime.replace(":", "")) % 100 : '',
		repeat: this.props.data.repeat,
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

	amPmList() {
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

	requestAndGetMessage = async (habitId, habitNotiId, time, weekId, repeat, dollId, endTime) => {
		try {
			await API.changeHabitNoti({ habitId, habitNotiId, time, weekId, repeat, dollId, endTime });
			this.props.changeFlag();
		} catch (e) {
			// console.log(e);
			alert(e.response.data.message)
			// console.log(e.response.data.message);
		}
	}

	submit(e) {
		e.preventDefault();

		let startHour = `${Number(e.target.StartHour.value) + (1 - Number(e.target.StartAMPM.value)) * 12 < 10 ? '0' : ''}${Number(e.target.StartHour.value) + (1 - Number(e.target.StartAMPM.value)) * 12}`;
		let startMinute = `${Number(e.target.StartMinute.value) < 10 ? '0' : ''}${e.target.StartMinute.value}`;
		let endHour = `${Number(e.target.EndHour.value) + (1 - Number(e.target.EndAMPM.value)) * 12 < 10 ? '0' : ''}${Number(e.target.EndHour.value) + (1 - Number(e.target.EndAMPM.value)) * 12}`;
		let endMinute = `${Number(e.target.EndMinute.value) < 10 ? '0' : ''}${e.target.EndMinute.value}`;
		let Flag = true

		if (this.state.weekId < 1) {
			alert('알람이 울릴 요일을 선택하셔야 합니다.');
			Flag = false;
		}

		// if (this.state.repeat !== 0) {
		// 	if (Number(finalStartTime) > Number(finalEndTime)) {
		// 		alert('종료시간이 시작시간보다 빠를 수 없습니다.');
		// 		Flag = false;
		// 	} 
		// 	else if (Number(finalStartTime) === Number(finalEndTime)) {
		// 		if (Number(this.state.startMin) > Number(this.state.endMin)) {
		// 			alert('종료시간이 시작시간보다 빠를 수 없습니다.');
		// 			Flag = false;
		// 		}
		// 	}
		// }

		// if (this.state.repeat === 0) {
		// 	if (Number(this.state.endHour) || Number(this.state.endMin)) {
		// 		alert('반복을 설정하지 않으실 경우, 종료시간을 지정하실 수 없습니다.');
		// 		Flag = false;
		// 	}
		// }

		if (!Flag) return;

		this.requestAndGetMessage(
			this.state.habitId, 
			this.state.alarmId,
			`${startHour}:${startMinute}`, 
			this.state.weekId,
			e.target.IterHour.value === '없음' ? 0 : e.target.IterHour.value,
			e.target.Machine.value,
			this.state.repeat !== 0 ? `${endHour}:${endMinute}` : null)
		
		this.props.onHide();
		this.props.changeFlag();
	}

	render() {
		return (
			<Modal
				{...this.props}
				size='md'
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
							<Form onSubmit={(e) => {this.submit(e)}}>
								<Container className="justify-content-md-center">
									<Row>
										<Col style={{padding:0}}>
											<Form.Group>
												<Form.Label>기기명</Form.Label>
												<Form.Control
													as="select"
													name="Machine"
													value={this.state.dollId}
													onChange={function(e) {
														this.setState({dollId:e.target.value})
													}.bind(this)}
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
													value={this.state.startAMPM}
													onChange={function(e) {
														this.setState({startAMPM:e.target.value})
													}.bind(this)}
													required>
													{this.amPmList()}
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
													onChange={function(e) {
														this.setState({startHour:e.target.value})
													}.bind(this)}
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
													value={this.state.startMinute}
													onChange={function(e) {
														this.setState({startMinute:e.target.value})
													}.bind(this)}
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
													onChange={function(e) {
														this.setState({repeat:e.target.value})
													}.bind(this)}
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
													value={this.state.endAMPM}
													onChange={function(e) {
														this.setState({endAMPM:e.target.value})
													}.bind(this)}
													required>
													{this.amPmList()}
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
													onChange={function(e) {
														this.setState({endHour:e.target.value})
													}.bind(this)}
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
													value={this.state.endMinute}
													onChange={function(e) {
														this.setState({endMinute:e.target.value})
													}.bind(this)}
													required>
													{this.minuteList()}
												</Form.Control>
											</Form.Group>
										</Col>
									</Row>
									<Row>
										<Form.Group controlId="Day">
											<Form.Label>요일</Form.Label>
											<Col className="justify-content-md-center p-0" style={{display:'flex'}}>{this.printWeek()}</Col>
										</Form.Group>
									</Row>
									<Row className="justify-content-md-center"> 
										<Form.Group className="m-2"> {/* was margin = 5 */}
											<Button type="submit">저장</Button>
										</Form.Group>
										<Form.Group className="m-2">
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
