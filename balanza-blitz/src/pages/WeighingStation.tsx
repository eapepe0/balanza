import React, { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { ScaleDisplay } from '../components/ScaleDisplay';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const socket = io('http://localhost:3000');

export function WeighingStation() {
  const navigate = useNavigate();
  const [weight, setWeight] = useState(0);

  useEffect(() => {
    socket.on('weight', (newWeight: number) => {
      setWeight(newWeight);
    });

    return () => {
      socket.off('weight');
    };
  }, []);

  const handleTare = async () => {
    try {
      await fetch('http://localhost:3000/api/tare');
    } catch (error) {
      console.error('Failed to tare scale:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Weighing Station</h1>
        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-gray-800"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Recipes
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
        <ScaleDisplay weight={weight} targetWeight={100} />
        
        <button
          onClick={handleTare}
          className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tare Scale
        </button>
      </div>
    </div>
  );
}