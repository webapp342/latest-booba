import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Typography } from '@mui/material';


function Brand() {



  

 
  return (
            <AppBar  sx={{minHeight:"10vh", backgroundColor: '#1a2126',border:"none",boxShadow:'none' }}>
                   <Box  alignItems={"center"}  sx={{backgroundColor: '#1a2126' }}>
                    <Box
    top="50%"
    left="40%"
    width="250px"
    height="10vh"
    borderRadius="40%"
    sx={{
      background: 'radial-gradient(circle, rgba(159,223,255,0.5) 0%, rgba(0,198,255,0) 70%)',
      transform: 'translate(60%, 90%)',
      filter: 'blur(40px)',
    }}
  />
          <Typography           variant="h1"
    sx={{
      
        textAlign: "center",
        mt: "-3vh",
        fontFamily: "monospace",
        fontWeight: 700,
        fontSize: "1.4rem",
        letterSpacing: "1px",
      }}>
            Wallet
          </Typography>
          
    </Box>
        
    </AppBar>

       
    
  );
  
}

export default Brand;
