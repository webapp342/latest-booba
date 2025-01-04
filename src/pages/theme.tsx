import { createTheme } from '@mui/material/styles';

// Tema oluşturma
const theme = createTheme({
  typography: {
    fontFamily: 'monospace',
    fontSize: 14, // Tüm bileşenler için varsayılan font boyutu
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none', // Tüm butonlar için textTransform ayarı
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          fontSize: '0.875rem', // Tüm Typography bileşenleri için font boyutu
        },
      },
    },
  },
});

export default theme;