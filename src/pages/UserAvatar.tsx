import React from 'react';
import { Avatar } from "@mui/material";
import WebApp from "@twa-dev/sdk";

interface UserAvatarProps {
  telegramUserId: string;
  displayName: string;
}

const UserAvatar: React.FC<UserAvatarProps> = ({ displayName }) => {
  const user = WebApp.initDataUnsafe.user;
  
  return (
    <Avatar
      alt={displayName}
      src={user?.photo_url}
      sx={{ 
        p:0.6,
        width: 22, 
        height: 22, 
        ml:0.1,
        backgroundColor: user?.photo_url ? "transparent" : "blue", 
        color: "white",
        borderRadius: '50%',
        overflow: 'hidden',
        objectFit: 'cover',
      }}
    >
      {!user?.photo_url && displayName.slice(0, 2).toUpperCase()}
    </Avatar>
  );
};

export default UserAvatar;