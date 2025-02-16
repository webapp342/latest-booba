import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Coins, Target, Crown } from 'lucide-react';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import styled from '@emotion/styled';

type SupportedLanguages = 'en' | 'tr' | 'hi' | 'ru' | 'th' | 'es' | 'id';

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
        description: " Your gateway to the future of decentralized finance. Booba Blip is more than just a platform—it's an ecosystem driven by innovation, community, and rewarding opportunities.",
        highlight: "Vision • Innovation • Community"
      },
      {
        title: "What is BBLIP?",
        description: "BBLIP is the core utility token of the Booba Blip ecosystem, designed to power our platform and reward our users.",
        highlight: "Pre-Launch • TGE Coming Soon "
      },
      {
        title: "Earning Methods & Tasks",
        description: "Complete daily tasks, engage with the community, and earn BBLIP rewards. Your contributions are recognized, with rewards calculated at $0.07 USDT per BBLIP, ensuring transparent and fair distribution.",
        highlight: "Daily Engagement • Task-Based Rewards"
      },
      {
        title: "VIP User Benefits",
        description: "Elevate your experience with VIP membership and unlock premium features, enhanced rewards, and priority access to exclusive opportunities.",
        highlight: "Exclusive Access • Enhanced Rewards"
      }
    ],
    getStarted: "Get Started"
  },
  tr: {
    slides: [
      {
        title: "Booba Blip'e Hoş Geldiniz",
        description: "Merkeziyetsiz finansın geleceğine açılan kapınız. Booba Blip sadece bir platform değil - inovasyon, topluluk ve ödüllendirici fırsatlarla desteklenen bir ekosistemdir.",
        highlight: "Vizyon • İnovasyon • Topluluk"
      },
      {
        title: "BBLIP Nedir?",
        description: "BBLIP, Booba Blip ekosisteminin temel yardımcı tokenidir, platformumuzu güçlendirmek ve kullanıcılarımızı ödüllendirmek için tasarlanmıştır.",
        highlight: "Ön Lansman • TGE Yakında"
      },
      {
        title: "Kazanç Yöntemleri ve Görevler",
        description: "Ekosistemimize aktif olarak katılarak kazancınızı maksimuma çıkarın. Günlük görevleri tamamlayın, toplulukla etkileşime geçin ve BBLIP ödülleri kazanın. Katkılarınız tanınır, ödüller BBLIP başına 0.07 USDT üzerinden hesaplanır, şeffaf ve adil dağıtım sağlanır.",
        highlight: "Günlük Katılım • Görev Bazlı Ödüller • Topluluk Büyümesi"
      },
      {
        title: "VIP Kullanıcı Avantajları",
        description: "VIP üyelikle deneyiminizi yükseltin ve premium özelliklerin, geliştirilmiş ödüllerin ve özel fırsatlara öncelikli erişimin kilidini açın. VIP olarak, platform güncellemelerine erken erişim ve Booba Blip ekosisteminde özel ayrıcalıklar kazanırsınız.",
        highlight: "Özel Erişim • Geliştirilmiş Ödüller • Öncelikli Avantajlar"
      }
    ],
    getStarted: "Başla"
  },
  hi: {
    slides: [
      {
        title: "बूबा ब्लिप में आपका स्वागत है",
        description: "विकेंद्रीकृत वित्त के भविष्य का आपका प्रवेशद्वार। बूबा ब्लिप केवल एक प्लेटफॉर्म नहीं है - यह नवाचार, समुदाय और पुरस्कृत अवसरों से संचालित एक पारिस्थितिकी तंत्र है।",
        highlight: "दृष्टि • नवाचार • समुदाय"
      },
      {
        title: "BBLIP क्या है?",
        description: "BBLIP बूबा ब्लिप पारिस्थितिकी तंत्र का मुख्य उपयोगिता टोकन है, जो हमारे प्लेटफॉर्म को शक्ति प्रदान करने और हमारे उपयोगकर्ताओं को पुरस्कृत करने के लिए डिज़ाइन किया गया है।",
        highlight: "पूर्व-लॉन्च • TGE जल्द आ रहा है"
      },
      {
        title: "कमाई के तरीके और कार्य",
        description: "हमारे पारिस्थितिकी तंत्र में सक्रिय रूप से भाग लेकर अपनी कमाई को अधिकतम करें। दैनिक कार्यों को पूरा करें, समुदाय के साथ जुड़ें और BBLIP पुरस्कार अर्जित करें। आपके योगदान को मान्यता दी जाती है, पुरस्कारों की गणना प्रति BBLIP $0.07 USDT पर की जाती है, पारदर्शी और निष्पक्ष वितरण सुनिश्चित किया जाता है।",
        highlight: "दैनिक सहभागिता • कार्य-आधारित पुरस्कार • समुदाय विकास"
      },
      {
        title: "VIP उपयोगकर्ता लाभ",
        description: "VIP सदस्यता के साथ अपने अनुभव को बढ़ाएं और प्रीमियम सुविधाओं, बढ़े हुए पुरस्कारों और विशेष अवसरों तक प्राथमिकता पहुंच को अनलॉक करें। एक VIP के रूप में, आप प्लेटफॉर्म अपडेट्स तक जल्दी पहुंच और बूबा ब्लिप पारिस्थितिकी तंत्र में विशेष विशेषाधिकार प्राप्त करते हैं।",
        highlight: "विशेष पहुंच • बढ़े हुए पुरस्कार • प्राथमिकता लाभ"
      }
    ],
    getStarted: "शुरू करें"
  },
  ru: {
    slides: [
      {
        title: "Добро пожаловать в Booba Blip",
        description: "Ваш путь в будущее децентрализованных финансов. Booba Blip - это не просто платформа, это экосистема, движимая инновациями, сообществом и возможностями для вознаграждения.",
        highlight: "Видение • Инновации • Сообщество"
      },
      {
        title: "Что такое BBLIP?",
        description: "BBLIP - это основной утилитарный токен экосистемы Booba Blip, разработанный для поддержки нашей платформы и вознаграждения наших пользователей.",
        highlight: "Пре-запуск • TGE Скоро"
      },
      {
        title: "Способы Заработка и Задания",
        description: "Максимизируйте свой заработок, активно участвуя в нашей экосистеме. Выполняйте ежедневные задания, взаимодействуйте с сообществом и зарабатывайте награды BBLIP. Ваш вклад признается, награды рассчитываются по курсу $0.07 USDT за BBLIP, обеспечивая прозрачное и справедливое распределение.",
        highlight: "Ежедневное Участие • Награды за Задания • Рост Сообщества"
      },
      {
        title: "Преимущества VIP Пользователей",
        description: "Улучшите свой опыт с VIP-членством и получите доступ к премиум-функциям, повышенным наградам и приоритетному доступу к эксклюзивным возможностям. Как VIP-пользователь, вы получаете ранний доступ к обновлениям платформы и особые привилегии в экосистеме Booba Blip.",
        highlight: "Эксклюзивный Доступ • Повышенные Награды • Приоритетные Преимущества"
      }
    ],
    getStarted: "Начать"
  },
  th: {
    slides: [
      {
        title: "ยินดีต้อนรับสู่ Booba Blip",
        description: "ประตูสู่อนาคตของการเงินแบบกระจายศูนย์ Booba Blip ไม่ใช่แค่แพลตฟอร์ม แต่เป็นระบบนิเวศที่ขับเคลื่อนด้วยนวัตกรรม ชุมชน และโอกาสในการได้รับรางวัล",
        highlight: "วิสัยทัศน์ • นวัตกรรม • ชุมชน"
      },
      {
        title: "BBLIP คืออะไร?",
        description: "BBLIP คือโทเค็นหลักของระบบนิเวศ Booba Blip ที่ออกแบบมาเพื่อขับเคลื่อนแพลตฟอร์มของเราและให้รางวัลแก่ผู้ใช้ของเรา",
        highlight: "ก่อนเปิดตัว • TGE เร็วๆ นี้"
      },
      {
        title: "วิธีการรับรางวัลและภารกิจ",
        description: "เพิ่มรายได้ของคุณให้สูงสุดด้วยการมีส่วนร่วมในระบบนิเวศของเรา ทำภารกิจประจำวัน มีส่วนร่วมกับชุมชน และรับรางวัล BBLIP การมีส่วนร่วมของคุณได้รับการยอมรับ รางวัลคำนวณที่ $0.07 USDT ต่อ BBLIP รับประกันการกระจายที่โปร่งใสและยุติธรรม",
        highlight: "การมีส่วนร่วมประจำวัน • รางวัลตามภารกิจ • การเติบโตของชุมชน"
      },
      {
        title: "สิทธิประโยชน์ผู้ใช้ VIP",
        description: "ยกระดับประสบการณ์ของคุณด้วยสมาชิก VIP และปลดล็อกคุณสมบัติพรีเมียม รางวัลที่เพิ่มขึ้น และการเข้าถึงโอกาสพิเศษก่อนใคร ในฐานะ VIP คุณจะได้รับสิทธิ์เข้าถึงการอัปเดตแพลตฟอร์มก่อนใครและสิทธิพิเศษในระบบนิเวศ Booba Blip",
        highlight: "การเข้าถึงพิเศษ • รางวัลที่เพิ่มขึ้น • สิทธิประโยชน์ที่สำคัญ"
      }
    ],
    getStarted: "เริ่มต้น"
  },
  es: {
    slides: [
      {
        title: "Bienvenido a Booba Blip",
        description: "Tu puerta de entrada al futuro de las finanzas descentralizadas. Booba Blip no es solo una plataforma, es un ecosistema impulsado por la innovación, la comunidad y las oportunidades de recompensa.",
        highlight: "Visión • Innovación • Comunidad"
      },
      {
        title: "¿Qué es BBLIP?",
        description: "BBLIP es el token de utilidad principal del ecosistema Booba Blip, diseñado para potenciar nuestra plataforma y recompensar a nuestros usuarios.",
        highlight: "Pre-Lanzamiento • TGE Próximamente"
      },
      {
        title: "Métodos de Ganancia y Tareas",
        description: "Maximiza tus ganancias participando activamente en nuestro ecosistema. Completa tareas diarias, interactúa con la comunidad y gana recompensas BBLIP. Tus contribuciones son reconocidas, con recompensas calculadas a $0.07 USDT por BBLIP, asegurando una distribución transparente y justa.",
        highlight: "Participación Diaria • Recompensas por Tareas • Crecimiento Comunitario"
      },
      {
        title: "Beneficios de Usuario VIP",
        description: "Eleva tu experiencia con la membresía VIP y desbloquea características premium, recompensas mejoradas y acceso prioritario a oportunidades exclusivas. Como VIP, obtienes acceso anticipado a actualizaciones de la plataforma y privilegios especiales dentro del ecosistema Booba Blip.",
        highlight: "Acceso Exclusivo • Recompensas Mejoradas • Beneficios Prioritarios"
      }
    ],
    getStarted: "Comenzar"
  },
  id: {
    slides: [
      {
        title: "Selamat Datang di Booba Blip",
        description: "Gerbang Anda menuju masa depan keuangan terdesentralisasi. Booba Blip bukan sekadar platform—ini adalah ekosistem yang didorong oleh inovasi, komunitas, dan peluang yang menguntungkan.",
        highlight: "Visi • Inovasi • Komunitas"
      },
      {
        title: "Apa itu BBLIP?",
        description: "BBLIP adalah token utilitas inti dari ekosistem Booba Blip, dirancang untuk mendukung platform kami dan memberi penghargaan kepada pengguna kami.",
        highlight: "Pra-Peluncuran • TGE Segera Hadir"
      },
      {
        title: "Metode Penghasilan & Tugas",
        description: "Maksimalkan penghasilan Anda dengan berpartisipasi aktif dalam ekosistem kami. Selesaikan tugas harian, terlibat dengan komunitas, dan dapatkan hadiah BBLIP. Kontribusi Anda diakui, dengan hadiah dihitung pada $0.07 USDT per BBLIP, memastikan distribusi yang transparan dan adil.",
        highlight: "Keterlibatan Harian • Hadiah Berbasis Tugas • Pertumbuhan Komunitas"
      },
      {
        title: "Manfaat Pengguna VIP",
        description: "Tingkatkan pengalaman Anda dengan keanggotaan VIP dan buka fitur premium, hadiah yang ditingkatkan, dan akses prioritas ke peluang eksklusif. Sebagai VIP, Anda mendapatkan akses awal ke pembaruan platform dan hak istimewa khusus dalam ekosistem Booba Blip.",
        highlight: "Akses Eksklusif • Hadiah Ditingkatkan • Manfaat Prioritas"
      }
    ],
    getStarted: "Mulai"
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
  background: 'linear-gradient(180deg, rgba(26, 33, 38, 0.8) 0%, rgba(26, 33, 38, 1) 100%)',
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
  padding: '16px 40px',
  borderRadius: '12px',
  fontSize: '18px',
  fontWeight: 'bold',
  textTransform: 'none',
  marginTop: '32px',
  boxShadow: '0 4px 20px rgba(110, 211, 255, 0.3)',
  '&:hover': {
    backgroundColor: '#89d9ff',
    boxShadow: '0 4px 25px rgba(110, 211, 255, 0.4)',
  },
});

