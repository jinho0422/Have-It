import React, { Component } from 'react';
import { Button, ButtonToolbar } from 'react-bootstrap';
import AddCalenderContents from './AddCalenderContents';

import '../../lib/styles/style.css';

export default class AddCalendarModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show:false
        }
    }

    render() {
        let closeModal = () => this.setState({show:false});

        return(
            <div>
                <div
                    onClick={function() {
                        this.setState({show:!this.state.show})
                    }.bind(this)}
                ></div>
                <AddCalenderContents
                    {...this.props}
                    title={this.props.title}
                    show={this.props.show}
                    onHide={closeModal}/>
            </div>
        );
    }
}