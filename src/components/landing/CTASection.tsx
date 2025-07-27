import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Shield, Zap, Globe } from 'lucide-react';

const CTASection: React.FC = () => {
  const benefits = [
    {
      icon: Sparkles,
      title: 'Start Free',
      description: 'No credit card required'
    },
    {
      icon: Zap,
      title: 'Instant Setup',
      description: 'Ready in under 2 minutes'
    },
    {
      icon: Shield,
      title: 'Secure & Private',
      description: 'Your data stays protected'
    },
    {
      icon: Globe,
      title: 'Works Everywhere',
      description: 'Access from any device'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900/20 to-purple-900/20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        {/* Animated Gradient Blobs */}
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1]
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"
          animate={{
            x: [0, -100, 0],
            y: [0, 50, 0],
            scale: [1.2, 1, 1.2]
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-6xl font-bold mb-6">
            Ready to Transform Your{' '}
            <span className="bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 bg-clip-text text-transparent">
              Knowledge?
            </span>
          </h2>
          <p className="text-xl sm:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Join thousands of professionals who've revolutionized their workflow with AI-powered knowledge management.
          </p>
        </motion.div>

        {/* Main CTA Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="relative"
        >
          <div className="bg-gradient-to-r from-gray-900/80 to-gray-800/80 backdrop-blur-xl border border-gray-700 rounded-3xl p-8 sm:p-12 shadow-2xl">
            {/* Animated Border */}
            <motion.div
              className="absolute inset-0 rounded-3xl"
              style={{
                background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #10b981, #3b82f6)',
                backgroundSize: '400% 400%'
              }}
              animate={{
                backgroundPosition: ['0% 50%', '100% 50%', '0% 50%']
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <div className="absolute inset-1 bg-gray-900 rounded-3xl" />
            </motion.div>

            <div className="relative z-10">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left Side - CTA Content */}
                <div className="text-center lg:text-left">
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    viewport={{ once: true }}
                  >
                    <h3 className="text-3xl sm:text-4xl font-bold mb-6">
                      Start Your AI Journey Today
                    </h3>
                    <p className="text-lg text-gray-300 mb-8">
                      Upload your first file and experience the magic of AI-powered knowledge management. 
                      No setup required, no credit card needed.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <Link to="/app">
                        <motion.button
                          className="group relative bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 px-8 py-4 rounded-xl font-semibold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl w-full sm:w-auto"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <span className="relative z-10 flex items-center justify-center space-x-2">
                            <span>Get Started Free</span>
                            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
                          </span>
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-500 rounded-xl opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                        </motion.button>
                      </Link>
                      
                      <motion.button
                        className="px-8 py-4 border-2 border-gray-600 hover:border-gray-400 rounded-xl font-semibold text-lg transition-all duration-300 hover:bg-gray-800/50 w-full sm:w-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Watch Demo
                      </motion.button>
                    </div>

                    {/* Trust Indicators */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      viewport={{ once: true }}
                      className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-gray-400"
                    >
                      <div className="flex items-center space-x-2">
                        <Shield className="w-4 h-4 text-green-400" />
                        <span>Enterprise Security</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Zap className="w-4 h-4 text-yellow-400" />
                        <span>Lightning Fast</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span>Used Worldwide</span>
                      </div>
                    </motion.div>
                  </motion.div>
                </div>

                {/* Right Side - Benefits */}
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                  viewport={{ once: true }}
                  className="space-y-6"
                >
                  {benefits.map((benefit, index) => (
                    <motion.div
                      key={benefit.title}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                      viewport={{ once: true }}
                      className="flex items-center space-x-4 p-4 bg-gray-800/30 rounded-xl border border-gray-700/50 hover:border-gray-600/50 transition-colors duration-300"
                    >
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 rounded-lg flex items-center justify-center">
                        <benefit.icon className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{benefit.title}</h4>
                        <p className="text-gray-400 text-sm">{benefit.description}</p>
                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Final Message */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <p className="text-lg text-gray-400">
            Join the knowledge revolution. Your files are waiting to become intelligent.
          </p>
          
          {/* Animated Pulse */}
          <motion.div
            className="mt-8 flex justify-center"
            animate={{
              scale: [1, 1.1, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <div className="w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;