import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Correct imports
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import LoginPage from './components/LoginPage';
import Homepage from './components/Homepage';
import AddStudentPage from './components/AddStudentPage';
import EditStudentPage from './components/EditStudentPage';
import StudentListPage from './components/StudentListPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Homepage />} />
        <Route path="/addstudent" element={<AddStudentPage />} />
        <Route path="/editstudent" element={<EditStudentPage />} />
        <Route path="/studentlist" element={<StudentListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
  