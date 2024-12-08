import React from "react";
import { AppBar, Toolbar, Typography, Box, Select, MenuItem } from "@mui/material";

interface NavbarProps {
  currentLanguage: string;
  onLanguageChange: (language: string) => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentLanguage, onLanguageChange }) => {
  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Typography variant="h6">CAPVERSAL</Typography>
        <Box>
          <Select
            value={currentLanguage}
            onChange={(e) => onLanguageChange(e.target.value)}
            sx={{ color: "white", borderColor: "white", minWidth: 100 }}
          >
            <MenuItem value="en">English</MenuItem>
            <MenuItem value="tr">Türkçe</MenuItem>
          </Select>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
