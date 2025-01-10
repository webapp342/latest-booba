import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { Match } from './match';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface MatchOverUnderProps {
  match: Match;
  onSelect: (betType: string, selection: string, odds: number) => void;
}

const MatchOverUnder: React.FC<MatchOverUnderProps> = ({ match, onSelect }) => {
  const overUnderValues = [
    { value: '0.5', over: 'over0_5', under: 'under0_5' },
    { value: '1.5', over: 'over1_5', under: 'under1_5' },
    { value: '2.5', over: 'over2_5', under: 'under2_5' },
    { value: '3.5', over: 'over3_5', under: 'under3_5' },
    { value: '4.5', over: 'over4_5', under: 'under4_5' }
  ];

  // Varsayılan olarak tüm seçenekleri açık olarak ayarla
  const defaultExpandedState = overUnderValues.reduce((acc, item) => {
    acc[item.value] = true;
    return acc;
  }, {} as { [key: string]: boolean });

  const [expandedSections, setExpandedSections] = useState(defaultExpandedState);

  const toggleSection = (value: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [value]: !prev[value]
    }));
  };

  const getButtonStyle = (value: string, isOver: boolean) => {
    const totalGoals = (match.liveData?.goals?.home ?? 0) + (match.liveData?.goals?.away ?? 0);
    const numValue = parseFloat(value);
    const isWinner = isOver ? totalGoals > numValue : totalGoals < numValue;

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

  const getDescription = (value: string, isOver: boolean) => {
    return `The match will have ${isOver ? 'more than' : 'less than'} ${value} goals`;
  };

  return (
    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {overUnderValues.map((item) => (
        <Box key={item.value}>
          <Box 
            onClick={() => toggleSection(item.value)}
            sx={{ 
              bgcolor: '#2e2e2e', 
              p: 1.5,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              cursor: 'pointer',
              borderRadius: '4px',
              mb: expandedSections[item.value] ? 0 : 1,
              borderBottomLeftRadius: expandedSections[item.value] ? 0 : '4px',
              borderBottomRightRadius: expandedSections[item.value] ? 0 : '4px',
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
                Over/Under (Total {item.value})
              </Typography>
              <InfoOutlinedIcon sx={{ color: '#666', fontSize: '1rem' }} />
            </Box>
            {expandedSections[item.value] ? 
              <KeyboardArrowUpIcon sx={{ color: '#fff' }} /> : 
              <KeyboardArrowDownIcon sx={{ color: '#fff' }} />
            }
          </Box>

          {expandedSections[item.value] && (
            <Box sx={{ 
              p: 1,
              bgcolor: '#1e1e1e',
              display: 'flex',
              gap: 1
            }}>
              <Tooltip 
                title={getDescription(item.value, true)}
                arrow
                placement="top"
              >
                <Button
                  fullWidth
                  sx={getButtonStyle(item.value, true)}
                  onClick={() => onSelect('overUnder', `over${item.value}`, Number(match[item.over]))}
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
                      Over {item.value}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#333',
                      ml: 1
                    }}>
                      {match[item.over]}
                    </Typography>
                  </Box>
                </Button>
              </Tooltip>

              <Tooltip 
                title={getDescription(item.value, false)}
                arrow
                placement="top"
              >
                <Button
                  fullWidth
                  sx={getButtonStyle(item.value, false)}
                  onClick={() => onSelect('overUnder', `under${item.value}`, Number(match[item.under]))}
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
                      Under {item.value}
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#333',
                      ml: 1
                    }}>
                      {match[item.under]}
                    </Typography>
                  </Box>
                </Button>
              </Tooltip>
            </Box>
          )}
        </Box>
      ))}
    </Box>
  );
};

export default MatchOverUnder;
