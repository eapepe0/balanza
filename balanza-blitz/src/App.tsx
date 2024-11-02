import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import { Scale, BookOpen } from 'lucide-react';
import RecipeManagement from './pages/RecipeManagement';
import { WeighingStation } from './pages/WeighingStation';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <nav className="bg-white shadow-md">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <BookOpen className="mr-2" size={20} />
                  Recipes
                </Link>
                <Link
                  to="/weigh"
                  className="flex items-center text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium"
                >
                  <Scale className="mr-2" size={20} />
                  Weigh
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <Routes>
          <Route path="/" element={<RecipeManagement />} />
          <Route path="/weigh" element={<WeighingStation />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;