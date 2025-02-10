import { forwardRef, useImperativeHandle, useRef } from 'react';
import { Box, Paper } from '@mui/material';
import { keyframes } from '@emotion/react';

interface SlotDisplayProps {
  numbers: string;
  selectedSpinType: string;
  onAnimationComplete?: () => void;
}

export interface CounterRef {
  startAnimation: (config: {
    duration: number;
    dummyCharacterCount: number;
    direction: string;
    value: string;
    easingFunction?: string;
  }) => void;
}

// Animasyonlar
const glowAnimation = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.1); }
  50% { box-shadow: 0 0 20px rgba(255, 215, 0, 0.8), 0 0 40px rgba(255, 215, 0, 0.5), 0 0 60px rgba(255, 215, 0, 0.3); }
  100% { box-shadow: 0 0 10px rgba(255, 215, 0, 0.5), 0 0 20px rgba(255, 215, 0, 0.3), 0 0 30px rgba(255, 215, 0, 0.1); }
`;

const redGlowAnimation = keyframes`
  0% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.5), 0 0 20px rgba(255, 0, 0, 0.3), 0 0 30px rgba(255, 0, 0, 0.1); }
  50% { box-shadow: 0 0 20px rgba(255, 0, 0, 0.8), 0 0 40px rgba(255, 0, 0, 0.5), 0 0 60px rgba(255, 0, 0, 0.3); }
  100% { box-shadow: 0 0 10px rgba(255, 0, 0, 0.5), 0 0 20px rgba(255, 0, 0, 0.3), 0 0 30px rgba(255, 0, 0, 0.1); }
