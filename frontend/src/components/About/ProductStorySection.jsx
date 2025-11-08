import React from 'react';
import { FiZap, FiUsers, FiTrendingUp, FiAward } from 'react-icons/fi';

const ProductStorySection = () => {
  const timeline = [
    {
      year: '2024',
      title: 'The Beginning',
      description: 'Started with a vision to democratize AI technology and make it accessible to everyone.',
      icon: <FiZap className="w-6 h-6" />
    },
    {
      year: '2024 Q2',
      title: 'First Prototype',
      description: 'Built the first working prototype with multi-agent capabilities and real-time streaming.',
      icon: <FiUsers className="w-6 h-6" />
    },
    {
      year: '2024 Q4',
      title: 'Product Launch',
      description: 'Launched Twin-T to the public with full features and professional UI.',
      icon: <FiTrendingUp className="w-6 h-6" />
    },
    {
      year: 'Future',
      title: 'Growing & Scaling',
      description: 'Expanding features, improving AI models, and building a community of users.',
      icon: <FiAward className="w-6 h-6" />
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Our Product Story
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Twin-T was born from a simple idea: AI should be powerful, accessible, and user-friendly. 
            Here's our journey from concept to reality.
          </p>
        </div>

        {/* The Vision */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8 mb-12">
          <div className="max-w-3xl mx-auto text-center">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
              💡 The Vision
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              We envisioned a platform where users could interact with multiple AI agents seamlessly, 
              each specialized in different tasks, all working together to provide the best possible assistance.
            </p>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              No complex setup, no technical barriers—just pure, intelligent conversation that adapts to your needs.
            </p>
          </div>
        </div>

        {/* Timeline */}
        <div className="space-y-8">
          {timeline.map((item, index) => (
            <div 
              key={index}
              className="flex gap-6 items-start group"
            >
              {/* Icon */}
              <div className="flex-shrink-0">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform">
                  {item.icon}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-sm font-bold text-blue-600 dark:text-blue-400 px-3 py-1 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                    {item.year}
                  </span>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100">
                    {item.title}
                  </h3>
                </div>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* What Makes Us Different */}
        <div className="mt-16">
          <h3 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8 text-center">
            What Makes Twin-T Different?
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: '🎯',
                title: 'Multi-Agent Intelligence',
                description: 'Multiple specialized AI agents working together seamlessly'
              },
              {
                icon: '⚡',
                title: 'Real-Time Streaming',
                description: 'Instant responses with WebSocket technology'
              },
              {
                icon: '🎨',
                title: 'Beautiful UX',
                description: 'Modern, intuitive interface that feels natural'
              },
              {
                icon: '🔒',
                title: 'Privacy First',
                description: 'Your conversations are secure and private'
              },
              {
                icon: '🔄',
                title: 'Continuous Learning',
                description: 'Always improving based on user feedback'
              },
              {
                icon: '🌐',
                title: 'Open & Flexible',
                description: 'Support for multiple AI providers and models'
              }
            ].map((feature, index) => (
              <div 
                key={index}
                className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift border border-gray-200 dark:border-gray-700 text-center"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {feature.title}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">
              Join Us on This Journey
            </h3>
            <p className="text-lg opacity-90 mb-6 max-w-2xl mx-auto">
              We're just getting started. Help us build the future of AI interaction.
            </p>
            <div className="flex gap-4 justify-center">
              <a 
                href="/"
                className="px-8 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-all hover-scale"
              >
                Try Twin-T Now
              </a>
              <a 
                href="mailto:contact@twin-t.com"
                className="px-8 py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition-all hover-scale"
              >
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductStorySection;
