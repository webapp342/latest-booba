import { collection, setDoc, doc, onSnapshot, orderBy, query, getDoc, updateDoc, arrayUnion, serverTimestamp, Timestamp } from 'firebase/firestore';
import { db } from '../pages/firebase';
import { UserChatDocument, ChatMessage, SupportMessage, SupportChat } from '../types/support';
import WebApp from '@twa-dev/sdk';
import { v4 as uuidv4 } from 'uuid';

const SUPPORT_COLLECTION = 'user_chats';
const ADMIN_ID = '1421109983';

const convertTimestampToDate = (timestamp: Date | Timestamp): Date => {
  if (timestamp instanceof Timestamp) {
    return timestamp.toDate();
  }
  return timestamp;
};

export const sendSupportMessage = async (message: string, userId: string, userName: string) => {
  try {
    console.log('Sending message with:', { userId, userName, message });
    
    const isAdmin = userId === ADMIN_ID;
    const targetUserId = isAdmin ? 
      (userName.startsWith('User ') ? userName.split('User ')[1] : userName) : 
      userId;

    const chatDocRef = doc(db, SUPPORT_COLLECTION, targetUserId);
    const now = Timestamp.now();
    
    const newMessage: ChatMessage = {
      id: uuidv4(),
      message,
      timestamp: now,
      isAdmin,
      isRead: false
    };

    // Update or create the chat document
    await setDoc(chatDocRef, {
      userId: targetUserId,
      userName: `User ${targetUserId}`,
      lastMessage: message,
      lastMessageTimestamp: now,
      unreadCount: isAdmin ? 1 : 0,
      messages: arrayUnion(newMessage),
      updatedAt: serverTimestamp(),
      createdAt: serverTimestamp()
    }, { merge: true });

    console.log('Message sent successfully');

    if (isAdmin) {
      WebApp.showAlert(`New support message from admin: ${message}`);
    }

    return true;
  } catch (error) {
    console.error('Error sending support message:', error);
    return false;
  }
};

export const getUserMessages = (userId: string, callback: (messages: SupportMessage[]) => void) => {
  console.log('Getting messages for user:', userId);
  
  const docRef = doc(db, SUPPORT_COLLECTION, userId);
  
  return onSnapshot(docRef, (snapshot) => {
    if (!snapshot.exists()) {
      console.log('No chat document exists for user:', userId);
      callback([]);
      return;
    }

    const chatDoc = snapshot.data() as UserChatDocument;
    console.log('Chat document:', chatDoc);

    // Convert ChatMessage[] to SupportMessage[]
    const messages = chatDoc.messages.map(msg => ({
      ...msg,
      timestamp: convertTimestampToDate(msg.timestamp),
      senderId: msg.isAdmin ? ADMIN_ID : userId,
      receiverId: msg.isAdmin ? userId : ADMIN_ID,
      userName: msg.isAdmin ? 'Support Team' : chatDoc.userName
    }));

    // Sort messages by timestamp
    const sortedMessages = messages.sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );

    console.log('Processed messages:', sortedMessages);
    callback(sortedMessages);
  }, (error) => {
    console.error('Error in getUserMessages:', error);
  });
};

export const getAllChats = (callback: (chats: SupportChat[]) => void) => {
  const q = query(
    collection(db, SUPPORT_COLLECTION),
    orderBy('updatedAt', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const chats = snapshot.docs.map(doc => {
      const data = doc.data() as UserChatDocument;
      
      // Convert ChatMessage[] to SupportMessage[]
      const messages = data.messages.map(msg => ({
        ...msg,
        timestamp: convertTimestampToDate(msg.timestamp),
        senderId: msg.isAdmin ? ADMIN_ID : data.userId,
        receiverId: msg.isAdmin ? data.userId : ADMIN_ID,
        userName: msg.isAdmin ? 'Support Team' : data.userName
      }));

      return {
        userId: data.userId,
        userName: data.userName,
        lastMessage: data.lastMessage,
        lastMessageTimestamp: convertTimestampToDate(data.lastMessageTimestamp),
        unreadCount: data.unreadCount,
        messages
      } as SupportChat;
    });

    callback(chats);
  });
};

export const markMessageAsRead = async (userId: string, messageId: string) => {
  try {
    const chatDocRef = doc(db, SUPPORT_COLLECTION, userId);
    
    // Get current document
    const snapshot = await getDoc(chatDocRef);
    if (!snapshot.exists()) {
      return false;
    }

    const chatDoc = snapshot.data() as UserChatDocument;
    
    // Update the specific message
    const updatedMessages = chatDoc.messages.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    );

    // Count unread messages
    const unreadCount = updatedMessages.filter(msg => !msg.isRead && !msg.isAdmin).length;

    // Update document
    await updateDoc(chatDocRef, {
      messages: updatedMessages,
      unreadCount,
      updatedAt: serverTimestamp()
    });

    return true;
  } catch (error) {
    console.error('Error marking message as read:', error);
    return false;
  }
}; 