`;

const metalAnimation = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;







const SlotDisplay = forwardRef<CounterRef[], SlotDisplayProps>(({ numbers, selectedSpinType, onAnimationComplete }, ref) => {
  const numberRefs = useRef<(HTMLDivElement | null)[]>(Array(6).fill(null));
  const localRefs = useRef<CounterRef[]>(Array(6).fill(null));

  useImperativeHandle(ref, () => localRefs.current, [localRefs]);

  return (
    <Box //@ts-ignore
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 1,
        my: 4,
      }}
    >
      {/* Slot Machine Frame */}
      <Box
        sx={{
          background: 'linear-gradient(45deg, #2b2b2b 0%, #1a1a1a 100%)',
          borderRadius: '30px',
          m:2,
          width:'100%',
          boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(90deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
            borderRadius: '30px',
            pointerEvents: 'none',
          }
        }}
      >
        {/* Numbers Display Container */}
        <Box
          sx={{
            display: 'flex',
            gap: { xs: '8px', sm: '12px', md: '16px' },
            background: 'linear-gradient(45deg, #000000 0%, #1a1a1a 100%)',
            padding: '20px',
            borderRadius: '20px',
            position: 'relative',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: -2,
              left: -2,
              right: -2,
              bottom: -2,
              background: 'linear-gradient(45deg, #FFD700, #FFA500)',
              borderRadius: '22px',
              zIndex: -1,
            }
          }}
        >
          {numbers.split('').map((number, index) => {
            const isRed = (selectedSpinType === 'total' && index === 0) ||
                         (selectedSpinType === 'bblip' && index < 2);
            
            return (
              <Paper
                key={index}
                elevation={24}
                sx={{
                  width: { xs: '45px', sm: '55px', md: '65px' },
                  height: { xs: '65px', sm: '75px', md: '85px' },
                  background: isRed
                    ? 'linear-gradient(135deg, #ff4444 0%, #cc0000 100%)'
                    : 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderRadius: '12px',
                  position: 'relative',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease-in-out',
                  animation: `${isRed ? redGlowAnimation : glowAnimation} 2s infinite, ${metalAnimation} 3s linear infinite`,
                  backgroundSize: '200% 200%',
                  transform: 'rotateX(10deg)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: isRed
                      ? 'linear-gradient(135deg, rgba(255,0,0,0.1) 0%, rgba(255,0,0,0) 100%)'
                      : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%)',
                    opacity: 0.5,
                    zIndex: 1,
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    right: 0,
                    height: '1px',
                    background: isRed
                      ? 'rgba(255,0,0,0.2)'
                      : 'rgba(255,255,255,0.2)',
                    boxShadow: isRed
                      ? '0 0 10px rgba(255,0,0,0.5)'
                      : '0 0 10px rgba(255,255,255,0.5)',
                    zIndex: 2,
                  }
                }}
              >
                <div 
                  className="number-container"
                  ref={el => {
                    numberRefs.current[index] = el;
                    if (el) {
                      localRefs.current[index] = {
                        startAnimation: (config) => {
                          const { duration, value } = config;
                          
                          if (duration === 0) {
                            el.textContent = value;
                            return;
                          }

                          // Create slot reel
                          const reel = document.createElement('div');
                          reel.style.position = 'absolute';
                          reel.style.width = '100%';
                          reel.style.height = '2000%';
                          reel.style.display = 'flex';
                          reel.style.flexDirection = 'column';
                          reel.style.alignItems = 'center';
                          
                          // Generate sequence for smooth transition
                          const sequence = [];
                          const targetNum = parseInt(value);
                          let currentNum = Math.floor(Math.random() * 10);
                          
                          // First set of fast spinning numbers
                          for (let i = 0; i < 60; i++) {
                            sequence.push(...Array.from({length: 10}, (_, i) => i));
                          }
                          
                          // Intermediate numbers for slowing down effect
                          for (let i = 0; i < 15; i++) {
                            sequence.push(...Array.from({length: 5}, () => Math.floor(Math.random() * 10)));
                          }
                          
                          // Approach target number
                          while (currentNum !== targetNum) {
                            currentNum = (currentNum + 1) % 10;
                            for (let i = 0; i < 4; i++) {
                              sequence.push(currentNum);
                            }
                          }
                          
                          // Repeat final number
                          for (let i = 0; i < 8; i++) {
                            sequence.push(targetNum);
                          }
                          
                          // Create number elements
                          sequence.forEach(num => {
                            const numDiv = document.createElement('div');
                            numDiv.textContent = num.toString();
                            numDiv.style.height = '50px';
                            numDiv.style.width = '100%';
                            numDiv.style.display = 'flex';
                            numDiv.style.alignItems = 'center';
                            numDiv.style.justifyContent = 'center';
                            numDiv.style.fontSize = '2.4rem';
                            numDiv.style.fontWeight = 'bold';
                            numDiv.style.color = '#ffffff';
                            numDiv.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
                            numDiv.style.fontFamily = "'Digital-7', monospace";
                            reel.appendChild(numDiv);
                          });

                          // Clear and add reel
                          el.innerHTML = '';
                          el.appendChild(reel);

                          // Start spinning animation
                          const spinDuration = duration * 1.5;
                          reel.style.transition = `transform ${spinDuration}s cubic-bezier(0.15, 0.01, 0.15, 1)`;
                          
                          // Initial position
                          reel.style.transform = 'translateY(0)';
                          
                          // Force reflow
                          reel.offsetHeight;
                          
                          // Final position
                          const finalOffset = -(sequence.length - 1) * 50;
                          reel.style.transform = `translateY(${finalOffset}px)`;
                          
                          // Cleanup and add winning flash effect
                          setTimeout(() => {
                            el.innerHTML = '';
                            el.textContent = value;
                            
                            el.style.transition = 'all 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)';
                            el.style.transform = 'scale(1.3)';
                            el.style.textShadow = '0 0 20px rgba(255,215,0,0.8)';
                            
                            setTimeout(() => {
                              el.style.transform = 'scale(1)';
                              el.style.textShadow = '2px 2px 4px rgba(0,0,0,0.5)';
                              
                              if (index === 5 && onAnimationComplete) {
                                onAnimationComplete();
                              }
                            }, 300);
                          }, spinDuration * 1000);
                        }
                      };
                    }
                  }}
                  style={{
                    color: '#ffffff',
                    fontSize: '2.4rem',
                    fontWeight: 'bold',
                    textShadow: '2px 2px 4px rgba(0,0,0,0.5)',
                    zIndex: 2,
                    position: 'relative',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    overflow: 'hidden',
                    fontFamily: "'Digital-7', monospace",
                  }}
                >
                  {number}
                </div>
              </Paper>
            );
          })}
        </Box>

        {/* Decorative Elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '20px',
            background: 'linear-gradient(90deg, #FFD700, #FFA500)',
            borderRadius: '10px 10px 0 0',
            boxShadow: '0 -5px 15px rgba(255,215,0,0.3)',
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -10,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '80%',
            height: '20px',
            background: 'linear-gradient(90deg, #FFD700, #FFA500)',
            borderRadius: '0 0 10px 10px',
            boxShadow: '0 5px 15px rgba(255,215,0,0.3)',
          }}
        />
      </Box>
    </Box>
  );
});

SlotDisplay.displayName = 'SlotDisplay';

export default SlotDisplay;
