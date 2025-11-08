import React from 'react';
import { FiTarget, FiEye, FiHeart } from 'react-icons/fi';

const MissionSection = () => {
  const missions = [
    {
      icon: <FiTarget className="w-8 h-8" />,
      title: 'Our Mission',
      description: 'To democratize AI technology and make advanced conversational AI accessible to everyone, everywhere. We believe in empowering individuals and businesses with intelligent tools that enhance productivity and creativity.'
    },
    {
      icon: <FiEye className="w-8 h-8" />,
      title: 'Our Vision',
      description: 'To become the leading multi-agent AI platform that seamlessly integrates into daily workflows, providing personalized, context-aware assistance that adapts to each user\'s unique needs.'
    },
    {
      icon: <FiHeart className="w-8 h-8" />,
      title: 'Our Values',
      description: 'Innovation, transparency, and user privacy. We are committed to building ethical AI systems that respect user data, promote open-source collaboration, and continuously push the boundaries of what\'s possible.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Mission, Vision & Values
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            What drives us forward
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {missions.map((item, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg hover-lift border border-gray-200 dark:border-gray-700"
            >
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
                {item.title}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MissionSection;
