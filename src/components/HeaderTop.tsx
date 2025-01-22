import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import LanguageIcon from '@mui/icons-material/Language'; // Import a language icon
import { Select, MenuItem, FormControl,  SelectChangeEvent } from '@mui/material'; // Import Select components
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined'; // Yeni ikon import edildi
import DataSaverOnOutlinedIcon from '@mui/icons-material/DataSaverOnOutlined';
import WebApp from "@twa-dev/sdk";
import { Link } from 'react-router-dom'; // Import Link from react-router-dom
import { useTheme } from '@mui/material/styles'; // Import useTheme
import { Avatar } from '@mui/material';


// Import images
import bblipLogo from '../assets/bblip.png'; // Image for BBLIP
import totalLogo from '../assets/ton_symbol.png'; // Image for Total
import UserAvatar from '../pages/UserAvatar';

function ResponsiveAppBar() {
  const telegramUser = WebApp.initDataUnsafe.user;
  
  const theme = useTheme(); // Use the theme

  const [bblip, setBblip] = useState<number | null>(null);
  const [total, setTotal] = useState<number | null>(null);
  const [telegramUserId, setTelegramUserId] = useState<string | null>(null);
  const [, setLanguage] = useState<string>('en'); // Default language
  const [selectedBalance, setSelectedBalance] = useState<string>('bblip'); // Default selected balance
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // Track if the menu is open

  useEffect(() => {
    const id = localStorage.getItem("telegramUserId");
    if (id) {
      setTelegramUserId(id);
    } else {
      console.error("Telegram User ID not found in local storage!");
    }
  }, []);

  useEffect(() => {
    const fetchBalances = async () => {
      if (!telegramUserId) {
        console.log('User ID is not available');
        return; // Exit if the user ID is not available
      }

      const db = getFirestore();
      const userDoc = doc(db, 'users', String(telegramUserId)); // Convert to string
      const userSnapshot = await getDoc(userDoc);

      if (userSnapshot.exists()) {
        const data = userSnapshot.data();
        setBblip(data.bblip);
        setTotal(data.total);
      } else {
        console.log('No such document!');
      }
    };

    fetchBalances();
  }, [telegramUserId]);

  const handleLanguageChange = () => {
    setLanguage((prev) => (prev === 'en' ? 'tr' : 'en')); // Toggle between English and Turkish
  };

  const handleBalanceChange = (event: SelectChangeEvent<string>) => {
    setSelectedBalance(event.target.value as string); // Update selected balance
  };

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

  const displayedBalance = selectedBalance === 'bblip' 
    ? (bblip !== null ? (bblip / 1000).toFixed(2) : 'Loading...') 
    : (total !== null ? (total / 1000).toFixed(2) : 'Loading...');

       const avatarStyles = selectedBalance === 'bblip' 
                      ? { width: "8vw", height: "auto" } // BBLIP için stil
                      : { width: "8vw", height: "auto" }; // Total için stil

  return (
    <AppBar position="fixed" sx={{ backgroundColor: '#282828', borderBottomLeftRadius: '16px', borderBottomRightRadius: '16px' }}>
      <Container  maxWidth="xl">
        <Toolbar disableGutters>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <FormControl variant="outlined" sx={{ backgroundColor: 'transparent', '&.Mui-focused': { border: 'none' } }}>
                <Select
                  labelId="balance-select-label"
                  value={selectedBalance}
                  onChange={handleBalanceChange}
                  onOpen={handleMenuOpen}
                  onClose={handleMenuClose}
                  label=""
                  sx={{
                    border: 'none',
                    borderRadius: 0,
                    backgroundColor: 'transparent',
                    '&.Mui-focused': { backgroundColor: 'transparent', border: 'none' },
                    '&:hover': { backgroundColor: 'transparent' },
                    '&.MuiSelect-select': { backgroundColor: 'transparent', border: 'none' },
                    '&.MuiSelect-outlined': { border: 'none' },
                    '&.MuiSelect-filled': { border: 'none' },
                    '&.MuiSelect-select:focus': { backgroundColor: 'transparent', border: 'none' },
                    '&.MuiSelect-select.MuiSelect-filled': { backgroundColor: 'transparent', border: 'none' },
                    '& .MuiSelect-icon': { display: 'none' }, // Hide the default icon
                    '& .MuiOutlinedInput-notchedOutline': { border: 'none' }, // Remove outline border
                    '& .MuiSelect-select:before': { border: 'none' }, // Remove underline before
                    '& .MuiSelect-select:after': { border: 'none' }, // Remove underline after
                  }}
                  inputProps={{ disableUnderline: true }}
                  IconComponent={() => null}
                  renderValue={() => {
                    const logo = selectedBalance === 'bblip' ? bblipLogo : totalLogo;

                    return (
                      <Box sx={{ display: 'flex', alignItems: 'center' ,position: 'relative' }}>
                        <Box sx={{  }}>
  <Avatar
                            sx={avatarStyles} // Burada stil uygulama
                            src={logo}
                          />                        </Box>
    <ChangeCircleOutlinedIcon fontSize='medium'
                          style={{
                            position: 'absolute',
                            bottom: '0',
                            left: '0',
                            color: '#00c6ff',
                            padding: 1,
                            transform: `translate(-55%, 30%) rotate(${menuOpen ? 140 : 0}deg)`, // Rotate based on menu state
                            transition: 'transform 0.1s ease', // Kısa geçiş süresi
                            borderRadius: '50%', // Make it circular
                            backgroundColor: '#282828', // Use dark theme background
                          }}
                        />                        <Typography sx={{marginLeft:'1vw', fontWeight: 'light', fontSize: '1rem', color: '#FFFFFF' }}>
                          {displayedBalance}
                        </Typography>
                      </Box>
                    );
                  }}
                >
                  <MenuItem value="bblip" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>


<Box display={'flex'}>
   <img src={bblipLogo} alt="BBLIP" style={{ height: '20px', marginRight: '8px' }} />

                        {menuOpen && <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>BBLIP</Typography>}
</Box>
                     

                  <Box display={'flex'} gap={1}>
                    <Box>
                            {bblip !== null ? (bblip / 1000).toFixed(2) : 'Loading...'} 
                    </Box>


                      <Box>
   BBLIP
                      </Box>

               
                   
                  </Box>
    
                  
                  </MenuItem>



                  <MenuItem value="total" sx={{minWidth:"90vw", display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>


                    <Box sx={{ display: 'flex' }}>

   <img src={totalLogo} alt="Total" style={{ height: '20px', marginRight: '8px' }} />
                        {menuOpen && <Typography variant="body2" sx={{ color: theme.palette.text.primary }}>TON</Typography>}
                         </Box>
                  

                  <Box   display={'flex'} gap={1}>
                    <Box>

                                            {total !== null ? (total / 1000).toFixed(2) : 'Loading...'} 
                    </Box>
                     <Box>
                    TON
                   </Box>

                     
                    </Box>
                  </MenuItem>
                  
                </Select>
              </FormControl>

              <Box ml={-16}  display={'flex'} sx={{ alignItems: 'center', mt: 1 }}>
                <Link to="/latest-booba/spin" style={{ textDecoration: 'none' }}>
                  <DataSaverOnOutlinedIcon  sx={{width:'8vw', height:'auto', color: '#00c6ff' }} />
                </Link>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Tooltip title="Change Language">
                  <IconButton onClick={handleLanguageChange}>
                    <LanguageIcon sx={{ color: '#FFFFFF', width: 28, height: 28 }} />
                  </IconButton>
                </Tooltip>
                <UserAvatar 
                  telegramUserId={telegramUser?.id?.toString() ?? ''}
                  displayName={telegramUser?.first_name ?? 'User'}
                />
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default ResponsiveAppBar;
