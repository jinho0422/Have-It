import React from 'react';
import { Container, Tabs, Tab} from 'react-bootstrap';
import Parallax from "../Parallax/Parallax.js";
import GridItem from "../grid/GridItem.js";
import GridContainer from "../grid/GridContainer.js";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import styles from "../material-kit-react/components.js";
import CushionData from "./Cushion";
import classNames from "classnames";
// react components for routing our app without refresh

const useStyles = makeStyles(styles);

export default function Cushion() {
  const classes = useStyles();
  // render() {
  return (
    <div>
      <Parallax image={require("../Parallax/Header4.png")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1 className={classes.title}>Change Your Posture.</h1>
                <h3 className={classes.subtitle}>
                  다양한 보조 기구들을 인형에 연결해보세요.
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

    <Container>
      <div className={classNames(classes.main, classes.mainRaised)}>
        <Tabs defaultActiveKey="cushion" id="uncontrolled-tab-example">
          <Tab eventKey="cushion" title="Cushion">
            <CushionData></CushionData>
          </Tab>
          <Tab eventKey={"vest"} title="Vest" disabled></Tab>
          <Tab eventKey={"shoes"} title="Shoes" disabled></Tab>
        </Tabs>
      </div>
    </Container>
    </div>
  )
// }
}