import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { Match } from './match';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface MatchFirstGoalProps {
  match: Match;
  onSelect: (betType: string, selection: string, odds: number) => void;
}

const MatchFirstGoal: React.FC<MatchFirstGoalProps> = ({ match, onSelect }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  const getButtonStyle = (selection: '1' | '0' | '2') => {
    const firstGoalScorer = match.firstGoalScorer;
    let isWinner = false;
    
    if (selection === '1') {
      isWinner = firstGoalScorer === match.homeTeam;
    } else if (selection === '0') {
      isWinner = firstGoalScorer === 'None';
    } else {
      isWinner = firstGoalScorer === match.awayTeam;
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

  const getDescription = (selection: '1' | '0' | '2') => {
    if (selection === '1') return `${match.homeTeam} will score first`;
    if (selection === '0') return 'No goals will be scored';
    return `${match.awayTeam} will score first`;
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
            First Team to Score
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
              onClick={() => onSelect('firstGoal', '1', Number(match.firstGoalscorer1))}
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
                  {match.firstGoalscorer1}
                </Typography>
              </Box>
            </Button>
          </Tooltip>

          <Tooltip 
            title={getDescription('0')}
            arrow
            placement="top"
          >
            <Button
              sx={{
                flex: 1,
                ...getButtonStyle('0'),
              }}
              onClick={() => onSelect('firstGoal', '0', Number(match.firstGoalscorer0))}
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
                  No Goal
                </Typography>
                <Typography sx={{ 
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  color: '#333',
                  ml: 1
                }}>
                  {match.firstGoalscorer0}
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
              onClick={() => onSelect('firstGoal', '2', Number(match.firstGoalscorer2))}
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
                  {match.firstGoalscorer2}
                </Typography>
              </Box>
            </Button>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default MatchFirstGoal;
