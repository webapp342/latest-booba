import React, { useEffect, useState } from "react";
import { Avatar } from "@mui/material";

interface UserAvatarProps {
  telegramUserId: string;
  displayName: string; // Kullanıcı adı veya baş harfler için kullanılacak ad
}

const UserAvatar: React.FC<UserAvatarProps> = ({ telegramUserId, displayName }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);

  useEffect(() => {
    // Telegram profil fotoğrafını al
    const fetchUserPhotoUrl = async () => {
      try {
        const storedPhotoUrl = localStorage.getItem("telegramPhotoUrl");
        if (storedPhotoUrl) {
          setPhotoUrl(storedPhotoUrl); // Önbellekte varsa kullan
        } else {
          // Simüle edilen bir URL örneği, gerçek API çağrısı burada yapılabilir
          const url = `https://t.me/i/userpic/${telegramUserId}`;
          setPhotoUrl(url);
          localStorage.setItem("telegramPhotoUrl", url); // Önbelleğe al
        }
      } catch (error) {
        console.error("Profil fotoğrafı yüklenemedi:", error);
      }
    };

    fetchUserPhotoUrl();
  }, [telegramUserId]);

  return (
    <Avatar
      alt={displayName}
      src={photoUrl || undefined} // Fotoğraf URL'si varsa göster
      sx={{ width: 48, height: 48, backgroundColor: photoUrl ? "transparent" : "blue", color: "white" }} // Varsayılan arka plan rengi
    >
      {!photoUrl && displayName.slice(0, 2).toUpperCase()} {/* Fotoğraf yoksa baş harfleri göster */}
    </Avatar>
  );
};

export default UserAvatar;
