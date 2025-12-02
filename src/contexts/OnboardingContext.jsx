import React, { createContext, useContext, useState } from 'react';

const OnboardingContext = createContext();

export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
};

// Définition des étapes de l'onboarding
export const ONBOARDING_STEPS = [
  {
    id: 'welcome',
    title: 'Bienvenue sur Metr !',
    description: 'Nous allons vous guider pour créer votre premier projet en quelques étapes simples.',
    target: null,
    position: 'center',
    showNext: true,
    showSkip: true
  },
  {
    id: 'create-project-button',
    title: 'Créer votre premier projet',
    description: 'Cliquez sur ce bouton pour commencer à créer votre premier projet. C\'est ici que tout commence !',
    target: '.cta-button',
    position: 'left',
    showNext: false,
    showSkip: true,
    requiredAction: 'click'
  },
  {
    id: 'project-form',
    title: 'Remplir les informations',
    description: 'Donnez un nom à votre projet et remplissez les informations de base. Ne vous inquiétez pas, vous pourrez les modifier plus tard.',
    target: '.creation-projet-content',
    position: 'right',
    showNext: true,
    showSkip: true,
    requiredAction: null
  },
  {
    id: 'sidebar-navigation',
    title: 'Navigation dans l\'application',
    description: 'Utilisez cette barre latérale pour naviguer entre vos projets, consulter vos notifications et accéder à votre profil.',
    target: '.nav-links',
    position: 'right',
    showNext: true,
    showSkip: false
  },
  {
    id: 'projects-page',
    title: 'Gérer vos projets',
    description: 'Ici vous pouvez voir tous vos projets, les filtrer et les organiser. Cliquez sur "Projet" pour accéder à cette page.',
    target: '.nav-item[href="/projet"]',
    position: 'right',
    showNext: false,
    showSkip: true,
    requiredAction: 'click'
  },
  {
    id: 'notifications',
    title: 'Restez informé',
    description: 'Les notifications vous permettent de suivre les modifications apportées à vos projets par votre équipe.',
    target: '.nav-item[href="/notif"]',
    position: 'right',
    showNext: true,
    showSkip: false
  },
  {
    id: 'completion',
    title: 'Félicitations ! 🎉',
    description: 'Vous maîtrisez maintenant les bases de Metr. Explorez l\'application et créez d\'autres projets !',
    target: null,
    position: 'center',
    showNext: false,
    showSkip: false,
    showClose: true,
    isComplete: true
  }
];

export const OnboardingProvider = ({ children }) => {
  const [isOnboardingActive, setIsOnboardingActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [completedActions, setCompletedActions] = useState(new Set());
  const [currentPath, setCurrentPath] = useState('/');

  const startOnboarding = () => {
    setIsOnboardingActive(true);
    setCurrentStep(0);
    setCompletedActions(new Set());
  };

  const stopOnboarding = () => {
    setIsOnboardingActive(false);
    setCurrentStep(0);
    setCompletedActions(new Set());
  };

  const nextStep = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      stopOnboarding();
    }
  };

  const skipOnboarding = () => {
    stopOnboarding();
  };

  const markActionCompleted = (action) => {
    setCompletedActions(prev => new Set([...prev, action]));
    
    // Auto-advance si l'action requise est complétée
    const step = ONBOARDING_STEPS[currentStep];
    if (step.requiredAction === action) {
      setTimeout(nextStep, 1000); // Petit délai pour que l'utilisateur voie le changement
    }
  };

  const getCurrentStep = () => {
    return ONBOARDING_STEPS[currentStep];
  };

  const updateCurrentPath = (path) => {
    setCurrentPath(path);
    
    // Auto-advance si on arrive sur la page de création de projet
    if (path === '/creation-projet' && currentStep === 1) {
      // Faire défiler vers le haut immédiatement
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
      
      setTimeout(() => {
        setCurrentStep(2);
      }, 800);
    }
    
    // Auto-advance si on arrive sur la page projet depuis l'étape projects-page
    if (path === '/projet' && currentStep === 4 && ONBOARDING_STEPS[currentStep].id === 'projects-page') {
      setTimeout(() => {
        setCurrentStep(5);
      }, 500);
    }
  };

  const value = {
    isOnboardingActive,
    currentStep,
    completedActions,
    currentPath,
    startOnboarding,
    stopOnboarding,
    nextStep,
    skipOnboarding,
    markActionCompleted,
    getCurrentStep,
    updateCurrentPath,
    totalSteps: ONBOARDING_STEPS.length
  };

  return (
    <OnboardingContext.Provider value={value}>
      {children}
    </OnboardingContext.Provider>
  );
};
