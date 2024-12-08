import React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import WalletIcon from '@mui/icons-material/Wallet';

import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded"; // Dünya ikonu

interface NavbarProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({  onLanguageChange }) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLanguageSelect = (language: string) => {
    onLanguageChange(language);
    handleMenuClose();
  };

  return (
    <AppBar
      position="static"
      sx={{
        borderBottom: '1px solid #E0E0E0', // Gri ince top border

        backgroundColor: "white", // Modern koyu gri
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Hafif gölge
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingX: 2, // Yatayda iç boşluk
        }}
      >
        
        <Box>
          <IconButton
            size="large"
            edge="end"
            sx={{
              padding: 0,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)", // Hover efekti
              },
            }}
          >
            <WalletIcon />
          </IconButton>
       
        </Box>

        


        <Box>
          <IconButton
            size="large"
            edge="end"
            onClick={handleMenuOpen}
            sx={{
              padding: 1,
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.1)", // Hover efekti
              },
            }}
          >
            <LanguageRoundedIcon />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            sx={{
              "& .MuiMenu-paper": {
                backgroundColor: "#2D3748", // Menü arka plan rengi
                color: "#FFF",
              },
            }}
          >
            <MenuItem
              onClick={() => handleLanguageSelect("en")}
              sx={{
                "&:hover": { backgroundColor: "#4A5568" },
              }}
            >
              English
            </MenuItem>
            <MenuItem
              onClick={() => handleLanguageSelect("tr")}
              sx={{
                "&:hover": { backgroundColor: "#4A5568" },
              }}
            >
              Türkçe
            </MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
