import { Component } from 'react';

export default class Clock2 extends Component {

    state = {
        h: (new Date().getHours()<10?'0':'') + new Date().getHours(),
        m: (new Date().getMinutes()<10?'0':'') + new Date().getMinutes(),
    };

    componentDidMount() { // Clockcmp 컴포넌트가 불러올때마다 1초씩 this.Change()를 부른다
        this.timeID = setInterval(
            () => this.Change(),
            1000 * 10
        )
    }

    componentWillUnmount(){ //종료되면 반복하는것도 클리어시키기
        clearInterval(this.timeID)
    }

    Change = () => {  //시계 구현
        const time = new Date();
        const m = (time.getMinutes()<10?'0':'') + time.getMinutes();
        const h = (time.getHours()<10?'0':'') + time.getHours();
        // console.log(m);
        this.setState({
            h: h,
            m: m
        })
    };

    render() {
        return(
            `${this.state.h}시 ${this.state.m}분`
        )
    }
}

