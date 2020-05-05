import React, { Component } from 'react';

import { CircularProgressbarWithChildren, buildStyles } from "react-circular-progressbar";
import { Container, Row } from 'react-bootstrap';

import "react-circular-progressbar/dist/styles.css";

import '../../lib/styles/style.css'

import { MdLocalCafe, MdLocalDining, MdTimer } from "react-icons/md";
import { FaRegCalendarAlt, FaItunesNote, FaPencilAlt, FaPills, FaRaspberryPi, FaRegStar } from "react-icons/fa";
import { IoMdBrush, IoIosFootball, IoIosWater } from "react-icons/io";

export default class BarAfter extends Component {
    state = {
        src: '',
    };
    color = this.props.color ? this.props.color : 'rgba(255,234,236,0.93)';
    fontSize = 50;

    makeIcon() {
        if (this.props.icon === 'IoMdBrush') {
            return <IoMdBrush onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        } else if (this.props.icon === 'FaRegCalendarAlt') {
            return <FaRegCalendarAlt onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        } else if (this.props.icon === 'MdLocalCafe') {
            return <MdLocalCafe onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        } else if (this.props.icon === 'MdLocalDining') {
            return <MdLocalDining onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        } else if (this.props.icon === 'IoIosFootball') {
            return <IoIosFootball onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '',color: this.color }}/>
        } else if (this.props.icon === 'FaItunesNote') {
            return <FaItunesNote onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        } else if (this.props.icon === 'FaPencilAlt') {
            return <FaPencilAlt onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        } else if (this.props.icon === 'FaPills') {
            return <FaPills onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        } else if (this.props.icon === 'MdTimer') {
            return <MdTimer onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        } else if (this.props.icon === 'IoIosWater') {
            return <IoIosWater onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        } else if (this.props.icon === 'FaRaspberryPi') {
            return <FaRaspberryPi onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        } else if (this.props.icon === 'FaRegStar') {
            return <FaRegStar onMouseEnter={function(e) {
                if (this.props.flag) this.props.showHover(true, e.pageX, e.pageY, this.props.habitId);
            }.bind(this)}
            onMouseLeave={function() {
                if (this.props.flag) this.props.showHover(false, 0, 0, null);
            }.bind(this)}
            style={{ fontSize:this.fontSize, cursor: this.props.flag ? 'zoom-in' : '', color: this.color }}/>
        }
    }    

    render() {
        function Example(props) {
            return (
                <Container
                    className="justify-content-md-center"
                    style={{ display: "flex" }}>
                    <Row>{props.children}</Row>
                </Container>
            );
        }

        var rate = this.props.rate;

        return (
            <Container style={{position: 'relative'}}>
                <Example>
                    <CircularProgressbarWithChildren
                        value={rate} 
                        styles={buildStyles({pathColor:this.props.color, trailColor:'rgba(255, 255, 255, 0.6)'})}>
                        {this.makeIcon()}
                        <Row style={{color: this.props.flag ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'}}>
                            <strong>{this.props.habitName ? this.props.habitName : "ALL"}</strong>
                        </Row>
                        <Row style={{color: this.props.flag ? 'rgba(255, 255, 255, 0.8)' : 'rgba(0, 0, 0, 0.8)'}}>
                            <strong>{rate}%</strong>
                        </Row>
                    </CircularProgressbarWithChildren>
                </Example>
            </Container>
        );
    }
}
