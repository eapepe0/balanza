import React from 'react';
import { Scale } from 'lucide-react';

interface ScaleDisplayProps {
  weight: number;
  targetWeight: number;
}

export function ScaleDisplay({ weight, targetWeight }: ScaleDisplayProps) {
  const percentage = Math.min((weight / targetWeight) * 100, 100);
  const isComplete = percentage >= 100;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
      <div className="flex items-center justify-between mb-4">
        <Scale className="w-8 h-8 text-blue-600" />
        <span className="text-3xl font-bold text-gray-800">{weight.toFixed(2)}g</span>
      </div>
      
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full bg-blue-200 text-blue-600">
              Progress
            </span>
          </div>
          <div className="text-right">
            <span className="text-xs font-semibold inline-block text-blue-600">
              {percentage.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-blue-200">
          <div
            style={{ width: `${percentage}%` }}
            className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${
              isComplete ? 'bg-green-500' : 'bg-blue-500'
            } transition-all duration-300`}
          ></div>
        </div>
      </div>
    </div>
  );
}