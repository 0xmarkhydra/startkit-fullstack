import React, { useState } from 'react';
import { ChatWidget } from '../components/chat/ChatWidget';
import { FloatingChatWidget } from '../components/chat/FloatingChatWidget';

export const WidgetDemoPage: React.FC = () => {
  const [selectedToken, setSelectedToken] = useState('xpl');
  const [selectedLayout, setSelectedLayout] = useState<'full' | 'floating'>('full');

  const tokens = [
    { slug: 'xpl', name: 'Plasma (XPL)', description: 'High-throughput Bitcoin execution environment' },
    { slug: 'btc', name: 'Bitcoin (BTC)', description: 'The original cryptocurrency' },
    { slug: 'eth', name: 'Ethereum (ETH)', description: 'Smart contract platform' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-bold text-gray-900">Chat Widget Demo</h1>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-500">Backend Connected</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <a 
                href="http://localhost:3000/docs" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:text-blue-800 underline"
              >
                View API Docs
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Widget Controls</h2>
              
              {/* Token Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Token
                </label>
                <div className="space-y-2">
                  {tokens.map((token) => (
                    <button
                      key={token.slug}
                      onClick={() => setSelectedToken(token.slug)}
                      className={`w-full text-left p-3 rounded-lg border transition-colors ${
                        selectedToken === token.slug
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="font-medium text-gray-900">{token.name}</div>
                      <div className="text-sm text-gray-500">{token.description}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Layout Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Layout Type
                </label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedLayout('full')}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedLayout === 'full'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">Full Widget</div>
                    <div className="text-sm text-gray-500">Embedded in page</div>
                  </button>
                  <button
                    onClick={() => setSelectedLayout('floating')}
                    className={`w-full text-left p-3 rounded-lg border transition-colors ${
                      selectedLayout === 'floating'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-medium text-gray-900">Floating Widget</div>
                    <div className="text-sm text-gray-500">Overlay button</div>
                  </button>
                </div>
              </div>

              {/* Integration Code */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Integration Code
                </label>
                <div className="bg-gray-50 rounded-lg p-3">
                  <code className="text-xs text-gray-700">
                    {`<div id="chat-widget" 
  data-token="${selectedToken}" 
  data-user-id="auto">
</div>`}
                  </code>
                </div>
              </div>

              {/* Features */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Features</h3>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>✅ Real-time AI responses</li>
                  <li>✅ PretgeMarket API integration</li>
                  <li>✅ Chat history persistence</li>
                  <li>✅ Context-aware conversations</li>
                  <li>✅ Mobile responsive</li>
                  <li>✅ Customizable themes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Chat Widget */}
          <div className="lg:col-span-2">
            {selectedLayout === 'full' ? (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 h-[600px]">
                <ChatWidget 
                  tokenSlug={selectedToken}
                  className="h-full"
                />
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 h-[600px] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Floating Widget Active</h3>
                  <p className="text-gray-500 mb-4">
                    The floating chat widget is now active. Look for the blue chat button in the bottom-right corner.
                  </p>
                  <p className="text-sm text-gray-400">
                    Token: {selectedToken.toUpperCase()}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating Widget */}
      {selectedLayout === 'floating' && (
        <FloatingChatWidget tokenSlug={selectedToken} />
      )}
    </div>
  );
};
