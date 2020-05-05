import React, { Component } from 'react';
import { XYPlot, VerticalBarSeries } from 'react-vis';
import { Container, Col, Row } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../node_modules/react-vis/dist/style.css';

const data2 = [
  {x: 0, y: 8},
  {x: 1, y: 5},
  {x: 2, y: 4},
  {x: 3, y: 9},
  {x: 4, y: 1},
  {x: 5, y: 7},
  {x: 6, y: 6},
  {x: 7, y: 3},
  {x: 8, y: 2},
  {x: 9, y: 0}
];

export default class Circle extends Component {
  render() {
    return (
      <div>
        <Container>
          <Row>
            <Col md={{offset:1, span: 3}}>
              <XYPlot height={200} width={200}>
                <VerticalBarSeries data={data2}></VerticalBarSeries>
              </XYPlot>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}