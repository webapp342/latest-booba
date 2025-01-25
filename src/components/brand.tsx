import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';


function Brand() {



  

 
  return (
            <AppBar position="fixed" sx={{minHeight:"10vh", backgroundColor: '#1E1E1E',border:"none",boxShadow:'none' }}>
                   <Box  alignItems={"center"}  sx={{backgroundColor: '#1E1E1E' }}>
            <Typography  sx={{mt:"7vh", textAlign:'center',  background: "linear-gradient(90deg, #1976d2, #00c6ff)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    fontFamily: "'Press Start 2P', sans-serif", // Pikselleştirilmiş retro font
    fontWeight: 700,

    fontSize: "1.2rem",
    letterSpacing: "1px"}}>
        BOOBA
            </Typography>
    
          
    </Box>
        
    </AppBar>

       
    
  );
  
}

export default Brand;
