import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Typography } from '@mui/material';


function Brand() {



  

 
  return (
            <AppBar position="fixed" sx={{minHeight:"10vh", backgroundColor: '#1a2126',border:"none",boxShadow:'none' }}>
                   <Box  alignItems={"center"}  sx={{backgroundColor: 'transparent' }}>
                    <Box
    top="50%"
    left="50%"
    width="200px"
    height="10vh"
    borderRadius="50%"
    zIndex={-1} // Arka plana almak için
    sx={{
      background: 'radial-gradient(circle, rgba(159,223,255,0.5) 0%, rgba(0,198,255,0) 80%)',
      transform: 'translate(80%, 50%)',
      filter: 'blur(40px)',
    }}
  />
          <Typography     sx={{
      
        textAlign: "center",
     
        fontFamily: "'Press Start 2P', sans-serif",
        fontWeight: 700,
        fontSize: "1.2rem",
        letterSpacing: "1px",
      }}>
            Wallet
          </Typography>
          
    </Box>
        
    </AppBar>

       
    
  );
  
}

export default Brand;
