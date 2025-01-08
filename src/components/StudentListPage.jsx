import React, { useEffect, useState } from "react";
import { Container, Table, Button, Modal } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../assets/css/App.css";
import { FaPencilAlt, FaTrash } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { getApi, deleteApi } from "./Api.jsx";

function StudentListPage() {
    const accesstoken = localStorage.getItem("accesstoken");
    const name = localStorage.getItem("createdBy");
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [loading, setLoading] = useState(true);

    // Modal state
    const [showModal, setShowModal] = useState(false);
    const [modalMessage, setModalMessage] = useState("");
    const [studentToDelete, setStudentToDelete] = useState(null);

    // Redirect to login page if user is not authenticated
    useEffect(() => {
        if (!localStorage.getItem("auth")) {
            navigate("/");
        }
    }, [navigate]);

    const fetchStudents = async () => {
        const url = 'Student/StudentsList'; // Your API endpoint
        const response = await getApi(url); // Get the student data
        console.log(response);
        // Check if response is valid before setting students
        if (response) {
            const { data } = response;
            setStudents(data || []); // Set the students data
            setLoading(false); // Set loading to false when data is fetched
        } else {
            console.log("Failed to fetch data or response was empty.");
            // Optionally set a default value for students if needed
            setStudents([]);
            setLoading(false); // Set loading to false if no data
        }
    };
    useEffect(() => {
        if (accesstoken) {
            fetchStudents();
        }
    }, [accesstoken]);

    // Calculate age from date of birth
    const calculateAge = (dob) => {
        const birthDate = new Date(dob);
        const today = new Date();
        let age = today.getFullYear() - birthDate.getFullYear();
        if (
            today.getMonth() < birthDate.getMonth() ||
            (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate())
        ) {
            age--;
        }
        return age;
    };

    // Show modal for delete confirmation
    const handleDeleteClick = (id) => {
        setModalMessage("Are you sure you want to delete this student?");
        setStudentToDelete(id);
        setShowModal(true);
    };

    // Handle delete action after confirmation
    const handleDeleteConfirm = async () => {
        if (studentToDelete) {
            const credentials = {
                "id": `${studentToDelete}`, // Correctly using colon (:) for object properties
                "DeletedBy": `${name}`,      // Replace "name" with the actual variable holding the delete user's name
            };
            const url = "Student/DeleteStudent";
            const response = await deleteApi(url, credentials);
                if (response) {
                    const { data, message } = response;
                    const {id} = data;
                    setStudents((prev) => prev.filter((student) => student.id !== id));
                    setModalMessage( message );
                    setShowModal(true);
                } else {
                    setModalMessage("Failed to delete student. Please try again.");
                    setShowModal(true);
                }
        }
    };

    return (
        <div className="page-wrapper d-flex">
            {/* Sidebar */}
            <Sidebar />
            {/* Main Content */}
            <div className="content flex-grow-1 p-4">
                <Container fluid>
                <div className="table">
                    <h3 className="text-center mb-4">STUDENT LIST</h3>
                    {loading ? (
                        <p className="text-center">Loading students...</p>
                    ) : students.length > 0 ? (
                        <Table striped bordered hover responsive>
                            <thead className="table-primary">
                                <tr>
                                    <th>S.No</th>
                                    <th>Name</th>
                                    <th>Father's Name</th>
                                    <th>Mobile No</th>
                                    <th>Date of Birth</th>
                                    <th>Age</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {students.map((student, index) => (
                                    <tr key={student.id}>
                                        <td>{index + 1}</td>
                                        <td>{student.name}</td>
                                        <td>{student.fatherName}</td>
                                        <td>{student.mobileNo}</td>
                                        <td>{student.dateOfBirth}</td>
                                        <td>{calculateAge(student.dateOfBirth)}</td>
                                        <td>
                                            <Link
                                                to="/editstudent"
                                                state={{
                                                    id: student.id,
                                                    name: student.name,
                                                    fatherName: student.fatherName,
                                                    mobileNo: student.mobileNo,
                                                    dateOfBirth: student.dateOfBirth,
                                                }}
                                            >
                                                <Button variant="primary" className="me-1">
                                                    <FaPencilAlt />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="danger"
                                                onClick={() => handleDeleteClick(student.id)}
                                            >
                                                <FaTrash />
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    ) : (
                        <p className="text-center">No students found.</p>
                    )}
                </div>
                {/* Modal for confirmation and notifications */}
                <Modal show={showModal} onHide={() => setShowModal(false)}>
                    <Modal.Header closeButton>
                        <Modal.Title>Notification</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalMessage}</Modal.Body>
                    <Modal.Footer>
                        {studentToDelete ? (
                            <>
                                <Button variant="danger" onClick={handleDeleteConfirm}>
                                    Confirm
                                </Button>
                                <Button variant="secondary" onClick={() => setShowModal(false)}>
                                    Cancel
                                </Button>
                            </>
                        ) : (
                            <Button variant="primary" onClick={() => setShowModal(false)}>
                                Ok
                            </Button>
                        )}
                    </Modal.Footer>
                </Modal>
             </Container>
             </div>
            </div>
    );
}

export default StudentListPage;
