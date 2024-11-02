import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Scale, BookOpen } from 'lucide-react';

export function Navigation() {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="flex items-center px-2 py-2">
              <Scale className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">Recipe Scale</span>
            </Link>
          </div>
          <div className="flex items-center">
            {!isHome && (
              <Link
                to="/"
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-50 hover:bg-blue-100"
              >
                <BookOpen className="h-5 w-5 mr-2" />
                Recipe List
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}