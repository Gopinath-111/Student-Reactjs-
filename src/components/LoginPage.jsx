import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, Form, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import {jwtDecode} from "jwt-decode";
import "../assets/css/LoginPage.css";
import Loginimage from "../assets/login.jpg";
import {loginApi} from "./Api.jsx";
import NotificationModal from "./NotificationModal.jsx";
import { FaSignInAlt } from "react-icons/fa";

//localStorage.clear();
function LoginPage ()  {
    //alert("login");
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({ email: "", password: "" });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };
    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
    const handleLogin = async (e) => {
        e.preventDefault();
        try
        {        const url = "Admin/Login";
            const response = await loginApi(url, credentials);  
            const { message, accesstoken } = response;
            if (accesstoken) {
                    const decoded = jwtDecode(accesstoken);
                    const claims = {
                        name: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"],
                        email: decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"],
                        role: decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"],
                    };
                    localStorage.setItem("auth", true);
                    localStorage.setItem("accesstoken", accesstoken);
                    localStorage.setItem("createdBy", claims.name);
                    handleShowModal(message);
                    setTimeout(() => navigate("/home"), 1500);
            } else {
                handleShowModal(message);
                setCredentials({ email: "", password: "" });
            }
        }
        catch(e)
        {
            const messgae = e.error;
            handleChange(message);
        }

    };

    return (
        <Container className="login-container" fluid="md">
            {/* Modal for Notifications */}
            <NotificationModal show={showModal} onHide={handleCloseModal} modalMessage={modalMessage} />
            <Row>
                {/* Right Section - Login Form */}
                <Col xs={12}>
                <Row className="justify-content-center mb-4 mt-4">
                    <FaSignInAlt size={30} className="mx-2" />
                    <h3> Login Form </h3>
                </Row>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <Form onSubmit={handleLogin}>
                                {/* Email Field */}
                                <Form.Group className="p-4">
                                    <Row>
                                        <Col xs={4} className="align-items-center">
                                            <Form.Label className="ms-2">Email</Form.Label>
                                        </Col>
                                        <Col xs={ 8}>
                                                <Form.Control
                                                    type="email"
                                                    name="email"
                                                    placeholder="Enter email"
                                                    value={credentials.email}
                                                    onChange={handleChange}
                                                    required
                                                />
                                        </Col>
                                    </Row>
                                </Form.Group>

                                {/* Password Field */}
                                <Form.Group className="mb-3 p-4">
                                    <Row>
                                        <Col xs={4} className="align-items-center">
                                            <Form.Label className="ms-2">Password</Form.Label>
                                        </Col>
                                        <Col xs={8}>
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                placeholder="Enter password"
                                                value={credentials.password}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>

                                {/* Submit Button */}
                                <div className="text-center">
                                    <Button variant="primary" type="submit" className="w-50">
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        </Col>
                    </Row>
                    <Row className="text-center mt-4">
                        <p>
                            Do You haven't Account? <br></br>
                            <Link to="/register">Register Here</Link>
                        </p>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default LoginPage;
