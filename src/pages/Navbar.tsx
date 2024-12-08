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
import LanguageRoundedIcon from "@mui/icons-material/LanguageRounded"; // Dünya ikonu

interface NavbarProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentLanguage, onLanguageChange }) => {
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
        backgroundColor: "#1A202C", // Modern koyu gri
        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.2)", // Hafif gölge
      }}
    >
      <Toolbar
        sx={{
          justifyContent: "space-between",
          paddingX: 2, // Yatayda iç boşluk
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            letterSpacing: 1.2,
          }}
        >
          CAPVERSAL
        </Typography>
        <Box>
          <IconButton
            size="large"
            edge="end"
            color="inherit"
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
