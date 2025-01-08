import React, { useState } from "react";
import { FaBars, FaHome, FaUser, FaList, FaSignOutAlt } from "react-icons/fa";
import { Row, Col, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../assets/css/Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.clear(); // Clear all stored data
        navigate("/"); // Redirect to the login page or home
    };

    return (
        <div className={`sidebar bg-light p-4 ${sidebarOpen ? "open" : "closed"}`}>
            <Row className="align-items-center mb-4">
                <Col xs={8} className="text-center">
                    <h4 className="mb-0">MENU</h4>
                </Col>
                <Col xs={4} className="text-end">
                    <FaBars className="mx-2" onClick={toggleSidebar} />
                </Col>
            </Row>
            <Nav className="flex-column">
                <Nav.Item className="mb-3">
                    <Nav.Link href="/home" className="d-flex align-items-center">
                        <FaHome className="me-2" /> Homepage
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                    <Nav.Link href="/addstudent" className="d-flex align-items-center">
                        <FaUser className="me-2" /> Add Students
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                    <Nav.Link href="/studentlist" className="d-flex align-items-center">
                        <FaList className="me-2" /> Students List
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                    <Nav.Link className="d-flex align-items-center" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" /> Logout
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default Sidebar;
