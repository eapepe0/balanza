import React, { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import type { Recipe, RecipeStep } from '../types/Recipe';

interface RecipeFormProps {
  onSave: (recipe: Recipe) => void;
  onCancel: () => void;
  initialRecipe?: Recipe | null;
}

export function RecipeForm({ onSave, onCancel, initialRecipe }: RecipeFormProps) {
  const [recipe, setRecipe] = useState<Recipe>(
    initialRecipe || {
      id: Date.now(),
      name: '',
      steps: [],
      currentStep: 0,
    }
  );

  const [newStep, setNewStep] = useState<Partial<RecipeStep>>({
    ingredient: '',
    targetWeight: 0,
  });

  const handleAddStep = () => {
    if (newStep.ingredient && newStep.targetWeight) {
      setRecipe({
        ...recipe,
        steps: [
          ...recipe.steps,
          {
            id: Date.now(),
            ingredient: newStep.ingredient,
            targetWeight: newStep.targetWeight,
            completed: false,
          },
        ],
      });
      setNewStep({ ingredient: '', targetWeight: 0 });
    }
  };

  const handleRemoveStep = (stepId: number) => {
    setRecipe({
      ...recipe,
      steps: recipe.steps.filter(step => step.id !== stepId),
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        {initialRecipe ? 'Edit Recipe' : 'New Recipe'}
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Recipe Name</label>
          <input
            type="text"
            value={recipe.name}
            onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
          />
        </div>

        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-700 mb-2">Steps</h3>
          
          <div className="space-y-2">
            {recipe.steps.map(step => (
              <div key={step.id} className="flex items-center space-x-2">
                <input
                  type="text"
                  value={step.ingredient}
                  readOnly
                  className="flex-1 rounded-md border-gray-300 bg-gray-50"
                />
                <input
                  type="number"
                  value={step.targetWeight}
                  readOnly
                  className="w-24 rounded-md border-gray-300 bg-gray-50"
                />
                <button
                  onClick={() => handleRemoveStep(step.id)}
                  className="p-2 text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="flex items-center space-x-2 mt-4">
            <input
              type="text"
              placeholder="Ingredient"
              value={newStep.ingredient}
              onChange={(e) => setNewStep({ ...newStep, ingredient: e.target.value })}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            />
            <input
              type="number"
              placeholder="Weight (g)"
              value={newStep.targetWeight}
              onChange={(e) => setNewStep({ ...newStep, targetWeight: Number(e.target.value) })}
              className="w-24 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200"
            />
            <button
              onClick={handleAddStep}
              className="p-2 text-blue-600 hover:text-blue-700"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(recipe)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Save Recipe
          </button>
        </div>
      </div>
    </div>
  );
}