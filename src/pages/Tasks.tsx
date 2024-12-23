import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, CircularProgress, Badge } from '@mui/material';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore'; // Firestore metodları
import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig'; // Firebase yapılandırma
import Tasks from '../assets/tasks.png'; // PNG dosyasını import edin

// Firebase App başlat
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Her görev için logo ve link
const boxes = [
  { title: 'Follow Booba on X', description: '+100 BBLIP', logo: '', link: 'https://telegram.com' },
  { title: 'Task 2', description: '+100 BBLIP', logo: '', link: 'https://facebook.com' },
  { title: 'Task 3', description: '+100 BBLIP', logo: '', link: 'https://x.com' },
  { title: 'Task 4', description: '+100 BBLIP', logo: '', link: 'https://example.com/task-4' },
  { title: 'Task 5', description: '+100 BBLIP', logo: '', link: 'https://example.com/task-5' },
  { title: 'Task 6', description: '+100 BBLIP', logo: '', link: 'https://example.com/task-6' },
  { title: '', description: 'Coming Soon ...', logo: '', link: '' },
];

// Kategoriler
const categories = [
  { id: 1, name: 'New', tasks: [0, 1] },
  { id: 2, name: 'Socials', tasks: [2, 3] },
  { id: 3, name: 'Frens', tasks: [4] },
  { id: 4, name: 'Academy', tasks: [5] },
  { id: 5, name: 'On Chain', tasks: [6] },
  { id: 6, name: 'Farming', tasks: [6] },
];

const DealsComponent: React.FC = () => {
  const [taskStatus, setTaskStatus] = useState<any>([]); // Kullanıcı görev durumu
  const [loading, setLoading] = useState(true); // Yükleniyor durumu
  const [error, setError] = useState<string | null>(null); // Hata mesajı için state
  const [selectedCategory, setSelectedCategory] = useState<number>(1); // Seçili kategori

  useEffect(() => {
    const fetchUserTasks = async () => {
      console.log('Fetching user tasks...');
      setLoading(true);
      setError(null); // Hata durumunu sıfırla

      try {
        const telegramUserId = localStorage.getItem('telegramUserId');
        console.log('Telegram User ID:', telegramUserId);

        if (!telegramUserId) {
          setError('Kullanıcı ID’si bulunamadı. Lütfen tekrar giriş yapın.');
          console.log('Kullanıcı ID bulunamadı.');
          setTaskStatus([]);
          setLoading(false);
          return;
        }

        const userDocRef = doc(db, 'users', telegramUserId);
        console.log('Fetching user data from Firestore:', userDocRef.path);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log('User data retrieved:', userData);

          if (userData.tasks) {
            setTaskStatus(userData.tasks);
            console.log('User tasks:', userData.tasks);
          } else {
            setTaskStatus([]);
            console.log('No tasks found for user.');
          }
        } else {
          setError('Kullanıcı belgesi bulunamadı.');
          console.log('User document not found.');
          setTaskStatus([]);
        }
      } catch (err) {
        setError('Bir hata oluştu. Lütfen tekrar deneyin.');
        console.error('Error fetching user tasks:', err);
        setTaskStatus([]);
      } finally {
        setLoading(false);
        console.log('Loading complete, UI updated.');
      }
    };

    fetchUserTasks();
  }, []);

  const handleTaskCompletion = async (taskIndex: number) => {
    console.log(`Task ${taskIndex} clicked for completion.`);

    const telegramUserId = localStorage.getItem('telegramUserId');
    console.log('Telegram User ID for task completion:', telegramUserId);

    if (!telegramUserId) {
      console.log('No user ID found, aborting task completion.');
      return;
    }

    console.log(`Updating task ${taskIndex} to completed...`);

    setTaskStatus((prevStatus: any) => {
      const updatedTasks = [...prevStatus];
      updatedTasks[taskIndex].completed = true;
      updatedTasks[taskIndex].disabled = true;
      return updatedTasks;
    });

    const userDocRef = doc(db, 'users', telegramUserId);
    console.log('Updating task status in Firestore...');
    await updateDoc(userDocRef, {
      [`tasks.${taskIndex}.completed`]: true,
      [`tasks.${taskIndex}.disabled`]: true,
    });

    setTimeout(() => {
      setTaskStatus((prevStatus: any) => {
        const updatedTasks = [...prevStatus];
        updatedTasks[taskIndex].disabled = true;
        return updatedTasks;
      });
    }, 15000);

    window.location.href = boxes[taskIndex].link!;
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
        margin: '0 auto',
      }}
    >
      {/* PNG Görseli */}
      <Box
        component="img"
        src={Tasks}
        alt="Deal Icon"
        sx={{
          mt: 4,
          width: '80px',
          maxWidth: '50%',
        }}
      />
      {/* Başlık */}
      <Typography variant="h5" sx={{ marginTop: 4, color: 'black', fontWeight: 'bold' }}>
        Tasks
      </Typography>

      {/* Açıklama */}
      <Typography variant="body1" sx={{ marginTop: 1, color: 'text.secondary' }}>
        Get rewards for completing tasks.
      </Typography>

      {/* Kategori Seçici */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          marginTop: 4,
          padding: 2,
          ml: -3,
          width: '100%',
          whiteSpace: 'nowrap',
          scrollbarWidth: 'none',
          '-ms-overflow-style': 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        }}
      >
        {categories.map((category) => (
          <Badge
            key={category.id}
            color="success"
            badgeContent=" "
            invisible={![1, 2, 3].includes(category.id)}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            sx={{
              margin: '0 15px',
              '& .MuiBadge-badge': {
                height: '12px',
                minWidth: '12px',
                borderRadius: '6px',
              },
            }}
          >
            <Typography
              onClick={() => setSelectedCategory(category.id)}
              sx={{
                fontSize: '1.1rem',
                cursor: 'pointer',
                color: selectedCategory === category.id ? 'black' : 'gray',
                fontWeight: selectedCategory === category.id ? 'bold' : 'normal',
                textDecoration: 'none',
              }}
            >
              {category.name}
            </Typography>
          </Badge>
        ))}
      </Box>

      {/* Görevler */}
      <Box sx={{ width: '100%', mt: 4 }}>
        {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : (
          categories
            .find((category) => category.id === selectedCategory)
            ?.tasks.map((taskIndex: number) => (
              <Box
                key={taskIndex}
                sx={{
                  backgroundColor: 'white',
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  borderRadius: 2,
                  padding: 2,
                  margin: '8px auto',
                  textAlign: 'left',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="body1" sx={{ fontWeight: 'bold', color: 'black' }}>
                    {boxes[taskIndex].title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {boxes[taskIndex].description}
                  </Typography>
                </Box>
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => handleTaskCompletion(taskIndex)}
                  disabled={taskStatus[taskIndex]?.disabled || taskStatus[taskIndex]?.completed}
                  sx={{
                    textTransform: 'none',
                    backgroundColor: 'transparent',
                    boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.2)',
                    borderRadius: 2,
                  }}
                >
                  {taskStatus[taskIndex]?.completed ? 'Done' : 'Start'}
                </Button>
              </Box>
            ))
        )}
      </Box>
    </Box>
  );
};

export default DealsComponent;
