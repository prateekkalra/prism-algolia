import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Brain, Search, MessageSquare, Zap, Globe, Database } from 'lucide-react';

const TechnologySection: React.FC = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  const technologies = [
    {
      name: 'Google Gemini 2.5 Pro',
      description: 'Multi-modal AI for file analysis',
      icon: Brain,
      position: { x: 150, y: 100 },
      color: 'from-blue-500 to-blue-600',
      features: ['Text Analysis', 'Image Recognition', 'Video Processing', 'Audio Transcription']
    },
    {
      name: 'Algolia Search',
      description: 'Enterprise-grade search engine',
      icon: Search,
      position: { x: 450, y: 100 },
      color: 'from-purple-500 to-purple-600',
      features: ['Sub-second Search', 'Semantic Understanding', 'Real-time Indexing', 'Advanced Analytics']
    },
    {
      name: 'Moonshot v1',
      description: 'Conversational AI with tool calling',
      icon: MessageSquare,
      position: { x: 300, y: 250 },
      color: 'from-green-500 to-green-600',
      features: ['Natural Language', 'Function Calling', 'Streaming Responses', 'Context Awareness']
    }
  ];

  const connections = [
    { from: 0, to: 2, delay: 0.5 },
    { from: 1, to: 2, delay: 0.7 },
    { from: 0, to: 1, delay: 0.9 }
  ];

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    // Animate connections
    connections.forEach(({ from, to, delay }) => {
      setTimeout(() => {
        const fromTech = technologies[from];
        const toTech = technologies[to];
        
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', fromTech.position.x.toString());
        line.setAttribute('y1', fromTech.position.y.toString());
        line.setAttribute('x2', toTech.position.x.toString());
        line.setAttribute('y2', toTech.position.y.toString());
        line.setAttribute('stroke', 'url(#connectionGradient)');
        line.setAttribute('stroke-width', '2');
        line.setAttribute('opacity', '0.6');
        line.style.strokeDasharray = '5,5';
        line.style.animation = 'dash 2s linear infinite';
        
        svg.appendChild(line);
      }, delay * 1000);
    });
  }, []);

  return (
    <section className="py-20 bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Powered by{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Cutting-Edge AI
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Prism combines the best AI technologies through Model Context Protocol (MCP) for seamless integration and optimal performance.
          </p>
        </motion.div>

        {/* Technology Architecture Diagram */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="relative mb-16"
        >
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 border border-gray-700 overflow-hidden">
            <div className="relative">
              {/* Background Grid */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#3b82f6" strokeWidth="1"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              {/* Connection Lines SVG */}
              <svg
                ref={svgRef}
                className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                style={{ minHeight: '400px' }}
              >
                <defs>
                  <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="50%" stopColor="#8b5cf6" />
                    <stop offset="100%" stopColor="#10b981" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Technology Nodes */}
              <div className="relative z-20 grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 py-8">
                {technologies.map((tech, index) => (
                  <motion.div
                    key={tech.name}
                    initial={{ opacity: 0, y: 30, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.6, delay: index * 0.2 }}
                    viewport={{ once: true }}
                    className="group relative"
                  >
                    <div className="relative bg-gray-800/80 backdrop-blur-sm border border-gray-600 rounded-2xl p-6 hover:border-gray-500 transition-all duration-300">
                      {/* Glow Effect */}
                      <div className={`absolute inset-0 bg-gradient-to-r ${tech.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`} />
                      
                      {/* Icon */}
                      <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${tech.color} rounded-xl mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        {React.createElement(tech.icon, { className: "w-8 h-8 text-white" })}
                      </div>

                      {/* Content */}
                      <h3 className="text-xl font-bold mb-2">{tech.name}</h3>
                      <p className="text-gray-400 mb-4">{tech.description}</p>

                      {/* Features */}
                      <div className="space-y-2">
                        {tech.features.map((feature, featureIndex) => (
                          <motion.div
                            key={feature}
                            initial={{ opacity: 0, x: -10 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.2 + featureIndex * 0.1 }}
                            viewport={{ once: true }}
                            className="flex items-center space-x-2"
                          >
                            <div className="w-2 h-2 bg-blue-400 rounded-full" />
                            <span className="text-sm text-gray-300">{feature}</span>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Performance Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
        >
          {[
            { icon: Zap, label: 'Search Speed', value: '<50ms', colorClasses: { bg: 'bg-yellow-500/20', border: 'border-yellow-500/30', text: 'text-yellow-400' } },
            { icon: Database, label: 'File Formats', value: '10+', colorClasses: { bg: 'bg-blue-500/20', border: 'border-blue-500/30', text: 'text-blue-400' } },
            { icon: Globe, label: 'Concurrent Users', value: '1000+', colorClasses: { bg: 'bg-green-500/20', border: 'border-green-500/30', text: 'text-green-400' } },
            { icon: Brain, label: 'AI Accuracy', value: '95%+', colorClasses: { bg: 'bg-purple-500/20', border: 'border-purple-500/30', text: 'text-purple-400' } }
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="text-center"
            >
              <div className={`inline-flex items-center justify-center w-16 h-16 ${stat.colorClasses.bg} border ${stat.colorClasses.border} rounded-xl mb-4`}>
                {React.createElement(stat.icon, { className: `w-8 h-8 ${stat.colorClasses.text}` })}
              </div>
              <div className={`text-3xl font-bold ${stat.colorClasses.text} mb-2`}>{stat.value}</div>
              <div className="text-gray-400">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes dash {
          to {
            stroke-dashoffset: -10;
          }
        }
      `}</style>
    </section>
  );
};

export default TechnologySection;