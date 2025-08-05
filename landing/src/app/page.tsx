import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <div className="relative flex items-center justify-center min-h-screen px-4">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Transform Your{' '}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Customer Service
            </span>{' '}
            with AI
          </h1>
          
          <p className="text-lg sm:text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            ShopChat.vn giúp cửa hàng của bạn tự động hóa customer service, 
            tăng conversion rate và cung cấp trải nghiệm mua sắm tuyệt vời 24/7.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              href="https://app.shopchat.vn"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-300 text-center"
            >
              Thử ngay miễn phí
            </Link>
            
            <Link 
              href="#demo"
              className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 rounded-lg font-semibold transition-colors duration-300 text-center"
            >
              Xem Demo
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-6 max-w-lg mx-auto">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">10K+</div>
              <div className="text-sm text-gray-600">Conversations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">&lt;2s</div>
              <div className="text-sm text-gray-600">Response Time</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900 mb-1">99.9%</div>
              <div className="text-sm text-gray-600">Uptime</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Preview */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Tại sao chọn ShopChat.vn?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Giải pháp AI toàn diện giúp cửa hàng của bạn tự động hóa customer service 
            và tăng doanh thu một cách thông minh.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-12 h-12 bg-purple-500 rounded-lg mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-xl">🧠</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Thông Minh</h3>
              <p className="text-gray-600">
                Powered by GPT-4 và Claude, hiểu ngữ cảnh tiếng Việt tự nhiên
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-12 h-12 bg-blue-500 rounded-lg mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Phản Hồi Tức Thì</h3>
              <p className="text-gray-600">
                Trả lời khách hàng trong vòng 2 giây, 24/7 không nghỉ
              </p>
            </div>

            <div className="bg-gray-50 rounded-2xl p-8">
              <div className="w-12 h-12 bg-green-500 rounded-lg mx-auto mb-6 flex items-center justify-center">
                <span className="text-white text-xl">📈</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Tăng Conversion</h3>
              <p className="text-gray-600">
                Tăng tỷ lệ chuyển đổi lên đến 35% nhờ tư vấn cá nhân hóa
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4">
          <h2 className="text-3xl font-bold text-white mb-6">
            Sẵn sàng transform cửa hàng của bạn?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Bắt đầu free trial 14 ngày, không cần thẻ tín dụng
          </p>
          <Link 
            href="https://app.shopchat.vn"
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 inline-block"
          >
            Thử ngay miễn phí
          </Link>
        </div>
      </div>
    </div>
  )
}
