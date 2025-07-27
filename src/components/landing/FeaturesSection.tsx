import React from 'react';
import { motion } from 'framer-motion';
import { 
  Upload, 
  Search, 
  MessageCircle, 
  FileText, 
  Image, 
  Video, 
  Music, 
  Database,
  Zap,
  Brain,
  Globe,
  Shield
} from 'lucide-react';

const FeaturesSection: React.FC = () => {
  const features = [
    {
      icon: Upload,
      title: 'Universal File Support',
      description: 'Upload any file format - PDFs, images, videos, audio, documents, and more. Prism understands them all.',
      gradient: 'from-blue-500 to-cyan-500',
      supportedFormats: [FileText, Image, Video, Music]
    },
    {
      icon: Brain,
      title: 'AI-Powered Analysis',
      description: 'Advanced AI extracts meaning, context, and insights from your content using Google Gemini 2.5 Pro.',
      gradient: 'from-purple-500 to-pink-500',
      supportedFormats: [Brain, Database, Zap, Globe]
    },
    {
      icon: Search,
      title: 'Intelligent Search',
      description: 'Find information instantly with semantic search powered by Algolia. No more searching for exact keywords.',
      gradient: 'from-green-500 to-teal-500',
      supportedFormats: [Search, MessageCircle, Shield, Database]
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  return (
    <section className="py-20 bg-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Powerful Features for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Modern Knowledge Work
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Transform your static files into a dynamic, searchable knowledge base with cutting-edge AI technology.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              variants={itemVariants}
              className="group relative"
            >
              <div className="relative h-full bg-gray-900/60 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 hover:border-gray-600 transition-all duration-300 overflow-hidden">
                {/* Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
                
                {/* Icon */}
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-xl mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors duration-300">
                  {feature.title}
                </h3>
                <p className="text-gray-300 mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Supported Formats/Technologies */}
                <div className="flex space-x-3">
                  {feature.supportedFormats.map((Icon, iconIndex) => (
                    <motion.div
                      key={iconIndex}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      transition={{ 
                        duration: 0.3, 
                        delay: index * 0.2 + iconIndex * 0.1 
                      }}
                      viewport={{ once: true }}
                      className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center border border-gray-600 group-hover:border-gray-500 transition-colors duration-300"
                    >
                      <Icon className="w-5 h-5 text-gray-400 group-hover:text-gray-300 transition-colors duration-300" />
                    </motion.div>
                  ))}
                </div>

                {/* Hover Effect */}
                <motion.div
                  className="absolute inset-0 border-2 border-transparent rounded-2xl"
                  whileHover={{
                    borderColor: `rgba(59, 130, 246, 0.3)`,
                    transition: { duration: 0.3 }
                  }}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Feature Demo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <div className="bg-gradient-to-r from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold mb-4">See It In Action</h3>
              <p className="text-gray-300">
                Upload a file, watch AI analyze it, then chat with your content
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  step: '1',
                  title: 'Upload',
                  description: 'Drag & drop any file',
                  icon: Upload,
                  colorClasses: { bg: 'bg-blue-500', text: 'text-blue-400' }
                },
                {
                  step: '2',
                  title: 'Analyze',
                  description: 'AI extracts insights',
                  icon: Brain,
                  colorClasses: { bg: 'bg-purple-500', text: 'text-purple-400' }
                },
                {
                  step: '3',
                  title: 'Chat',
                  description: 'Ask questions about your content',
                  icon: MessageCircle,
                  colorClasses: { bg: 'bg-green-500', text: 'text-green-400' }
                }
              ].map((step, index) => (
                <motion.div
                  key={step.step}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl"
                >
                  <div className={`w-12 h-12 ${step.colorClasses.bg} rounded-full flex items-center justify-center font-bold text-white`}>
                    {step.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{step.title}</h4>
                    <p className="text-gray-400">{step.description}</p>
                  </div>
                  {React.createElement(step.icon, { className: `w-6 h-6 ${step.colorClasses.text} ml-auto` })}
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;