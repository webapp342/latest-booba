import { collection, addDoc, query, where,  updateDoc, doc, onSnapshot, orderBy} from 'firebase/firestore';
import { db } from '../pages/firebase';
import { SupportMessage, SupportChat } from '../types/support';
import WebApp from '@twa-dev/sdk';

const SUPPORT_COLLECTION = 'support_chats';
const ADMIN_ID = '1421109983';

export const sendSupportMessage = async (message: string, userId: string, userName: string) => {
  try {
    const chatRef = collection(db, SUPPORT_COLLECTION);
    const newMessage: Omit<SupportMessage, 'id'> = {
      userId,
      userName,
      message,
      timestamp: new Date(),
      isAdmin: userId === ADMIN_ID,
      isRead: false
    };

    await addDoc(chatRef, newMessage);
    
    // If message is from admin, send notification to user
    if (userId === ADMIN_ID) {
      WebApp.showAlert(`New support message from admin: ${message}`);
    }

    return true;
  } catch (error) {
    console.error('Error sending support message:', error);
    return false;
  }
};

export const getUserMessages = (userId: string, callback: (messages: SupportMessage[]) => void) => {
  const q = query(
    collection(db, SUPPORT_COLLECTION),
    where('userId', 'in', [userId, ADMIN_ID]),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    } as SupportMessage));
    callback(messages);
  });
};

export const getAllChats = (callback: (chats: SupportChat[]) => void) => {
  const q = query(
    collection(db, SUPPORT_COLLECTION),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    } as SupportMessage));

    // Group messages by userId
    const chatMap = new Map<string, SupportChat>();
    messages.forEach(message => {
      if (!chatMap.has(message.userId)) {
        chatMap.set(message.userId, {
          userId: message.userId,
          userName: message.userName,
          lastMessage: message.message,
          lastMessageTimestamp: message.timestamp,
          unreadCount: message.isAdmin ? 0 : 1,
          messages: [message]
        });
      } else {
        const chat = chatMap.get(message.userId)!;
        chat.messages.push(message);
        if (!message.isAdmin && !message.isRead) {
          chat.unreadCount++;
        }
      }
    });

    callback(Array.from(chatMap.values()));
  });
};

export const markMessageAsRead = async (messageId: string) => {
  try {
    const messageRef = doc(db, SUPPORT_COLLECTION, messageId);
    await updateDoc(messageRef, { isRead: true });
    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
}; 