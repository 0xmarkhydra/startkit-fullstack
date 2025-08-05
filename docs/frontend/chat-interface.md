# Chat Interface

Tài liệu chi tiết về Chat Interface trong Startkit Platform Agent Frontend.

## 🎯 Tổng quan

Chat Interface là thành phần chính của frontend, cho phép người dùng tương tác với AI Agent thông qua giao diện trò chuyện trực quan và thân thiện.

## 🏗️ Kiến trúc Component

```
Chat Interface Architecture
├── ChatWindow (Container)
│   ├── ChatHeader (Session Info)
│   ├── ChatMessages (Message List)
│   │   ├── UserMessage
│   │   ├── AIMessage
│   │   └── SystemMessage
│   ├── ChatInput (Input Area)
│   │   ├── TextInput
│   │   ├── ToolSelector
│   │   └── SendButton
│   └── ChatSidebar (Tools & Settings)
```

## 🔧 Core Components

### 1. ChatWindow Container

```typescript
interface ChatWindowProps {
  sessionId: string;
  onMessageSend: (message: string) => Promise<void>;
  onSessionChange?: (sessionId: string) => void;
  onToolToggle?: (toolName: string, enabled: boolean) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  sessionId,
  onMessageSend,
  onSessionChange,
  onToolToggle,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [availableTools, setAvailableTools] = useState<Tool[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const handleSendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      
      // Add user message
      const userMessage: ChatMessage = {
        id: generateId(),
        content,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, userMessage]);

      // Send to AI
      await onMessageSend(content);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Add error message
      const errorMessage: ChatMessage = {
        id: generateId(),
        content: 'Sorry, there was an error processing your message.',
        sender: 'system',
        timestamp: new Date(),
        type: 'error',
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="chat-window">
      <ChatHeader 
        sessionId={sessionId}
        onSessionChange={onSessionChange}
      />
      
      <div className="chat-content">
        <ChatMessages 
          messages={messages}
          isLoading={isLoading}
        />
        
        <ChatInput 
          onSend={handleSendMessage}
          disabled={isLoading}
          placeholder="Type your message..."
        />
      </div>
      
      <ChatSidebar
        availableTools={availableTools}
        selectedTools={selectedTools}
        onToolToggle={onToolToggle}
      />
    </div>
  );
};
```

### 2. ChatMessages Component

```typescript
interface ChatMessagesProps {
  messages: ChatMessage[];
  isLoading: boolean;
}

export const ChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isLoading 
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="chat-messages">
      {messages.map(message => (
        <ChatMessage key={message.id} message={message} />
      ))}
      
      {isLoading && (
        <div className="message ai-message loading">
          <div className="message-avatar">
            <div className="ai-avatar">🤖</div>
          </div>
          <div className="message-content">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        </div>
      )}
      
      <div ref={messagesEndRef} />
    </div>
  );
};
```

### 3. ChatMessage Component

```typescript
interface ChatMessageProps {
  message: ChatMessage;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.sender === 'user';
  const isAI = message.sender === 'ai';
  const isSystem = message.sender === 'system';

  return (
    <div className={`message ${isUser ? 'user-message' : 'ai-message'} ${message.type || ''}`}>
      <div className="message-avatar">
        {isUser ? (
          <div className="user-avatar">👤</div>
        ) : isAI ? (
          <div className="ai-avatar">🤖</div>
        ) : (
          <div className="system-avatar">⚙️</div>
        )}
      </div>
      
      <div className="message-content">
        <div className="message-text">
          {message.content}
        </div>
        
        {message.toolsUsed && message.toolsUsed.length > 0 && (
          <div className="message-tools">
            <span className="tools-label">Tools used:</span>
            {message.toolsUsed.map(tool => (
              <span key={tool} className="tool-tag">{tool}</span>
            ))}
          </div>
        )}
        
        <div className="message-timestamp">
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};
```

### 4. ChatInput Component

