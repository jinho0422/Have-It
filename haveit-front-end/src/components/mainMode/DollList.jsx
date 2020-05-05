import React, { Component } from 'react';
import { Container, Row, Col, Form } from 'react-bootstrap';

export default class DollList extends Component {
    state = {
        list:[]
    }

    options() {
        let ret = [];
        
        ret.push(<option id={-1}>{'All'}</option>);

        const dollLength = window.sessionStorage.getItem('dollLength');
        
		for (let i = 0; i<dollLength; ++i) {
			let dollId = window.sessionStorage.getItem(`dollId${i}`);
			let dollName = window.sessionStorage.getItem(`dollId${i}Name`);
			ret.push(<option value={dollId}>{dollName}</option>);
        }
        
		return ret;
	}

    render() {
        return (
            <Container>
                <Row>
                    <Col className="d-flex justify-content-end" style={{padding:0}}>
                        <Form.Control
                            style={{width:150}}
                            as="select"
                            name="Doll"
                            required
                            onChange={function(e) {
                                e.preventDefault();
                                let idx = e.target.selectedIndex;
                                this.props.changeDoll(e.target[idx].value);
                            }.bind(this)}>
                            {this.options()}
                        </Form.Control>
                    </Col>
                </Row>
            </Container>
        )
    }
}