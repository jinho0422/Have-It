import React, { Component } from "react";
import { Line } from "react-chartjs-2";
import { MDBContainer } from "mdbreact";

class ChartsPage extends Component {
  state = {
    data: this.props.dataLine
  }

  componentWillReceiveProps() {
    this.setState({data: this.props.dataLine})
  }

  render() {
    return (
      <MDBContainer style={{display:'flex', alignItems:'center'}}>
          <h3 className="mt-5">{this.props.title}</h3>
          <Line data={this.props.dataLine} options={{ responsive: true }}/>
      </MDBContainer>
    );
  }
}

export default ChartsPage;