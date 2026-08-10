import { apiRequest } from "./api";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "";

export interface Conversation {
  id: number;
  student_id: number;
  institution_id: number;
  student_name: string;
  institution_name: string;
  last_message_preview: string;
  last_message_at: string | null;
  unread_count: number;
  participants: Participant[];
}

export interface Participant {
  participant_type: string;
  participant_id: number;
  last_read_message_id: number | null;
  unread_count: number;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_type: string;
  sender_id: number;
  sender_name: string;
  client_message_id: string;
  content: string;
  created_at: string;
  edited_at: string | null;
  deleted_at: string | null;
  read_at: string | null;
  status: "sending" | "sent" | "delivered" | "read";
  attachments: Attachment[];
}

export interface Attachment {
  id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_key: string;
  thumbnail_key?: string;
}

export interface UploadResponse {
  upload_id: number;
  file_name: string;
  file_size: number;
  file_type: string;
  storage_key: string;
  thumbnail_key?: string;
}

export interface CreateConversationPayload {
  institution_id: number;
  content: string;
  subject?: string;
  client_message_id: string;
  attachment_ids?: number[];
}

export interface SendMessagePayload {
  content: string;
  client_message_id: string;
  attachment_ids?: number[];
}

export interface WSMessage {
  version: number;
  type: string;
  data?: any;
}

class MessageApi {
  private ws: WebSocket | null = null;
  private wsListeners: Map<string, Set<(data: any) => void>> = new Map();
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 10;
  private reconnectTimeout: NodeJS.Timeout | null = null;

  // REST API Methods

  async getConversations(limit = 20, offset = 0): Promise<Conversation[]> {
    const response = await apiRequest(`${API_BASE}/api/v1/conversations?limit=${limit}&offset=${offset}`);
    return response.conversations || [];
  }

  async getConversation(id: number): Promise<Conversation> {
    const response = await apiRequest(`${API_BASE}/api/v1/conversations/${id}`);
    return response;
  }

  async getMessages(conversationId: number, limit = 50, offset = 0): Promise<Message[]> {
    const response = await apiRequest(`${API_BASE}/api/v1/conversations/${conversationId}/messages?limit=${limit}&offset=${offset}`);
    return response.messages || [];
  }

  async createConversation(payload: CreateConversationPayload): Promise<{ conversation: Conversation; message: Message }> {
    const response = await apiRequest(`${API_BASE}/api/v1/conversations`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  }

  async sendMessage(conversationId: number, payload: SendMessagePayload): Promise<Message> {
    const response = await apiRequest(`${API_BASE}/api/v1/conversations/${conversationId}/messages`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
    return response;
  }

  async editMessage(conversationId: number, messageId: number, content: string): Promise<void> {
    await apiRequest(`${API_BASE}/api/v1/conversations/${conversationId}/messages/${messageId}`, {
      method: "PUT",
      body: JSON.stringify({ content }),
    });
  }

  async deleteMessage(conversationId: number, messageId: number): Promise<void> {
    await apiRequest(`${API_BASE}/api/v1/conversations/${conversationId}/messages/${messageId}`, {
      method: "DELETE",
    });
  }

  async markAsRead(conversationId: number, lastMessageId: number): Promise<void> {
    await apiRequest(`${API_BASE}/api/v1/conversations/${conversationId}/read`, {
      method: "POST",
      body: JSON.stringify({ last_message_id: lastMessageId }),
    });
  }

  async uploadFile(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append("file", file);

    const token = localStorage.getItem("token") || sessionStorage.getItem("token");
    const response = await fetch(`${API_BASE}/api/v1/uploads`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    return response.json();
  }

  // WebSocket Methods

  connectWebSocket(userType: string, userId: number, token: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `${API_BASE.replace("http", "ws")}/api/v1/ws?token=${token}&user_type=${userType}&user_id=${userId}`;
    this.ws = new WebSocket(wsUrl);

    this.ws.onopen = () => {
      console.log("WebSocket connected");
      this.reconnectAttempts = 0;
    };

    this.ws.onmessage = (event) => {
      try {
        const msg: WSMessage = JSON.parse(event.data);
        this.emit(msg.type, msg.data);
      } catch (e) {
        console.error("Failed to parse WS message:", e);
      }
    };

    this.ws.onclose = () => {
      console.log("WebSocket disconnected");
      this.attemptReconnect(userType, userId, token);
    };

    this.ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };
  }

  private attemptReconnect(userType: string, userId: number, token: string): void {
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      return;
    }

    const delay = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
    this.reconnectAttempts++;

    this.reconnectTimeout = setTimeout(() => {
      this.connectWebSocket(userType, userId, token);
    }, delay);
  }

  disconnectWebSocket(): void {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }
    this.ws?.close();
    this.ws = null;
  }

  sendWSMessage(msg: WSMessage): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  sendReadReceipt(conversationId: number, lastMessageId: number): void {
    this.sendWSMessage({
      version: 1,
      type: "message.read",
      data: { conversation_id: conversationId, last_message_id: lastMessageId },
    });
  }

  sendTypingStart(conversationId: number): void {
    this.sendWSMessage({
      version: 1,
      type: "typing.start",
      data: { conversation_id: conversationId },
    });
  }

  sendTypingStop(conversationId: number): void {
    this.sendWSMessage({
      version: 1,
      type: "typing.stop",
      data: { conversation_id: conversationId },
    });
  }

  // Event Emitter

  on(type: string, callback: (data: any) => void): () => void {
    if (!this.wsListeners.has(type)) {
      this.wsListeners.set(type, new Set());
    }
    this.wsListeners.get(type)!.add(callback);

    return () => {
      this.wsListeners.get(type)?.delete(callback);
    };
  }

  private emit(type: string, data: any): void {
    this.wsListeners.get(type)?.forEach((callback) => callback(data));
  }
}

export const messageApi = new MessageApi();
