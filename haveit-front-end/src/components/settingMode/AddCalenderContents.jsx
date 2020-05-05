import React, { Component } from 'react';
import styled from 'styled-components';
import palette from '../../lib/styles/palette';
import { Modal, Button, Row, Col, Form } from 'react-bootstrap';

export default class AddCalenderContents extends Component {

    render() {
        return (
          <>
            <Modal
                {...this.props}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered>

                <Modal.Header>
                  <Modal.Title id="contained-modal-title-vcenter" >
                    {this.props.title}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                </Modal.Body>

                <Button onClick={function() {
                  this.props.onHide();
                }.bind(this)}>닫기</Button>
            </Modal>
          </>
        )
    }
}