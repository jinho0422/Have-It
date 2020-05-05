import React, { Component } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import Fade from 'react-reveal/Fade';
import AddDollModal from '../settingMode/AddDollModal';
import DollInfoCard from './DollInforCard';
import * as FrontAPI from '../../lib/api/FrontQuery';



export default class MyidPage extends Component {
    state = {
        userName: '',
        nickName: '',
        email: '',
        datas: [],
        dollIds: [],
        flag: false,
        prev: false,
        checked: true,
    }

    componentDidMount() {
        this.getData();
        this.func();
    }
    componentDidUpdate() {
        if (this.state.flag === this.state.prev) {
            this.getData();
            this.func();
        }
    }
    getData = async () => {

        const res = await FrontAPI.getIdData({ userName: window.sessionStorage.getItem('user') });
        this.setState({ userName: res.data.user.userName });
        this.setState({ nickName: res.data.user.nickName });
        this.setState({ email: res.data.user.email });
    
        this.setState({ datas: res.data });
        
        if (this.state.flag === this.state.prev) {
            this.setState({ flag: !this.state.flag })
        }
    };

    getDollId = async () => {
        // const ret = await API1.check();
        // this.setState({ dollIds: ret.data})
        // console.log(this.state.dollIds);
        // const dollLength = window.sessionStorage.getItem('dollLength');
        // let dollIds = [];
        // for (let i=0; i<dollLength; i++) {
        //     dollIds.push(window.sessionStorage.getItem(`dollId${i}`));
        // }
        // this.setState({dollIds: dollIds});
      
        
    }

    func() {
        let ret = [];
        let dollName = [];
        let dollserial = [];
        let dollId =[];
      

        if (this.state.datas.length === 0) return;

        for (let i = 0; i < this.state.datas.doll.length; i++) {
            dollName.push((Object(Object(this.state.datas.doll)[i])["dollName"]))
            dollserial.push((Object(Object(this.state.datas.doll)[i])["serialNumber"]))
            dollId.push((Object(Object(this.state.datas.doll)[i])["id"]))
        }
        for (let i = 0; i < this.state.datas.doll.length; i++) {
            ret.push(
                <Col>
                    <DollInfoCard
                        dollSerial={dollserial[i]}
                        dollName={dollName[i]} 
                        dollId={dollId[i]}
                        checked={this.state.datas.doll[i]["is_activated"]}
                        machine={this.state.datas.doll[i]["machines"] && this.state.datas.doll[i]["machines"].length ? true : false}
                        />

                    {/* <Card bg="dark" text="black" style={{ width: '18rem' }}> */}
                    {/* <Switch
                        checked={this.state.checked}
                        onChange={function() {
                            this.setState({checked: !this.state.checked})
                        }.bind(this)}
                        value="checked"
                        color="primary"
                        inputProps={{ 'aria-label': 'primary checkbox' }}
                    />
                        <Card.Header style={{fontWeight:'bold'}}>S/N : {dollserial[i]}</Card.Header>
                        <Card.Body>
                            <Card.Title className="m-0 py-1" style={{fontSize:15}}>기기명 : {dollName[i]}</Card.Title>
                            <Card.Title className="m-0 py-1" style={{fontSize:15}}>설명 : 집? 회사?</Card.Title>
                        </Card.Body>
                    </Card> */}
                </Col>
            )
        }
        return ret;
    }

    render() {
        return (
                <Fade>
                    <Container className="pt-5 pb-3">
                        <Row className="py-1">
                            ID : {this.state.userName}
                        </Row>
                        <Row className="py-1">
                            Nickname : {this.state.nickName}
                        </Row>
                        <Row className="pt-1 pb-4" style={{borderBottom:'1px solid rgba(0, 0, 0, 0.8)'}}>
                            E-Mail : {this.state.email}
                        </Row>
                        <Row className="justify-content-md-center p-3 mt-3">
                            {this.state.datas.doll ? this.func() : ''}
                        </Row>
                    </Container>
                    <AddDollModal changeFlag={function () {
                        this.setState({ flag: !this.state.flag })
                    }.bind(this)}></AddDollModal>
                </Fade>
        )
    }
}