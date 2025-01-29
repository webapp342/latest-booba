import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Typography } from '@mui/material';


function Brand() {



  

 
  return (
            <AppBar position="fixed" sx={{minHeight:"10vh", backgroundColor: '#1a2126',border:"none",boxShadow:'none' }}>
                   <Box  alignItems={"center"}  sx={{backgroundColor: 'transparent' }}>
                    <Box
    top="50%"
    left="40%"
    width="250px"
    height="10vh"
    borderRadius="40%"
    zIndex={-1} // Arka plana almak için
    sx={{
      background: 'radial-gradient(circle, rgba(159,223,255,0.5) 0%, rgba(0,198,255,0) 70%)',
      transform: 'translate(60%, 90%)',
      filter: 'blur(40px)',
    }}
  />
          <Typography     sx={{
      
        textAlign: "center",
        mt:-5,
        fontFamily: "monospace",
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
