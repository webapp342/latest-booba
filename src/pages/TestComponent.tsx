import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import { keyframes } from "@emotion/react";

import { Box, Typography, Button } from "@mui/material";

// Animasyon keyframe tanımı
const bounceAnimation = keyframes`
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(10px);
  }
`;

const LuckyLotto = () => {
  return (
    <Box
      sx={{
        backgroundColor: "#7b0105",
        color: "white",
        textAlign: "center",
        padding: 1,
        
        position: "relative",
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
  

    {/* Jackpot Section */}
    <Box
          sx={{
            background: "linear-gradient(to bottom, #ffd700, #ffffff)",
            padding: 3,
  
            borderRadius: 1,
            marginTop: 5,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
            Lucky Lotto
          </Typography>
        </Box>

        {/* Buttons */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(to right, #c70039, #ff0000)",
            borderRadius: 2,
            px: 3,
            mt: -2,
            marginBottom: "10px",
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
         TOP PRIZE : 999 TON
        </Button>
        <Box>
               {/* Aşağı yönlendirme ikonu */}
      <ArrowDownwardIcon
        sx={{
          color: "#ffd700",
          fontSize: "2rem",
          animation: `${bounceAnimation} 1.5s infinite`,
        }}
      />

        </Box>

    
    

      {/* Lucky Lotto Main Content */}
    
        {/* Jackpot Section */}
        <Box
          sx={{
            background: "linear-gradient(to bottom, #ffd700, #ffffff)",
            padding: 2,
            borderRadius: 1,
          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold" }}
          >
            JACKPOT
          </Typography>
        </Box>

        {/* Buttons */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(to right, #c70039, #ff0000)",
            borderRadius: 2,
            px: 5,
            mt: -2,

            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Pick Your Winning Token
        </Button>

        <Box>
               {/* Aşağı yönlendirme ikonu */}
      <ArrowDownwardIcon
        sx={{
          color: "#ffd700",
          fontSize: "2rem",
          animation: `${bounceAnimation} 1.5s infinite`,
        }}
      />

        </Box>

        <Box
          sx={{
            background: "linear-gradient(to bottom, #ffd700, #ffffff)",
            padding: 5,
            mx: 3,
            borderRadius: 1,

          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
           
          </Typography>
        </Box>

        {/* Buttons */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(to right, #c70039, #ff0000)",
            borderRadius: 1,
            px: 5,
            mt: -2,
            textTransform: "none",
            fontWeight: "bold",
          }}
        >
          Pick Your POWER
        </Button>

        <Box>
               {/* Aşağı yönlendirme ikonu */}
      <ArrowDownwardIcon
        sx={{
          color: "#ffd700",
          fontSize: "2rem",
          animation: `${bounceAnimation} 1.5s infinite`,
        }}
      />

        </Box>

        <Box
          sx={{
            background: "linear-gradient(to bottom, #ffd700, #ffffff)",
            padding: 5,
            mx: 3,
            borderRadius: 1,


          }}
        >
          <Typography
            variant="h4"
            sx={{ fontWeight: "bold", marginBottom: "10px" }}
          >
           
          </Typography>
        </Box>
      
        
        {/* Golden Button */}
        <Button
          variant="contained"
          sx={{
            background: "linear-gradient(to right, #ffcc00, #ffd700)",
            color: "black",
            borderRadius: 1,
            px: 5,
            fontWeight: "bold",
            marginTop: "20px",
          }}
        >
          Spin Now
        </Button>
    </Box>
  );
};

export default LuckyLotto;
