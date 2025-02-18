import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Checkbox,
  FormControlLabel,
  IconButton,
  Divider
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import GavelIcon from '@mui/icons-material/Gavel';

interface UserAgreementModalProps {
  open: boolean;
  onClose: () => void;
  onAccept: () => void;
}

const UserAgreementModal: React.FC<UserAgreementModalProps> = ({
  open,
  onClose,
  onAccept
}) => {
  const [accepted, setAccepted] = React.useState(false);

  const handleAccept = () => {
    if (accepted) {
      onAccept();
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: 'linear-gradient(180deg, rgba(47, 54, 58, 0.95) 0%, rgba(47, 54, 58, 0.85) 100%)',
          border: '1px solid rgba(110, 211, 255, 0.1)',
          borderRadius: '16px',
          backdropFilter: 'blur(10px)',
        }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        pb: 1
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <GavelIcon sx={{ color: '#6ed3ff' }} />
          <Typography sx={{ 
            color: '#fff',
            fontWeight: 600,
            fontSize: '1.2rem'
          }}>
            User Agreement
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'rgba(255, 255, 255, 0.5)' }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      
      <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)' }} />

      <DialogContent>
        {/* Algorithm & Activity Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 1.5,
            color:'white',
          }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              Algorithm & Activity System
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', mb: 2 }}>
            Our platform uses an advanced algorithm that monitors and evaluates user activity:
          </Typography>
          <Box component="ul" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            pl: 2,
            '& li': { mb: 1 }
          }}>
            <li>The algorithm continuously monitors your in-app activities and social media engagement</li>
            <li>Reward access is determined based on your overall platform engagement and activity level</li>
            <li>Higher engagement and consistent activity lead to faster reward acquisition</li>
            <li>The system performs regular checks on task completion and social media activities</li>
          </Box>
        </Box>

        {/* Withdrawal & Rewards Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 1.5,
            color: '#22C55E'
          }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              Withdrawal & Rewards Policy
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', mb: 2 }}>
            Important information about withdrawals and rewards:
          </Typography>
          <Box component="ul" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            pl: 2,
            '& li': { mb: 1 }
          }}>
            <li>Withdrawal level requirements are dynamically determined by the algorithm based on your activity</li>
            <li>Required levels can range from 1 to 50, depending on your engagement and activity patterns</li>
            <li>Deposited funds can be withdrawn without level requirements</li>
            <li>Rewards are not instant - they are distributed based on your activity level and engagement</li>
            <li>The speed of reward acquisition directly correlates with your platform interaction and task completion</li>
          </Box>
        </Box>

        {/* Risk Warning Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 1.5,
            color: 'white'
          }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600 }}>
              Risk Warning
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', mb: 2 }}>
            Please be aware that investing in cryptocurrency pools involves significant risks:
          </Typography>
          <Box component="ul" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            pl: 2,
            '& li': { mb: 1 }
          }}>
            <li>Cryptocurrency investments are subject to high market volatility</li>
            <li>Past performance does not guarantee future results</li>
            <li>You should never invest more than you can afford to lose</li>
            <li>Smart contract risks and technical vulnerabilities may exist</li>
          </Box>
        </Box>

        {/* Terms Section */}
        <Box sx={{ mb: 3 }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            mb: 1.5,
            color: '#6ed3ff'
          }}>
            <Typography variant="h6" sx={{ fontSize: '1rem', fontWeight: 600, color: '#fff' }}>
              Terms & Conditions
            </Typography>
          </Box>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem', mb: 2 }}>
            By using our platform, you agree to:
          </Typography>
          <Box component="ul" sx={{ 
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '0.9rem',
            pl: 2,
            '& li': { mb: 1 }
          }}>
            <li>Comply with all applicable laws and regulations</li>
            <li>Accept full responsibility for your investment decisions</li>
            <li>Acknowledge that we are not providing financial advice</li>
            <li>Understand that rewards are distributed based on algorithm-determined activity levels</li>
            <li>Accept that withdrawal requirements may vary based on your platform engagement</li>
          </Box>
        </Box>

        <FormControlLabel
          control={
            <Checkbox 
              checked={accepted}
              onChange={(e) => setAccepted(e.target.checked)}
              sx={{
                color: 'rgba(110, 211, 255, 0.5)',
                '&.Mui-checked': {
                  color: '#6ed3ff',
                },
              }}
            />
          }
          label={
            <Typography sx={{ color: 'rgba(255, 255, 255, 0.7)', fontSize: '0.9rem' }}>
              I have read and agree to the terms and conditions, and I understand how the reward system works
            </Typography>
          }
          sx={{ mt: 2 }}
        />
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button
          onClick={onClose}
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)'
            }
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleAccept}
          disabled={!accepted}
          sx={{
            backgroundColor: accepted ? '#6ed3ff' : 'rgba(110, 211, 255, 0.1)',
            color: accepted ? '#000' : 'rgba(255, 255, 255, 0.3)',
            '&:hover': {
              backgroundColor: accepted ? '#89d9ff' : 'rgba(110, 211, 255, 0.1)',
            },
            '&:disabled': {
              backgroundColor: 'rgba(110, 211, 255, 0.1)',
            }
          }}
        >
          Accept & Continue
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default UserAgreementModal; 