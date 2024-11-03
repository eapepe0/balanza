import type { Recipe } from '../types/Recipe';

class RecipeStorage {
  private readonly API_URL = 'http://localhost:3000/api';

  async getAllRecipes(): Promise<Recipe[]> {
    try {
      const response = await fetch(`${this.API_URL}/recipes`);
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to fetch recipes');
      }
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return []; // Return empty array when server is not running
      }
      console.error('Error loading recipes:', error);
      throw error;
    }
  }

  async getRecipeById(id: number): Promise<Recipe | null> {
    try {
      const response = await fetch(`${this.API_URL}/recipes/${id}`);
      console.log(response);
      if (!response.ok) {
        if (response.status === 404) return null;
        const error = await response.text();
        throw new Error(error || 'Failed to fetch recipe');
      }
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        return null; // Return null when server is not running
      }
      console.error('Error loading recipe:', error);
      throw error;
    }
  }

  async saveRecipe(recipe: Recipe): Promise<Recipe> {
    try {
      const response = await fetch(`${this.API_URL}/recipes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(recipe),
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to save recipe');
      }
      return await response.json();
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Server is not running. Please start the server and try again.');
      }
      console.error('Error saving recipe:', error);
      throw error;
    }
  }

  async deleteRecipe(id: number): Promise<boolean> {
    try {
      const response = await fetch(`${this.API_URL}/recipes/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) {
        const error = await response.text();
        throw new Error(error || 'Failed to delete recipe');
      }
      return true;
    } catch (error) {
      if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
        throw new Error('Server is not running. Please start the server and try again.');
      }
      console.error('Error deleting recipe:', error);
      throw error;
    }
  }
}

export const recipeStorage = new RecipeStorage();