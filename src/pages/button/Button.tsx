import { FC, ButtonHTMLAttributes } from 'react';
import { styles } from './styles';

export const Button: FC<ButtonHTMLAttributes<HTMLButtonElement>> = ({ 
  children, 
  ...props 
}) => {
  return (
    <button style={styles.button} {...props}>
      {children}
    </button>
  );
};