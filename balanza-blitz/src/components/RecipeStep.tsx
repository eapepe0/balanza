import { Check, ChevronRight } from 'lucide-react';
import type { RecipeStep as RecipeStepType } from '../types/Recipe';

interface RecipeStepProps {
  step: RecipeStepType;
  isActive: boolean;
  isCompleted: boolean;
}

export function RecipeStep({ step, isActive, isCompleted }: RecipeStepProps) {
  return (
    <div
      className={`flex items-center p-4 rounded-lg mb-2 transition-all ${
        isActive
          ? 'bg-blue-50 border-2 border-blue-500'
          : isCompleted
          ? 'bg-green-50 border-2 border-green-500'
          : 'bg-gray-50 border-2 border-gray-200'
      }`}
    >
      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{step.ingredient}</h3>
        <p className="text-sm text-gray-600">{step.targetWeight}g</p>
      </div>
      
      {isCompleted ? (
        <Check className="w-6 h-6 text-green-500" />
      ) : isActive ? (
        <ChevronRight className="w-6 h-6 text-blue-500" />
      ) : null}
    </div>
  );
}