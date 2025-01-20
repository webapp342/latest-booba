import React from 'react';
import { Box } from '@mui/material';

const LevelIndicator: React.FC<{ currentLevel: number; maxLevel: number }> = ({ currentLevel, maxLevel }) => {
    return (
        <Box display="flex" justifyContent="center" mt={0.5}>
            <Box
                sx={{
                    width: '100%',
                    height: 30,
                    display: 'flex',
                    justifyContent: 'space-between',
                }}
            >
                {[...Array(maxLevel)].map((_, index) => (
                    <Box
                        key={index}
                        sx={{
                            flex: 1,
                            height: '100%',
                            borderRadius: '4px',
                            backgroundColor: index < currentLevel ? 'green' : 'lightgray',
                            margin: '0 1px',
                        }}
                    />
                ))}
            </Box>
        </Box>
    );
};

export default LevelIndicator; 