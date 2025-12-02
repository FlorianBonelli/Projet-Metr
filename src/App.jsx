import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OnboardingProvider } from './contexts/OnboardingContext';
import OnboardingOverlay from './composants/OnboardingOverlay';
import Dashbord from './pages/Dashbord';
import Projet from './pages/Projet';
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Bibliotheques from './pages/Bibliotheques';
import Profil from './pages/Profil';
import Notif from './pages/notif';
import CreationProjet from './pages/CreationProjet';
import InfoProjet from './pages/InfoProjet';
import './App.css';

function App() {
  return (
    <OnboardingProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Connexion />} />
          <Route path="/dashboard" element={<Dashbord />} />
          <Route path="/bibliotheques" element={<Bibliotheques />} />
          <Route path="/connexion" element={<Connexion />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/notif" element={<Notif />} />
          <Route path="/inscription" element={<Inscription />} />
          <Route path="/projet" element={<Projet />} />
          <Route path="/creation-projet" element={<CreationProjet />} />
          <Route path="/info-projet/:projectId" element={<InfoProjet />} />
          {/* Ajoutez d'autres routes ici si nécessaire */}
        </Routes>
        <OnboardingOverlay />
      </Router>
    </OnboardingProvider>
  );
}

export default App;