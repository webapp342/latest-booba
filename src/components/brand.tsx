import { Typography } from '@mui/material';
import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';


function Brand() {



  

 
  return (
            <AppBar position="fixed" sx={{minHeight:"10vh", backgroundColor: '#1E1E1E',border:"none",boxShadow:'none' }}>
                   <Box  alignItems={"center"}  sx={{backgroundColor: '#1E1E1E' }}>
            <Typography  sx={{mt:"8vh", textAlign:'center'}}>
        BOOBA
            </Typography>
    
          
    </Box>
        
    </AppBar>

       
    
  );
  
}

export default Brand;
