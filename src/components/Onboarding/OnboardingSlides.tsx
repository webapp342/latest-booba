import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import SwapHorizontalCircleIcon from '@mui/icons-material/SwapHorizontalCircle';
import WalletIcon from '@mui/icons-material/Wallet';
import TaskAltIcon from '@mui/icons-material/TaskAlt';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from '@emotion/styled';

type SupportedLanguages = 'en' | 'tr' | 'hi' | 'ru' | 'th' | 'es';

interface SlideContent {
  title: string;
  description: string;
  highlight: string;
}

interface LanguageContent {
  slides: SlideContent[];
  getStarted: string;
}

type ContentType = Record<SupportedLanguages, LanguageContent>;

interface OnboardingSlidesProps {
  onComplete: () => void;
}

// Multi-language content
const content: ContentType = {
  en: {
    slides: [
      {
        title: "Welcome to Booba Blip",
        description: "Your gateway to the future of DeFi. Join us on this exciting journey of innovation and rewards.",
        highlight: "Vision • Innovation • Community"
      },
      {
        title: "What is BBLIP?",
        description: "BBLIP token is coming soon with TGE (Token Generation Event). Pre-launch price is set at $0.07 USDT, allowing early calculation of your earned rewards.",
        highlight: "Pre-Launch • TGE Coming Soon • $0.07 USDT"
      },
      {
        title: "Earning Methods & Tasks",
        description: "Complete tasks, participate in activities, and grow your BBLIP holdings. Your rewards are calculated at $0.07 USDT per BBLIP.",
        highlight: "Daily Tasks • Social Activities • Rewards"
      },
      {
        title: "VIP User Benefits",
        description: "Unlock exclusive advantages and enhanced rewards as a VIP user. Special access to features and priority benefits await.",
        highlight: "Exclusive Access • Enhanced Rewards • Priority Benefits"
      }
    ],
    getStarted: "Get Started"
  },
  tr: {
    slides: [
      {
        title: "Booba Blip'e Hoş Geldiniz",
        description: "DeFi'nin geleceğine açılan kapınız. Bu heyecan verici inovasyon ve ödül yolculuğuna katılın.",
        highlight: "Vizyon • İnovasyon • Topluluk"
      },
      {
        title: "BBLIP Nedir?",
        description: "BBLIP token yakında TGE (Token Üretim Etkinliği) ile geliyor. Ön lansman fiyatı 0.07 USDT olarak belirlenmiş olup, kazanılan ödülleriniz bu değer üzerinden hesaplanmaktadır.",
        highlight: "Ön Lansman • TGE Yakında • 0.07 USDT"
      },
      {
        title: "Kazanç Yöntemleri ve Görevler",
        description: "Görevleri tamamlayın, etkinliklere katılın ve BBLIP varlığınızı artırın. Ödülleriniz BBLIP başına 0.07 USDT üzerinden hesaplanır.",
        highlight: "Günlük Görevler • Sosyal Aktiviteler • Ödüller"
      },
      {
        title: "VIP Kullanıcı Avantajları",
        description: "VIP kullanıcı olarak özel avantajlar ve geliştirilmiş ödüller kazanın. Özel erişim ve öncelikli faydalar sizi bekliyor.",
        highlight: "Özel Erişim • Geliştirilmiş Ödüller • Öncelikli Faydalar"
      }
    ],
    getStarted: "Başla"
  },
  hi: {
    slides: [
      {
        title: "बूबा ब्लिप में आपका स्वागत है",
        description: "DeFi के भविष्य का आपका गेटवे। इनोवेशन और रिवॉर्ड्स की इस रोमांचक यात्रा में शामिल हों।",
        highlight: "विजन • इनोवेशन • कम्युनिटी"
      },
      {
        title: "BBLIP क्या है?",
        description: "BBLIP टोकन जल्द ही TGE (टोकन जनरेशन इवेंट) के साथ आ रहा है। प्री-लॉन्च मूल्य $0.07 USDT निर्धारित है, जिससे आपके अर्जित रिवॉर्ड्स की गणना की जा सकती है।",
        highlight: "प्री-लॉन्च • TGE जल्द आ रहा है • $0.07 USDT"
      },
      {
        title: "कमाई के तरीके और टास्क",
        description: "टास्क पूरे करें, गतिविधियों में भाग लें और अपनी BBLIP होल्डिंग्स बढ़ाएं। आपके रिवॉर्ड्स की गणना $0.07 USDT प्रति BBLIP पर की जाती है।",
        highlight: "दैनिक टास्क • सोशल एक्टिविटीज • रिवॉर्ड्स"
      },
      {
        title: "VIP यूजर बेनिफिट्स",
        description: "VIP यूजर के रूप में एक्सक्लूसिव एडवांटेज और एन्हांस्ड रिवॉर्ड्स अनलॉक करें। स्पेशल एक्सेस और प्राथमिकता लाभ आपका इंतजार कर रहे हैं।",
        highlight: "एक्सक्लूसिव एक्सेस • एन्हांस्ड रिवॉर्ड्स • प्राथमिकता लाभ"
      }
    ],
    getStarted: "शुरू करें"
  },
  ru: {
    slides: [
      {
        title: "Добро пожаловать в Booba Blip",
        description: "Ваш путь в будущее DeFi. Присоединяйтесь к нашему захватывающему путешествию инноваций и вознаграждений.",
        highlight: "Видение • Инновации • Сообщество"
      },
      {
        title: "Что такое BBLIP?",
        description: "Токен BBLIP скоро появится с TGE (событием генерации токенов). Цена пре-запуска установлена на уровне $0.07 USDT, что позволяет рассчитывать ваши заработанные вознаграждения.",
        highlight: "Пре-запуск • TGE Скоро • $0.07 USDT"
      },
      {
        title: "Способы Заработка и Задания",
        description: "Выполняйте задания, участвуйте в активностях и увеличивайте ваши holdings BBLIP. Ваши вознаграждения рассчитываются по курсу $0.07 USDT за BBLIP.",
        highlight: "Ежедневные Задания • Социальные Активности • Награды"
      },
      {
        title: "Преимущества VIP Пользователей",
        description: "Разблокируйте эксклюзивные преимущества и повышенные вознаграждения как VIP пользователь. Вас ждут специальный доступ и приоритетные бонусы.",
        highlight: "Эксклюзивный Доступ • Повышенные Награды • Приоритетные Бонусы"
      }
    ],
    getStarted: "Начать"
  },
  th: {
    slides: [
      {
        title: "ยินดีต้อนรับสู่ Booba Blip",
        description: "ประตูสู่อนาคตของ DeFi เข้าร่วมการเดินทางที่น่าตื่นเต้นของนวัตกรรมและรางวัล",
        highlight: "วิสัยทัศน์ • นวัตกรรม • ชุมชน"
      },
      {
        title: "BBLIP คืออะไร?",
        description: "โทเค็น BBLIP กำลังจะมาพร้อมกับ TGE (Token Generation Event) ราคาก่อนเปิดตัวถูกกำหนดไว้ที่ $0.07 USDT ช่วยให้คำนวณรางวัลที่คุณได้รับ",
        highlight: "ก่อนเปิดตัว • TGE เร็วๆ นี้ • $0.07 USDT"
      },
      {
        title: "วิธีการรับรางวัลและภารกิจ",
        description: "ทำภารกิจให้สำเร็จ เข้าร่วมกิจกรรม และเพิ่มการถือครอง BBLIP ของคุณ รางวัลของคุณจะถูกคำนวณที่ $0.07 USDT ต่อ BBLIP",
        highlight: "ภารกิจประจำวัน • กิจกรรมทางสังคม • รางวัล"
      },
      {
        title: "สิทธิประโยชน์ผู้ใช้ VIP",
        description: "ปลดล็อกสิทธิพิเศษและรางวัลที่เพิ่มขึ้นในฐานะผู้ใช้ VIP การเข้าถึงพิเศษและสิทธิประโยชน์ที่มีความสำคัญกำลังรอคุณอยู่",
        highlight: "การเข้าถึงพิเศษ • รางวัลที่เพิ่มขึ้น • สิทธิประโยชน์ที่สำคัญ"
      }
    ],
    getStarted: "เริ่มต้น"
  },
  es: {
    slides: [
      {
        title: "Bienvenido a Booba Blip",
        description: "Tu puerta de entrada al futuro de DeFi. Únete a este emocionante viaje de innovación y recompensas.",
        highlight: "Visión • Innovación • Comunidad"
      },
      {
        title: "¿Qué es BBLIP?",
        description: "El token BBLIP llegará pronto con TGE (Evento de Generación de Tokens). El precio de pre-lanzamiento está fijado en $0.07 USDT, permitiendo el cálculo temprano de tus recompensas ganadas.",
        highlight: "Pre-Lanzamiento • TGE Próximamente • $0.07 USDT"
      },
      {
        title: "Métodos de Ganancia y Tareas",
        description: "Completa tareas, participa en actividades y aumenta tus holdings de BBLIP. Tus recompensas se calculan a $0.07 USDT por BBLIP.",
        highlight: "Tareas Diarias • Actividades Sociales • Recompensas"
      },
      {
        title: "Beneficios de Usuario VIP",
        description: "Desbloquea ventajas exclusivas y recompensas mejoradas como usuario VIP. Te esperan acceso especial y beneficios prioritarios.",
        highlight: "Acceso Exclusivo • Recompensas Mejoradas • Beneficios Prioritarios"
      }
    ],
    getStarted: "Comenzar"
  }
};