const IconWrapper = styled(motion.div)({
  width: '80px',
  height: '80px',
  borderRadius: '24px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: '32px',
  background: 'linear-gradient(135deg, rgba(110, 211, 255, 0.2) 0%, rgba(110, 211, 255, 0.1) 100%)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(110, 211, 255, 0.1)',
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
  const iconVariants = {
    hidden: { scale: 0, rotate: -180, opacity: 0 },
    visible: { 
      scale: 1, 
      rotate: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        duration: 0.8,
        bounce: 0.4
      }
    },
    hover: {
      scale: 1.1,
      rotate: [0, -10, 10, -10, 0],
      transition: {
        duration: 0.3
      }
    }
  };

  const icons = [
    <Rocket size={40} strokeWidth={1.5} color="#6ed3ff" />,
    <Coins size={40} strokeWidth={1.5} color="#6ed3ff" />,
    <Target size={40} strokeWidth={1.5} color="#6ed3ff" />,
    <Crown size={40} strokeWidth={1.5} color="#6ed3ff" />
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
            <IconWrapper
              initial="hidden"
              animate="visible"
              whileHover="hover"
              variants={iconVariants}
            >
              {icons[currentSlide]}
            </IconWrapper>
            
            <Typography 
              variant="h4" 
              sx={{ 
                mb: 3,
                fontWeight: 'bold',
                fontSize: '28px',
                background: 'linear-gradient(90deg, #6ED3FF 0%, #89D9FF 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 2px 10px rgba(110, 211, 255, 0.2)'
              }}
            >
              {currentContent.slides[currentSlide].title}
            </Typography>
            
            <Typography 
              variant="body1" 
              sx={{ 
                mb: 3,
                color: 'rgba(255, 255, 255, 0.8)',
                maxWidth: '320px',
                lineHeight: 1.6,
                fontSize: '16px'
              }}
            >
              {currentContent.slides[currentSlide].description}
            </Typography>
            
            <Typography 
              variant="caption" 
              sx={{ 
                color: '#6ed3ff',
                opacity: 0.9,
                fontSize: '14px',
                fontWeight: 500,
                padding: '8px 16px',
                borderRadius: '8px',
                background: 'rgba(110, 211, 255, 0.1)',
                backdropFilter: 'blur(5px)'
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
              {currentSlide !== currentContent.slides.length - 1 ? (
                <NavigationContainer mb={5}>
                  <NavigationButton 
                    onClick={handlePrevious}
                    disabled={currentSlide === 0}
                    sx={{
                      width: '48px',
                      height: '48px',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    <ArrowBackIcon />
                  </NavigationButton>
                  
                  <ProgressDots>
                    {currentContent.slides.map((_: SlideContent, index: number) => (
                      <Dot key={index} active={currentSlide === index} />
                    ))}
                  </ProgressDots>
                  
                  <NavigationButton 
                    onClick={handleNext}
                    sx={{
                      width: '48px',
                      height: '48px',
                      backdropFilter: 'blur(5px)'
                    }}
                  >
                    <ArrowForwardIcon />
                  </NavigationButton>
                </NavigationContainer>
              ) : (
                <GetStartedButton
                  fullWidth
                  sx={{ 
                    mb: 5,
                    maxWidth: '320px'
                  }}
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