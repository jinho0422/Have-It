import React from 'react';
import { Container } from 'react-bootstrap';
import Parallax from "../Parallax/Parallax.js";
import GridItem from "../grid/GridItem.js";
import GridContainer from "../grid/GridContainer.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../material-kit-react/components.js";
// import classNames from "classnames";
import SettingPage from "./SettingPage"
const useStyles = makeStyles(styles);

export default function SettingIntro() {
  const classes = useStyles();
  // render() {
  return (
    <div>
      <Parallax image={require("../Parallax/Header3.png")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1 className={classes.title} style={{color: "white"}}>Make Your Habit!</h1>
                <h3 className={classes.subtitle} style={{color: "white"}}>
                  습관을 만들고 인형에 울릴 알람을 설정합니다.
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <Container>
        {/*<div className={classNames(classes.main, classes.mainRaised)}>*/}
          <SettingPage></SettingPage>
        {/*</div>*/}
      </Container>
    </div>
  )
// }
}