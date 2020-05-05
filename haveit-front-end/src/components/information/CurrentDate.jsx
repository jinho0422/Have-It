import React, { Component } from 'react';

export default class CurrentDate extends Component {
    dayOfWeek = ['일', '월', '화', '수', '목', '금', '토'];
    // dayOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thu', 'Friday', 'Saturday'];

    newDate = new Date();
    date = this.newDate.getDate();
    month = this.newDate.getMonth() + 1;
    year = this.newDate.getFullYear();
    day = this.dayOfWeek[this.newDate.getDay()];

    ret = this.year + "." + (this.month < 10 ? "0" : "") + this.month + "." + (this.date < 10 ? "0" : "") + this.date + ". " + this.day;

    render() {
        return(
            <div style={{fontSize:this.props.size}}>{this.ret}</div>
        )
    }
}