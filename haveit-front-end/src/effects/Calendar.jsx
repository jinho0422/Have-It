import React from 'react';
import InfiniteCalendar from 'react-infinite-calendar';
import './calCss.css'; // only needs to be imported once

// Render the Calendar
const today = new Date();
// var lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 7);

export default class Calender extends React.Component {
  render() {
    return (
      <InfiniteCalendar
        theme={{
          selectionColor: 'rgb(159,87,88)',
          textColor: {
            default: '#333',
            active: '#FFF'
          },
          weekdayColor: 'rgb(202,142,144)',
          headerColor: 'rgb(183,171,181)',
          floatingNav: {
          background: 'rgba(128,70,90,0.96)',
          color: '#FFFFFF',
          chevron: '#FFA726'
          }
        }}
        height={300}
        width={500}
        selected={today}
        displayOptions={{
          layout: 'landscape'
        }}
        onSelect={function(e) {
          this.props.selectDay(e);
        }.bind(this)}/>
    )
  }
}

// https://clauderic.github.io/react-infinite-calendar/#/events/on-select?_k=dqhynv