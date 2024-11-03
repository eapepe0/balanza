export interface RecipeStep {
    id?: number;
    ingredient: string;
    targetWeight: number;
    order: number;
    completed?: boolean;
  }
  
  export interface Recipe {
    id?: number;
    name: string;
    steps: RecipeStep[];
    created_at?: string;
    currentStep?: number;
  }