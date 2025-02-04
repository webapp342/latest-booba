import React, { useEffect, useRef } from 'react';
import { Box, Typography, Modal, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import gsap from 'gsap';
import { styled } from '@mui/system';

const AnimationContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '600px',
  height: '400px',
  backgroundColor: '#1a1a1a',
  borderRadius: '20px',
  boxShadow: '0 0 50px rgba(0,0,0,0.5)',
  overflow: 'hidden',
});

const BoxScene = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  perspective: '1000px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const BoxContainer = styled(Box)({
  width: '200px',
  height: '200px',
  position: 'relative',
  transformStyle: 'preserve-3d',
  cursor: 'pointer',
});

const BoxSide = styled(Box)({
  position: 'absolute',
  width: '100%',
  height: '100%',
  backfaceVisibility: 'hidden',
  background: 'linear-gradient(45deg, #FFD700, #FFA500)',
  border: '2px solid rgba(255,255,255,0.1)',
  boxShadow: '0 0 20px rgba(255,215,0,0.3)',
});

const BoxFront = styled(BoxSide)({
  transform: 'translateZ(100px)',
  borderRadius: '10px',
});

const BoxBack = styled(BoxSide)({
  transform: 'translateZ(-100px) rotateY(180deg)',
  borderRadius: '10px',
});

const BoxTop = styled(BoxSide)({
  transform: 'rotateX(-90deg) translateZ(100px)',
  borderRadius: '10px',
});

const BoxBottom = styled(BoxSide)({
  transform: 'rotateX(90deg) translateZ(100px)',
  borderRadius: '10px',
});

const BoxLeft = styled(BoxSide)({
  transform: 'rotateY(-90deg) translateZ(100px)',
  borderRadius: '10px',
});

const BoxRight = styled(BoxSide)({
  transform: 'rotateY(90deg) translateZ(100px)',
  borderRadius: '10px',
});

const GlowEffect = styled(Box)({
  position: 'absolute',
  width: '300%',
  height: '300%',
  background: 'radial-gradient(circle, rgba(255,215,0,0.2) 0%, rgba(255,215,0,0) 70%)',
  pointerEvents: 'none',
  opacity: 0,
});

interface BoxOpenAnimationProps {
  isOpening: boolean;
  onAnimationComplete: () => void;
  onClose: () => void;
}

const BoxOpenAnimation: React.FC<BoxOpenAnimationProps> = ({ 
  isOpening, 
  onAnimationComplete,
  onClose 
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpening && boxRef.current && glowRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(onAnimationComplete, 500);
        }
      });

      // Initial setup
      tl.set(boxRef.current, { rotateY: 0, rotateX: 0, scale: 1 });
      tl.set(glowRef.current, { opacity: 0 });

      // Start animation sequence
      tl.to(boxRef.current, {
        duration: 0.5,
        scale: 1.1,
        ease: "back.out(1.7)"
      })
      // Floating effect
      .to(boxRef.current, {
        duration: 1,
        y: -20,
        ease: "power1.inOut",
        yoyo: true,
        repeat: 1
      })
      // Rotation build-up
      .to(boxRef.current, {
        duration: 0.7,
        rotateY: 720,
        scale: 1.2,
        ease: "power2.inOut"
      })
      // Shake effect
      .to(boxRef.current, {
        duration: 0.1,
        x: 5,
        y: 5,
        rotateZ: 3,
        yoyo: true,
        repeat: 5,
        ease: "none"
      })
      // Glow effect
      .to(glowRef.current, {
        duration: 0.5,
        opacity: 1,
        ease: "power2.in"
      })
      // Final explosion
      .to(boxRef.current, {
        duration: 0.3,
        scale: 1.5,
        opacity: 0,
        ease: "power3.in"
      }, "+=0.2")
      .to(glowRef.current, {
        duration: 0.3,
        opacity: 1,
        scale: 2,
        ease: "power3.in"
      }, "-=0.3");

      // Add ambient rotation
      gsap.to(boxRef.current, {
        duration: 10,
        rotateY: "+=360",
        repeat: -1,
        ease: "none"
      });
    }
  }, [isOpening, onAnimationComplete]);

  return (
    <Modal
      open={isOpening}
      onClose={onClose}
      aria-labelledby="box-opening-modal"
      sx={{
        backdropFilter: 'blur(5px)',
        backgroundColor: 'rgba(0,0,0,0.8)'
      }}
    >
      <AnimationContainer>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: 'white',
            zIndex: 1
          }}
        >
          <CloseIcon />
        </IconButton>
        
        <BoxScene ref={containerRef}>
          <GlowEffect ref={glowRef} />
          <BoxContainer ref={boxRef}>
            <BoxFront>
              <Box
                sx={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'column',
                  gap: 1
                }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    color: '#fff',
                    fontWeight: 'bold',
                    textShadow: '0 0 10px rgba(0,0,0,0.5)'
                  }}
                >
                  Mystery Box
                </Typography>
              </Box>
            </BoxFront>
            <BoxBack />
            <BoxTop />
            <BoxBottom />
            <BoxLeft />
            <BoxRight />
          </BoxContainer>
        </BoxScene>
      </AnimationContainer>
    </Modal>
  );
};

export default BoxOpenAnimation; 