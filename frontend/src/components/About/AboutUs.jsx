import React from 'react';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiGithub, FiLinkedin, FiMail, FiGlobe } from 'react-icons/fi';
import HeroSection from './HeroSection';
import ProductStorySection from './ProductStorySection';
import FounderSection from './FounderSection';
import MissionSection from './MissionSection';
import TechStackSection from './TechStackSection';
import ThemeToggle from '../Common/ThemeToggle';

const AboutUs = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      {/* Navigation Header */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <Link 
              to="/" 
              className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <FiArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back to Chat</span>
            </Link>
            <ThemeToggle />
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="fade-in">
        <HeroSection />
        <ProductStorySection />
        <FounderSection />
        <MissionSection />
        <TechStackSection />
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              © 2025 Twin-T. All rights reserved.
            </p>
            <div className="flex justify-center gap-6">
              <a 
                href="https://github.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="GitHub"
              >
                <FiGithub className="w-6 h-6" />
              </a>
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="w-6 h-6" />
              </a>
              <a 
                href="mailto:contact@twin-t.com"
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                aria-label="Email"
              >
                <FiMail className="w-6 h-6" />
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;
