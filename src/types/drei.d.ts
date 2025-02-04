declare module '@react-three/drei' {
  import { ReactNode } from 'react';
  import { Object3D } from 'three';
  
  export interface PresentationControlsProps {
    global?: boolean;
    config?: { mass: number; tension: number };
    snap?: { mass: number; tension: number };
    rotation?: [number, number, number];
    polar?: [number, number];
    azimuth?: [number, number];
    children?: ReactNode;
  }

  export interface FloatProps {
    speed?: number;
    rotationIntensity?: number;
    floatIntensity?: number;
    children?: ReactNode;
    position?: [number, number, number];
    rotation?: [number, number, number];
    scale?: [number, number, number];
  }

  export interface EnvironmentProps {
    preset?: 'sunset' | 'dawn' | 'night' | 'warehouse' | 'forest' | 'apartment' | 'studio' | 'city' | 'park' | 'lobby';
    background?: boolean;
    blur?: number;
  }

  export const PresentationControls: React.FC<PresentationControlsProps>;
  export const Float: React.FC<FloatProps>;
  export const Environment: React.FC<EnvironmentProps>;
} 