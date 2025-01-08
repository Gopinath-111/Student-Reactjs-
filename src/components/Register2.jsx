import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { FaKey, FaUserPlus } from "react-icons/fa";
import NotificationModal from "./NotificationModal.jsx";
import "react-phone-input-2/lib/style.css";
import "../assets/css/LoginPage.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import app from "../firebase/setup.js";
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";

function RegisterPage() {
    const auth = getAuth(app);
    const navigate = useNavigate();
    const [credentials, setCredentials] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        mobileNo: "",
        userOtp: "",
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [isVisible, setIsVisible] = useState(true);
    const [confirmationResult, setConfirmationResult] = useState(null);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    const handleChange = (event) => {
        const { name, value } = event.target;
        setCredentials((prevCredentials) => ({
            ...prevCredentials,
            [name]: value,
        }));
    };

    const validateInput = (name, value) => {
        const validators = {
            name: /^[A-Za-z\s]*$/,
            mobileNo: /^[0-9]{10}$/,
            email: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/,
            password: /^(?=.*[A-Za-z])(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{8,}$/,
        };

        if (validators[name] && !validators[name].test(value)) {
            const errorMessages = {
                name: "Name can only contain alphabets and spaces.",
                mobileNo: "Please enter a valid 10-digit mobile number.",
                email: "Please enter a valid email address.",
                password: "Password must be at least 8 characters long and contain letters, numbers, and a special character.",
            };
            return errorMessages[name];
        }
        return null;
    };

    const initializeRecaptcha = () => {
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(
                "recaptcha-container",
                {
                    size: "normal",
                    callback: () => console.log("Recaptcha verified"),
                    "expired-callback": () => console.log("Recaptcha expired. Please try again."),
                },
                auth
            );
        }
    };

    const handlegenerateOTP = async (e) => {
        e.preventDefault();

        if (credentials.password !== credentials.confirmPassword) {
            handleShowModal("Passwords do not match.");
            return;
        }

        const errorMessage =
            validateInput("name", credentials.name) ||
            validateInput("mobileNo", credentials.mobileNo) ||
            validateInput("email", credentials.email) ||
            validateInput("password", credentials.password);

        if (errorMessage) {
            handleShowModal(errorMessage);
            return;
        }

        try {
            initializeRecaptcha();

            const appVerifier = window.recaptchaVerifier;
            const phoneNumber = `+91${credentials.mobileNo}`; // Adjust the country code as needed

            const result = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
            setConfirmationResult(result);
            setIsVisible(false); // Show OTP form
        } catch (error) {
            console.error("Error sending OTP:", error);
            handleShowModal(`Error sending OTP: ${error.message}`);
        }
    };

    const handleuserOtpVerify = async (e) => {
        e.preventDefault();

        if (!confirmationResult) {
            handleShowModal("OTP verification failed. Please try again.");
            return;
        }

        try {
            const result = await confirmationResult.confirm(credentials.userOtp);
            console.log("User verified:", result.user);
            handleShowModal("OTP verified successfully!");
            navigate("/home"); // Navigate to another page on success
        } catch (error) {
            handleShowModal(`Error verifying OTP: ${error.message}`);
        }
    };

    return (
        <Container className="login-container" fluid>
            <NotificationModal show={showModal} onHide={handleCloseModal} modalMessage={modalMessage} />
            {isVisible ? (
                <Row id="registerform">
                    <Col>
                        <div id="recaptcha-container"></div>
                    </Col>
                    <Col xs={12}>
                        <Row className="justify-content-center mb-4 mt-4">
                            <h3>
                                <FaUserPlus size={30} className="mx-2" /> Registration Form
                            </h3>
                        </Row>
                        <Row className="justify-content-center">
                            <Col xs={12}>
                                <Form onSubmit={handlegenerateOTP}>
                                    {[
                                        "name",
                                        "mobileNo",
                                        "email",
                                        "password",
                                        "confirmPassword",
                                    ].map((field, idx) => (
                                        <Form.Group className="mb-3" key={idx}>
                                            <Row>
                                                <Col xs={3} className="d-flex align-items-center">
                                                    <Form.Label className="ms-2">
                                                        {field.charAt(0).toUpperCase() + field.slice(1)}
                                                    </Form.Label>
                                                </Col>
                                                <Col xs={9}>
                                                    <Form.Control
                                                        type={
                                                            field === "password" || field === "confirmPassword"
                                                                ? "password"
                                                                : "text"
                                                        }
                                                        name={field}
                                                        placeholder={`Enter ${field}`}
                                                        value={credentials[field]}
                                                        onChange={handleChange}
                                                        required
                                                    />
                                                </Col>
                                            </Row>
                                        </Form.Group>
                                    ))}
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
            ) : (
                <Row id="userOtpform">
                    <Row className="justify-content-center mb-4 mt-4">
                        <h3>
                            <FaKey size={30} className="mx-2" /> OTP Form
                        </h3>
                    </Row>
                    <Row className="justify-content-center">
                        <Col xs={12}>
                            <Form onSubmit={handleuserOtpVerify}>
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col xs={3} className="d-flex align-items-center">
                                            <Form.Label className="ms-2">OTP</Form.Label>
                                        </Col>
                                        <Col xs={9}>
                                            <Form.Control
                                                type="text"
                                                name="userOtp"
                                                placeholder="Enter OTP"
                                                value={credentials.userOtp}
                                                onChange={handleChange}
                                                required
                                            />
                                        </Col>
                                    </Row>
                                </Form.Group>
                                <div className="text-center">
                                    <Button variant="primary" type="submit" className="w-50">
                                        Verify OTP
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