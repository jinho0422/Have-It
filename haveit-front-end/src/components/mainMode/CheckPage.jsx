import React, { Component } from 'react';
import { Container, Button } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';

import * as API from '../../lib/api/FrontQuery';
import CheckList from '../mainMode/CheckList';
import CheckListAll from '../mainMode/CheckListAll';
import CushionData from '../mainMode/Cushion';

import { MdLocalCafe, MdLocalDining, MdTimer } from "react-icons/md";
import { FaRegCalendarAlt, FaItunesNote, FaPencilAlt, FaPills, FaRaspberryPi, FaRegStar } from "react-icons/fa";
import { IoMdBrush, IoIosFootball, IoIosWater } from "react-icons/io";


import '../../lib/styles/style.css';

export default class CheckPage extends Component {
    state = {
        totalData: [],
        allVData: [],
        selectedData: [],
        today: {
            year: (new Date()).getFullYear(),
            month: (new Date()).getMonth() + 1,
            date: (new Date()).getDate(),
        },
        flag: false,
        prev: false,
    };

    componentDidUpdate() {
        this.showCheckList();
        if (this.state.flag === this.state.prev) {
            this.getTotalHabitName(this.state.today.year, this.state.today.month, this.state.today.date);
        }
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getTotalHabitName(this.state.today.year, this.state.today.month, this.state.today.date);
    }

    getTotalHabitName = async (year, month, day) => {
        try {
            const res = await API.getMonthlyTotalData({ year: year, month: month });
            const { data, habit } = res.data;
            this.setState({ allVData: data.habit });
            this.setState({ totalData: habit });


        } catch (e) {
            console.log(e)
        }
        if (this.state.flag === this.state.prev) {
            this.setState({ flag: !this.state.flag })
        }
    };


    showCheckList (id) {
        if (id) {
            return <CheckList selectedHabitId={id} icon={this.state.selectedData['habit_icon.icon']}></CheckList>
        } else if (this.state.allVData) {
            return (<CheckListAll showData={this.state.allVData} getTotalHabitName={this.getTotalHabitName}></CheckListAll>)
        }
    }

    makeIcon(iconName, data) {
        let fontSize = 18;
        let color = this.props.color;
        if (iconName === 'IoMdBrush') {
            return <IoMdBrush style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}} />
        } else if (iconName === 'FaRegCalendarAlt') {
            return <FaRegCalendarAlt style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}}/>
        } else if (iconName === 'MdLocalCafe') {
            return <MdLocalCafe style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}}/>
        } else if (iconName === 'MdLocalDining') {
            return <MdLocalDining style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}} />
        } else if (iconName === 'IoIosFootball') {
            return <IoIosFootball style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}}/>
        } else if (iconName === 'FaItunesNote') {
            return <FaItunesNote style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}}/>
        } else if (iconName === 'FaPencilAlt') {
            return <FaPencilAlt style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}}/>
        } else if (iconName === 'FaPills') {
            return <FaPills style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}}/>
        } else if (iconName === 'MdTimer') {
            return <MdTimer style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}} />
        } else if (iconName === 'IoIosWater') {
            return <IoIosWater style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}} />
        } else if (iconName === 'FaRaspberryPi') {
            return <FaRaspberryPi style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}}/>
        } else if (iconName === 'FaRegStar') {
            return <FaRegStar style={{fontSize: fontSize, margin: 5, color: color, cursor:"pointer"}}/>
        }
    }

    makeHabitIcon() {
        const habit = [];
        // const temp = ["outline-primary", "outline-secondary", "outline-success", "outline-warning", "outline-danger", "outline-info", "outline-dark"];

        habit.push(
            <Button
                className="list-group-item list-group-item-action"
                variant="outline-danger"
                // style={{ margin: 2 }}
                type="button"
                data-toggle="All"
                data-placement="top"
                onClick={function () {
                    this.setState({ selectedData: this.state.allVData });
                }.bind(this)}>
                All
            </Button>
        );
        for (const data of this.state.totalData) {
            habit.push(
                <Button
                    className="list-group-item list-group-item-action"
                    variant="outline-danger"
                    // style={{ margin: 2 }}
                    type="button"
                    data-toggle="tooltip"
                    data-placement="top"
                    title={`${data.habitName}`}
                    onClick={function () {
                        this.setState({selectedData: data});
                    }.bind(this)}>
                    { this.makeIcon(data['habit_icon.icon'], data) }
                </Button>
            );
        }

        if (habit) return habit
    }


    checkMode() {
        if (this.state.mode === 'habit') {
            return (
                <Fade>
                    <Container className="py-5">
                        <div className="btn-group" role="group" aria-label="Basic example">
                            {this.makeHabitIcon()}
                        </div>
                    </Container>
                    {this.showCheckList(this.state.selectedData.id)}
                </Fade>
            )
        } else if (this.state.mode === 'cushion') {
            return (
                <CushionData></CushionData>
            )
        }
    }
    // index={'asdeasdsadasdasdas'} two={this.state.mode}

    render() {
        return (
            <div className="content">
                <Container fluid>
                    <Fade>
                        <div className="py-4">
                            <ul className="list-group list-group-horizontal">
                                {this.makeHabitIcon()}
                            </ul>
                        </div>
                        {this.showCheckList(this.state.selectedData.id)}
                    </Fade>
                </Container>
                <Container className="pb-5"></Container>
            </div>
        )
    }
}