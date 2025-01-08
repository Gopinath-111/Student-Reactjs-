import React, { useEffect, useState } from "react";
import { Container, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import Sidebar from "./Sidebar";
import { Bar } from "react-chartjs-2";
import "../assets/css/App.css";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
// Register the necessary components with Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function HomePage  ()  {
    const navigate = useNavigate();
    const  name  = localStorage.getItem("createdBy"); // Default name fallback
    const currentDateTime = new Date().toLocaleString();
    // Redirect to login page if the user is not authenticated
    useEffect(() => {
        if (!localStorage.getItem("auth")) {
            navigate("/");
        }
    }, [navigate]);
    const data = {
        labels: ["Italy", "France", "Spain", "USA", "Argentina"], // X-axis labels
        datasets: [
          {
            label: "World Wine Production 2018", // Dataset label
            data: [55, 49, 44, 24, 15], // Y-axis data
            backgroundColor: ["red", "green", "blue", "orange", "brown"], // Colors for each bar
            borderColor: "black", // Border color of bars
            borderWidth: 1 // Border width
          }
        ]
      };
    
      // Options for customizing the chart
      const options = {
        responsive: true, // Make the chart responsive
        plugins: {
          title: {
            display: true,
            text: "Wine Production by Country"
          },
          legend: {
            display: true,
            position: "top"
          }
        },
        scales: {
          y: {
            beginAtZero: true // Ensure Y-axis starts at 0
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
                    <Row className="header">
                        <h4 className="text-center mb-2 mt-2">ADMIN DASHBOARD</h4>
                    </Row>
                    {/* Add more content here */}
                    <Container>
                        <div>
                            <h1>Welcome! {name}</h1>
                            <p>Today is: {currentDateTime}</p>
                        </div>
                        {/*<Bar data={data} options={options} /> */ }
                    </Container>

                </Container>
            </div>
        </div>
    );
};

export default HomePage;