```typescript
interface ChatInputProps {
  onSend: (message: string) => Promise<void>;
  disabled?: boolean;
  placeholder?: string;
}

export const ChatInput: React.FC<ChatInputProps> = ({
  onSend,
  disabled = false,
  placeholder = "Type your message...",
}) => {
  const [message, setMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!message.trim() || disabled) return;
    
    const trimmedMessage = message.trim();
    setMessage('');
    await onSend(trimmedMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="chat-input" onSubmit={handleSubmit}>
      <div className="input-container">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="message-input"
        />
        
        <button
          type="submit"
          disabled={disabled || !message.trim()}
          className="send-button"
        >
          <SendIcon />
        </button>
      </div>
      
      <div className="input-actions">
        <button
          type="button"
          className="action-button"
          onClick={() => {/* Handle file upload */}}
          disabled={disabled}
        >
          <AttachIcon />
        </button>
        
        <button
          type="button"
          className="action-button"
          onClick={() => {/* Handle voice input */}}
          disabled={disabled}
        >
          <MicIcon />
        </button>
      </div>
    </form>
  );
};
```

### 5. ChatSidebar Component

```typescript
interface ChatSidebarProps {
  availableTools: Tool[];
  selectedTools: string[];
  onToolToggle: (toolName: string, enabled: boolean) => void;
}

export const ChatSidebar: React.FC<ChatSidebarProps> = ({
  availableTools,
  selectedTools,
  onToolToggle,
}) => {
  return (
    <div className="chat-sidebar">
      <div className="sidebar-section">
        <h3 className="section-title">Available Tools</h3>
        
        <div className="tools-list">
          {availableTools.map(tool => (
            <div key={tool.name} className="tool-item">
              <label className="tool-checkbox">
                <input
                  type="checkbox"
                  checked={selectedTools.includes(tool.name)}
                  onChange={(e) => onToolToggle(tool.name, e.target.checked)}
                />
                <span className="tool-name">{tool.name}</span>
              </label>
              
              <p className="tool-description">{tool.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="sidebar-section">
        <h3 className="section-title">Session Info</h3>
        
        <div className="session-info">
          <div className="info-item">
            <span className="label">Session ID:</span>
            <span className="value">{sessionId}</span>
          </div>
          
          <div className="info-item">
            <span className="label">Messages:</span>
            <span className="value">{messages.length}</span>
          </div>
          
          <div className="info-item">
            <span className="label">Active Tools:</span>
            <span className="value">{selectedTools.length}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
```

## 🎨 Styling

### 1. Chat Window Styling

```css
@layer components {
  .chat-window {
    @apply flex flex-col h-full bg-gray-50;
  }
  
  .chat-content {
    @apply flex-1 flex flex-col;
  }
  
  .chat-messages {
    @apply flex-1 overflow-y-auto p-4 space-y-4;
  }
  
  .message {
    @apply flex gap-3;
  }
  
  .message-avatar {
    @apply flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center;
  }
  
  .user-avatar {
    @apply bg-blue-500 text-white;
  }
  
  .ai-avatar {
    @apply bg-green-500 text-white;
  }
  
  .system-avatar {
    @apply bg-gray-500 text-white;
  }
  
  .message-content {
    @apply flex-1;
  }
  
  .message-text {
    @apply text-gray-900 leading-relaxed;
  }
  
  .message-tools {
    @apply mt-2 flex items-center gap-2;
  }
  
  .tools-label {
    @apply text-xs text-gray-500;
  }
  
  .tool-tag {
    @apply px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded;
  }
  
  .message-timestamp {
    @apply text-xs text-gray-400 mt-1;
  }
}
```

### 2. Chat Input Styling

```css
@layer components {
  .chat-input {
    @apply border-t border-gray-200 p-4 bg-white;
  }
  
  .input-container {
    @apply flex items-end gap-2;
  }
  
  .message-input {
    @apply flex-1 resize-none border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent;
  }
  
  .send-button {
    @apply px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed;
  }
  
  .input-actions {
    @apply flex gap-2 mt-2;
  }
  
  .action-button {
    @apply p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50;
  }
}
```

