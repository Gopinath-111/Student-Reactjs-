import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaKey, FaUserPlus } from "react-icons/fa";
import NotificationModal from "./NotificationModal.jsx";
import "react-phone-input-2/lib/style.css";
import "../assets/css/LoginPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerApi, generateOtpApi } from "./Api.jsx";

function RegisterPage() {
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNo: "",
        userOtp: "" // Add userOtp field to state
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isVisible, setIsVisible] = useState(true);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        if (name === "userOtp") {
            setCredentials((prevCredentials) => ({
                ...prevCredentials,
                userOtp: value,
            }));
        } else {
            setCredentials((prevCredentials) => ({
                ...prevCredentials,
                [name]: value,
            }));
        }
    };

    const validateInput = (name, value) => {
        if (name === "name") {
            const nameRegex = /^[A-Za-z\s]*$/;
            if (!nameRegex.test(value)) {
                return "Name can only contain alphabets and spaces.";
            }
        }
        if (name === "mobileNo") {
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(value)) {
                return "Please enter a valid 10-digit mobile number.";
            }
        }
        if (name === "email") {
            const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
            if (!emailRegex.test(value)) {
                return "Please enter a valid email address.";
            }
        }
        if (name === "password") {
            const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/;
            if (!passwordRegex.test(value)) {
                return "Password must be at least 8 characters long and contain both letters, numbers, and at least one special character.";
            }
        }
        return null;
    };

    const handlegenerateOTP = async (e) => {
        e.preventDefault();
        if (credentials.password !== credentials.confirmPassword) {
            handleShowModal("Passwords do not match.");
            return;
        }

        let errorMessage =
            validateInput("name", credentials.name) ||
            validateInput("mobileNo", credentials.mobileNo) ||
            validateInput("email", credentials.email) ||
            validateInput("password", credentials.password);

        if (errorMessage) {
            handleShowModal(errorMessage);
            return;
        }
        const { email} = credentials;
        const response = await generateOtpApi(`Admin/GenerateOtp?Email=${email}`);
        if (response) {
            handleShowModal(response.message);
            sessionStorage.setItem("generatedOtp", response.decryptedOtp);
            setIsVisible(false);
        } else {
            handleShowModal(response.message);
        }
    };

    const handleuserOtpVerify = async (e) => {
        e.preventDefault();
        const { userOtp } = credentials;
        var generatedOtp = sessionStorage.getItem("generatedOtp");
        if(generatedOtp.trim() == userOtp.trim())
        {
            const response = await registerApi("Admin/Register", credentials);
            if (response) {
                handleShowModal(response.message);
                navigate("/");
            } else {
                handleShowModal(response.message);
            }
        }
        else
        {
            console.log("Not Match");
        }

    };

    return (
        <Container className="login-container" fluid>
            {/* Modal for Notifications */}
            <NotificationModal show={showModal} onHide={handleCloseModal} modalMessage={modalMessage} />
            
            {isVisible && (
                <Row id="registerform">
                    <Col xs={12}>
                        <Row className="justify-content-center mb-4 mt-4">
                            <h3>
                                <FaUserPlus size={30} className="mx-2" /> Registration Form
                            </h3>
                        </Row>

                        <Row className="justify-content-center">
                            <Col xs={12}>
                                <Form onSubmit={handlegenerateOTP}>
                                    {/* Name Field */}
                                    <Form.Group className="mb-3">
                                        <Row>
                                            <Col xs={3} className="d-flex align-items-center">
                                                <Form.Label className="ms-2">Name</Form.Label>
                                            </Col>
                                            <Col xs={9}>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter name"
                                                    value={credentials.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Group>

                                    {/* Mobile No Field */}
                                    <Form.Group className="mb-3">
                                        <Row>
                                            <Col xs={3} className="d-flex align-items-center">
                                                <Form.Label className="ms-2">Mobile No</Form.Label>
                                            </Col>
                                            <Col xs={9}>
                                                <Form.Control
                                                    type="text"
                                                    name="mobileNo"
                                                    placeholder="Enter mobile no"
                                                    value={credentials.mobileNo}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </Col>
                                        </Row>
                                    </Form.Group>

                                    {/* Email Field */}
                                    <Form.Group className="mb-3">
                                        <Row>
                                            <Col xs={3} className="d-flex align-items-center">
                                                <Form.Label className="ms-2">Email</Form.Label>
                                            </Col>
                                            <Col xs={9}>
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
                                    <Form.Group className="mb-3">
                                        <Row>
                                            <Col xs={3} className="d-flex align-items-center">
                                                <Form.Label className="ms-2">Password</Form.Label>
                                            </Col>
                                            <Col xs={9}>
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

                                    {/* Confirm Password Field */}
                                    <Form.Group className="mb-3">
                                        <Row>
                                            <Col xs={3} className="d-flex align-items-center">
                                                <Form.Label className="ms-2">Confirm Password</Form.Label>
                                            </Col>
                                            <Col xs={9}>
                                                <Form.Control
                                                    type="password"
                                                    name="confirmPassword"
                                                    placeholder="Confirm password"
                                                    value={credentials.confirmPassword}
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
                    </Col>
                </Row>
            )}

            {!isVisible && (
                <Row id="userOtpform">
                    <Row className="justify-content-center mb-4 mt-4">
                        <h3>
                            <FaKey size={30} className="mx-2" /> userOtp Form
                        </h3>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <Form onSubmit={handleuserOtpVerify}>
                                {/* userOtp Field */}
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col xs={3} className="d-flex align-items-center">
                                            <Form.Label className="ms-2">userOtp</Form.Label>
                                        </Col>
                                        <Col xs={9}>
                                            <Form.Control
                                                type="text"
                                                name="userOtp"
                                                placeholder="Enter your userOtp"
                                                value={credentials.userOtp}
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
                </Row>
            )}
        </Container>
    );
}

export default RegisterPage;