const SlideContainer = styled(Box)({
  height: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '24px',
  textAlign: 'center',
  color: 'white',
});

interface DotProps {
  active: boolean;
}

const NavigationContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '16px',
  marginTop: '32px',
});

const ProgressDots = styled(Box)({
  display: 'flex',
  gap: '8px',
  alignItems: 'center', // Align dots vertically with arrows
});

const Dot = styled(Box)<DotProps>(({ active }) => ({
  width: '8px',
  height: '8px',
  borderRadius: '50%',
  backgroundColor: active ? '#6ed3ff' : 'rgba(110, 211, 255, 0.3)',
  transition: 'all 0.3s ease',
}));

const NavigationButton = styled(IconButton)({
  color: '#6ed3ff',
  backgroundColor: 'rgba(110, 211, 255, 0.1)',
  '&:hover': {
    backgroundColor: 'rgba(110, 211, 255, 0.2)',
  },
});

const GetStartedButton = styled(Button)({
  backgroundColor: '#6ed3ff',
  color: '#1a2126',
  padding: '12px 32px',
  borderRadius: '12px',
  fontSize: '16px',
  fontWeight: 'bold',
  textTransform: 'none',
  marginTop: '32px',
  '&:hover': {
    backgroundColor: '#89d9ff',
  },
});

