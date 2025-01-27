import Box from '@mui/material/Box';
import AppBar from '@mui/material/AppBar';
import TypingText from './TypingText';


function Brand() {



  

 
  return (
            <AppBar position="fixed" sx={{minHeight:"10vh", backgroundColor: '#1a2126',border:"none",boxShadow:'none' }}>
                   <Box  alignItems={"center"}  sx={{backgroundColor: '#1a2126' }}>
          <TypingText />
    
          
    </Box>
        
    </AppBar>

       
    
  );
  
}

export default Brand;
