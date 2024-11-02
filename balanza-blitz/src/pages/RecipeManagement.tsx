import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Edit, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { recipeStorage } from '../services/recipeStorage';
import type { Recipe } from '../types/Recipe';

function RecipeManagement() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingRecipe, setEditingRecipe] = useState<Recipe | null>(null);
  const [newRecipe, setNewRecipe] = useState<Recipe>({
    name: '',
    steps: []
  });

  useEffect(() => {
    loadRecipes();
  }, []);

  const loadRecipes = async () => {
    try {
      setLoading(true);
      setError(null);
      const loadedRecipes = await recipeStorage.getAllRecipes();
      setRecipes(loadedRecipes);
    } catch (err) {
      setError('Failed to load recipes. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const validateRecipe = (recipe: Recipe): string | null => {
    if (!recipe.name.trim()) {
      return 'Recipe name is required';
    }
    if (recipe.steps.length === 0) {
      return 'Recipe must have at least one step';
    }
    for (const step of recipe.steps) {
      if (!step.ingredient.trim()) {
        return 'Each step must have an ingredient name';
      }
      if (!step.targetWeight || step.targetWeight <= 0) {
        return 'Each step must have a valid target weight';
      }
    }
    return null;
  };

  const handleAddStep = () => {
    const recipe = editingRecipe || newRecipe;
    const updatedSteps = [
      ...recipe.steps,
      {
        ingredient: '',
        targetWeight: 0,
        order: recipe.steps.length,
      }
    ];

    if (editingRecipe) {
      setEditingRecipe({ ...editingRecipe, steps: updatedSteps });
    } else {
      setNewRecipe({ ...newRecipe, steps: updatedSteps });
    }
  };

  const handleStepChange = (index: number, field: 'ingredient' | 'targetWeight', value: string | number) => {
    const recipe = editingRecipe || newRecipe;
    const updatedSteps = recipe.steps.map((step, i) => 
      i === index ? { ...step, [field]: value } : step
    );

    if (editingRecipe) {
      setEditingRecipe({ ...editingRecipe, steps: updatedSteps });
    } else {
      setNewRecipe({ ...newRecipe, steps: updatedSteps });
    }
  };

  const handleSaveRecipe = async () => {
    try {
      const recipeToSave = editingRecipe || newRecipe;
      
      const validationError = validateRecipe(recipeToSave);
      if (validationError) {
        setError(validationError);
        return;
      }

      await recipeStorage.saveRecipe(recipeToSave);
      await loadRecipes();
      setEditingRecipe(null);
      setNewRecipe({ name: '', steps: [] });
      setError(null);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to save recipe. Please try again.');
      }
    }
  };

  const handleDeleteRecipe = async (id: number) => {
    try {
      await recipeStorage.deleteRecipe(id);
      await loadRecipes();
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Failed to delete recipe. Please try again.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Recipe Management</h1>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {editingRecipe ? 'Edit Recipe' : 'Add New Recipe'}
        </h2>
        
        <input
          type="text"
          placeholder="Recipe Name"
          className="w-full p-2 border rounded mb-4"
          value={(editingRecipe || newRecipe).name}
          onChange={(e) => {
            if (editingRecipe) {
              setEditingRecipe({ ...editingRecipe, name: e.target.value });
            } else {
              setNewRecipe({ ...newRecipe, name: e.target.value });
            }
          }}
        />

        <div className="space-y-4">
          {(editingRecipe || newRecipe).steps.map((step, index) => (
            <div key={index} className="flex gap-4">
              <input
                type="text"
                placeholder="Ingredient"
                className="flex-1 p-2 border rounded"
                value={step.ingredient}
                onChange={(e) => handleStepChange(index, 'ingredient', e.target.value)}
              />
              <input
                type="number"
                placeholder="Weight (g)"
                className="w-32 p-2 border rounded"
                value={step.targetWeight}
                onChange={(e) => handleStepChange(index, 'targetWeight', parseFloat(e.target.value) || 0)}
              />
            </div>
          ))}
        </div>

        <button
          onClick={handleAddStep}
          className="mt-4 flex items-center gap-2 text-blue-600 hover:text-blue-800"
        >
          <PlusCircle size={20} />
          Add Step
        </button>

        <div className="mt-6 flex gap-4">
          <button
            onClick={handleSaveRecipe}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {editingRecipe ? 'Update Recipe' : 'Save Recipe'}
          </button>
          {editingRecipe && (
            <button
              onClick={() => setEditingRecipe(null)}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <div key={recipe.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-semibold">{recipe.name}</h3>
              <div className="flex gap-2">
                <Link
                  to={`/weigh/${recipe.id}`}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Scale size={20} />
                </Link>
                <button
                  onClick={() => setEditingRecipe(recipe)}
                  className="text-blue-600 hover:text-blue-800"
                >
                  <Edit size={20} />
                </button>
                <button
                  onClick={() => recipe.id && handleDeleteRecipe(recipe.id)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            
            <ul className="space-y-2">
              {recipe.steps.map((step, index) => (
                <li key={index} className="flex justify-between">
                  <span>{step.ingredient}</span>
                  <span className="font-medium">{step.targetWeight}g</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecipeManagement;