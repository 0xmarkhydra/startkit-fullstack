import React from 'react'

export const ChatWindow: React.FC = () => {
  return (
    <div className="flex flex-col h-full bg-white">
      {/* Clean Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg">🤖</span>
            </div>
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">
              AI Assistant
            </h3>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-500">Đang hoạt động</span>
            </div>
          </div>
        </div>
        
        <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors duration-200">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
          </svg>
        </button>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
        {/* Welcome Message */}
        <div className="flex justify-start">
          <div className="bg-white rounded-lg p-4 max-w-sm shadow-sm">
            <p className="text-gray-800">
              Xin chào! 👋 Tôi là AI Assistant của ShopChat. 
              Tôi có thể giúp bạn tìm sản phẩm, kiểm tra tồn kho và hỗ trợ đặt hàng.
              <br/><br/>
              Bạn cần hỗ trợ gì hôm nay?
            </p>
          </div>
        </div>

        {/* Suggested Actions */}
        <div className="flex justify-start">
          <div className="space-y-3">
            <p className="text-sm font-medium text-gray-600">Các tính năng hỗ trợ:</p>
            <div className="flex flex-wrap gap-2">
              {[
                "🔍 Tìm sản phẩm",
                "📦 Kiểm tra tồn kho", 
                "🛒 Đặt hàng",
                "📞 Liên hệ hỗ trợ"
              ].map((item, index) => (
                <button 
                  key={index}
                  className="px-3 py-2 bg-white hover:bg-blue-50 border border-gray-200 rounded-lg text-sm text-gray-700 hover:text-blue-600 transition-colors duration-200 shadow-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4 bg-white">
        <div className="flex items-center space-x-3">
          <div className="flex-1 relative">
            <input
              type="text"
              placeholder="Nhập tin nhắn..."
              className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-200 bg-gray-50 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors duration-200">
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            </button>
          </div>
          
          <button className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-sm transition-all duration-200 transform hover:-translate-y-0.5">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
        
        <div className="flex items-center justify-center mt-2">
          <span className="text-xs text-gray-500">Nhấn Enter để gửi tin nhắn</span>
        </div>
      </div>
    </div>
  )
} 