import React from "react";

// reactstrap components
import {
    Button,
    Label,
    FormGroup,
    Input,
    NavItem,
    NavLink,
    Nav,
    TabContent,
    TabPane,
    Container,
    Row,
    Col
} from "reactstrap";

import ProfilePageHeader from "../MyInfo/ProfilePageHeader";

export default function ProfilePage({ a, b, listName, listSerial }) {
    const [activeTab, setActiveTab] = React.useState("1");
    let device_idx = 0;
    const toggle = tab => {
        if (activeTab !== tab) {
        setActiveTab(tab);
        }
    };
    document.documentElement.classList.remove("nav-open");
    React.useEffect(() => {
        document.body.classList.add("landing-page");
        return function cleanup() {
        document.body.classList.remove("landing-page");
        };
    });

    return (
        <>
            <ProfilePageHeader />
            <div className="section profile-content">
                <Container>
                    <div className="owner">
                        <div className="name">
                            <h4 className="title">
                                아이디 <br />
                            </h4>
                            <h6 className="description"> 닉네임</h6>
                        </div>
                    </div>
                    <Row>
                        <Col className="ml-auto mr-auto text-center" md="6">
                            <p>
                                이메일
                        </p>
                            <br />
                            <Button className="btn-round" color="default" outline>
                                <i className="fa fa-cog" /> 기기 등록
                            </Button>
                        </Col>
                    </Row>
                    <div className="nav-tabs-navigation">
                        <div className="nav-tabs-wrapper">
                            <Nav role="tablist" tabs>
                                <NavItem>
                                    <NavLink
                                        className={activeTab === "1" ? "active" : ""}
                                        onClick={() => {
                                            toggle("1");
                                        }}
                                    >
                                        Device Info.
                                    </NavLink>
                                </NavItem>
                            </Nav>
                        </div>
                    </div>


                    {/* Device Info List */}
                    <TabContent className="following" activeTab={activeTab}>
                        <Row>
                        

                        </Row>




                    </TabContent>




                </Container>
            </div>
        </>
    );
}