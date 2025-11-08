import React from 'react';
import logoImage from '../../assets/logo.jpeg';

const HeroSection = () => {
  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center">
          {/* Logo */}
          <div className="mb-8 inline-block">
            <img 
              src={logoImage} 
              alt="Twin-T Logo" 
              className="w-32 h-32 rounded-full object-cover shadow-2xl ring-4 ring-blue-100 dark:ring-blue-900/30 mx-auto hover-scale"
            />
          </div>
          
          {/* Title */}
          <h1 className="text-5xl sm:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 dark:from-blue-400 dark:via-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
            Welcome to Twin-T
          </h1>
          
          {/* Subtitle */}
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            A cutting-edge multi-agent AI system designed to revolutionize how you interact with artificial intelligence. 
            Built with passion, powered by innovation.
          </p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
