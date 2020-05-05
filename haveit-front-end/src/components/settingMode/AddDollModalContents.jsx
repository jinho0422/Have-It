import React, { Component } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import * as postmashine from '../../lib/api/DollQuery';
import * as API from '../../lib/api/auth.js';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';
import { PushSpinner } from "react-spinners-kit";

const StyledInput = styled.input`
  font-size: 1rem;
  border: none;
  border-bottom: 1px solid ${palette.gray[5]};
  padding-bottom: 0.5rem;
  outline: none;
  width: 100%;
  &:focus {
    color: $oc-teal-7;
    border-bottom: 1px solid ${palette.gray[7]};
  }
  & + & {
    margin-top: 1rem;
  }
`;


export default class AddDollModalContents extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            data: ''
        };
    }

    render() {
        return (
            <div>
                <Modal
                    {...this.props}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    chek="0"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            기기등록
                </Modal.Title>
                    </Modal.Header>
                    <Form onSubmit={function (e) {
                        e.preventDefault();

                        postmashine.postmashine({ serialNumber: e.target.serialNumber.value, dollName: e.target.dollName.value })
                            .then(response => {
                                this.setState({
                                    data: response.status
                                });

                                 //console.log(this.state.data)   

                                if (this.state.data === 200) {
                                    this.setState({loading: false});
                                    // this.state.loading = false;
                                    this.props.onHide();
                                    alert(response.data.message);
                                    this.props.changeFlag();
                                    API.check().then(responese => {
                                        //console.log(responese.data.user.dolls)
                                        let dollLength = responese.data.user.dolls.length - 1;
                                        window.sessionStorage.setItem('dollId' + dollLength, responese.data.user.dolls[dollLength].id);
                                        window.sessionStorage.setItem('dollId' + dollLength + 'Name', responese.data.user.dolls[dollLength].dollName);
                                        ++dollLength
                                        window.sessionStorage.setItem('dollLength', dollLength);
                                    })
                                }
                             })           
                            .catch(response => {
                                // console.log('ddd');
                                //console.log(response);
                                this.setState({data: response.status}); 
                                this.setState({loading: false});
                                // this.state.loading = false;
                                this.props.onHide();                          
                                alert('시리얼넘버를 확인하세요');           
                            })
                    }.bind(this)}>

                        <Modal.Body>
                            <Row>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>serialNumber</Form.Label>
                                        <StyledInput
                                            autoComplete="serialNumber"
                                            name="serialNumber"
                                        />
                                    </Form.Group>
                                </Col>
                                <Col>
                                    <Form.Group>
                                        <Form.Label>dollName</Form.Label>
                                        <StyledInput
                                            autoComplete="dollName"
                                            name="dollName"
                                        />
                                    </Form.Group>
                                </Col>
                            </Row>
                        </Modal.Body>
                        <Modal.Footer>

                            <Button
                                type="submit"
                                onClick={function () {
                                    this.setState({ loading: !this.state.loading })
                                }.bind(this)}>

                                동기화</Button>
                            <PushSpinner
                                size={50}
                                color="#686769"
                                loading={this.state.loading} />
                        </Modal.Footer>

                    </Form>

                </Modal>

            </div>
        );
    }
}