const OnboardingSlides: React.FC<OnboardingSlidesProps> = ({ onComplete }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [language, setLanguage] = useState<SupportedLanguages>('en');

  useEffect(() => {
    const userLang = window.Telegram?.WebApp?.initDataUnsafe?.user?.language_code as SupportedLanguages | undefined;
    if (userLang && Object.keys(content).includes(userLang)) {
      setLanguage(userLang);
    }
  }, []);

  const currentContent = content[language];
  const icons = [
    <WalletIcon sx={{ fontSize: 48, color: '#6ed3ff' }} />,
    <SwapHorizontalCircleIcon sx={{ fontSize: 48, color: '#6ed3ff' }} />,
    <TaskAltIcon sx={{ fontSize: 48, color: '#6ed3ff' }} />,
    <WalletIcon sx={{ fontSize: 48, color: '#6ed3ff' }} />
  ];

  const handleNext = () => {
    if (currentSlide === currentContent.slides.length - 1) {
      onComplete();
    } else {
      setCurrentSlide(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  return (
    <Box sx={{ overflow: 'hidden', height: '100vh' }}>
      <AnimatePresence initial={false} custom={currentSlide}>
        <motion.div
          key={currentSlide}
          custom={currentSlide}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%'
          }}
        >
          <SlideContainer>
            <Box sx={{ mb: 4 }}>
              {icons[currentSlide]}
            </Box>
            
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 2,
                fontWeight: 'bold',
                background: 'linear-gradient(90deg, #6ED3FF 0%, #89D9FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {currentContent.slides[currentSlide].title}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 2,
                color: 'rgba(255, 255, 255, 0.7)',
                maxWidth: '280px'
              }}
            >
              {currentContent.slides[currentSlide].description}
            </Typography>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#6ed3ff',
                opacity: 0.8
              }}
            >
              {currentContent.slides[currentSlide].highlight}
            </Typography>

            <Box sx={{ 
              position: 'fixed',
              bottom: 'env(safe-area-inset-bottom, 32px)',
              left: 0,
              right: 0,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              px: 3
            }}>
              <NavigationContainer mb={5}>
                <NavigationButton 
                  onClick={handlePrevious}
                  disabled={currentSlide === 0}
                >
                  <ArrowBackIcon />
                </NavigationButton>
                
                <ProgressDots>
                  {currentContent.slides.map((_: SlideContent, index: number) => (
                    <Dot key={index} active={currentSlide === index} />
                  ))}
                </ProgressDots>
                
                <NavigationButton onClick={handleNext}>
                  <ArrowForwardIcon />
                </NavigationButton>
              </NavigationContainer>

              {currentSlide === currentContent.slides.length - 1 && (
                <GetStartedButton
                  fullWidth
                  sx={{mb:5}}
                  onClick={onComplete}
                  variant="contained"
                >
                  {currentContent.getStarted}
                </GetStartedButton>
              )}
            </Box>
          </SlideContainer>
        </motion.div>
      </AnimatePresence>
    </Box>
  );
};

export default OnboardingSlides; 