import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import AddRoutineModalContents from './AddRoutineModalContents';

import '../../lib/styles/style.css';

export default class AddRoutineModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show:false
        }
    }

    render() {
        let closeModal = () => this.setState({show:false});
        
        return(
            <Container className="p-0">
                <Button
                    id='button-day'
                    style={{color:this.props.color, width:this.props.width, fontWeight:'bold', display:'flex', alignItems:'center'}}
                    onClick={function() {
                        this.setState({show:!this.state.show});
                    }.bind(this)}
                >추가</Button>
                <AddRoutineModalContents
                    habitId={this.props.habitId}
                    title='새로운 일정 추가'
                    show={this.state.show}
                    onHide={closeModal}
                    changeFlag={this.props.changeFlag}
                    // changeSettingList={this.props.changeSettingList}
                />
            </Container>
        );
    }
}