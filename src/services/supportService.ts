import { collection, addDoc, query, where, updateDoc, doc, onSnapshot, orderBy, getDocs, writeBatch} from 'firebase/firestore';
import { db } from '../pages/firebase';
import { SupportMessage, SupportChat } from '../types/support';
import WebApp from '@twa-dev/sdk';

const SUPPORT_COLLECTION = 'support_chats';
const ADMIN_ID = '1421109983';

export const sendSupportMessage = async (message: string, userId: string, userName: string) => {
  try {
    console.log('Sending message with:', { userId, userName, message });
    const chatRef = collection(db, SUPPORT_COLLECTION);
    
    const isAdmin = userId === ADMIN_ID;
    const newMessage: Omit<SupportMessage, 'id'> = {
      senderId: userId,
      receiverId: isAdmin ? userName : ADMIN_ID, // If admin, send to user, else send to admin
      userName,
      message,
      timestamp: new Date(),
      isAdmin,
      isRead: false,
      participants: isAdmin ? [userName, ADMIN_ID] : [userId, ADMIN_ID] // Include both sender and receiver
    };

    console.log('New message object:', newMessage);
    const docRef = await addDoc(chatRef, newMessage);
    console.log('Message sent with ID:', docRef.id);

    // If admin is sending a message, notify the user
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
  
  // Use orderBy with composite index for better performance
  const q = query(
    collection(db, SUPPORT_COLLECTION),
    where('participants', 'array-contains', userId),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    console.log('Received snapshot with size:', snapshot.size);
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      console.log('Message data:', data);
      return {
        id: doc.id,
        senderId: data.senderId || '',
        receiverId: data.receiverId || '',
        userName: data.userName || '',
        message: data.message || '',
        timestamp: data.timestamp?.toDate() || new Date(),
        isAdmin: data.isAdmin || false,
        isRead: data.isRead || false,
        participants: data.participants || []
      } as SupportMessage;
    });

    console.log('Processed messages:', messages);
    callback(messages); // No need to sort as we're using orderBy
  }, (error) => {
    console.error('Error in getUserMessages:', error);
  });
};

export const getAllChats = (callback: (chats: SupportChat[]) => void) => {
  const q = query(
    collection(db, SUPPORT_COLLECTION),
    orderBy('timestamp', 'desc')
  );

  return onSnapshot(q, (snapshot) => {
    const messages = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        senderId: data.senderId || '',
        receiverId: data.receiverId || '',
        userName: data.userName || '',
        message: data.message || '',
        timestamp: data.timestamp?.toDate() || new Date(),
        isAdmin: data.isAdmin || false,
        isRead: data.isRead || false,
        participants: data.participants || []
      } as SupportMessage;
    });

    const chatMap = new Map<string, SupportChat>();
    messages.forEach(message => {
      const userId = message.isAdmin ? message.receiverId : message.senderId;
      
      if (!chatMap.has(userId)) {
        chatMap.set(userId, {
          userId,
          userName: message.userName,
          lastMessage: message.message,
          lastMessageTimestamp: message.timestamp,
          unreadCount: message.isAdmin ? 0 : 1,
          messages: [message]
        });
      } else {
        const chat = chatMap.get(userId)!;
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

export const migrateExistingMessages = async () => {
  try {
    const q = query(collection(db, SUPPORT_COLLECTION));
    const snapshot = await getDocs(q);
    
    const batch = writeBatch(db);
    let operationCount = 0;
    
    snapshot.forEach((docSnapshot) => {
      const data = docSnapshot.data();
      if (!data.participants && data.senderId && data.receiverId) {
        batch.update(docSnapshot.ref, {
          participants: [data.senderId, data.receiverId],
          // Ensure all required fields exist
          senderId: data.senderId || '',
          receiverId: data.receiverId || '',
          userName: data.userName || '',
          message: data.message || '',
          timestamp: data.timestamp || new Date(),
          isAdmin: data.isAdmin || false,
          isRead: data.isRead || false
        });
        operationCount++;
        
        if (operationCount >= 500) {
          batch.commit();
          operationCount = 0;
        }
      }
    });
    
    if (operationCount > 0) {
      await batch.commit();
    }
    
    console.log('Migration completed successfully');
    return true;
  } catch (error) {
    console.error('Error during migration:', error);
    return false;
  }
}; 