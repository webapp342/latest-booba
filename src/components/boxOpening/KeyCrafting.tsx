import React from 'react';
import { Box, Button, Typography, CircularProgress, IconButton } from '@mui/material';
import { motion } from 'framer-motion';
import KeyIcon from '@mui/icons-material/Key';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface KeyCraftingProps {
  keyParts: number;
  onCraftKey: () => void;
  isLoading: boolean;
  onOpenFreeBox?: () => void;
}

// Renk paleti
const commonStyles = {
  primaryColor: '#6ed3ff',
  primaryGradient: 'linear-gradient(90deg, #6ed3ff, #8ee9ff)',
  bgGradient: 'linear-gradient(135deg, rgba(110, 211, 255, 0.3) 0%, rgba(110, 211, 255, 0.1) 100%)',
  borderColor: 'rgba(110, 211, 255, 0.2)',
  hoverBorderColor: 'rgba(110, 211, 255, 0.4)',
  buttonShadow: '0 4px 12px rgba(110, 211, 255, 0.3)',
  buttonHoverShadow: '0 6px 16px rgba(110, 211, 255, 0.4)',
};

const KeyCrafting: React.FC<KeyCraftingProps> = ({ keyParts, onCraftKey, isLoading, onOpenFreeBox }) => {
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
          background: commonStyles.bgGradient,
          borderRadius: '15px',
          border: `1px solid ${commonStyles.borderColor}`,
          position: 'relative',
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          '&:hover': {
            border: `1px solid ${commonStyles.hoverBorderColor}`,
            boxShadow: commonStyles.buttonHoverShadow,
          }
        }}
      >
        {/* Background Animation Effect */}
        <Box
          sx={{
            position: 'absolute',
            top: '-50%',
            left: '-50%',
            width: '200%',
            height: '200%',
            background: `radial-gradient(circle, ${commonStyles.primaryColor}15 0%, ${commonStyles.primaryColor}00 70%)`,
            pointerEvents: 'none',
            opacity: canCraftKey ? 1 : 0,
            transition: 'opacity 0.3s ease',
          }}
        />

        <Box sx={{ position: 'relative', zIndex: 1 }}>
          {/* Header Section */}
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 3
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <Box sx={{ 
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: commonStyles.primaryGradient,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: commonStyles.buttonShadow
              }}>
                <KeyIcon sx={{ 
                  color: 'white',
                  fontSize: '1.8rem'
                }} />
              </Box>
              <Box>
                <Typography
                  variant="h6"
                  sx={{
                    color: 'white',
                    fontWeight: 'bold',
                    lineHeight: 1.2
                  }}
                >
                  Key Crafting
                </Typography>
                <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                  Collect 5 parts to craft a key
                </Typography>
              </Box>
            </Box>
            <IconButton 
              sx={{ 
                color: 'rgba(255,255,255,0.7)',
                '&:hover': { color: commonStyles.primaryColor }
              }}
            >
              <InfoOutlinedIcon />
            </IconButton>
          </Box>

          {/* Progress Section */}
          <Box sx={{ mb: 3 }}>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              alignItems: 'center',
              mb: 1
            }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                Progress
              </Typography>
              <Typography sx={{ 
                color: canCraftKey ? commonStyles.primaryColor : 'rgba(255,255,255,0.7)',
                fontWeight: 'bold',
                fontSize: '0.9rem'
              }}>
                {keyParts}/5 parts
              </Typography>
            </Box>
            
            {/* Progress Bar */}
            <Box sx={{ 
              width: '100%', 
              height: '8px', 
              background: 'rgba(255,255,255,0.1)',
              borderRadius: '4px',
              overflow: 'hidden',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                style={{
                  height: '100%',
                  background: canCraftKey ? 
                    commonStyles.primaryGradient : 
                    'linear-gradient(90deg, rgba(255,255,255,0.2), rgba(255,255,255,0.3))',
                  borderRadius: '4px',
                }}
              />
            </Box>
          </Box>

          {/* Action Buttons */}
          <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
            <Button
              variant="contained"
              onClick={onCraftKey}
              disabled={!canCraftKey || isLoading}
              fullWidth
              sx={{
                py: 1.5,
                background: canCraftKey ? commonStyles.primaryGradient : 'rgba(255,255,255,0.1)',
                color: canCraftKey ? 'black' : 'rgba(255,255,255,0.5)',
                fontWeight: 'bold',
                fontSize: '0.95rem',
                borderRadius: '8px',
                textTransform: 'none',
                position: 'relative',
                boxShadow: canCraftKey ? commonStyles.buttonShadow : 'none',
                '&:hover': {
                  background: canCraftKey ? 
                    'linear-gradient(90deg, #8ee9ff, #6ed3ff)' : 
                    'rgba(255,255,255,0.1)',
                  boxShadow: canCraftKey ? commonStyles.buttonHoverShadow : 'none'
                },
                '&:disabled': {
                  background: 'rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.3)',
                }
              }}
            >
              {isLoading ? (
                <CircularProgress 
                  size={24} 
                  sx={{ 
                    color: canCraftKey ? 'black' : 'rgba(255,255,255,0.5)',
                  }} 
                />
              ) : (
                <>
                  {canCraftKey ? 'Craft Key' : 'Insufficient Parts'}
                </>
              )}
            </Button>

            {/* Open Free Box Button - Only show when can't craft key */}
            {!canCraftKey && (
              <Button
                variant="contained"
                onClick={onOpenFreeBox}
                fullWidth
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(90deg, #0088CC, #00A3FF)',
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: '0.95rem',
                  borderRadius: '8px',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(90deg, #00A3FF, #0088CC)',
                  }
                }}
              >
                Open Free Box
              </Button>
            )}
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
};

export default KeyCrafting; 