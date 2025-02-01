import { Timestamp } from 'firebase/firestore';

export interface ChatMessage {
  id: string;
  message: string;
  timestamp: Date | Timestamp;
  isAdmin: boolean;
  isRead: boolean;
}

export interface UserChatDocument {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTimestamp: Date | Timestamp;
  unreadCount: number;
  messages: ChatMessage[];
  updatedAt: Date | Timestamp;
  createdAt: Date | Timestamp;
}

// Types for component props and state management
export interface SupportMessage extends ChatMessage {
  senderId: string;
  receiverId: string;
  userName: string;
}

export interface SupportChat {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
  messages: SupportMessage[];
} 