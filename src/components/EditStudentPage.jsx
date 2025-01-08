import React, { useEffect, useState } from "react";
import { Container, Row, Form, Col, Button, InputGroup } from "react-bootstrap";
import { useNavigate, useLocation } from "react-router-dom";
import { FaUser, FaPhone, FaCalendar } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { addApi } from "./Api"; // Assuming this is where the API call is defined
import NotificationModal from "./NotificationModal";


function EditStudentPage  ()  {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = location;
  const { id, name, fatherName, mobileNo, dateOfBirth } = state || {};

  const [studentData, setStudentData] = useState({
    id: id || "",
    name: name || "",
    fatherName: fatherName || "",
    mobileNo: mobileNo || "",
    dateOfBirth: dateOfBirth || "",
  });

  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");

  // Redirect if not authenticated
  useEffect(() => {
    if (!localStorage.getItem("auth")) {
      navigate("/");
    }
  }, [navigate]);

  // Input change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setStudentData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Input validation
  const validateInput = (name, value) => {
    if (name === "name" || name === "fatherName") {
      const nameRegex = /^[A-Za-z\s]*$/;
      if (!nameRegex.test(value)) {
        return `${name === "name" ? "Student" : "Father's"} Name can only contain alphabets and spaces.`;
      }
    } else if (name === "mobileNo") {
      const mobileRegex = /^[0-9]{10}$/;
      if (!mobileRegex.test(value)) {
        return "Please enter a valid 10-digit mobile number.";
      }
    }
    return null; // Return null if validation passes
  };

  // Form submission handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, fatherName, mobileNo, dateOfBirth } = studentData;

    // Validate inputs
    for (const [field, value] of Object.entries({ name, fatherName, mobileNo })) {
      const errorMessage = validateInput(field, value);
      if (errorMessage) {
        handleShowModal(errorMessage);
        return;
      }
    }

    // Ensure date of birth is not empty
    if (!dateOfBirth) {
      handleShowModal("Date of Birth cannot be empty.");
      return;
    }

    // API call
    const accessToken = localStorage.getItem("accesstoken");
    const response = await addApi("Student/UpdateStudent", studentData, accessToken);

    if (response && response.message) {
      handleShowModal(response.message); // Success message
    } else {
      handleShowModal("Failed to update student. Please try again.");
    }
  };

  // Modal handlers
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal = (message) => {
    setModalMessage(message);
    setShowModal(true);
  };

  return (
    <div className="page-wrapper d-flex">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="content flex-grow-1 p-4">
          <Container fluid>
            <Row>
              <h3 className="mb-3">EDIT STUDENT</h3>
            </Row>
            <div className="form">  
              <Row>
                <Form onSubmit={handleSubmit}>
                  {/* Student Name */}
                  <Form.Group className="mb-3" controlId="studentName">
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
                            placeholder="Enter Student Name"
                            name="name"
                            value={studentData.name}
                            onChange={handleChange}
                            required
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </Form.Group>

                  {/* Father's Name */}
                  <Form.Group className="mb-3" controlId="fatherName">
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
                            placeholder="Enter Father's Name"
                            name="fatherName"
                            value={studentData.fatherName}
                            onChange={handleChange}
                            required
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </Form.Group>

                  {/* Date of Birth */}
                  <Form.Group className="mb-3" controlId="dateOfBirth">
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
                            name="dateOfBirth"
                            value={studentData.dateOfBirth}
                            onChange={handleChange}
                            required
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </Form.Group>

                  {/* Mobile Number */}
                  <Form.Group className="mb-3" controlId="mobileNo">
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
                            type="text"
                            placeholder="Enter Mobile No"
                            name="mobileNo"
                            value={studentData.mobileNo}
                            onChange={handleChange}
                            required
                          />
                        </InputGroup>
                      </Col>
                    </Row>
                  </Form.Group>

                  <Button type="submit" className="w-50">Update</Button>
                </Form>
              </Row>
            </div>
          </Container>

      {/* Modal for success/error message */}
      {showModal && (
        <NotificationModal show={showModal} onHide={handleCloseModal} modalMessage={modalMessage} />
      )}
    </div>
    </div>
  );
};

export default EditStudentPage;
