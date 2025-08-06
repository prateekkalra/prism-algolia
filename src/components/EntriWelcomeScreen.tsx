import React from 'react';
import { Database, TrendingUp, BarChart3, PieChart, LineChart, Zap } from 'lucide-react';

interface EntriWelcomeScreenProps {
  onExampleClick: (prompt: string) => void;
}

const EntriWelcomeScreen: React.FC<EntriWelcomeScreenProps> = ({ onExampleClick }) => {
  const entriExamples = [
    {
      id: '1',
      text: 'Analyze customer acquisition trends from our latest campaign data',
      icon: TrendingUp,
      category: 'Analytics'
    },
    {
      id: '2', 
      text: 'Compare conversion rates across different marketing channels',
      icon: BarChart3,
      category: 'Performance'
    },
    {
      id: '3',
      text: 'Identify patterns in user engagement metrics',
      icon: PieChart,
      category: 'Insights'
    },
    {
      id: '4',
      text: 'Generate a summary of key business metrics from uploaded reports',
      icon: LineChart,
      category: 'Reporting'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full text-center max-w-4xl mx-auto p-8">
      {/* Entri Branding */}
      <div className="mb-8">
        <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-4 mx-auto">
          <span className="text-white text-2xl font-bold">E</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">DataChat AI</h1>
        <p className="text-xl text-gray-300">Powered by Entri Intelligence</p>
        <p className="text-gray-400 mt-2">Transform your business data into actionable insights</p>
      </div>

      {/* Feature Highlights */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full max-w-3xl">
        {[
          {
            icon: Database,
            title: 'Smart Data Processing',
            description: 'Advanced algorithms analyze your business data'
          },
          {
            icon: Zap,
            title: 'Real-time Insights',
            description: 'Get instant answers to complex business questions'
          },
          {
            icon: TrendingUp,
            title: 'Predictive Analytics',
            description: 'Forecast trends and identify opportunities'
          }
        ].map((feature, index) => (
          <div key={index} className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/50">
            <feature.icon className="w-8 h-8 text-blue-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Example Prompts */}
      <div className="w-full max-w-2xl">
        <h2 className="text-xl font-semibold text-white mb-6">Try these business intelligence queries:</h2>
        <div className="grid gap-3">
          {entriExamples.map((example) => (
            <button
              key={example.id}
              onClick={() => onExampleClick(example.text)}
              className="flex items-center gap-4 p-4 bg-gray-800/50 hover:bg-gray-800/70 rounded-xl text-left transition-all duration-200 hover:scale-[1.02] group border border-gray-700/50 hover:border-gray-600/50"
            >
              <div className="text-blue-400 group-hover:text-blue-300 transition-colors">
                <example.icon className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <span className="text-gray-300 group-hover:text-white transition-colors">
                  {example.text}
                </span>
                <div className="text-xs text-gray-500 mt-1">{example.category}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Getting Started */}
      <div className="mt-12 p-6 bg-blue-900/20 border border-blue-500/30 rounded-xl max-w-2xl">
        <h3 className="text-lg font-semibold text-blue-300 mb-2">Getting Started</h3>
        <p className="text-gray-300 text-sm">
          Upload your business data files (CSV, Excel, PDF reports) to the left panel, 
          then ask questions about your data using natural language. Our AI will analyze 
          your data and provide insights, trends, and recommendations.
        </p>
      </div>
    </div>
  );
};

export default EntriWelcomeScreen;