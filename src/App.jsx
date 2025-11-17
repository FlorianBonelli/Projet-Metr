import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashbord from './pages/Dashbord';
import Projet from './pages/Projet';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Bibliotheques from './pages/Bibliotheques';
import Profil from './pages/Profil';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Connexion />} />
        <Route path="/dashboard" element={<Dashbord />} />
        <Route path="/bibliotheques" element={<Bibliotheques />} />
        <Route path="/connexion" element={<Connexion />} />
        <Route path="/profil" element={<Profil />} />
        <Route path="/inscription" element={<Inscription />} />
        <Route path="/projet" element={<Projet />} />
        {/* Ajoutez d'autres routes ici si nécessaire */}
      </Routes>
    </Router>
  );
}

export default App;