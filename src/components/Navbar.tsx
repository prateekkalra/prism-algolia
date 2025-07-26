import React from 'react';
import { RotateCcw, Download } from 'lucide-react';
import MCPStatusPanel from './MCPStatusPanel';

interface NavbarProps {
  onClearChat: () => void;
  onExportChat: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  onClearChat,
  onExportChat
}) => {
  return (
    <div className="w-full bg-slate-900/95 backdrop-blur border-b border-gray-800 px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Prism Branding */}
        <div className="flex items-center gap-3">
          <img src="/prism-logo.svg" alt="Prism" className="w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold text-white">Prism</h1>
            <p className="text-xs text-gray-400">AI-Powered Data Analysis Platform</p>
          </div>
        </div>

        {/* Right: Controls */}
        <div className="flex items-center gap-2">
          <MCPStatusPanel />
          <button
            onClick={onClearChat}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors duration-200"
            title="Clear Chat"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <button
            onClick={onExportChat}
            className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors duration-200"
            title="Export Conversation"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Navbar;