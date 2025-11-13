import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashbord from './pages/Dashbord';
import Connexion from './pages/Connexion';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashbord />} />
        <Route path="/dashboard" element={<Dashbord />} />
        <Route path="/profil" element={<Connexion />} />
        {/* Ajoutez d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;