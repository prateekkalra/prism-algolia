import React, { useState, useEffect } from 'react';
import { Settings, Wrench, Server, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface MCPServer {
  connected: boolean;
  tools: string[];
}

interface MCPTool {
  name: string;
  description: string;
}

interface MCPInfo {
  servers: Record<string, MCPServer>;
  tools: MCPTool[];
}

const MCPStatusPanel: React.FC = () => {
  const [mcpInfo, setMcpInfo] = useState<MCPInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const fetchMCPInfo = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/mcp/info');
      const data = await response.json();
      setMcpInfo(data);
    } catch (error) {
      console.error('Failed to fetch MCP info:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMCPInfo();
  }, []);

  const totalServers = mcpInfo ? Object.keys(mcpInfo.servers).length : 0;
  const connectedServers = mcpInfo ? Object.values(mcpInfo.servers).filter(s => s.connected).length : 0;
  const totalTools = mcpInfo ? mcpInfo.tools.length : 0;

  return (
    <div className="relative">
      {/* Status Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 bg-gray-800/50 hover:bg-gray-800/70 rounded-lg text-sm text-gray-300 hover:text-white transition-colors"
        title="MCP Server Status"
      >
        <Server className="w-4 h-4" />
        <span className="hidden sm:inline">MCP</span>
        <div className="flex items-center gap-1">
          {connectedServers > 0 ? (
            <CheckCircle className="w-3 h-3 text-green-400" />
          ) : (
            <XCircle className="w-3 h-3 text-red-400" />
          )}
          <span className="text-xs">{connectedServers}/{totalServers}</span>
        </div>
        {totalTools > 0 && (
          <div className="flex items-center gap-1">
            <Wrench className="w-3 h-3 text-blue-400" />
            <span className="text-xs">{totalTools}</span>
          </div>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                <Settings className="w-5 h-5" />
                MCP Status
              </h3>
              <button
                onClick={fetchMCPInfo}
                disabled={isLoading}
                className="p-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800 transition-colors disabled:opacity-50"
                title="Refresh"
              >
                <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {mcpInfo ? (
              <div className="space-y-4">
                {/* Servers Section */}
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-2">Servers</h4>
                  <div className="space-y-2">
                    {Object.entries(mcpInfo.servers).map(([serverId, server]) => (
                      <div key={serverId} className="flex items-center justify-between p-2 bg-gray-800/50 rounded">
                        <div className="flex items-center gap-2">
                          <Server className="w-4 h-4 text-gray-400" />
                          <span className="text-sm text-gray-200">{serverId}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {server.connected ? (
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          ) : (
                            <XCircle className="w-4 h-4 text-red-400" />
                          )}
                          <span className="text-xs text-gray-400">
                            {server.tools.length} tools
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Tools Section */}
                {mcpInfo.tools.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-gray-300 mb-2">Available Tools</h4>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {mcpInfo.tools.map((tool) => (
                        <div key={tool.name} className="p-2 bg-gray-800/50 rounded">
                          <div className="flex items-center gap-2 mb-1">
                            <Wrench className="w-3 h-3 text-blue-400" />
                            <span className="text-sm font-medium text-gray-200">{tool.name}</span>
                          </div>
                          <p className="text-xs text-gray-400 ml-5">{tool.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Summary */}
                <div className="pt-2 border-t border-gray-700">
                  <div className="flex justify-between text-xs text-gray-400">
                    <span>{connectedServers} of {totalServers} servers connected</span>
                    <span>{totalTools} tools available</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="animate-spin w-6 h-6 border-2 border-blue-400 border-t-transparent rounded-full mx-auto mb-2"></div>
                <p className="text-sm text-gray-400">Loading MCP info...</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MCPStatusPanel; 