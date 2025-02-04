import React, { useEffect, useRef, Suspense } from 'react';
import { Box, Modal, IconButton } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import gsap from 'gsap';
import { motion } from 'framer-motion';
import { styled } from '@mui/system';
import { Canvas, useFrame, type MeshProps } from '@react-three/fiber';
import { Environment, PresentationControls, Float } from '@react-three/drei';
import * as THREE from 'three';

const AnimationContainer = styled(Box)({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '100%',
  maxWidth: '600px',
  height: '400px',
  background: 'radial-gradient(circle at center, rgba(26, 26, 26, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
  borderRadius: '20px',
  boxShadow: '0 0 100px rgba(0,0,0,0.8)',
  overflow: 'hidden',
});

const BoxScene = styled(Box)({
  position: 'relative',
  width: '100%',
  height: '100%',
  perspective: '2000px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

interface Box3DProps extends MeshProps {
  isOpening: boolean;
}

const Box3D: React.FC<Box3DProps> = ({ isOpening, ...props }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshPhysicalMaterial>(null);

  useEffect(() => {
    if (isOpening && meshRef.current && materialRef.current) {
      gsap.to(meshRef.current.rotation, {
        y: Math.PI * 4,
        duration: 2,
        ease: "power2.inOut"
      });

      gsap.to(materialRef.current, {
        emissiveIntensity: 2,
        duration: 1,
        yoyo: true,
        repeat: 1,
        ease: "power2.inOut"
      });
    }
  }, [isOpening]);

  return (
    <mesh ref={meshRef} {...props}>
      <boxGeometry args={[1, 1, 1]} />
      <meshPhysicalMaterial
        ref={materialRef}
        color="#FFD700"
        metalness={0.9}
        roughness={0.1}
        emissive="#FFA500"
        emissiveIntensity={0.2}
        envMapIntensity={1}
      />
    </mesh>
  );
};

interface ParticleSystemProps {
  count: number;
  isExploding: boolean;
}

const ParticleSystem: React.FC<ParticleSystemProps> = ({ count = 100, isExploding }) => {
  const particlesRef = useRef<THREE.Points>(null);
  const positions = useRef<Float32Array>(new Float32Array(count * 3));
  const velocities = useRef<Float32Array>(new Float32Array(count * 3));

  useEffect(() => {
    if (isExploding && particlesRef.current) {
      for (let i = 0; i < count; i++) {
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.random() * Math.PI;
        const speed = 0.1 + Math.random() * 0.2;
        
        velocities.current[i * 3] = Math.sin(phi) * Math.cos(theta) * speed;
        velocities.current[i * 3 + 1] = Math.cos(phi) * speed;
        velocities.current[i * 3 + 2] = Math.sin(phi) * Math.sin(theta) * speed;
      }

      if (particlesRef.current.material instanceof THREE.Material) {
        gsap.to(particlesRef.current.material, {
          opacity: 0,
          duration: 1.5,
          ease: "power2.out"
        });
      }
    }
  }, [isExploding, count]);

  useFrame(() => {
    if (isExploding && particlesRef.current) {
      const geometry = particlesRef.current.geometry;
      const positionAttribute = geometry.getAttribute('position') as THREE.BufferAttribute;
      const positions = positionAttribute.array as Float32Array;

      for (let i = 0; i < count; i++) {
        positions[i * 3] += velocities.current[i * 3];
        positions[i * 3 + 1] += velocities.current[i * 3 + 1];
        positions[i * 3 + 2] += velocities.current[i * 3 + 2];
      }
      positionAttribute.needsUpdate = true;
    }
  });

  return (
    <points ref={particlesRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions.current}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.02}
        color="#FFD700"
        transparent
        opacity={1}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

const GlowEffect = styled(motion.div)({
  position: 'absolute',
  width: '300%',
  height: '300%',
  background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, rgba(255,215,0,0) 70%)',
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
  const glowRef = useRef<HTMLDivElement>(null);
  const [isExploding, setIsExploding] = React.useState(false);

  useEffect(() => {
    if (isOpening && glowRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          setTimeout(() => {
            onAnimationComplete();
          }, 500);
        }
      });

      tl.set(glowRef.current, { opacity: 0, scale: 1 })
        .to(glowRef.current, {
          duration: 0.5,
          opacity: 0.8,
          scale: 1.5,
          ease: "power2.in"
        })
        .add(() => setIsExploding(true))
        .to(glowRef.current, {
          duration: 0.5,
          opacity: 1,
          scale: 3,
          ease: "power3.in"
        }, "+=1");
    }
  }, [isOpening, onAnimationComplete]);

  return (
    <Modal
      open={isOpening}
      onClose={onClose}
      aria-labelledby="box-opening-modal"
      sx={{
        backdropFilter: 'blur(8px)',
        backgroundColor: 'rgba(0,0,0,0.85)'
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
          <Canvas camera={{ position: [0, 0, 4], fov: 50 }}>
            <Suspense fallback={null}>
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
              <pointLight position={[-10, -10, -10]} />
              
              <PresentationControls
                global
                config={{ mass: 2, tension: 500 }}
                snap={{ mass: 4, tension: 1500 }}
                rotation={[0, 0, 0]}
                polar={[-Math.PI / 3, Math.PI / 3]}
                azimuth={[-Math.PI / 1.4, Math.PI / 2]}
              >
                <Float
                  speed={1.5}
                  rotationIntensity={1}
                  floatIntensity={2}
                >
                  <Box3D isOpening={isOpening} scale={[1, 1, 1]} />
                </Float>
              </PresentationControls>
              
              <ParticleSystem count={200} isExploding={isExploding} />
              <Environment preset="sunset" />
            </Suspense>
          </Canvas>
        </BoxScene>
      </AnimationContainer>
    </Modal>
  );
}

export default BoxOpenAnimation; 