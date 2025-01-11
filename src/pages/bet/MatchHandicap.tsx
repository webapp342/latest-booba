import React, { useState } from 'react';
import { Box, Typography, Button, Tooltip } from '@mui/material';
import { Match } from './match';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

interface MatchHandicapProps {
  match: Match;
  onSelect: (betType: string, selection: string, odds: number) => void;
}

const MatchHandicap: React.FC<MatchHandicapProps> = ({ match, onSelect }) => {
  const handicapValues = [
    { value: '-1.5', away: 'under1_5Deplas', home: 'under1_5home', label: '-1.5' },
    { value: '-1', away: 'under1Deplas', home: 'under1home', label: '-1' },
    { value: '0', away: 'draw_0Deplas', home: 'draw_0home', label: '0' },
    { value: '+1', away: 'plus_1Deplas', home: 'plus_1home', label: '+1' },
    { value: '+1.5', away: 'plus1_5Deplas', home: 'plus1_5home', label: '+1.5' }
  ];

  // Varsayılan olarak tüm seçenekleri açık olarak ayarla
  const defaultExpandedState = handicapValues.reduce((acc, item) => {
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

  const getButtonStyle = (value: string, isHome: boolean) => {
  const homeGoals = match.liveData?.goals?.home;
  const awayGoals = match.liveData?.goals?.away;

  // Veriler mevcut değilse varsayılan stil uygula
  if (homeGoals === undefined || awayGoals === undefined) {
    return {
      background: '#f0f0f0', // Varsayılan arka plan rengi
      color: '#333',         // Varsayılan yazı rengi
      borderRadius: '4px',
      padding: '8px 12px',
      height: '40px',
      transition: 'all 0.2s ease',
      border: 'none',
      boxShadow: 'none',
      position: 'relative',
      '&:hover': {
        background: '#e0e0e0',
        transform: 'none',
      }
    };
  }

  const handicapValue = parseFloat(value);
  let isWinner = false;

  if (isHome) {
    // Ev sahibi için handikap hesabı
    const homeScoreWithHandicap = homeGoals + handicapValue;
    isWinner = homeScoreWithHandicap > awayGoals;
  } else {
    // Deplasman için handikap hesabı
    const awayScoreWithHandicap = awayGoals - handicapValue;
    isWinner = awayScoreWithHandicap > homeGoals;
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


  const getDescription = (team: string, handicap: string) => {
    const value = parseFloat(handicap);
    if (value === 0) return `${team} (0) - No handicap`;
    if (value > 0) return `${team} (+${value}) - Team starts with ${value} goal advantage`;
    return `${team} (${value}) - Team starts with ${Math.abs(value)} goal disadvantage`;
  };

  return (
    <Box sx={{ mt: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
      {handicapValues.map((item) => (
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
                Handicap ({item.label})
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
                title={getDescription(match.awayTeam, item.label)}
                arrow
                placement="top"
              >
                <Button
                  fullWidth
                  sx={getButtonStyle(item.value, false)}
                  onClick={() => onSelect('handicap', `away_${item.value}`, Number(match[item.away]))}
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
                      {match.awayTeam} ({item.label})
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#333',
                      ml: 1
                    }}>
                      {match[item.away]}
                    </Typography>
                  </Box>
                </Button>
              </Tooltip>

              <Tooltip 
                title={getDescription(match.homeTeam, item.label)}
                arrow
                placement="top"
              >
                <Button
                  fullWidth
                  sx={getButtonStyle(item.value, true)}
                  onClick={() => onSelect('handicap', `home_${item.value}`, Number(match[item.home]))}
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
                      {match.homeTeam} ({item.label})
                    </Typography>
                    <Typography sx={{ 
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#333',
                      ml: 1
                    }}>
                      {match[item.home]}
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

export default MatchHandicap;
