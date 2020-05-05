import React from 'react';
import { Container } from 'react-bootstrap';
import Parallax from "../Parallax/Parallax.js";
import GridItem from "../grid/GridItem.js";
import GridContainer from "../grid/GridContainer.js";
import { makeStyles } from "@material-ui/core/styles";
import styles from "../material-kit-react/components.js";
import classNames from "classnames";
import CheckPage from './CheckPage';
const useStyles = makeStyles(styles);

export default function CheckIntro() {
  const classes = useStyles();
  // render() {
  return (
    <div>
      <Parallax image={require("../Parallax/Header2.jpg")}>
        <div className={classes.container}>
          <GridContainer>
            <GridItem>
              <div className={classes.brand}>
                <h1 className={classes.title}>Check Your Data.</h1>
                <h3 className={classes.subtitle}>
                  습관에 대한 정보와 이력을 조회할 수 있습니다.
                </h3>
              </div>
            </GridItem>
          </GridContainer>
        </div>
      </Parallax>

      <Container>
        <div className={classNames(classes.main, classes.mainRaised)}>
          <CheckPage></CheckPage>
        </div>
      </Container>
    </div>
  )
// }
}