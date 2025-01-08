import React, { useEffect, useState } from "react";
import { Container, Row, Form, Col, Button, InputGroup } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUser, FaPhone, FaCalendar, FaImage } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { addApi } from "./Api.jsx";
import NotificationModal from "./NotificationModal.jsx";
import ReactConfetti from "react-confetti";
import "../assets/css/App.css";

const AddStudentPage = () => {
    const navigate = useNavigate();

    // State management
    const [studentData, setStudentData] = useState({
        name: "",
        fatherName: "",
        dateofBirth: "",
        mobileNo: "",
        file: null,
        createdBy: localStorage.getItem("createdBy") || "",
    });
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [confetti, setConfetti] = useState(false);

    // Modal handlers
    const handleCloseModal = () => {
        setShowModal(false);
        if (confetti) setConfetti(false);
    };

    const handleShowModal = (message) => {
        setModalMessage(message);
        setShowModal(true);
    };

    // Redirect to login if unauthenticated
    useEffect(() => {
        if (!localStorage.getItem("auth")) {
            navigate("/");
        }
    }, [navigate]);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === "file") {
            const file = files[0];
            // File type validation
            const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
            if (file && !allowedTypes.includes(file.type)) {
                handleShowModal("Please upload a valid image (JPEG/PNG).");
                return;
            }
            setStudentData((prevData) => ({
                ...prevData,
                [name]: file,
            }));
        } else {
            setStudentData((prevData) => ({
                ...prevData,
                [name]: value,
            }));
        }
    };

    // Validation function
    const validateInput = (name, value) => {
        if (["name", "fatherName"].includes(name)) {
            const nameRegex = /^[A-Za-z\s]*$/;
            if (!nameRegex.test(value)) {
                return `${name === "name" ? "Student" : "Father's"} Name can only contain alphabets and spaces.`;
            }
        }
        if (name === "mobileNo") {
            const mobileRegex = /^[0-9]{10}$/;
            if (!mobileRegex.test(value)) {
                return "Please enter a valid 10-digit mobile number.";
            }
        }
        return null;
    };

    // Form submission handler
    const handleSubmit = async (e) => {
        e.preventDefault();
        const { name, fatherName, dateofBirth, mobileNo, file } = studentData;

        // Check for empty fields
        if (!name || !fatherName || !dateofBirth || !mobileNo || !file) {
            handleShowModal("Please fill in all fields.");
            return;
        }

        // Validate inputs
        let errorMessage =
            validateInput("name", name) ||
            validateInput("fatherName", fatherName) ||
            validateInput("mobileNo", mobileNo);

        if (errorMessage) {
            handleShowModal(errorMessage);
            return;
        }

        // Prepare form data for submission
        const formData = new FormData();
        formData.append("name", name);
        formData.append("fatherName", fatherName);
        formData.append("dateofBirth", dateofBirth);
        formData.append("mobileNo", mobileNo);
        formData.append("file", file); // Attach the file
        formData.append("createdBy", studentData.createdBy);

        // Submit data to API
        const response = await addApi("Student/AddStudent", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (response) {
            handleShowModal(response.message || "Student added successfully!");
            if (response.status === "success") {
                setConfetti(true);
            }
        } else {
            handleShowModal(response.errors || "An error occurred. Please try again.");
        }
    };

    return (
        <div className="page-wrapper d-flex">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="content flex-grow-1 p-4">
                <Container fluid>
                <NotificationModal show={showModal} onHide={handleCloseModal} modalMessage={modalMessage} />
                {confetti && <ReactConfetti />}
                        <Row className="mb-3">
                        <h3 className="text-center">STUDENT ENTRY FORM</h3>
                    </Row>
                    <div className="form">
                        <Row>
                            <Form onSubmit={handleSubmit} encType="multipart/form-data">
                                {/* Student Name */}
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={4}>
                                            <Form.Label>Student Name</Form.Label>
                                        </Col>
                                        <Col md={8}>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaUser />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    name="name"
                                                    placeholder="Enter Student Name"
                                                    value={studentData.name}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Form.Group>

                                {/* Father's Name */}
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={4}>
                                            <Form.Label>Father's Name</Form.Label>
                                        </Col>
                                        <Col md={8}>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaUser />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    name="fatherName"
                                                    placeholder="Enter Father's Name"
                                                    value={studentData.fatherName}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Form.Group>

                                {/* Date of Birth */}
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={4}>
                                            <Form.Label>Date of Birth</Form.Label>
                                        </Col>
                                        <Col md={8}>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaCalendar />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="date"
                                                    name="dateofBirth"
                                                    value={studentData.dateofBirth}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Form.Group>

                                {/* Mobile Number */}
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={4}>
                                            <Form.Label>Mobile No</Form.Label>
                                        </Col>
                                        <Col md={8}>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaPhone />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="tel"
                                                    name="mobileNo"
                                                    placeholder="Enter Mobile No"
                                                    value={studentData.mobileNo}
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Form.Group>

                                {/* Student Image */}
                                <Form.Group className="mb-3">
                                    <Row>
                                        <Col md={4}>
                                            <Form.Label>Student Image</Form.Label>
                                        </Col>
                                        <Col md={8}>
                                            <InputGroup>
                                                <InputGroup.Text>
                                                    <FaImage />
                                                </InputGroup.Text>
                                                <Form.Control
                                                    type="file"
                                                    name="file"
                                                    onChange={handleChange}
                                                    required
                                                />
                                            </InputGroup>
                                        </Col>
                                    </Row>
                                </Form.Group>

                                {/* Submit Button */}
                                <div className="text-center">
                                    <Button type="submit" className="w-50">
                                        Submit
                                    </Button>
                                </div>
                            </Form>
                        </Row>
                    </div>
                </Container>
                
            </div>
        </div>
        
    );
};

export default AddStudentPage;
