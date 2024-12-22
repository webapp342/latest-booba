import React, { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Tasks from '../assets/tasks.png'; // PNG dosyasını import edin

const DealsComponent: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState(4);

  const categories = [
    { id: 1, name: 'Category 1', tasks: [0, 1] },
    { id: 2, name: 'Category 2', tasks: [2, 3] },
    { id: 3, name: 'Category 3', tasks: [4] },
    { id: 4, name: 'Category 4', tasks: [5] },
  ];

  const boxes = [
    { title: 'Task 1', description: 'Complete task 1 and get rewards.' },
    { title: 'Task 2', description: 'Complete task 2 and get rewards.' },
    { title: 'Task 3', description: 'Complete task 3 and get rewards.' },
    { title: 'Task 4', description: 'Complete task 4 and get rewards.' },
    { title: 'Task 5', description: 'Complete task 5 and get rewards.' },
    { title: 'Task 6', description: 'Complete task 6 and get rewards.' },
  ];

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 2,
        maxWidth: '100%',
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
      <Typography
        variant="h5"
        sx={{
          marginTop: 4,
          color: 'black',
          fontWeight: 'bold',
        }}
      >
        Tasks
      </Typography>
      {/* Açıklama */}
      <Typography
        variant="body1"
        sx={{
          marginTop: 1,
          color: 'text.secondary',
        }}
      >
        Get rewards for completing tasks.
      </Typography>

      {/* Kategori Seçici */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          marginTop: 4,
          padding: 1,
          width: '100%',
          whiteSpace: 'nowrap', // Butonların yan yana hizalanmasını sağlar
          scrollbarWidth: 'none', // Kaydırma çubuğunu gizle
          '-ms-overflow-style': 'none', // Internet Explorer için kaydırma çubuğunu gizle
          '&::-webkit-scrollbar': {
            display: 'none', // Webkit tabanlı tarayıcılarda kaydırma çubuğunu gizle
          },
        }}
      >
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? 'contained' : 'outlined'}
            onClick={() => setSelectedCategory(category.id)}
            sx={{
              margin: '0 8px',
              whiteSpace: 'nowrap',
              flexShrink: 0, // Butonların sıkışmasını engeller
            }}
          >
            {category.name}
          </Button>
        ))}
      </Box>

      {/* Görevler */}
      <Box
        sx={{
          width: '100%',
          marginTop: 4,
        }}
      >
        {categories
          .find((category) => category.id === selectedCategory)?.tasks.map((taskIndex) => (
            <Box
              key={taskIndex}
              sx={{
                width: '95%',
                backgroundColor: 'white',
                boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                borderRadius: 2,
                padding: 2,
                margin: '8px auto',
                textAlign: 'left',
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 'bold',
                  color: 'black',
                }}
              >
                {boxes[taskIndex].title}
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  marginTop: 1,
                  color: 'text.secondary',
                }}
              >
                {boxes[taskIndex].description}
              </Typography>
            </Box>
          ))}
      </Box>
    </Box>
  );
};

export default DealsComponent;
