/**
 * WebSocket service for real-time chat streaming
 */

// Auto-detect WebSocket URL:
// 1. If VITE_WS_URL is set, use it
// 2. If VITE_API_URL is set, convert http/https to ws/wss
// 3. Otherwise, use default localhost
function getWebSocketURL() {
  if (import.meta.env.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }
  
  const apiUrl = import.meta.env.VITE_API_URL;
  if (apiUrl) {
    // Convert http:// to ws:// and https:// to wss://
    return apiUrl.replace(/^http:/, 'ws:').replace(/^https:/, 'wss:') + '/ws';
  }
  
  return 'ws://localhost:8001/ws';
}

const WS_URL = getWebSocketURL();

class WebSocketService {
  constructor() {
    this.ws = null;
    this.clientId = null;
    this.messageHandlers = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000;
    this.isIntentionallyClosed = false;
  }

  /**
   * Connect to WebSocket server
   */
  connect(clientId) {
    // Prevent multiple connections
    if (this.ws && (this.ws.readyState === WebSocket.CONNECTING || this.ws.readyState === WebSocket.OPEN)) {
      console.log('WebSocket already connected or connecting');
      return;
    }

    // Close existing connection if any
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }

    this.clientId = clientId;
    this.isIntentionallyClosed = false;
    
    const url = `${WS_URL}/${clientId}`;
    console.log('Connecting to WebSocket:', url);
    
    this.ws = new WebSocket(url);
    
    this.ws.onopen = () => {
      console.log('WebSocket connected');
      this.reconnectAttempts = 0;
      this.triggerHandler('open', { connected: true });
    };
    
    this.ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);
        console.log('WebSocket message:', message.type);
        this.handleMessage(message);
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    };
    
    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      this.triggerHandler('error', { error });
    };
    
    this.ws.onclose = () => {
      console.log('WebSocket disconnected');
      this.triggerHandler('close', { connected: false });
      
      // Attempt to reconnect if not intentionally closed
      if (!this.isIntentionallyClosed && this.reconnectAttempts < this.maxReconnectAttempts) {
        this.reconnectAttempts++;
        console.log(`Reconnecting... Attempt ${this.reconnectAttempts}`);
        setTimeout(() => {
          this.connect(this.clientId);
        }, this.reconnectDelay * this.reconnectAttempts);
      }
    };
  }

  /**
   * Disconnect from WebSocket
   */
  disconnect() {
    this.isIntentionallyClosed = true;
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  /**
   * Check if WebSocket is connected
   */
  isConnected() {
    return this.ws && this.ws.readyState === WebSocket.OPEN;
  }

  /**
   * Send message to server
   */
  send(message) {
    if (!this.isConnected()) {
      console.error('WebSocket is not connected');
      return false;
    }
    
    try {
      this.ws.send(JSON.stringify(message));
      return true;
    } catch (error) {
      console.error('Error sending WebSocket message:', error);
      return false;
    }
  }

  /**
   * Send chat message
   */
  sendChatMessage(message, userId, sessionId, model = null, providerId = null) {
    return this.send({
      type: 'chat',
      data: {
        message,
        user_id: userId,
        session_id: sessionId,
        model: model,
        provider_id: providerId,  // NEW: support provider selection
      },
    });
  }

  /**
   * Request history
   */
  requestHistory(userId, sessionId, limit = 50) {
    return this.send({
      type: 'history',
      data: {
        user_id: userId,
        session_id: sessionId,
        limit,
      },
    });
  }

  /**
   * Send ping
   */
  ping() {
    return this.send({
      type: 'ping',
      data: {},
    });
  }

  /**
   * Handle incoming message
   */
  handleMessage(message) {
    const { type, data } = message;
    this.triggerHandler(type, data);
  }

  /**
   * Register message handler
   */
  on(type, handler) {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, []);
    }
    this.messageHandlers.get(type).push(handler);
  }

  /**
   * Unregister message handler
   */
  off(type, handler) {
    if (this.messageHandlers.has(type)) {
      const handlers = this.messageHandlers.get(type);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Trigger registered handlers
   */
  triggerHandler(type, data) {
    if (this.messageHandlers.has(type)) {
      this.messageHandlers.get(type).forEach(handler => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error in ${type} handler:`, error);
        }
      });
    }
  }

  /**
   * Clear all handlers
   */
  clearHandlers() {
    this.messageHandlers.clear();
  }
}

// Export singleton instance
const websocketService = new WebSocketService();
export default websocketService;
