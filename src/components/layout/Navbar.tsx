'use client';

import { useState } from 'react';
import { Menu, X, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AuthButton } from '@/components/Auth/AuthButton';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-2xl font-bold text-blue-600">
                Medi<span className="text-teal-500">Schedule</span>
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <a href="#" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Home
            </a>
            <a href="#about" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              About
            </a>
            <a href="#services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Services
            </a>
            <a href="#doctors" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Doctors
            </a>
            <a href="#contact" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors">
              Contact
            </a>
          </div>

          {/* Right side buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="flex items-center text-gray-700">
              <Phone className="h-4 w-4 mr-2 text-blue-600" />
              <span className="text-sm font-medium">Emergency: +1 234 567 8900</span>
            </div>
            <AuthButton />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <a href="#" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Home
              </a>
              <a href="#about" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                About
              </a>
              <a href="#services" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Services
              </a>
              <a href="#doctors" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Doctors
              </a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600 block px-3 py-2 text-base font-medium">
                Contact
              </a>
              <div className="flex items-center text-gray-700 px-3 py-2">
                <Phone className="h-4 w-4 mr-2 text-blue-600" />
                <span className="text-sm font-medium">Emergency: +1 234 567 8900</span>
              </div>
              <div className="px-3 py-2">
                <AuthButton />
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
