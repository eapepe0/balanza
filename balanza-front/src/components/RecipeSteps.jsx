import  { useState } from 'react';
import IndicadorPeso from './IndicadorPeso'; // Importamos el componente IndicadorPeso
import Button from 'react-bootstrap/Button';


const RecipeSteps = ({ recipe }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const currentWeight = recipe[currentStep]?.targetWeight || 0;

  const handleNextStep = () => {
    if (currentStep < recipe.length - 1) {
      setCurrentStep((prevStep) => prevStep + 1);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <h2>Receta: Paso {currentStep + 1}</h2>
      <p>{recipe[currentStep]?.description || 'Receta finalizada'}</p>
      
      {currentStep < recipe.length - 1 ? (
        <>
          <IndicadorPeso targetWeight={currentWeight} currentWeight={recipe[currentStep]?.currentWeight} />
          <Button 
            variant="primary" 
            onClick={handleNextStep} 
            disabled={recipe[currentStep]?.currentWeight < currentWeight}>
              {`Siguiente Paso`}
          </Button>
        </>
      ) : (
        <Button variant="success" onClick={() => alert('Receta finalizada!')}>
          Finalizar Receta
        </Button>
      )}
    </div>
  );
};

export default RecipeSteps;


