import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { Match } from './match';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface MatchOddEvenProps {
  match: Match;
  onSelect: (betType: string, selection: string, odds: number) => void;
}

const MatchOddEven: React.FC<MatchOddEvenProps> = ({ match, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getButtonStyle = (isOdd: boolean) => {
    const totalGoals = (match.liveData?.goals?.home ?? 0) + (match.liveData?.goals?.away ?? 0);
    const isWinner = isOdd ? totalGoals % 2 !== 0 : totalGoals % 2 === 0;

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

  const getDescription = (isOdd: boolean) => {
    return `Total goals will be ${isOdd ? 'odd' : 'even'}`;
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
            Total Goals Odd/Even
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
              onClick={() => onSelect('oddEven', 'odd', Number(match.tekevet))}
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
                  Odd
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#333',
                  ml: 1
                }}>
                  {match.tekevet}
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
              onClick={() => onSelect('oddEven', 'even', Number(match.ciftevet))}
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
                  Even
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#333',
                  ml: 1
                }}>
                  {match.ciftevet}
                </Typography>
              </Box>
            </Button>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default MatchOddEven;
