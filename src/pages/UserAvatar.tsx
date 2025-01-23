import React from 'react';
import { Avatar, Box } from "@mui/material";
import WebApp from "@twa-dev/sdk";

interface UserAvatarProps {
  telegramUserId: string;
  displayName: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ displayName }) => {
  const user = WebApp.initDataUnsafe.user;
  
  return (
    <Box sx={{ borderRadius: '50%', overflow: 'hidden' }}>
    <Avatar
      alt={displayName}
      src={user?.photo_url}
      sx={{ 
        p: 0,
        width: 32, 
        height: 32, 
        ml: 0.1,
        backgroundColor: user?.photo_url ? "transparent" : "blue", 
        color: "white",
        borderRadius: '50%',
        objectFit: 'cover',
      }}
    >
      {!user?.photo_url && displayName.slice(0, 2).toUpperCase()}
    </Avatar>
    </Box>
  );
};

export default UserAvatar;