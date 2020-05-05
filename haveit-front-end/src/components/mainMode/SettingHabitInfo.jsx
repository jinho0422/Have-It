import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import EditHabitModal from '../settingMode/EditHabitModal';

import '../../lib/styles/style.css'

export default class SettingHabitInfo extends Component {

    render() {
        return(
            <Container>
                <Row>
                    <Col id="col-habit" className="justify-content-md-center">
                        <Col className="justify-content-md-center">
                            {this.props.habitName}
                        </Col>
                        <Col xs="2" md="2" style={{padding:"0px"}}>
                            <EditHabitModal
                                icon={this.props.icon}
                                habitId={this.props.habitId}
                                habitName={this.props.habitName}
                                changeFlag={this.props.changeFlag}
                                changeSettingPageFlag={this.props.changeSettingPageFlag}/>
                        </Col>
                    </Col>
                </Row>
            </Container>
        )
    }
}