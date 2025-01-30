import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import { Typography } from '@mui/material';


function Brand() {



  

 
  return (
            <AppBar  sx={{minHeight:"10vh", backgroundColor: '#1a2126',border:"none",boxShadow:'none' }}>
                   <Box  alignItems={"center"}  sx={{backgroundColor: '#1a2126' }}>
          <Typography     sx={{
        mt: "7vh",
        textAlign: "center",
     
        fontFamily: "'Press Start 2P', sans-serif",
        fontWeight: 700,
        fontSize: "1.2rem",
        letterSpacing: "1px",
      }}>
            Tasks
          </Typography>
          
    </Box>
        
    </AppBar>

       
    
  );
  
}

export default Brand;
