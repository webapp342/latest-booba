import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import TypingText from './TypingText';


function Brand() {



  

 
  return (
            <AppBar position="fixed" sx={{minHeight:"10vh", backgroundColor: '#1E1E1E',border:"none",boxShadow:'none' }}>
                   <Box  alignItems={"center"}  sx={{backgroundColor: '#1E1E1E' }}>
          <TypingText />
    
          
    </Box>
        
    </AppBar>

       
    
  );
  
}

export default Brand;
