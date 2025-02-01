export interface SupportMessage {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
  isRead: boolean;
}

export interface SupportChat {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
  messages: SupportMessage[];
} 