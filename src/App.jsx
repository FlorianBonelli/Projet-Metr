import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashbord from './pages/Dashbord';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashbord />} />
        <Route path="/dashboard" element={<Dashbord />} />
        <Route path="/profil" element={<Connexion />} />
        <Route path="/inscription" element={<Inscription />} />
        {/* Ajoutez d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;