import React from 'react';
import { Dialog, DialogContent, Box, Typography, IconButton, Button } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';

interface RewardDisplayProps {
  reward: {
    code: string;
    name: string;
    image: string;
    price: string;
    rarity: number;
    amount: number;
  };
  isVisible: boolean;
  onClose: () => void;
}

const RewardDisplay: React.FC<RewardDisplayProps> = ({ reward, isVisible, onClose }) => {
  const navigate = useNavigate();

  return (
    <Dialog
      open={isVisible}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(145deg, rgba(26,27,35,0.9) 0%, rgba(26,27,35,0.95) 100%)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.1)',
        }
      }}
    >
      <DialogContent>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white'
          }}
        >
          <CloseIcon />
        </IconButton>

        <Box //@ts-ignore
        sx={{ textAlign: 'center', pt: 2 }}>
          <Typography variant="h4" sx={{ color: 'white', mb: 2 }}>
            Congratulations!
          </Typography>
          
          <Typography variant="h5" sx={{ color: '#6C5DD3', mb: 3 }}>
            You won: {reward.name}
          </Typography>

          <Box
            component="img"
            src={reward.image}
            alt={reward.name}
            sx={{
              width: '200px',
              height: 'auto',
              mb: 3
            }}
          />

          <Box sx={{ mb: 2 }}>
            <Typography sx={{ color: 'white', fontSize: '1.2rem' }}>
              Price: ${reward.price}
            </Typography>
          
            <Typography sx={{ color: '#6C5DD3', mt: 1 }}>
              Item Code: {reward.code}
            </Typography>
            {reward.amount > 1 && (
              <Typography sx={{ color: '#4CAF50', mt: 1 }}>
                You now have {reward.amount} of this item!
              </Typography>
            )}
          </Box>

          <Button
            variant="contained"
                            onClick={() => navigate('/mystery-box', { state: { defaultTab: 'drops' } })}
            sx={{
              mt: 2,
              mb: 1,
              background: 'linear-gradient(90deg, #6C5DD3, #8F7BE8)',
              color: 'white',
              textTransform: 'none',
              fontSize: '1.1rem',
              padding: '10px 30px',
              borderRadius: '12px',
              '&:hover': {
                background: 'linear-gradient(90deg, #5a4ec0, #7c69d5)',
              }
            }}
          >
            Sell This Item
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default RewardDisplay; 