import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { Match } from './match';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface MatchGoalInBothHalvesProps {
  match: Match;
  onSelect: (betType: string, selection: string, odds: number) => void;
}

const MatchGoalInBothHalves: React.FC<MatchGoalInBothHalvesProps> = ({ match, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getButtonStyle = (isYes: boolean) => {
    // İlk yarı skorları
    const firstHalfHomeGoals = match.liveData?.halftimeScore?.home ?? 0;
    const firstHalfAwayGoals = match.liveData?.halftimeScore?.away ?? 0;
    const firstHalfTotalGoals = firstHalfHomeGoals + firstHalfAwayGoals;

    // Toplam goller
    const totalHomeGoals = match.liveData?.goals?.home ?? 0;
    const totalAwayGoals = match.liveData?.goals?.away ?? 0;
    const totalGoals = totalHomeGoals + totalAwayGoals;

    // İkinci yarı golleri
    const secondHalfTotalGoals = totalGoals - firstHalfTotalGoals;

    // Her iki yarıda da gol var mı?
    const hasGoalsInBothHalves = firstHalfTotalGoals > 0 && secondHalfTotalGoals > 0;

    // Kazanan bahis belirleme
    const isWinner = isYes ? hasGoalsInBothHalves : !hasGoalsInBothHalves;

    return {
      background: isWinner ? '#ffd700' : '#c8f7c8',
      color: '#333',
      borderRadius: '4px',
      padding: '8px 12px',
      height: '40px',
      transition: 'all 0.2s ease',
      border: 'none',
      boxShadow: 'none',
      position: 'relative',
      '&:hover': {
        background: isWinner ? '#ffed4a' : '#a5e6a5',
        transform: 'none',
      }
    };
  };

  const getDescription = (isYes: boolean) => {
    const firstHalfHomeGoals = match.liveData?.halftimeScore?.home ?? 0;
    const firstHalfAwayGoals = match.liveData?.halftimeScore?.away ?? 0;
    const firstHalfTotalGoals = firstHalfHomeGoals + firstHalfAwayGoals;

    const totalHomeGoals = match.liveData?.goals?.home ?? 0;
    const totalAwayGoals = match.liveData?.goals?.away ?? 0;
    const totalGoals = totalHomeGoals + totalAwayGoals;
    const secondHalfTotalGoals = totalGoals - firstHalfTotalGoals;

    if (isYes) {
      return `Goals will be scored in both halves (First half: ${firstHalfTotalGoals}, Second half: ${secondHalfTotalGoals})`;
    }
    return `Goals will not be scored in both halves (First half: ${firstHalfTotalGoals}, Second half: ${secondHalfTotalGoals})`;
  };

  return (
    <Box sx={{ mt: 1 }}>
      <Box 
        onClick={() => setIsExpanded(!isExpanded)}
        sx={{ 
          bgcolor: '#2e2e2e', 
          p: 1.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          borderRadius: '4px',
          mb: isExpanded ? 0 : 1,
          borderBottomLeftRadius: isExpanded ? 0 : '4px',
          borderBottomRightRadius: isExpanded ? 0 : '4px',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography sx={{ 
            color: '#fff',
            fontSize: '0.9rem',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            gap: 1
          }}>
            Goal in Both Halves
          </Typography>
          <InfoOutlinedIcon sx={{ color: '#666', fontSize: '1rem' }} />
        </Box>
        {isExpanded ? 
          <KeyboardArrowUpIcon sx={{ color: '#fff' }} /> : 
          <KeyboardArrowDownIcon sx={{ color: '#fff' }} />
        }
      </Box>

      {isExpanded && (
        <Box sx={{ 
          p: 1,
          bgcolor: '#1e1e1e',
          display: 'flex',
          gap: 1
        }}>
          <Tooltip 
            title={getDescription(true)}
            arrow
            placement="top"
          >
            <Button
              sx={{
                flex: 1,
                ...getButtonStyle(true),
              }}
              onClick={() => onSelect('goalInBothHalves', 'yes', Number(match.goalInBothHalves_Y))}
            >
              <Box sx={{ 
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: '#333',
                  textAlign: 'left',
                  flex: 1
                }}>
                  Yes
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#333',
                  ml: 1
                }}>
                  {match.goalInBothHalves_Y}
                </Typography>
              </Box>
            </Button>
          </Tooltip>

          <Tooltip 
            title={getDescription(false)}
            arrow
            placement="top"
          >
            <Button
              sx={{
                flex: 1,
                ...getButtonStyle(false),
              }}
              onClick={() => onSelect('goalInBothHalves', 'no', Number(match.goalInBothHalves_N))}
            >
              <Box sx={{ 
                width: '100%',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <Typography sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  color: '#333',
                  textAlign: 'left',
                  flex: 1
                }}>
                  No
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#333',
                  ml: 1
                }}>
                  {match.goalInBothHalves_N}
                </Typography>
              </Box>
            </Button>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default MatchGoalInBothHalves;
