import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Typography } from "@mui/material";
import "./text.css";


const words = ["BOOBA", "Fun.", "Freedom.", "Future."];

const TypingText = () => {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [charIndex, setCharIndex] = useState(0);

  useEffect(() => {
    const currentWord = words[currentWordIndex];
    const typingSpeed = isDeleting ? 100 : 200;
    
    if (!isDeleting && charIndex === currentWord.length) {
      setTimeout(() => setIsDeleting(true), 1000);
      return;
    }
    if (isDeleting && charIndex === 0) {
      setIsDeleting(false);
      setCurrentWordIndex((prev) => (prev + 1) % words.length);
      return;
    }

    const timeout = setTimeout(() => {
      setDisplayText(
        isDeleting
          ? currentWord.substring(0, charIndex - 1)
          : currentWord.substring(0, charIndex + 1)
      );
      setCharIndex((prev) => prev + (isDeleting ? -1 : 1));
    }, typingSpeed);

    return () => clearTimeout(timeout);
  }, [charIndex, isDeleting, currentWordIndex]);

  return (
    <Typography
    className="text-gradient"
      sx={{
        mt: "7vh",
        textAlign: "center",
     
        fontFamily: "'Press Start 2P', sans-serif",
        fontWeight: 700,
        fontSize: "1.2rem",
        letterSpacing: "1px",
      }}
    >
      <motion.span>{displayText}</motion.span>
    </Typography>
  );
};

export default TypingText;
