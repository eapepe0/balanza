import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { io } from 'socket.io-client';
import { ScaleDisplay } from '../components/ScaleDisplay';
import { RecipeStep } from '../components/RecipeStep';
import { Trash2, ArrowLeft } from 'lucide-react';
import type { Recipe } from '../types/Recipe';
import { recipeStorage } from '../services/recipeStorage';

const socket = io('http://localhost:3000');

export default function WeighingProcess() {
  const { recipeId } = useParams();
  const navigate = useNavigate();
  const [weight, setWeight] = useState(0);
  const [recipe, setRecipe] = useState<Recipe | null>(null);

  useEffect(() => {
    if (recipeId) {
      const foundRecipe = recipeStorage.getRecipeById(Number(recipeId));
      console.log(foundRecipe);
      if (foundRecipe) {
        setRecipe({ ...foundRecipe, currentStep: 0 });
      }
    }

    socket.on('weight', (newWeight: number) => {
      setWeight(newWeight);
      if (recipe) {
        checkStepCompletion(newWeight);
      }
    });

    return () => {
      socket.off('weight');
    };
  }, [recipeId]);

  const checkStepCompletion = (currentWeight: number) => {
    if (!recipe) return;

    const currentStep = recipe.steps[recipe.currentStep];
    if (currentWeight >= currentStep.targetWeight && !currentStep.completed) {
      const updatedSteps = recipe.steps.map((step, index) =>
        index === recipe.currentStep ? { ...step, completed: true } : step
      );
      setRecipe({ ...recipe, steps: updatedSteps });
    }
  };

  const handleNextStep = () => {
    if (recipe && recipe.currentStep < recipe.steps.length - 1) {
      setRecipe({ ...recipe, currentStep: recipe.currentStep + 1 });
    }
  };

  const handleTare = async () => {
    try {
      await fetch('http://localhost:3000/api/tare');
    } catch (error) {
      console.error('Failed to tare scale:', error);
    }
  };

  if (!recipe) {
    return (
      <div className="max-w-4xl mx-auto text-center py-12">
        <h2 className="text-2xl font-bold text-gray-800">Recipe not found</h2>
        <button
          onClick={() => navigate('/')}
          className="mt-4 inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Recipes
        </button>
      </div>
    );
  }

  const currentStep = recipe.steps[recipe.currentStep];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">{recipe.name}</h1>
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Back to Recipes
          </button>
        </div>

        <ScaleDisplay weight={weight} targetWeight={currentStep.targetWeight} />

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleTare}
            className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Trash2 className="w-5 h-5" />
            Tare Scale
          </button>

          <button
            onClick={handleNextStep}
            disabled={
              !currentStep.completed ||
              recipe.currentStep === recipe.steps.length - 1
            }
            className={`px-6 py-2 rounded-lg transition-colors ${
              currentStep.completed &&
              recipe.currentStep < recipe.steps.length - 1
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
            }`}
          >
            Next Step
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Recipe Steps
        </h2>
        <div className="space-y-2">
          {recipe.steps.map((step, index) => (
            <RecipeStep
              key={step.id}
              step={step}
              isActive={index === recipe.currentStep}
              isCompleted={step.completed}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
