import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Briefcase, 
  PenTool, 
  Scale, 
  Users, 
  BookOpen,
  FileText,
  Search,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

const UseCasesSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);

  const useCases = [
    {
      icon: GraduationCap,
      title: 'Students & Academics',
      description: 'Organize research, analyze papers, and build knowledge bases',
      colorClasses: {
        bg: 'from-blue-500 to-blue-600',
        border: 'border-blue-500/50',
        text: 'text-blue-400',
        bgLight: 'bg-blue-500/20',
        borderLight: 'border-blue-500/30',
        dot: 'bg-blue-400'
      },
      features: [
        'Research paper analysis',
        'Note organization',
        'Citation management',
        'Study material search'
      ],
      workflow: [
        { icon: FileText, step: 'Upload research papers and notes' },
        { icon: Search, step: 'Search across all your materials' },
        { icon: MessageSquare, step: 'Ask questions about your research' }
      ]
    },
    {
      icon: Briefcase,
      title: 'Knowledge Workers',
      description: 'Transform business documents into searchable insights',
      colorClasses: {
        bg: 'from-purple-500 to-purple-600',
        border: 'border-purple-500/50',
        text: 'text-purple-400',
        bgLight: 'bg-purple-500/20',
        borderLight: 'border-purple-500/30',
        dot: 'bg-purple-400'
      },
      features: [
        'Document analysis',
        'Report generation',
        'Data extraction',
        'Team collaboration'
      ],
      workflow: [
        { icon: FileText, step: 'Upload business documents' },
        { icon: Search, step: 'Find insights across projects' },
        { icon: MessageSquare, step: 'Generate reports and summaries' }
      ]
    },
    {
      icon: PenTool,
      title: 'Content Creators',
      description: 'Manage and discover content across all your creative work',
      colorClasses: {
        bg: 'from-green-500 to-green-600',
        border: 'border-green-500/50',
        text: 'text-green-400',
        bgLight: 'bg-green-500/20',
        borderLight: 'border-green-500/30',
        dot: 'bg-green-400'
      },
      features: [
        'Content library management',
        'Inspiration discovery',
        'Version tracking',
        'Idea organization'
      ],
      workflow: [
        { icon: FileText, step: 'Store all creative assets' },
        { icon: Search, step: 'Discover related content' },
        { icon: MessageSquare, step: 'Get creative suggestions' }
      ]
    },
    {
      icon: Scale,
      title: 'Legal Professionals',
      description: 'Organize case files and extract legal insights efficiently',
      colorClasses: {
        bg: 'from-red-500 to-red-600',
        border: 'border-red-500/50',
        text: 'text-red-400',
        bgLight: 'bg-red-500/20',
        borderLight: 'border-red-500/30',
        dot: 'bg-red-400'
      },
      features: [
        'Case file analysis',
        'Legal document search',
        'Precedent discovery',
        'Contract review'
      ],
      workflow: [
        { icon: FileText, step: 'Upload legal documents' },
        { icon: Search, step: 'Find relevant precedents' },
        { icon: MessageSquare, step: 'Ask about legal implications' }
      ]
    }
  ];

  return (
    <section className="py-20 bg-gray-800/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl sm:text-5xl font-bold mb-6">
            Perfect for{' '}
            <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              Every Professional
            </span>
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Whether you're a student, professional, or creator, Prism adapts to your workflow and enhances your productivity.
          </p>
        </motion.div>

        {/* Tab Navigation */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {useCases.map((useCase, index) => (
            <motion.button
              key={useCase.title}
              onClick={() => setActiveTab(index)}
              className={`flex items-center space-x-3 px-6 py-3 rounded-xl border transition-all duration-300 ${
                activeTab === index
                  ? `${useCase.colorClasses.bgLight} ${useCase.colorClasses.border} ${useCase.colorClasses.text}`
                  : 'bg-gray-800/50 border-gray-600 text-gray-300 hover:border-gray-500'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {React.createElement(useCase.icon, { className: "w-5 h-5" })}
              <span className="font-medium">{useCase.title}</span>
            </motion.button>
          ))}
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
          >
            {/* Left Side - Content */}
            <div>
              <div className="flex items-center space-x-4 mb-6">
                <div className={`w-16 h-16 bg-gradient-to-r ${useCases[activeTab].colorClasses.bg} rounded-xl flex items-center justify-center`}>
                  {React.createElement(useCases[activeTab].icon, { className: "w-8 h-8 text-white" })}
                </div>
                <div>
                  <h3 className="text-3xl font-bold">{useCases[activeTab].title}</h3>
                  <p className="text-gray-400">{useCases[activeTab].description}</p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {useCases[activeTab].features.map((feature, index) => (
                  <motion.div
                    key={feature}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center space-x-3"
                  >
                    <div className={`w-2 h-2 ${useCases[activeTab].colorClasses.dot} rounded-full`} />
                    <span className="text-gray-300">{feature}</span>
                  </motion.div>
                ))}
              </div>

              {/* Workflow Steps */}
              <div className="space-y-4">
                <h4 className="text-xl font-semibold mb-4">How It Works</h4>
                {useCases[activeTab].workflow.map((step, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                    className="flex items-center space-x-4 p-4 bg-gray-800/50 rounded-xl"
                  >
                    <div className={`w-10 h-10 ${useCases[activeTab].colorClasses.bgLight} border ${useCases[activeTab].colorClasses.borderLight} rounded-lg flex items-center justify-center`}>
                      {React.createElement(step.icon, { className: `w-5 h-5 ${useCases[activeTab].colorClasses.text}` })}
                    </div>
                    <span className="text-gray-300">{step.step}</span>
                    {index < useCases[activeTab].workflow.length - 1 && (
                      <ArrowRight className="w-4 h-4 text-gray-500 ml-auto" />
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Right Side - Visual Demo */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 border border-gray-700 shadow-2xl">
                {/* Mock Interface */}
                <div className="space-y-4">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full" />
                      <div className="w-3 h-3 bg-yellow-500 rounded-full" />
                      <div className="w-3 h-3 bg-green-500 rounded-full" />
                    </div>
                    <span className="text-sm text-gray-400">Prism Interface</span>
                  </div>

                  {/* File Upload Area */}
                  <div className={`border-2 border-dashed ${useCases[activeTab].colorClasses.borderLight} rounded-xl p-6 text-center ${useCases[activeTab].colorClasses.bgLight} opacity-50`}>
                    <FileText className={`w-8 h-8 ${useCases[activeTab].colorClasses.text} mx-auto mb-2`} />
                    <p className="text-sm text-gray-400">Drag files here or click to upload</p>
                  </div>

                  {/* Sample Files */}
                  <div className="space-y-2">
                    {['Research Paper.pdf', 'Meeting Notes.docx', 'Data Analysis.xlsx'].map((fileName, index) => (
                      <motion.div
                        key={fileName}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                        className="flex items-center space-x-3 p-3 bg-gray-800/50 rounded-lg"
                      >
                        <div className={`w-8 h-8 ${useCases[activeTab].colorClasses.bgLight} rounded flex items-center justify-center`}>
                          <FileText className={`w-4 h-4 ${useCases[activeTab].colorClasses.text}`} />
                        </div>
                        <span className="text-sm text-gray-300">{fileName}</span>
                        <div className="ml-auto">
                          <div className={`w-2 h-2 ${useCases[activeTab].colorClasses.dot} rounded-full`} />
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Chat Interface */}
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <MessageSquare className={`w-4 h-4 ${useCases[activeTab].colorClasses.text}`} />
                      <span className="text-sm font-medium">Ask anything about your files</span>
                    </div>
                    <div className="bg-gray-700/50 rounded p-2 text-sm text-gray-300">
                      "What are the key findings in my research papers?"
                    </div>
                  </div>
                </div>

                {/* Animated Dots */}
                <motion.div
                  className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.7, 1, 0.7]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        </AnimatePresence>

        {/* Success Stories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <h3 className="text-2xl font-bold mb-8">Trusted by Professionals Worldwide</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { metric: '10,000+', label: 'Files Analyzed Daily' },
              { metric: '95%', label: 'Time Saved on Research' },
              { metric: '50ms', label: 'Average Search Speed' }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="p-6 bg-gray-800/50 rounded-xl border border-gray-700"
              >
                <div className="text-3xl font-bold text-blue-400 mb-2">{stat.metric}</div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default UseCasesSection;