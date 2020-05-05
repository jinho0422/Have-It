import React, { Component } from "react";
import { startOfWeek, addDays, startOfMonth, endOfMonth, endOfWeek, isSameMonth, isSameDay, 
  addMonths, subMonths, format, addYears, subYears, setDay,isSunday } from "date-fns";
import '../../lib/styles/cal.css'
import AddCalenderContents from '../settingMode/AddCalenderContents';
import AddCalendarModal from '../settingMode/AddCalendarModal';
import {Button, ButtonToolbar} from 'react-bootstrap';
class Calendar extends React.Component {
  state = {
    currentMonth: new Date(),
    selectedDate: new Date(),
    //show:false,
    thisDay: '',
  };

  renderHeader() {
    const dateFormat = "MMMM yyyy";
    return (
      <div className="header row flex-middle">
        <div className="col col-start" >
        </div>
        <div className="col col-center">
          <div className="icon" onClick={this.prevYear}>
           fast_rewind
          </div>
          <div className="icon" onClick={this.prevMonth}>
            chevron_left
          </div>
          <span>{format(this.state.currentMonth, dateFormat)}</span>
          <div className="icon" onClick={this.nextMonth}>
            chevron_right
            </div>
          <div className="icon" onClick={this.nextYear}>
            fast_forward
            </div>
        </div>
        <div className="col col-end">
        <div className="icon" onClick={this.nowDated}>
            autorenew
            </div>
        </div>
      </div>
    );
  }
  renderDays() {
    const dateFormat = "iiii";
    const days = [];
    let startDate = startOfWeek(this.state.currentMonth);
    
    for (let i = 0; i < 7; i++) {
      var color = (i == 0 ? "red" : i == 6 ? "blue" : "black");
      
      days.push(
        <div className="col col-center" style={{color:color}} key={i}>
          {format(addDays(startDate, i), dateFormat)}
        </div>)
    }
    return <div className="days row">{days}</div>;
  }
  renderCells() {
    const { currentMonth, selectedDate } = this.state;
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);
    const dateFormat = "d";
    const rows = [];
    let days = [];
    let day = startDate;
    let formattedDate = "";

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        formattedDate = format(day, dateFormat);
        const cloneDay = day;
        
        var color1 = (isSunday(cloneDay) && isSameMonth(day, monthStart)  ? "red" : "");
        days.push(
          <div
            
            onClick = {() => {
              // console.log("hihi",cloneDay)
              this.setState({
                thisDay:cloneDay+ ' ',
                show:!this.state.show
              });
            }}
            className={`col cell ${
              !isSameMonth(day, monthStart)
                ? "disabled"
                : isSameDay(day, selectedDate) ? "selected" : ""
              }`} 
            key={day}
            style={{color:color1}}>
            <AddCalenderContents 
              title={this.state.thisDay} 
              show={this.state.show}
              onHide={function() {
                this.setState({show:!this.state.show})
                // console.log("cell",this.props.title)
              }.bind(this)}/>
            <span className="number">{formattedDate}</span>
            {/* <span className="bg">{formattedDate}</span> */}
        </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div className="row" key={day}>
          {days}
        </div>
      );
      days = [];  
    }
    return <div className="body">{rows}</div>;
  }

 
  nextMonth = () => {
    this.setState({
      currentMonth: addMonths(this.state.currentMonth, 1)
    });
  };
  nextYear = () => {
    this.setState({
      currentMonth: addYears(this.state.currentMonth, 1)
    });
  };
  prevMonth = () => {
    this.setState({
      currentMonth: subMonths(this.state.currentMonth, 1)
    });
  };
  prevYear = () => {
    this.setState({
      currentMonth: subYears(this.state.currentMonth, 1)
    });
  };
  nowDated = () => {
    this.setState({
      currentMonth: setDay(new Date(), 0)
    });
  };
  render() {
    return (
      <div className="calendar">
        {this.renderHeader()}
        {this.renderDays()}
        {this.renderCells()}
  
      </div>
    );
  }
}
export default Calendar;