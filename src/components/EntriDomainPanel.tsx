import React, { useState } from 'react';
import { TrendingUp, AlertTriangle, Target, Lightbulb, BarChart3, PieChart, LineChart } from 'lucide-react';
import { EntriInsight } from '../types/types';

interface EntriDomainPanelProps {
  insights: EntriInsight[];
  onInsightClick: (insight: EntriInsight) => void;
}

const EntriDomainPanel: React.FC<EntriDomainPanelProps> = ({ insights, onInsightClick }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'trend':
        return <TrendingUp className="w-4 h-4 text-green-400" />;
      case 'anomaly':
        return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      case 'pattern':
        return <Target className="w-4 h-4 text-blue-400" />;
      case 'recommendation':
        return <Lightbulb className="w-4 h-4 text-purple-400" />;
      default:
        return <BarChart3 className="w-4 h-4 text-gray-400" />;
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-400';
    if (confidence >= 0.6) return 'text-yellow-400';
    return 'text-red-400';
  };

  const categories = ['all', 'trends', 'anomalies', 'patterns', 'recommendations'];
  const filteredInsights = activeCategory === 'all' 
    ? insights 
    : insights.filter(insight => insight.type === activeCategory.slice(0, -1));

  return (
    <div className="bg-gray-900 border-l border-gray-800 w-80 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded flex items-center justify-center">
            <span className="text-white text-xs font-bold">E</span>
          </div>
          <h3 className="text-lg font-semibold text-white">Entri Insights</h3>
        </div>
        
        {/* Category Filter */}
        <div className="flex flex-wrap gap-1">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-2 py-1 text-xs rounded-md transition-colors ${
                activeCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Insights List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {filteredInsights.length === 0 ? (
          <div className="text-center py-8">
            <PieChart className="w-12 h-12 text-gray-600 mx-auto mb-3" />
            <p className="text-gray-400 text-sm">No insights available</p>
            <p className="text-gray-500 text-xs">Upload data to generate insights</p>
          </div>
        ) : (
          filteredInsights.map((insight) => (
            <div
              key={insight.id}
              onClick={() => onInsightClick(insight)}
              className="bg-gray-800/50 hover:bg-gray-800/70 rounded-lg p-3 cursor-pointer transition-all duration-200 border border-gray-700/50 hover:border-gray-600/50"
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {getInsightIcon(insight.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-white mb-1 line-clamp-2">
                    {insight.title}
                  </h4>
                  <p className="text-xs text-gray-400 mb-2 line-clamp-3">
                    {insight.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs bg-gray-700 px-2 py-0.5 rounded text-gray-300 capitalize">
                      {insight.type}
                    </span>
                    <span className={`text-xs font-medium ${getConfidenceColor(insight.confidence)}`}>
                      {Math.round(insight.confidence * 100)}%
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Quick Stats */}
      <div className="p-4 border-t border-gray-800">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <LineChart className="w-4 h-4 text-blue-400 mx-auto mb-1" />
            <div className="text-xs text-gray-400">Total Insights</div>
            <div className="text-sm font-semibold text-white">{insights.length}</div>
          </div>
          <div className="bg-gray-800/50 rounded-lg p-2 text-center">
            <Target className="w-4 h-4 text-green-400 mx-auto mb-1" />
            <div className="text-xs text-gray-400">High Confidence</div>
            <div className="text-sm font-semibold text-white">
              {insights.filter(i => i.confidence >= 0.8).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EntriDomainPanel;