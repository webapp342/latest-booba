import { useEffect, useRef } from "react";
import styles from "./task.module.css";
import { Button, Typography } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import task8Logo from "../assets/booba-logo.png";
const theme = createTheme({
  typography: {
    fontFamily: "Inter, system-ui, -apple-system, sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
          textTransform: 'none',
          fontWeight: 600,
          boxShadow: 'none',
          color: '#6ed3ff',
          padding: 1.5,
          paddingRight: 5,
          paddingLeft: 5,
          letterSpacing: 1.1,
          '&:hover': {
            backgroundColor: 'transparent',
          },
          '&:active': {
            backgroundColor: 'transparent',
          },
          '&.MuiButton-contained': {
            backgroundColor: 'rgba(110, 211, 255, 0.1)',
           
            '&:active': {
              backgroundColor: 'transparent',
            },
          },
          '&.MuiButton-outlined': {
            '&:hover': {
              backgroundColor: 'transparent',
            },
            '&:active': {
              backgroundColor: 'transparent',
            },
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundColor: 'rgba(110, 211, 255, 0.1)',
          padding: '8px',
          borderRadius: '12px',
        },
      },
    },
  },
});

/**
  * Check Typescript section
  * and add types for <adsgram-task> typing
*/

interface TaskProps {
  debug: boolean;
  blockId: string;
}

export const Task = ({ debug, blockId }: TaskProps) => {
  const taskRef = useRef<AdsgramTaskElement>(null);

  useEffect(() => {
    const handler = (event: CustomEvent<string>) => {
      // event.detail contains your block id
      alert(`reward, detail = ${event.detail}`);
    };
    const task = taskRef.current;

    if (task) {
      task.addEventListener("reward", handler);
    }

    return () => {
      if (task) {
        task.removeEventListener("reward", handler);
      }
    };
  }, []);

  if (!customElements.get("adsgram-task")) {
    return null;
  }

  return (
          <ThemeProvider theme={theme}>

    <adsgram-task
      className={styles.task}
      data-block-id={blockId}
      data-debug={debug}
      ref={taskRef}
    >
      <span slot="reward" >
        <img src={task8Logo} alt="" width={16} style={{ borderRadius: '50%' }} />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: '#98d974',
                                  fontWeight: 600,
                                }}
                              >
                                +5 BBLIP
                              </Typography>
      </span>
      <Button         variant="contained"
 slot="button"   sx={{
          p: 1,
          backgroundColor: 'rgba(110, 211, 255, 0.1)',
          color: '#6ed3ff',
          '&:disabled': {
            background: '#2f363a',
            color: 'rgba(255, 255, 255, 0.3)',
          },
        }}>
        Earn
      </Button>
      <div slot="done" className={styles.button_done}>
        Done
      </div>
    </adsgram-task>
    </ThemeProvider>
  );
};