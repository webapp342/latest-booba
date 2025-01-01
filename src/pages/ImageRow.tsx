


import React from "react";
import { Box, Grid, Typography } from "@mui/material";
import Image1 from "../assets/vertical/Moleionaire_339x180-1.png";
import Image2 from "../assets/vertical/Money-Stacks_Money-Stack_339x180.png"; 
import Image3 from "../assets/vertical/7-Clovers-Of-Fortune_339x180.png";
import Image4 from "../assets/vertical/Angel-vs-Sinner_339x180.png";
import Image5 from "../assets/vertical/6-Jokers_339x180.png";
import Image6 from "../assets/vertical/Bow-of-Artemis_339x180.png";
import Image7 from "../assets/vertical/Crank-it-up_339x180-1.png";
import Image8 from "../assets/vertical/Devilicious_339x180.png";
import Image9 from "../assets/vertical/Ice-Lobster_339x180.png";
import Image11 from "../assets/vertical/Yeti-Quest_339x180.png";




const ImageRow: React.FC = () => {
   const images = [
    {
      src: Image11,
      header: "Yeti Quest",
      description: "Coming Soon",
    },
    {
      src: Image1,
      header: "Moleionaire",
      description: "Coming Soon",
    },
    {
      src: Image2,
      header: "Money Stacks",
      description: "Coming Soon",
    },
      {
      src: Image3,
      header: "7 Clovers Of Fortune",
      description: "Coming Soon",
    },
    {
      src: Image4,
      header: "Angel vs Sinner",
      description: "Coming Soon",
    },
     {
      src: Image5,
      header: "6 Jokers",
      description: "Coming Soon",
    }, {
      src: Image6,
      header: "Bow of Artemis",
      description: "Coming Soon",
    }, {
      src: Image7,
      header: "Crank it up",
      description: "Coming Soon",
    }, {
      src: Image8,
      header: "Devilicious",
      description: "Coming Soon",
    }, {
      src: Image9,
      header: "Ice Lobster",
      description: "Coming Soon",
    },
  ];

  return (
    <Box
      sx={{
        width: "90%",
        margin: "0 auto",
        textAlign: "center",
      }}
    >
      <Typography variant="h4" sx={{ mb: 1 , mt:3}}>
        SLOTS
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: "gray" }}>
        Find out more about our games
      </Typography>
      <Grid container spacing={2}>
        {images.map((image, index) => (
          <Grid item xs={6} key={index}>
            <Box
              component="img"
              src={image.src}
              alt={`Image ${index + 1}`}
              sx={{
                width: "100%",
                borderRadius: "8px", // Köşeleri yuvarlama
              }}
            />
            <Typography variant="h6" sx={{ mt: 2, textAlign: "center" }}>
              {image.header}
            </Typography>
            <Typography variant="body2" sx={{ textAlign: "center", color: "gray" }}>
              {image.description}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default ImageRow;

// Kullanım Örneği:
// <ImageRow />
