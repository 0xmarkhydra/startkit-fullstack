# Quick Start Guide - Chat Widget Integration

Hướng dẫn nhanh để tích hợp Chat Widget Q&A vào website của bạn.

## 🚀 Bước 1: Setup cơ bản

### 1.1 Thêm script tag
```html
<!-- Thêm vào <head> hoặc trước </body> -->
<script src="https://your-domain.com/widget.js"></script>
```

### 1.2 Khởi tạo widget
```html
<script>
  // Khởi tạo widget với cấu hình cơ bản
  TokenChatWidget.init({
    tokenSlug: 'xpl', // Token slug từ URL
    apiUrl: 'https://your-api-domain.com',
    theme: 'light' // hoặc 'dark'
  });
</script>
```

## 🎨 Bước 2: Tùy chỉnh giao diện

### 2.1 CSS Variables
```css
/* Tùy chỉnh màu sắc và style */
.token-chat-widget {
  --primary-color: #3b82f6;
  --background-color: #ffffff;
  --text-color: #1f2937;
  --border-color: #e5e7eb;
  --border-radius: 12px;
  --font-family: 'Inter', sans-serif;
}
```

### 2.2 Custom Styling
```css
/* Tùy chỉnh vị trí và kích thước */
.token-chat-widget {
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 350px;
  height: 500px;
  z-index: 9999;
}

/* Responsive design */
@media (max-width: 768px) {
  .token-chat-widget {
    width: 100%;
    height: 100vh;
    bottom: 0;
    right: 0;
  }
}
```

## ⚙️ Bước 3: Cấu hình nâng cao

### 3.1 Auto-detect token từ URL
```javascript
// Tự động detect token từ URL pattern
TokenChatWidget.init({
  autoDetect: true,
  urlPattern: /\/token\/([^\/]+)/, // Regex để extract token
  apiUrl: 'https://your-api-domain.com'
});
```

### 3.2 Event callbacks
```javascript
TokenChatWidget.init({
  tokenSlug: 'xpl',
  apiUrl: 'https://your-api-domain.com',
  sessionId: 'user_123_session', // Optional: custom session ID
  onMessage: (message) => {
    console.log('New message:', message);
    // Track analytics, etc.
  },
  onOpen: () => {
    console.log('Widget opened');
  },
  onClose: () => {
    console.log('Widget closed');
  },
  onHistoryLoaded: (messages) => {
    console.log('Chat history loaded:', messages.length, 'messages');
  }
});
```

### 3.3 Multi-language support
```javascript
TokenChatWidget.init({
  tokenSlug: 'xpl',
  apiUrl: 'https://your-api-domain.com',
  language: 'vi', // 'vi' hoặc 'en'
  translations: {
    'placeholder': 'Nhập câu hỏi của bạn...',
    'send': 'Gửi',
    'typing': 'Đang trả lời...'
  }
});
```

## 🔧 Bước 4: API Integration

### 4.1 Direct API calls
```javascript
// Gọi API trực tiếp không qua widget
const response = await fetch('https://your-api-domain.com/api/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer your-token' // Nếu cần
  },
  body: JSON.stringify({
    tokenSlug: 'xpl',
    question: 'What is Plasma token?',
    language: 'en',
    sessionId: 'user_123_session' // Để duy trì chat history
  })
});

const data = await response.json();
console.log('Answer:', data.answer);
console.log('Sources:', data.sources);
console.log('Session ID:', data.sessionId);
```

### 4.1.1 Chat History API
```javascript
// Lấy chat history
const historyResponse = await fetch('https://your-api-domain.com/api/chat-history/user_123_session?tokenSlug=xpl');
const history = await historyResponse.json();
console.log('Chat history:', history.messages);

// Xóa chat history
await fetch('https://your-api-domain.com/api/chat-history/user_123_session?tokenSlug=xpl', {
  method: 'DELETE'
});

// Lấy thống kê session
const statsResponse = await fetch('https://your-api-domain.com/api/chat-history/user_123_session/stats');
const stats = await statsResponse.json();
console.log('Session stats:', stats);
```

