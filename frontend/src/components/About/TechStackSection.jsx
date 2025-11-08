import React from 'react';
import { SiReact, SiPython, SiFastapi, SiTailwindcss, SiPostgresql, SiDocker, SiOpenai, SiSqlite } from 'react-icons/si';

const TechStackSection = () => {
  const technologies = {
    frontend: [
      { name: 'React 18+', icon: <SiReact className="w-10 h-10" />, color: 'text-blue-500' },
      { name: 'Tailwind CSS', icon: <SiTailwindcss className="w-10 h-10" />, color: 'text-cyan-500' },
      { name: 'Vite', icon: '⚡', color: 'text-yellow-500', isEmoji: true }
    ],
    backend: [
      { name: 'Python', icon: <SiPython className="w-10 h-10" />, color: 'text-blue-600' },
      { name: 'FastAPI', icon: <SiFastapi className="w-10 h-10" />, color: 'text-green-500' },
      { name: 'WebSocket', icon: '🔌', color: 'text-purple-500', isEmoji: true }
    ],
    database: [
      { name: 'PostgreSQL', icon: <SiPostgresql className="w-10 h-10" />, color: 'text-blue-700' },
      { name: 'SQLite', icon: <SiSqlite className="w-10 h-10" />, color: 'text-gray-600' }
    ],
    infrastructure: [
      { name: 'Docker', icon: <SiDocker className="w-10 h-10" />, color: 'text-blue-400' },
      { name: 'OpenAI API', icon: <SiOpenai className="w-10 h-10" />, color: 'text-green-600' }
    ]
  };

  const renderTechCard = (tech) => (
    <div 
      key={tech.name}
      className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover-lift border border-gray-200 dark:border-gray-700 text-center"
    >
      <div className={`flex justify-center mb-4 ${tech.color}`}>
        {tech.isEmoji ? (
          <span className="text-5xl">{tech.icon}</span>
        ) : (
          tech.icon
        )}
      </div>
      <h4 className="font-semibold text-gray-900 dark:text-gray-100">
        {tech.name}
      </h4>
    </div>
  );

  return (
    <section className="py-20 px-4 sm:px-6 bg-white/50 dark:bg-gray-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Technology Stack
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Built with modern, powerful technologies
          </p>
        </div>

        {/* Frontend */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Frontend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {technologies.frontend.map(renderTechCard)}
          </div>
        </div>

        {/* Backend */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Backend
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
            {technologies.backend.map(renderTechCard)}
          </div>
        </div>

        {/* Database */}
        <div className="mb-12">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Database
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            {technologies.database.map(renderTechCard)}
          </div>
        </div>

        {/* Infrastructure */}
        <div>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
            Infrastructure & APIs
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-2 gap-6">
            {technologies.infrastructure.map(renderTechCard)}
          </div>
        </div>

        {/* Features List */}
        <div className="mt-16 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-8">
          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <p className="text-gray-700 dark:text-gray-300">Real-time WebSocket streaming</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <p className="text-gray-700 dark:text-gray-300">Multi-provider support (OpenAI, Custom agents)</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <p className="text-gray-700 dark:text-gray-300">Persistent conversation history</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <p className="text-gray-700 dark:text-gray-300">Dark/Light theme support</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <p className="text-gray-700 dark:text-gray-300">Markdown & code syntax highlighting</p>
            </div>
            <div className="flex items-start gap-3">
              <span className="text-green-500 text-xl">✓</span>
              <p className="text-gray-700 dark:text-gray-300">Responsive design for all devices</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
