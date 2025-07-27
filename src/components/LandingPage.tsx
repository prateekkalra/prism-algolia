import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import HeroSection from './landing/HeroSection';
import FeaturesSection from './landing/FeaturesSection';
import TechnologySection from './landing/TechnologySection';
import UseCasesSection from './landing/UseCasesSection';
import CTASection from './landing/CTASection';

const LandingPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-900 text-white overflow-x-hidden"
    >
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
              <span className="text-xl font-bold">Prism</span>
            </div>
            <Link
              to="/app"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-6 py-2 rounded-lg font-medium transition-all duration-200 transform hover:scale-105"
            >
              Launch App
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>
        <HeroSection />
        <FeaturesSection />
        <TechnologySection />
        <UseCasesSection />
        <CTASection />
      </main>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400">
            © 2024 Prism. Transform your files into intelligent knowledge.
          </p>
        </div>
      </footer>
    </motion.div>
  );
};

export default LandingPage;