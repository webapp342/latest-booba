import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { Match } from './match';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface Match1x2Props {
  match: Match;
  onSelect: (betType: string, selection: string, odds: number) => void;
}

const Match1x2: React.FC<Match1x2Props> = ({ match, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getButtonStyle = (selection: '1' | 'X' | '2') => {
    const homeGoals = match.liveData?.goals?.home ?? 0;
    const awayGoals = match.liveData?.goals?.away ?? 0;
    
    let isWinner = false;
    if (selection === '1') {
      isWinner = homeGoals > awayGoals;
    } else if (selection === 'X') {
      isWinner = homeGoals === awayGoals;
    } else {
      isWinner = awayGoals > homeGoals;
    }

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

  const getDescription = (selection: '1' | 'X' | '2') => {
    if (selection === '1') return `${match.homeTeam} will win`;
    if (selection === 'X') return 'Match will end in a draw';
    return `${match.awayTeam} will win`;
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
            1X2
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
            title={getDescription('1')}
            arrow
            placement="top"
          >
            <Button
              sx={{
                flex: 1,
                ...getButtonStyle('1'),
              }}
              onClick={() => onSelect('1x2', '1', Number(match.homeWin))}
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
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {match.homeTeam}
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#333',
                  ml: 1
                }}>
                  {match.homeWin}
                </Typography>
              </Box>
            </Button>
          </Tooltip>

          <Tooltip 
            title={getDescription('X')}
            arrow
            placement="top"
          >
            <Button
              sx={{
                flex: 1,
                ...getButtonStyle('X'),
              }}
              onClick={() => onSelect('1x2', 'X', Number(match.draw))}
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
                  Draw
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#333',
                  ml: 1
                }}>
                  {match.draw}
                </Typography>
              </Box>
            </Button>
          </Tooltip>

          <Tooltip 
            title={getDescription('2')}
            arrow
            placement="top"
          >
            <Button
              sx={{
                flex: 1,
                ...getButtonStyle('2'),
              }}
              onClick={() => onSelect('1x2', '2', Number(match.awayWin))}
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
                  flex: 1,
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {match.awayTeam}
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#333',
                  ml: 1
                }}>
                  {match.awayWin}
                </Typography>
              </Box>
            </Button>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default Match1x2;