### 3. Sidebar Styling

```css
@layer components {
  .chat-sidebar {
    @apply w-64 bg-white border-l border-gray-200 p-4 overflow-y-auto;
  }
  
  .sidebar-section {
    @apply mb-6;
  }
  
  .section-title {
    @apply text-sm font-semibold text-gray-900 mb-3;
  }
  
  .tools-list {
    @apply space-y-2;
  }
  
  .tool-item {
    @apply p-2 rounded border border-gray-200;
  }
  
  .tool-checkbox {
    @apply flex items-center gap-2 cursor-pointer;
  }
  
  .tool-name {
    @apply text-sm font-medium text-gray-900;
  }
  
  .tool-description {
    @apply text-xs text-gray-500 mt-1;
  }
  
  .session-info {
    @apply space-y-2;
  }
  
  .info-item {
    @apply flex justify-between text-sm;
  }
  
  .label {
    @apply text-gray-500;
  }
  
  .value {
    @apply font-medium text-gray-900;
  }
}
```

## 🔄 State Management

### 1. Chat Store

```typescript
interface ChatState {
  messages: ChatMessage[];
  sessionId: string | null;
  isLoading: boolean;
  availableTools: Tool[];
  selectedTools: string[];
  error: string | null;
  
  // Actions
  addMessage: (message: ChatMessage) => void;
  setSessionId: (sessionId: string) => void;
  setLoading: (loading: boolean) => void;
  setTools: (tools: Tool[]) => void;
  toggleTool: (toolName: string) => void;
  clearMessages: () => void;
  setError: (error: string | null) => void;
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  sessionId: null,
  isLoading: false,
  availableTools: [],
  selectedTools: [],
  error: null,
  
  addMessage: (message) => {
    set(state => ({
      messages: [...state.messages, message]
    }));
  },
  
  setSessionId: (sessionId) => {
    set({ sessionId });
  },
  
  setLoading: (isLoading) => {
    set({ isLoading });
  },
  
  setTools: (tools) => {
    set({ availableTools: tools });
  },
  
  toggleTool: (toolName) => {
    set(state => {
      const isSelected = state.selectedTools.includes(toolName);
      const newSelectedTools = isSelected
        ? state.selectedTools.filter(t => t !== toolName)
        : [...state.selectedTools, toolName];
      
      return { selectedTools: newSelectedTools };
    });
  },
  
  clearMessages: () => {
    set({ messages: [] });
  },
  
  setError: (error) => {
    set({ error });
  },
}));
```

### 2. WebSocket Integration

