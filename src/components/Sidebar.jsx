import React, { useState } from "react";
import { FaBars, FaHome, FaUser, FaList, FaSignOutAlt } from "react-icons/fa";
import { Row, Col, Nav, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../assets/css/Sidebar.css";

const Sidebar = () => {
    const navigate = useNavigate();
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => {
            if (sidebarOpen) {
                const contentElement = document.querySelector(".content");
                // If the sidebar is open, remove "content" and add "content-full-width"
                contentElement.classList.remove("content");
                contentElement.classList.add("content-full-width");
            } else {
                const contentElement = document.querySelector(".content-full-width");
                // If the sidebar is closed, remove "content-full-width" and add "content"
                contentElement.classList.remove("content-full-width");
                contentElement.classList.add("content");
            }
        setSidebarOpen(!sidebarOpen);
    };

    const handleLogout = () => {
        console.log("Logging out...");
        localStorage.clear(); // Clear all stored data
        navigate("/"); // Redirect to the login page or home
    };

    return (
        <div className={`sidebar bg-light ${sidebarOpen ? "p-4 open" : "closed"}`}>
            <Row className="align-items-center mb-4">
                <Col xs={12} className="text-end">
                    <FaBars className="mx-2" onClick={toggleSidebar} />
                </Col>
            </Row>
            <Nav className="flex-column">
                <Nav.Item className="mb-3">
                    <Nav.Link href="/home" className="d-flex align-items-center">
                        <FaHome className="me-2" />
                        {sidebarOpen && <span className="mx-2">HOMEPAGE</span>}
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                    <Nav.Link href="/addstudent" className="d-flex align-items-center">
                        <FaUser className="me-2" />
                        {sidebarOpen && <span className="mx-2">ADD STUDENT</span>}
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                    <Nav.Link href="/studentlist" className="d-flex align-items-center">
                        <FaList className="me-2" /> 
                        {sidebarOpen && <span className="mx-2">STUDENT LIST</span>}
                    </Nav.Link>
                </Nav.Item>
                <Nav.Item className="mb-3">
                    <Nav.Link className="d-flex align-items-center" onClick={handleLogout}>
                        <FaSignOutAlt className="me-2" /> 
                        {sidebarOpen && <span className="mx-2">LOGOUT</span>}
                    </Nav.Link>
                </Nav.Item>
            </Nav>
        </div>
    );
};

export default Sidebar;
