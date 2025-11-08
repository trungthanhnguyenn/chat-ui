import React from 'react';
import { FiGithub, FiLinkedin, FiMail, FiGlobe } from 'react-icons/fi';
import { FaFacebook } from 'react-icons/fa';
import trungAvatar from '../../assets/trung.jpeg';
import truongAvatar from '../../assets/truong.jpeg';

const FounderSection = () => {
  const founders = [
    {
      name: 'Thanh Trung',
      role: 'Co-Founder & CEO',
      bio: 'Passionate about AI and software engineering. With years of experience in building scalable systems, focusing on the vision and strategy of Twin-T.',
      avatar: trungAvatar,
      links: {
        github: 'https://github.com/trungthanhnguyenn',
        linkedin: 'https://www.linkedin.com/in/nguyen-huu-thanh-trung/',
        facebook: 'https://www.facebook.com/trungthanhnguyenn/',
        email: 'sktkctman2@gmail.com'
      }
    },
    {
      name: 'Nhat Truong',
      role: 'Co-Founder & CTO',
      bio: 'Expert in machine learning and backend architecture. Drives the technical innovation and development of our multi-agent AI platform.',
      avatar: truongAvatar,
      links: {
        github: 'https://github.com/ChaosAIVision',
        linkedin: 'https://www.linkedin.com/in/nhattruongnguyen20022003/',
        facebook: 'https://www.facebook.com/truyen.nguongnhat.5',
        email: 'truongnn20022003@gmail.com'
      }
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 bg-white/50 dark:bg-gray-800/50">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            Meet the Founders
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            The minds behind Twin-T
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {founders.map((founder, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl p-8 hover-lift"
            >
              {/* Avatar */}
              <div className="flex justify-center mb-6">
                <img 
                  src={founder.avatar} 
                  alt={founder.name}
                  className="w-32 h-32 rounded-full object-cover shadow-lg ring-4 ring-blue-100 dark:ring-blue-900/30"
                />
              </div>

              {/* Info */}
              <div className="text-center">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                  {founder.name}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 font-medium mb-4">
                  {founder.role}
                </p>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                  {founder.bio}
                </p>

                {/* Social Links */}
                <div className="flex gap-3 justify-center">
                  {founder.links.github && (
                    <a 
                      href={founder.links.github} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover-scale"
                      aria-label="GitHub"
                    >
                      <FiGithub className="w-5 h-5" />
                    </a>
                  )}
                  {founder.links.linkedin && (
                    <a 
                      href={founder.links.linkedin} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover-scale"
                      aria-label="LinkedIn"
                    >
                      <FiLinkedin className="w-5 h-5" />
                    </a>
                  )}
                  {founder.links.facebook && (
                    <a 
                      href={founder.links.facebook} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover-scale"
                      aria-label="Facebook"
                    >
                      <FaFacebook className="w-5 h-5" />
                    </a>
                  )}
                  {founder.links.email && (
                    <a 
                      href={`mailto:${founder.links.email}`}
                      className="p-3 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-blue-100 dark:hover:bg-blue-900/30 hover:text-blue-600 dark:hover:text-blue-400 transition-all hover-scale"
                      aria-label="Email"
                    >
                      <FiMail className="w-5 h-5" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FounderSection;
