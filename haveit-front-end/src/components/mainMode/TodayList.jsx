import React, { Component } from 'react';
import BarBefore from '../information/BarBefore';
import BarAfter from '../information/BarAfter';

//https://cssgradient.io/
const nowTime = new Date().getHours();
let colorPick = [];
if (nowTime < 11) {
    colorPick =  ['rgb(84,101,129)', 'rgb(236,211,146)', 'rgb(158,209,199)', 'rgb(35,126,152)', 'rgb(74,162,174)',
        'rgb(254,238,169)', 'rgb(225,217,171)', 'rgb(59,180,209)', 'rgb(14,70,85)', 'rgb(19,78,96)'];
} else if (nowTime < 15) {
    colorPick = ['rgb(107,137,168)', 'rgb(255,208,177)', 'rgb(255,233,220)', 'rgb(150,178,206)', 'rgb(47,73,101)',
        'rgb(47,73,101)', 'rgb(255,215,191)', 'rgb(255,197,157)', 'rgb(6,16,25)', 'rgb(47,73,101)'];
} else if (nowTime < 19) {
    colorPick = ['rgb(46,51,91)', 'rgb(75,65,102)', 'rgb(169,93,104)', 'rgb(115,78,109)', 'rgb(102,48,71)',
        'rgb(164,163,164)', 'rgb(234,128,68)', 'rgb(196,101,92)', 'rgb(128,57,69)', 'rgb(40,33,64)'];
} else {
    colorPick = ['rgb(46,0,67)', 'rgb(97,11,95)', 'rgb(167,121,210)', 'rgb(29,104,188)', 'rgb(1,70,133)',
        'rgb(32,6,84)', 'rgb(80,16,117)', 'rgb(91,55,197)', 'rgb(26,133,197)', 'rgb(227,254,254)'];
}


export default class TodayHabit extends Component {
    state = {
        animation:'activated'
    }
    
    timeout;

    rateOfAchievement () {
        let result = 100;

        if (this.props.achievementData.nowTotal) {
            const tempResult = this.props.achievementData.nowDone/this.props.achievementData.nowTotal*100
            result = Math.round(tempResult)
        }

        return result;
    }

    deactivation(_mode) {
        clearTimeout(this.timeout);

        if (_mode === 'activated') {
            if (this.rateOfAchievement() === 0) {
                this.setState({animation:'deactivated'});
            } else {
                this.timeout = setTimeout(function() {
                    this.setState({animation:'deactivated'})
                }.bind(this), 2000);
            }
        }
    }

    // color = colorPick[this.rateOfAchievement() / 10];
    color = colorPick[this.props.habitId * 23 % 10];
    // color_font = this.color + 1

    render() {
        return (
            <div style={{position: 'relative'}}>
                {this.state.animation === 'activated' ?
                    <BarBefore rate={this.rateOfAchievement()} color={this.color}/> : 
                    <BarAfter rate={this.rateOfAchievement()}
                        showHover={this.props.showHover}
                        habitId={this.props.habitId}
                        habitName={this.props.habitName}
                        icon={this.props.habitIcon}
                        color={this.color}
                        flag={1}/>}
                {this.deactivation(this.state.animation)}
            </div>
        )
    }
}