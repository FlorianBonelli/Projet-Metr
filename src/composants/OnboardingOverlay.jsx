import React, { useEffect, useState } from 'react';
import { useOnboarding } from '../contexts/OnboardingContext';
import './OnboardingOverlay.css';

const OnboardingOverlay = () => {
  const {
    isOnboardingActive,
    getCurrentStep,
    nextStep,
    skipOnboarding,
    stopOnboarding,
    currentStep,
    totalSteps
  } = useOnboarding();

  const [targetElement, setTargetElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });

  const step = getCurrentStep();

  useEffect(() => {
    if (!isOnboardingActive || !step.target) {
      setTargetElement(null);
      return;
    }

    // Attendre un peu que la page se charge complètement
    const timer = setTimeout(() => {
      // Trouver l'élément cible
      const element = document.querySelector(step.target);
      if (element) {
        setTargetElement(element);
      
      // Calculer la position du tooltip
      const rect = element.getBoundingClientRect();
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      const scrollLeft = window.pageXOffset || document.documentElement.scrollLeft;
      
      let top, left;
      
      switch (step.position) {
        case 'right':
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.right + scrollLeft + 20;
          
          // Si on est sur la page de création, forcer à droite au milieu de l'écran
          if (step.id === 'project-form') {
            left = window.innerWidth - 350; // 320px width + 30px margin
            top = window.innerHeight / 2 + scrollTop - 100;
          }
          // Si c'est l'étape sidebar-navigation, positionner le tooltip de manière visible
          else if (step.id === 'sidebar-navigation') {
            left = rect.right + scrollLeft + 30; // Un peu plus d'espace depuis la sidebar
            top = Math.max(rect.top + scrollTop, 100); // Au moins 100px du haut
          }
          // Si le tooltip sort de l'écran à droite, le positionner à gauche
          else if (left + 320 > window.innerWidth) {
            left = rect.left + scrollLeft - 320;
          }
          break;
        case 'left':
          top = rect.top + scrollTop + rect.height / 2;
          left = rect.left + scrollLeft - 340; // 320px width + 20px margin
          
          // Vérifier si le tooltip sort de l'écran à gauche
          if (left < 20) {
            // Si pas assez de place à gauche, positionner à droite
            left = rect.right + scrollLeft + 20;
            // Si pas assez de place à droite non plus, centrer horizontalement
            if (left + 320 > window.innerWidth - 20) {
              left = (window.innerWidth - 320) / 2;
              // Ajuster la position verticale pour éviter de chevaucher le bouton
              if (Math.abs(top - (rect.top + scrollTop + rect.height / 2)) < 100) {
                top = rect.bottom + scrollTop + 20;
              }
            }
          }
          
          // Vérifier si le tooltip sort de l'écran en haut ou en bas
          if (top < 20) {
            top = 20;
          } else if (top + 200 > window.innerHeight + scrollTop) { // Estimation de la hauteur du tooltip
            top = window.innerHeight + scrollTop - 220;
          }
          break;
        case 'bottom':
          top = rect.bottom + scrollTop + 20;
          left = rect.left + scrollLeft + rect.width / 2 - 160; // Center tooltip
          
          // Vérifier si le tooltip sort de l'écran horizontalement
          if (left < 20) {
            left = 20;
          } else if (left + 320 > window.innerWidth - 20) {
            left = window.innerWidth - 340;
          }
          
          // Vérifier si le tooltip sort de l'écran en bas
          if (top + 200 > window.innerHeight + scrollTop) {
            top = rect.top + scrollTop - 220; // Positionner au-dessus
          }
          break;
        case 'top':
          top = rect.top + scrollTop - 220;
          left = rect.left + scrollLeft + rect.width / 2 - 160;
          
          // Vérifier si le tooltip sort de l'écran horizontalement
          if (left < 20) {
            left = 20;
          } else if (left + 320 > window.innerWidth - 20) {
            left = window.innerWidth - 340;
          }
          
          // Vérifier si le tooltip sort de l'écran en haut
          if (top < 20) {
            top = rect.bottom + scrollTop + 20; // Positionner en dessous
          }
          break;
        default:
          top = window.innerHeight / 2 + scrollTop - 100;
          left = window.innerWidth / 2 + scrollLeft - 150;
      }
      
        setTooltipPosition({ top, left });
      } else {
        console.warn('Élément cible non trouvé:', step.target);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [isOnboardingActive, step, currentStep]);

  useEffect(() => {
    if (targetElement) {
      // Ajouter la classe highlight à l'élément cible
      targetElement.classList.add('onboarding-highlight');
      
      // Scroll spécial pour certaines étapes
      if (step.id === 'project-form' || step.id === 'sidebar-navigation') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // Scroll vers l'élément si nécessaire pour les autres étapes
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'center'
        });
      }
      
      return () => {
        targetElement.classList.remove('onboarding-highlight');
      };
    }
  }, [targetElement, step.id]);

  if (!isOnboardingActive) {
    return null;
  }

  const handleNext = () => {
    if (step.requiredAction) {
      // Ne pas avancer automatiquement si une action est requise
      return;
    }
    nextStep();
  };

  const handleSkip = () => {
    skipOnboarding();
  };

  const handleClose = () => {
    stopOnboarding();
  };

  return (
    <>
      {/* Overlay sombre */}
      <div className="onboarding-overlay" />
      
      {/* Spotlight sur l'élément cible */}
      {targetElement && (
        <div 
          className="onboarding-spotlight"
          style={{
            top: targetElement.getBoundingClientRect().top + window.pageYOffset - (step.id === 'sidebar-navigation' ? 20 : 10),
            left: targetElement.getBoundingClientRect().left + window.pageXOffset - (step.id === 'sidebar-navigation' ? 20 : 10),
            width: targetElement.offsetWidth + (step.id === 'sidebar-navigation' ? 40 : 20),
            height: targetElement.offsetHeight + (step.id === 'sidebar-navigation' ? 40 : 20),
          }}
        />
      )}
      
      {/* Tooltip avec les instructions */}
      <div 
        className={`onboarding-tooltip onboarding-tooltip--${step.position} ${step.id === 'create-project-button' ? 'onboarding-tooltip--create-project' : ''}`}
        style={step.position === 'center' || step.id === 'create-project-button' ? {
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)'
        } : tooltipPosition}
      >
        <div className="onboarding-tooltip__header">
          <h3 className="onboarding-tooltip__title">{step.title}</h3>
          <div className="onboarding-tooltip__header-right">
            <div className="onboarding-tooltip__progress">
              {currentStep + 1} / {totalSteps}
            </div>
            <button 
              className="onboarding-tooltip__close-btn"
              onClick={handleClose}
              title="Fermer le tutoriel"
            >
              ×
            </button>
          </div>
        </div>
        
        <p className="onboarding-tooltip__description">
          {step.description}
        </p>
        
        {step.requiredAction && (
          <div className="onboarding-tooltip__action-hint">
            {step.requiredAction === 'click' && '👆 Cliquez sur l\'élément en surbrillance'}
            {step.requiredAction === 'form-submit' && '✏️ Remplissez et validez le formulaire'}
            {step.requiredAction === 'navigate' && '🧭 Cliquez sur l\'élément pour naviguer'}
          </div>
        )}
        
        <div className="onboarding-tooltip__actions">
          {step.showSkip && (
            <button 
              className="onboarding-tooltip__button onboarding-tooltip__button--secondary"
              onClick={handleSkip}
            >
              Passer le tutoriel
            </button>
          )}
          
          {step.showClose && (
            <button 
              className="onboarding-tooltip__button onboarding-tooltip__button--primary"
              onClick={handleClose}
            >
              Fermer le tutoriel
            </button>
          )}
          
          {step.showNext && (
            <button 
              className="onboarding-tooltip__button onboarding-tooltip__button--primary"
              onClick={handleNext}
            >
              {step.isComplete ? 'Terminer' : 'Suivant'}
            </button>
          )}
        </div>
        
        {/* Flèche pointant vers l'élément */}
        {step.target && step.id !== 'create-project-button' && (
          <div className={`onboarding-tooltip__arrow onboarding-tooltip__arrow--${step.position}`} />
        )}
      </div>
    </>
  );
};

export default OnboardingOverlay;
