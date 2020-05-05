import React, { Component } from 'react';

import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import { Container, Row } from 'react-bootstrap';
import "react-circular-progressbar/dist/styles.css";

import ChangingProgressProvider from "../../effects/ChangingProgressProvider";

export default class BarBefore extends Component {
    render() {
        function Example(props) {
            return (
                <Container style={{ display: "flex" }} className="justify-content-md-center">
                    <Row>{props.children}</Row>
                </Container>
            )
        }

        return (
            <Container style={{position: 'relative'}}>
                <Example>
                    <div>
                        <ChangingProgressProvider values={[0, this.props.rate]}>
                            {percentage => (
                                <CircularProgressbar
                                    value={percentage}
                                    text={`${this.props.rate}%`}
                                    styles={buildStyles({
                                        pathTransition:percentage === 0 ? "none" : "stroke-dashoffset 0.7s ease 0s",
                                        pathColor:this.props.color,
                                        textColor:this.props.color,
                                        trailColor:'rgba(255, 255, 255, 0.7)'
                                })}></CircularProgressbar>
                        )}</ChangingProgressProvider>
                    </div>
                </Example>
            </Container>
        )
    }
}