```typescript
export const useWebSocket = (sessionId: string) => {
  const { addMessage, setLoading, setError } = useChatStore();
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const ws = new WebSocket(`ws://localhost:3000/chat?sessionId=${sessionId}`);
    
    ws.onopen = () => {
      console.log('WebSocket connected');
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      if (data.type === 'message') {
        addMessage({
          id: generateId(),
          content: data.content,
          sender: 'ai',
          timestamp: new Date(),
          toolsUsed: data.toolsUsed,
        });
        setLoading(false);
      } else if (data.type === 'error') {
        setError(data.message);
        setLoading(false);
      }
    };
    
    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('Connection error');
    };
    
    ws.onclose = () => {
      console.log('WebSocket disconnected');
    };
    
    setSocket(ws);
    
    return () => {
      ws.close();
    };
  }, [sessionId]);

  const sendMessage = async (message: string) => {
    if (socket && socket.readyState === WebSocket.OPEN) {
      setLoading(true);
      socket.send(JSON.stringify({
        type: 'message',
        content: message,
        sessionId,
      }));
    }
  };

  return { sendMessage };
};
```

## 🧪 Testing

### 1. Component Testing

```typescript
describe('ChatWindow', () => {
  const mockOnMessageSend = jest.fn();
  
  beforeEach(() => {
    mockOnMessageSend.mockClear();
  });
  
  it('should render chat interface', () => {
    render(
      <ChatWindow
        sessionId="test-session"
        onMessageSend={mockOnMessageSend}
      />
    );
    
    expect(screen.getByPlaceholderText('Type your message...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument();
  });
  
  it('should send message when form is submitted', async () => {
    render(
      <ChatWindow
        sessionId="test-session"
        onMessageSend={mockOnMessageSend}
      />
    );
    
    const input = screen.getByPlaceholderText('Type your message...');
    const sendButton = screen.getByRole('button', { name: /send/i });
    
    fireEvent.change(input, { target: { value: 'Hello AI' } });
    fireEvent.click(sendButton);
    
    expect(mockOnMessageSend).toHaveBeenCalledWith('Hello AI');
  });
});
```

### 2. Store Testing

```typescript
describe('Chat Store', () => {
  beforeEach(() => {
    useChatStore.setState({
      messages: [],
      sessionId: null,
      isLoading: false,
      availableTools: [],
      selectedTools: [],
      error: null,
    });
  });
  
  it('should add message', () => {
    const message: ChatMessage = {
      id: '1',
      content: 'Test message',
      sender: 'user',
      timestamp: new Date(),
    };
    
    useChatStore.getState().addMessage(message);
    
    expect(useChatStore.getState().messages).toHaveLength(1);
    expect(useChatStore.getState().messages[0]).toEqual(message);
  });
  
  it('should toggle tool', () => {
    const toolName = 'database-query';
    
    useChatStore.getState().toggleTool(toolName);
    expect(useChatStore.getState().selectedTools).toContain(toolName);
    
    useChatStore.getState().toggleTool(toolName);
    expect(useChatStore.getState().selectedTools).not.toContain(toolName);
  });
});
```

## 🚀 Performance Optimization

### 1. Message Virtualization

```typescript
import { FixedSizeList as List } from 'react-window';

export const VirtualizedChatMessages: React.FC<ChatMessagesProps> = ({ 
  messages, 
  isLoading 
}) => {
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => (
    <div style={style}>
      <ChatMessage message={messages[index]} />
    </div>
  );

  return (
    <div className="chat-messages">
      <List
        height={400}
        itemCount={messages.length}
        itemSize={80}
        width="100%"
      >
        {Row}
      </List>
      
      {isLoading && <LoadingIndicator />}
    </div>
  );
};
```

### 2. Message Memoization

```typescript
export const ChatMessage = React.memo<ChatMessageProps>(({ message }) => {
  // Component implementation
});
```

### 3. Debounced Input

```typescript
import { useDebouncedCallback } from 'use-debounce';

export const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled }) => {
  const [message, setMessage] = useState('');
  
  const debouncedSend = useDebouncedCallback(
    (message: string) => {
      onSend(message);
    },
    300
  );
  
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
    debouncedSend(e.target.value);
  };
  
  return (
    <textarea
      value={message}
      onChange={handleChange}
      disabled={disabled}
    />
  );
};
```

## 📱 Responsive Design

### 1. Mobile Layout

```css
@media (max-width: 768px) {
  .chat-window {
    @apply flex-col;
  }
  
  .chat-sidebar {
    @apply w-full border-l-0 border-t;
  }
  
  .message {
    @apply flex-col gap-2;
  }
  
  .message-avatar {
    @apply w-6 h-6;
  }
  
  .chat-input {
    @apply p-2;
  }
  
  .input-container {
    @apply flex-col gap-2;
  }
}
```

### 2. Tablet Layout

```css
@media (min-width: 769px) and (max-width: 1024px) {
  .chat-sidebar {
    @apply w-48;
  }
  
  .message-content {
    @apply max-w-md;
  }
}
```

---

**Chat Interface Team** - Startkit Platform Agent

*Last updated: [Current Date]* 