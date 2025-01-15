import { getFirestore, doc, updateDoc, increment } from 'firebase/firestore'; // Örneğin Firebase kullanıyorsak

const db = getFirestore();

export const updateUserBblip = async (amount: number) => {
  const userId = localStorage.getItem('telegramUserId');
  if (!userId) {
    throw new Error('User ID localStorage\'da bulunamadı.');
  }
  const userRef = doc(db, 'users', userId);
  try {
    await updateDoc(userRef, {
      bblip: increment(amount)
    });
    console.log('Bblip değeri güncellendi.');
  } catch (error) {
    console.error('Bblip güncellenirken hata oluştu:', error);
  }
}; 