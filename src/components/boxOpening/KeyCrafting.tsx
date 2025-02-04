import React from 'react';
import { Box, Button, Typography, CircularProgress } from '@mui/material';
import { motion } from 'framer-motion';
import KeyIcon from '@mui/icons-material/Key';
import ExtensionIcon from '@mui/icons-material/Extension';

interface KeyCraftingProps {
  keyParts: number;
  onCraftKey: () => void;
  isLoading: boolean;
}

const KeyCrafting: React.FC<KeyCraftingProps> = ({ keyParts, onCraftKey, isLoading }) => {
  const canCraftKey = keyParts >= 5;
  const progress = (keyParts / 5) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Box
        sx={{
          mt: 4,
          p: 3,
          background: 'linear-gradient(145deg, rgba(26,27,35,0.9) 0%, rgba(26,27,35,0.95) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
          backdropFilter: 'blur(10px)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background Glow Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: 'radial-gradient(circle, rgba(108,93,211,0.1) 0%, rgba(108,93,211,0) 70%)',
            pointerEvents: 'none',
            opacity: canCraftKey ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Title Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1, 
            mb: 3,
            justifyContent: 'center'
          }}>
            <KeyIcon sx={{ 
              color: canCraftKey ? '#6C5DD3' : 'rgba(255,255,255,0.5)',
              fontSize: '2rem',
              transition: 'color 0.3s ease'
            }} />
            <Typography
              variant="h5"
              sx={{
                color: 'white',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Anahtar Üretimi
            </Typography>
          </Box>

          {/* Progress Section */}
          <Box sx={{ mb: 3 }}>
            {/* Progress Bar */}
            <Box sx={{ 
              width: '100%', 
              height: '8px', 
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
              mb: 2
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  height: '100%',
                  background: canCraftKey ? 
                    'linear-gradient(90deg, #6C5DD3, #8677E3)' : 
                    'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.3))',
                  borderRadius: '4px',
                }}
              />
            </Box>

            {/* Parts Counter */}
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              px: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <ExtensionIcon sx={{ 
                  color: 'rgba(255,255,255,0.7)',
                  fontSize: '1.2rem'
                }} />
                <Typography sx={{ color: 'rgba(255,255,255,0.7)' }}>
                  Parça Sayısı:
                </Typography>
              </Box>
              <Typography 
                sx={{ 
                  color: canCraftKey ? '#6C5DD3' : 'white',
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                {keyParts}/5
              </Typography>
            </Box>
          </Box>

          {/* Craft Button */}
          <motion.div
            whileHover={{ scale: canCraftKey ? 1.02 : 1 }}
            whileTap={{ scale: canCraftKey ? 0.98 : 1 }}
          >
            <Button
              variant="contained"
              onClick={onCraftKey}
              disabled={!canCraftKey || isLoading}
              fullWidth
              sx={{
                py: 1.5,
                background: canCraftKey ? 
                  'linear-gradient(90deg, #6C5DD3, #8677E3)' : 
                  'rgba(255,255,255,0.1)',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '1.1rem',
                borderRadius: '10px',
                textTransform: 'none',
                position: 'relative',
                overflow: 'hidden',
                '&:hover': {
                  background: canCraftKey ? 
                    'linear-gradient(90deg, #8677E3, #6C5DD3)' : 
                    'rgba(255,255,255,0.1)',
                },
                '&:disabled': {
                  color: 'rgba(255,255,255,0.5)',
                }
              }}
            >
              {isLoading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: 'white',
                    position: 'absolute',
                    left: '50%',
                    marginLeft: '-12px'
                  }} 
                />
              ) : (
                <>
                  {canCraftKey ? 'Anahtar Üret' : 'Yetersiz Parça'}
                </>
              )}
            </Button>
          </motion.div>
        </Box>
      </Box>
    </motion.div>
  );
};

export default KeyCrafting; 