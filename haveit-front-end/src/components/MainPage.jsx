import React, { useState, useEffect } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { GoBell } from "react-icons/go";
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import Popper from '@material-ui/core/Popper';
import { makeStyles } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Divider from '@material-ui/core/Divider';

import TodayPage from './mainMode/TodayPage';
import MyidPage from './mainMode/MyidPage';
import CheckIntro from "./mainMode/CheckIntro";
import SettingIntro from "./mainMode/SettingIntro";

import Cushion from "./mainMode/Device";

import 'bootstrap/dist/css/bootstrap.min.css';
import '../lib/styles/style.css';

import { useDispatch } from 'react-redux';
import { logout } from '../modules/user';

import * as API from '../lib/api/FrontQuery';


const useStyles = makeStyles(theme => ({
    root: {
      '& > *': {
        margin: theme.spacing(1),
      },
    },
}));

const useStylesPopper = makeStyles(theme => ({
    root: {
      width: 30,
    },
    typography: {
      padding: theme.spacing(1),
      margin: theme.spacing(1),
    },
  }));

const defaultProps = {
    color: 'secondary',
    children: <GoBell style={{fontSize:25, color:"#dcb400", cursor:"pointer"}} />,
  };

const MainPage = () => {
    const [mode, setMode] = useState('main');
    const [ret, setRet] = useState(null);
    const [missedNoti, setMissedNoti] = useState([]);
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const [open, setOpen] = React.useState(false);
    const [placement, setPlacement] = React.useState();
    const classesPopper = useStylesPopper();

    const handleClick = newPlacement => event => {
        setAnchorEl(event.currentTarget);
        setOpen(prev => placement !== newPlacement || !prev);
        setPlacement(newPlacement);
    };

    const onLogout = () => {
        dispatch(logout());
    }

    const getData = async() => {
        const res = await API.getToday();
        const {missedNoti} = res.data
        setMissedNoti(missedNoti)
    }

    const changeModeMy = () => {
        setMode('my')
    }

    const changeModeSetting = () => {
        setMode('setting')
    }

    const makeList = () => {
        let missedNotiList = [];
        for (const noti of missedNoti) {
            missedNotiList.push(
                <Typography className={classesPopper.typography} style={{cursor: "pointer"}}>
                    {`${noti.time}   |   ${noti['noti_detail.habitName']}`}
                </Typography>
            )
        }
        return missedNotiList
    }

    useEffect(() => {
        getData();
        if (mode === 'main') {
            setRet(<TodayPage changeModeMy={function() {changeModeMy()}} changeModeSetting={function() {changeModeSetting()}}></TodayPage>);
        }
        else if (mode === 'setting') {
            setRet(<SettingIntro></SettingIntro>);
        }
        else if (mode === 'check') {    
            setRet(<CheckIntro></CheckIntro>);
        }
        else if (mode === 'cushion') {
            setRet(<Cushion></Cushion>)
        }
        else if (mode === 'my') {
            setRet(props => <MyidPage {...props}/>);
        }

    }, [mode])
    
    const classes = useStyles();
    let divId = '';
    const nowTime = new Date().getHours();
    if (mode === 'main') {
        if (nowTime < 11) {
            divId = 'bg-img-am'
        } else if (nowTime < 15) {
            divId = 'bg-img-pm1'
        } else if (nowTime < 19) {
            divId = 'bg-img-pm2'
        } else {
            divId = 'bg-img-night'
        }
    }

    return (
        <div id={divId}>
            <Navbar id="nav-bar" collapseOnSelect expand="md" sticky={'top'} variant="dark">
                <Navbar.Brand className="pl-5" onClick={() => setMode('main')} style={{cursor:"pointer"}} >HAVE-IT</Navbar.Brand>
                <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                <Navbar.Collapse id="responsive-navbar-nav">
                    <Nav className="mr-auto">
                        <Nav.Link onClick={() => setMode('setting')} style={{color:'white', opacity:0.8}}>습관 설정</Nav.Link>
                        <Nav.Link onClick={() => setMode('check')} style={{color:'white', opacity:0.8}}>습관 통계</Nav.Link>
                        <Nav.Link onClick={() => setMode('cushion')} style={{color:'white', opacity:0.8}}>보조 기구</Nav.Link>
                    </Nav>
                    <Nav className="pr-5">
                    <div className={classes.root}>
                        <div className={classesPopper.root}>
                            <Popper open={open} anchorEl={anchorEl} placement={placement} transition style={{zIndex:1021}}>
                                {({ TransitionProps }) => (
                                  <Fade {...TransitionProps} timeout={350}>
                                      <Paper>
                                          <Typography className={classesPopper.typography} style={{margin:0.5}}>
                                              미완료 알림
                                          </Typography>
                                          <Divider />
                                            {missedNoti.length? makeList() : <Typography className={classesPopper.typography}> 미완료된 알람이 없습니다 </Typography> }
                                      </Paper>
                                  </Fade>
                                )}
                            </Popper>
                            <Grid item>
                                <Badge badgeContent={missedNoti.length} max={10} {...defaultProps} onClick={handleClick('bottom-start')}/>
                            </Grid>
                        </div>
                    </div>
                    <NavDropdown id="collasible-nav-dropdown" style={{color:'white', opacity:0.9}} title={`${window.sessionStorage.getItem('user')} 님`}>
                        <NavDropdown.Item onClick={() => setMode('my')} >회원정보</NavDropdown.Item>
                        <NavDropdown.Divider />
                        <NavDropdown.Item onClick={onLogout}>로그아웃</NavDropdown.Item>
                    </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
            <div>
                {ret}
            </div>
        </div>
    )
};

export default MainPage;