### 4.2 Streaming API connection
```javascript
// Real-time chat qua Streaming API
async function streamChat(question, tokenSlug) {
  const response = await fetch('https://your-api-domain.com/api/chat/stream', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      tokenSlug,
      question,
      language: 'en'
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value);
    const lines = chunk.split('\n');

    for (const line of lines) {
      if (line.startsWith('data: ')) {
        const data = JSON.parse(line.slice(6));
        
        switch (data.type) {
          case 'content':
            // Hiển thị nội dung streaming
            console.log('Content:', data.data);
            break;
          case 'citations':
            // Hiển thị citations
            console.log('Citations:', data.data);
            break;
          case 'done':
            console.log('Stream completed');
            break;
          case 'error':
            console.error('Error:', data.message);
            break;
        }
      }
    }
  }
}

// Sử dụng
streamChat('What is the tokenomics?', 'xpl');
```

## 📱 Bước 5: Mobile Optimization

### 5.1 Responsive configuration
```javascript
TokenChatWidget.init({
  tokenSlug: 'xpl',
  apiUrl: 'https://your-api-domain.com',
  responsive: {
    mobile: {
      position: 'bottom-full',
      width: '100%',
      height: '100vh'
    },
    tablet: {
      position: 'bottom-right',
      width: '400px',
      height: '600px'
    },
    desktop: {
      position: 'bottom-right',
      width: '350px',
      height: '500px'
    }
  }
});
```

### 5.2 Touch gestures
```javascript
// Hỗ trợ swipe để mở/đóng widget
TokenChatWidget.init({
  tokenSlug: 'xpl',
  apiUrl: 'https://your-api-domain.com',
  gestures: {
    swipeUp: 'open',
    swipeDown: 'close',
    doubleTap: 'toggle'
  }
});
```

## 🎯 Bước 6: Analytics & Tracking

### 6.1 Google Analytics
```javascript
TokenChatWidget.init({
  tokenSlug: 'xpl',
  apiUrl: 'https://your-api-domain.com',
  analytics: {
    provider: 'google',
    trackingId: 'GA-XXXXXXXXX',
    events: {
      messageSent: 'chat_message_sent',
      widgetOpened: 'chat_widget_opened',
      sourceClicked: 'chat_source_clicked'
    }
  }
});
```

### 6.2 Custom tracking
```javascript
TokenChatWidget.init({
  tokenSlug: 'xpl',
  apiUrl: 'https://your-api-domain.com',
  onMessage: (message) => {
    // Track với custom analytics
    analytics.track('Chat Message', {
      tokenSlug: 'xpl',
      messageLength: message.content.length,
      hasSources: message.sources.length > 0
    });
  }
});
```

## 🔒 Bước 7: Security & Privacy

### 7.1 Content Security Policy
```html
<!-- Thêm vào <head> -->
<meta http-equiv="Content-Security-Policy" 
      content="script-src 'self' https://your-api-domain.com; 
               connect-src 'self' https://your-api-domain.com wss://your-api-domain.com;">
```

### 7.2 Data privacy
```javascript
TokenChatWidget.init({
  tokenSlug: 'xpl',
  apiUrl: 'https://your-api-domain.com',
  privacy: {
    storeMessages: false, // Không lưu tin nhắn
    trackUser: false,     // Không track user
    anonymizeIP: true     // Ẩn danh IP
  }
});
```

## 🚨 Troubleshooting

### Common Issues

#### Widget không hiển thị
```javascript
// Kiểm tra console errors
console.log('Widget status:', TokenChatWidget.getStatus());

// Force reload widget
TokenChatWidget.destroy();
TokenChatWidget.init({...});
```

#### API connection failed
```javascript
// Kiểm tra network
fetch('https://your-api-domain.com/health')
  .then(response => console.log('API Status:', response.status))
  .catch(error => console.error('API Error:', error));
```

#### Token detection không hoạt động
```javascript
// Manual set token
TokenChatWidget.setToken('xpl');

// Check current token
console.log('Current token:', TokenChatWidget.getToken());
```

## 📞 Support

Nếu bạn gặp vấn đề, vui lòng:
1. Kiểm tra [Troubleshooting Guide](./troubleshooting.md)
2. Xem [API Documentation](./widget-api.md)
3. Liên hệ support team

---

**Integration Team** - Agent PRTGE

*Last updated: [Current Date]*
