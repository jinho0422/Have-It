import React, { Component } from 'react';
import { Button } from 'react-bootstrap';
import EditAlarmModalContents from './EditAlarmModalContents';
import * as API from '../../lib/api/FrontQuery';

import '../../lib/styles/style.css'

export default class EditAlarmModal extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show:false
        }
    }

    deleteHabitAlarm = async(habitId, notificationId) => {
        if (window.confirm("알람을 삭제하시겠습니까?")) {
            try {
                await API.deleteHabitDetail({habitId, notificationId});
                // this.props.changeFlag();
            } catch(e) {
                alert(e.response.data.message)
            }
        }
        this.props.changeFlag();
    }

    render() {
        return(
            <div md="auto" className="justify-content-md-center" style={{display:'flex', alignItems:'center'}}>
                <Button
                    id='button-day'
                    className="ml-2 my-1"
                    style={{fontSize:12}}
                    onClick={function() {
                        this.setState({show:true});
                    }.bind(this)}>수정</Button>
                <Button
                    id='button-day'
                    className="ml-2 my-1"
                    style={{fontSize:12}}
                    onClick={function() {
                        this.deleteHabitAlarm(this.props.habitId, this.props.data.id);
                    }.bind(this)}
                    >삭제</Button>
                {this.state.show ? <EditAlarmModalContents
                    data={this.props.data}
                    habitId={this.props.habitId}
                    habitName={this.props.habitName}
                    dollId={this.props.dollId}
                    changeFlag={this.props.changeFlag}
                    show={this.state.show}
                    onHide={function() {
                        this.setState({show:false})
                    }.bind(this)}/> : ''}
            </div>
        );
    }
}