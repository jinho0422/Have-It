import React, { Component } from 'react';
import {Row, Col, Card} from 'react-bootstrap';
import Switch from '@material-ui/core/Switch';
import * as API from '../../lib/api/DollQuery';
// import * as DollAPI from '../../lib/api/DollQuery';


export default class DollInforCard extends Component {
    state = {
        checked: this.props.checked,
    }

    cushion = this.props.machine ? "Y" : "N";

    changeDollStatus = async(dollId) => {
        try {
            const res = await API.changeDollStatus({dollId: dollId});
            alert(res);
        } catch (e) {
            alert(e.response.data.message);
            this.setState({checked: !this.state.checked})
        }
    }

    askDollSync = async(dollId) => {
        try {
            const res = await API.dollSync({dollId: dollId});
            alert(res);
        } catch (e) {
            alert(e.response.data.message);
        }
    }

    render () {
        return (
            <Card /*bg="dark"*/ text="black" /*style={{ width: '18rem' }}*/>
            {/* <Switch
                checked={this.state.checked}
                onChange={function() {
                    this.setState({checked: !this.state.checked});
                    this.changeDollStatus(this.props.dollId);
                    console.log('?')
                }.bind(this)}
                value="checked"
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
            /> */}
                <Card.Header style={{fontSize:18, fontWeight:'bold'}}>
                    <Row>
                        <Col>
                            {this.props.dollName}
                        </Col>
                    </Row>
                </Card.Header>
                <Card.Body>
                    <Card.Title className="m-0 py-1" style={{fontSize:15}}>S/N : {this.props.dollSerial}</Card.Title>
                    <Card.Title className="m-0 py-1" style={{fontSize:15}}>방석 : {this.cushion}</Card.Title>
                    <Card.Title className="m-0 py-1" style={{fontSize:15}}>알람 활성화 : <Switch
                        checked={this.state.checked}
                        onChange={function() {
                            this.setState({checked: !this.state.checked});
                            this.changeDollStatus(this.props.dollId);
                        }.bind(this)}
                        value="checked"
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    /></Card.Title>
                </Card.Body>
                <Card.Footer class="card-footer text-left">
                    <button
                        type="button"
                        className="btn btn-sm text-center mr-1"
                        style={{backgroundColor: "rgba(145,146,182,0.35)"}}
                        onClick={function (e) {
                            e.preventDefault();
                            if (window.confirm('설정한 알람과 인형의 알람 정보를 동기화 시킵니다. 인형이 정상적으로 켜져 있는 것을 확인해주세요.')) {
                                //console.log(this.state.dollIds[i]);
                                this.askDollSync(this.props.dollId);
                            }
                        }.bind(this)}>알람 동기화
                    </button>
                        <button
                            type="button"
                            className="btn btn-sm text-center"
                            style={{backgroundColor: "rgba(182,147,146,0.18)"}}
                            onClick={function (e) {
                                e.preventDefault();
                                if (window.confirm('인형을 초기화 시킵니다. 인형이 정상적으로 켜져 있는 것을 확인해주세요.')) {
                                    //console.log(this.state.dollIds[i]);
                                    API.deleteDoll({dollId: this.props.dollId}).then(res => {
                                        this.getData();
                                    }).catch(e => {
                                        alert(e.response.data.message)
                                    });
                                }
                            }.bind(this)}>인형 초기화
                        </button>
                </Card.Footer>
            </Card>
        )
    }
}