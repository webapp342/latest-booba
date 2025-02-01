export interface SupportMessage {
  id: string;
  senderId: string;
  receiverId: string;
  userName: string;
  message: string;
  timestamp: Date;
  isAdmin: boolean;
  isRead: boolean;
  participants: string[];
}

export interface SupportChat {
  userId: string;
  userName: string;
  lastMessage: string;
  lastMessageTimestamp: Date;
  unreadCount: number;
  messages: SupportMessage[];
} 