import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Tooltip from '@mui/material/Tooltip';
import { useEffect, useState } from 'react';
import { getFirestore, doc, getDoc, onSnapshot } from 'firebase/firestore';
import CircleNotificationsRoundedIcon from '@mui/icons-material/CircleNotificationsRounded';
import { Select, MenuItem, FormControl, SelectChangeEvent } from '@mui/material';
import ChangeCircleOutlinedIcon from '@mui/icons-material/ChangeCircleOutlined';
import DataSaverOnOutlinedIcon from '@mui/icons-material/DataSaverOnOutlined';
import WebApp from "@twa-dev/sdk";
import { Link } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { Avatar, Menu, Drawer, Badge } from '@mui/material';

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
  const [selectedBalance, setSelectedBalance] = useState<string>('bblip'); // Default selected balance
  const [menuOpen, setMenuOpen] = useState<boolean>(false); // Track if the menu is open
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null); // State for dropdown anchor
  const [notifications, setNotifications] = useState<any[]>([]); // Bildirimleri saklamak için state
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false); // Drawer durumu

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

  useEffect(() => {
    const db = getFirestore();
    const userDoc = doc(db, 'users', String(telegramUserId));

    // Firestore'da onSnapshot ile dinleme
    const unsubscribe = onSnapshot(userDoc, (doc) => {
      const data = doc.data();
      if (data && data.bblip) {
        const newBalance = data.bblip; // Yeni bakiye
        const previousBalance = bblip; // Önceki bakiye

        if (previousBalance !== null && newBalance > previousBalance) {
          const increaseAmount = newBalance - previousBalance; // Artış miktarı
          const newNotification = { amount: increaseAmount, read: false }; // Yeni bildirim nesnesi

          // LocalStorage'da bildirimleri güncelle
          const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
          existingNotifications.push(newNotification);
          localStorage.setItem('notifications', JSON.stringify(existingNotifications));
          setNotifications(existingNotifications);
        }
        setBblip(newBalance); // Yeni bakiyeyi state'e ayarla
      }
    });

    return () => unsubscribe(); // Cleanup
  }, [telegramUserId, bblip]);

  const handleBalanceChange = (event: SelectChangeEvent<string>) => {
    setSelectedBalance(event.target.value as string); // Update selected balance
  };

  const handleMenuOpen = () => {
    setMenuOpen(true);
  };

  const handleMenuClose = () => {
    setMenuOpen(false);
  };

 
  const handleClose = () => {
    setAnchorEl(null); // Close the dropdown
  };

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
    // Drawer açıldığında tüm bildirimleri read: true olarak güncelle
    const existingNotifications = JSON.parse(localStorage.getItem('notifications') || '[]');
    const updatedNotifications = existingNotifications.map((notification: any) => ({ ...notification, read: true }));
    localStorage.setItem('notifications', JSON.stringify(updatedNotifications));
    setNotifications(updatedNotifications);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const unreadCount = notifications.filter(notification => !notification.read).length; // Okunmamış bildirim sayısı

  const displayedBalance = selectedBalance === 'bblip' 
    ? (bblip !== null ? (bblip / 1000).toFixed(2) : 'Loading...') 
    : (total !== null ? (total / 1000).toFixed(2) : 'Loading...');

       const avatarStyles = selectedBalance === 'bblip' 
                      ? { width: "8vw", height: "auto" } // BBLIP için stil
                      : { width: "8vw", height: "auto" }; // Total için stil

  // Sample notifications data
  const notificationsData = [
    { id: 1, message: "New message from user" },
    { id: 2, message: "Your balance has been updated" },
    { id: 3, message: "New transaction completed" },
  ];

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
                  <IconButton onClick={handleDrawerOpen}>
                    <CircleNotificationsRoundedIcon sx={{ color: '#FFFFFF', width: 28, height: 28 }} />
                    {unreadCount > 0 && <Badge badgeContent={unreadCount} color="error" />}
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
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {notificationsData.map(notification => (
          <MenuItem key={notification.id} onClick={handleClose}>
            {notification.message}
          </MenuItem>
        ))}
      </Menu>
      <Drawer anchor="right" open={drawerOpen} onClose={handleDrawerClose}>
        <Box sx={{ width: 250 }}>
          <Typography variant="h6" sx={{ padding: 2 }}>Bildirimler</Typography>
          {notifications.map((notification, index) => (
            <Typography key={index} sx={{ padding: 1 }}>
              {`Yeni artış: ${notification.amount} BBLIP`}
            </Typography>
          ))}
        </Box>
      </Drawer>
    </AppBar>
  );
}

export default ResponsiveAppBar;
