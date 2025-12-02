import { useEffect } from 'react';
import { useOnboarding } from '../contexts/OnboardingContext';
import { useNavigate, useLocation } from 'react-router-dom';

export const useOnboardingActions = () => {
  const { isOnboardingActive, markActionCompleted, getCurrentStep, updateCurrentPath } = useOnboarding();
  const navigate = useNavigate();
  const location = useLocation();

  // Suivre les changements de route
  useEffect(() => {
    if (isOnboardingActive) {
      updateCurrentPath(location.pathname);
    }
  }, [location.pathname, isOnboardingActive, updateCurrentPath]);

  useEffect(() => {
    if (!isOnboardingActive) return;

    const step = getCurrentStep();
    
    // Écouter les clics sur les éléments ciblés
    const handleClick = (event) => {
      const target = event.target.closest(step.target);
      if (target && step.requiredAction === 'click') {
        markActionCompleted('click');
      }
    };

    // Écouter les soumissions de formulaire
    const handleFormSubmit = (event) => {
      if (step.requiredAction === 'form-submit') {
        const form = event.target.closest('form');
        if (form && form.classList.contains('creation-form')) {
          markActionCompleted('form-submit');
        }
      }
    };

    // Écouter les changements de route pour la navigation
    const handleNavigation = () => {
      if (step.requiredAction === 'navigate') {
        markActionCompleted('navigate');
      }
    };

    if (step.target) {
      document.addEventListener('click', handleClick);
      document.addEventListener('submit', handleFormSubmit);
    }

    // Détecter les changements de route
    if (step.requiredAction === 'navigate') {
      handleNavigation();
    }

    return () => {
      document.removeEventListener('click', handleClick);
      document.removeEventListener('submit', handleFormSubmit);
    };
  }, [isOnboardingActive, getCurrentStep, markActionCompleted, location]);

  return null;
};
