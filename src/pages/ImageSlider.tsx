import './slide.css';
import { Slide } from 'react-slideshow-image';
import 'react-slideshow-image/dist/styles.css';
import { Box, Button, Typography } from '@mui/material';
import { FaArrowRight, FaArrowLeft } from 'react-icons/fa';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom'; // Import the useNavigate hook
import { WithTourSection } from '../components/TourGuide/withTourSection';

// lucky games
import image1 from '../assets/206379314452739466.webp';
import image2 from '../assets/244073626002791007.webp';
import image3 from '../assets/39139874052580260.webp';
import image4 from '../assets/869723626719832237.webp';
import image46 from '../assets/a3270184c0bef5474fa983-Darkcard288144.webp';
import image47 from  '../assets/55625b662b95f9508840f7-allbrandscard288144-6.webp';


import image5 from '../assets/inout.plinko.png';
import image6 from '../assets/inout.new-double.png';
import image7 from '../assets/inout.keno.jpg';
import image8 from '../assets/inout.hot-mines.jpg';
import image9 from '../assets/inout.diver.png';
import image10 from '../assets/inout.battle-trades.jpg';
import image11 from '../assets/inout.stairs.jpg';
import image12 from '../assets/inout.joker-poker.jpg';
import image13 from '../assets/inout.tower.png';
//live games
import image14 from '../assets/livegames/pragmatic.101.png';
import image15 from '../assets/livegames/pragmatic.240.jpg';
import image16 from '../assets/livegames/pragmatic.528.jpg';
import image17 from '../assets/livegames/pragmatic.801.png';
import image18 from '../assets/livegames/softswiss.evolution-VIPDiamond.jpg';
import image19 from '../assets/livegames/softswiss.evolution-cashorcrash.jpg';
import image20 from '../assets/livegames/softswiss.evolution-crazytimea.jpg';
import image21 from '../assets/livegames/softswiss.evolution-megaball.jpg';
import image22 from '../assets/livegames/softswiss.evolution-monopoly.jpg';
//bonus buy
import image23 from '../assets/bonusbuy/pragmatic.vs20emptybank.jpg';
import image24 from '../assets/bonusbuy/pragmatic.vs25hotfiesta.jpg';
import image25 from '../assets/bonusbuy/softswiss.1spin4win-10LuckySpins.jpg';
import image26 from '../assets/bonusbuy/softswiss.1spin4win-GoldenJoker27HoldAndWin.jpg';
import image27 from '../assets/bonusbuy/softswiss.booming-WildWildVegas.jpg';
import image28 from  '../assets/bonusbuy/softswiss.highfive-MoneyMayHam.jpg';
import image29 from '../assets/bonusbuy/softswiss.nolimit-Deadwood1.jpg';
import image30 from '../assets/bonusbuy/softswiss.nolimit-MentalDX1.jpg';
import image31 from '../assets/bonusbuy/softswiss.softswiss-GoldRushWithJohnny.jpg';
//instant win
import image32 from '../assets/instantwin/pragmatic.1301.jpg';
import image33 from '../assets/instantwin/softswiss.onlyplay-LimboCat.jpg';
import image34 from '../assets/instantwin/softswiss.onlyplay-NeedforX.jpg';
import image35 from '../assets/instantwin/softswiss.platipus-2500xrush.jpg';
import image36 from '../assets/instantwin/softswiss.smartsoft-Balloon.jpg';
import image37 from '../assets/instantwin/softswiss.smartsoft-FootballX.jpg';
import image38 from  '../assets/instantwin/softswiss.softswiss-SpaceXY.jpg';
//jackpots
import image39 from '../assets/jackpots/softswiss.belatra-TheMoneymania.png';
import image40 from '../assets/jackpots/softswiss.platipus-jackpotlab.jpg';
import image41 from '../assets/jackpots/softswiss.quickfire-MGS_CashSplash5Reel.jpg';
import image42 from '../assets/jackpots/softswiss.quickfire-MGS_HTML5_FortuniumGoldMegaMoolah.jpg';
import image43 from '../assets/jackpots/softswiss.quickfire-MGS_queenOfAlexandriaWowpot.jpg';
import image44 from '../assets/jackpots/softswiss.yggdrasil-Holmes.jpg';
import image45 from  '../assets/jackpots/softswiss.yggdrasil-OzwinsJackpots.jpg';
import ImageRow from './ImageRow';


const theme = createTheme({
  typography: {
    fontFamily: 'monospace', // Default font family
  },
});


const NavigateButton = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/slot');
  };

  return <Button sx={{backgroundColor:'#b4e6ff',color:'black', left:32, width:'41vw'}} onClick={handleClick}>Play Now</Button>;
};

//lucky games 
const images1 = [
  {src: image9,description: <NavigateButton /> , description2: ""},  
  { src: image5, description: "Plinko ", description2: "Coming Soon" },
  { src: image6, description: "Double" , description2: "Coming Soon"},
  { src: image7, description: "Sweet Keno" , description2: "Coming Soon"},
  { src: image8, description: "Hot Mines" , description2: "Coming Soon"},
  { src: image10, description: "Battle Trades" , description2: "Coming Soon"},
  { src: image11, description: "Stairs" , description2: "Coming Soon"},
  { src: image12, description: "Joker Poker" , description2: "Coming Soon"},
  { src: image13, description: "Tower" , description2: "Coming Soon"}
];
//live games

const images2 = [
      { src: image22, description: "Monopoly Live" , description2: "Coming Soon"},

  {src: image14,  description: "Casino Lobby", description2: "Coming Soon"},  
  { src: image15, description: "Roulette", description2: "Coming Soon" },
  { src: image16, description: "BlackJack" , description2: "Coming Soon"},
  { src: image17, description: "Mega Wheel" , description2: "Coming Soon"},
  { src: image18, description: "Vip Diamond" , description2: "Coming Soon"},
  { src: image19, description: "Cash or Crash" , description2: "Coming Soon"},
   { src: image20, description: "Crazy Time" , description2: "Coming Soon"},
  { src: image21, description: "Mega Ball" , description2: "Coming Soon"},
 
];
//bonus buy
const images3 = [
      { src: image23 ,description: "Empty the Bank" , description2: "Coming Soon"},

  {src: image24,  description: "Hot Fiesta", description2: "Coming Soon"},  
  { src: image25, description: "10 Lucky Spins", description2: "Coming Soon" },
  { src: image26, description: "Golden Joker 27" , description2: "Coming Soon"},
  { src: image27, description: "Wild Wild" , description2: "Coming Soon"},
  { src: image28, description: "Money Mayham" , description2: "Coming Soon"},
  { src: image29, description: "Dead Wood" , description2: "Coming Soon"},
   { src: image30, description: "Mental" , description2: "Coming Soon"},
  { src: image31, description: "Gold Rush" , description2: "Coming Soon"},
 
];
//instant win
const images4 = [
  { src: image32 ,description: "Spaceman" , description2: "Coming Soon"},
  {src: image33,  description: "Limbo Cat", description2: "Coming Soon"},  
  { src: image34, description: "Need for X", description2: "Coming Soon" },
  { src: image35, description: "2500x Rush" , description2: "Coming Soon"},
  { src: image36, description: "Balloon" , description2: "Coming Soon"},
  { src: image37, description: "Football X" , description2: "Coming Soon"},
  { src: image38, description: "Space XY" , description2: "Coming Soon"},

 
];

//jackpots
const images5 = [
  { src: image39 ,description: "Money Mania" , description2: "Coming Soon"},
  {src: image40,  description: "Jackpot LAB", description2: "Coming Soon"},  
  { src: image41, description: "Cash Splash", description2: "Coming Soon" },
  { src: image42, description: "Fortunium" , description2: "Coming Soon"},
  { src: image43, description: "Queen of Alexandria" , description2: "Coming Soon"},
  { src: image44, description: "Holmes" , description2: "Coming Soon"},
  { src: image45, description: "Ozwins JACKPOT" , description2: "Coming Soon"},

 
];




// Define the images array
const images: { src: string, text: string, additionalText1: string, additionalText2: string }[] = [

    { src: image1, text: "Clucking Spins", additionalText1: "Weekly 35,000 ", additionalText2: "Free Spins" },
    { src: image2, text: "Weekly Cashback", additionalText1: "Up To", additionalText2: "25% Cashback" },
            { src: image47, text: "50% Highroller Bonus", additionalText1: "Daily Bronze Tournament", additionalText2: "$2,500" },

    { src: image3, text: "Winterfest VIP Tournament", additionalText1: "$150,000", additionalText2: "Special Event" },
    { src: image4, text: "100% Highroller Bonus", additionalText1: "up to $750", additionalText2: "Deposit Now" },
    { src: image46, text: "100% Welcome Bonus", additionalText1: "Launch Special", additionalText2: "Up to 75 TON" },

];

const Example: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <WithTourSection sectionId="games-section">
            <Box mt={"7vh"} sx={{                  
}} mx={1} borderRadius={5} overflow="hidden">
                <Box>
                <Slide 
                    nextArrow={
                        <Button 
                            style={{
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: 'none',
                                borderRadius: 15,
                                width: '10vw',
                                height: '10vw',
                                position: 'absolute', 
                                bottom: '3vh',
                                right: '1vw',
                                transform: 'translateY(50%)',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.3s, transform 0.3s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                        >
                            <FaArrowRight size={20} color="black" />
                        </Button>
                    } 
                    prevArrow={
                        <Button 
                            style={{
                                background: 'rgba(255, 255, 255, 0.5)',
                                border: 'none',
                                borderRadius: 15,
                                width: '10vw',
                                height: '10vw',
                                position: 'absolute',
                                bottom: '3vh',
                                left: '1vw',
                                transform: 'translateY(50%)',
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
                                display: 'flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                cursor: 'pointer',
                                transition: 'background 0.3s, transform 0.3s',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.8)'}
                            onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255, 255, 255, 0.5)'}
                        >
                            <FaArrowLeft size={20} color="black" />
                        </Button>
                    } 
                >
                    {images.map((image, index) => (
                        <Box key={index} className="each-slide-effect"  position="relative">
                            <Box
                                minHeight={'200px'}
                                
                                width={'100vh'}
                                style={{ backgroundImage: `url(${image.src})`, backgroundSize: 'cover', backgroundPosition: 'center',  }}
                            />
                            {/* Text on top of the image */}
                            <Typography
                                variant="subtitle2"
                                color="white"
                                position="absolute"
                                bottom={140}
                                left={20}
                                style={{
                                    backgroundColor: 'rgba(71, 70, 70, 0.5)',  // Semi-transparent black background
                                    padding: '0px 10px',
                                    borderRadius: '5px'
                                }}
                            >
                                {image.text}
                            </Typography>
                            {/* First additional text */}
                            <Typography
                                variant="h6"
                                color="white"
                                position="absolute"
                                bottom={83}
                                left={20}
                                fontWeight="bold"
                                 style={{
                                    backgroundColor: 'rgba(71, 70, 70, 0.5)',  // Semi-transparent black background
                                    padding: '0px 6px',
                                    borderRadius: '5px'
                                }}
                            >
                                {image.additionalText1}
                            </Typography>
                            {/* Second additional text */}
                            <Typography
                                variant="body1"
                                color="black"
                                px={1}
                                textAlign={'center'}
                                position="absolute"
                                bottom={55}
                                left={20}
                                fontWeight="normal"
                                style={{
                                    backgroundColor: 'rgb(247, 243, 11)',  // Semi-transparent black background
                                    borderRadius: '5px'
                                }}
                            >
                                {image.additionalText2}
                            </Typography>
                        </Box>
                    ))}
                </Slide>
                </Box>

              

       <Box mt={4}>

        <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
           <Typography p={1} fontSize={'1.5rem'}>
    Lucky Games
  </Typography>


   <Typography p={1} fontSize={'1rem'} sx={{color:"#b4e6ff",}}>
    See all
  </Typography>

        </Box>
 

  {/* Top Games Section */}
  <Box
    mt={3}
    display="flex"
    sx={{
      overflowX: 'auto', // Use sx prop for overflow
      width: '100%', // Takes up 90% width of the container
      margin: '0 auto',
      padding: 1,
      borderRadius: 2,
    }}
    component="div" // Added component prop to specify the HTML element type
  >
    {images1.map((image, idx) => (
      <Box
        key={idx}
        borderRadius={2}
        marginRight={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column" // Arrange image and description vertically
        style={{
          textAlign: 'center', // Center align text
          cursor: 'pointer',
        }}
      >
        {/* Image */}
        <Box
          p={10}
          borderRadius={2}
          sx={{
            backgroundSize: 'cover',
            backgroundImage: `url(${image.src})`, // Assign different image to each box
            backgroundPosition: 'center',
          }}
        />

        {/* Description under the image */}
        {typeof image.description === 'string' ? (
          <Typography
            variant="body2"
            pt={1}
            color="white"
            sx={{
              textAlign: 'left',
              fontWeight:'bold',
              alignSelf: 'flex-start', // Align text to the start of the container
            }}
          >
            {image.description}
          </Typography>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center', // Center the button horizontally
              alignItems: 'center', // Center the button vertically
              width: '100%',
              ml: -8,
              marginTop: '8px',
            }}
          >
            {image.description}
          </Box>
        )}

        <Typography
          variant="body2"
          color="grey"
          sx={{
            textAlign: 'left',
            alignSelf: 'flex-start', // Align text to the start of the container
          }}
        >
          {image.description2}
        </Typography>
      </Box>
    ))}
  </Box>
</Box>

 <Box>
    
              <Box mt={4}>
  

  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
           <Typography p={1} fontSize={'1.5rem'}>
    Live Games
  </Typography>


   <Typography p={1} fontSize={'1rem'} sx={{color:"#b4e6ff",}}>
    See all
  </Typography>

        </Box>

  {/* Top Games Section */}
  <Box
    mt={3}
    display="flex"
    sx={{
      overflowX: 'auto', // Use sx prop for overflow
      width: '100%', // Takes up 90% width of the container
      margin: '0 auto',
      padding: 1,
      borderRadius: 2,
    }}
    component="div" // Added component prop to specify the HTML element type
  >
    {images2.map((image, idx) => (
      <Box
        key={idx}
        width="60vw"
        
        borderRadius={2}
        marginRight={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column" // Arrange image and description vertically
        style={{
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        {/* Image */}
        <Box
          p={10}
                  borderRadius={2}
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url(${image.src})`, // Assign different image to each box
            backgroundPosition: 'center',
          }}
        />
        
        {/* Description under the image */}
        {/* Description under the image */}
        <Typography   sx={{
              textAlign: 'left',
              fontWeight:'bold',
              alignSelf: 'flex-start', // Align text to the start of the container
            }}  variant="body2" fontWeight={'bold'}  pt={1} color="white">
          {image.description}
        </Typography>

        <Typography   sx={{
              textAlign: 'left',
              fontWeight:'bold',
              alignSelf: 'flex-start', // Align text to the start of the container
            }} variant="body2"    color="grey">
          {image.description2}
        </Typography>
      </Box>
 
    ))}
  </Box>
</Box>

 </Box>


              <Box mt={4}>



  <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
           <Typography p={1} fontSize={'1.5rem'}>
    Bonus Buy
  </Typography>


   <Typography p={1} fontSize={'1rem'} sx={{color:"#b4e6ff",}}>
    See all
  </Typography>

        </Box>

  {/* Top Games Section */}
  <Box
    mt={3}
    display="flex"
    sx={{
      overflowX: 'auto', // Use sx prop for overflow
      width: '100%', // Takes up 90% width of the container
      margin: '0 auto',
      padding: 1,
      borderRadius: 2,
    }}
    component="div" // Added component prop to specify the HTML element type
  >
    {images3.map((image, idx) => (
      <Box
        key={idx}
        width="60vw"
        
        borderRadius={2}
        marginRight={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column" // Arrange image and description vertically
        style={{
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        {/* Image */}
        <Box
          p={10}
                  borderRadius={2}
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url(${image.src})`, // Assign different image to each box
            backgroundPosition: 'center',
          }}
        />
        
        {/* Description under the image */}
         {/* Description under the image */}
        <Typography   sx={{
              textAlign: 'left',
              fontWeight:'bold',
              alignSelf: 'flex-start', // Align text to the start of the container
            }}  variant="body2" fontWeight={'bold'}  pt={1} color="white">
          {image.description}
        </Typography>

        <Typography sx={{
              textAlign: 'left',
              fontWeight:'bold',
              alignSelf: 'flex-start', // Align text to the start of the container
            }}  variant="body2"    color="grey">
          {image.description2}
        </Typography>
        
      </Box>
 
    ))}
  </Box>
</Box>


              <Box mt={4}>


 

    <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
           <Typography p={1} fontSize={'1.5rem'}>
    Instant Win
  </Typography>


   <Typography p={1} fontSize={'1rem'} sx={{color:"#b4e6ff",}}>
    See all
  </Typography>

        </Box>

  {/* Top Games Section */}
  <Box
    mt={3}
    display="flex"
    sx={{
      overflowX: 'auto', // Use sx prop for overflow
      width: '100%', // Takes up 90% width of the container
      margin: '0 auto',
      padding: 1,
      borderRadius: 2,
    }}
    component="div" // Added component prop to specify the HTML element type
  >
    {images4.map((image, idx) => (
      <Box
        key={idx}
        width="60vw"
        
        borderRadius={2}
        marginRight={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column" // Arrange image and description vertically
        style={{
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        {/* Image */}
        <Box
          p={10}
                  borderRadius={2}
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url(${image.src})`, // Assign different image to each box
            backgroundPosition: 'center',
          }}
        />
        
        {/* Description under the image */}
         {/* Description under the image */}
        <Typography   sx={{
              textAlign: 'left',
              fontWeight:'bold',
              alignSelf: 'flex-start', // Align text to the start of the container
            }} variant="body2" fontWeight={'bold'}  pt={1} color="white">
          {image.description}
        </Typography>

        <Typography   sx={{
              textAlign: 'left',
              fontWeight:'bold',
              alignSelf: 'flex-start', // Align text to the start of the container
            }} variant="body2"    color="grey">
          {image.description2}
        </Typography>
        
      </Box>
 
    ))}
  </Box>
</Box>



              <Box mt={4}>
 


   <Box display={'flex'} justifyContent={'space-between'} alignItems={'center'}>
           <Typography p={1} fontSize={'1.5rem'}>
    Jackpots
  </Typography>


   <Typography p={1} fontSize={'1rem'} sx={{color:"#b4e6ff",}}>
    See all
  </Typography>

        </Box>

  {/* Top Games Section */}
  <Box
    mt={3}
    display="flex"
    sx={{
      overflowX: 'auto', // Use sx prop for overflow
      width: '100%', // Takes up 90% width of the container
      margin: '0 auto',
      padding: 1,
      borderRadius: 2,
    }}
    component="div" // Added component prop to specify the HTML element type
  >
    {images5.map((image, idx) => (
      <Box
        key={idx}
        width="60vw"
        
        borderRadius={2}
        marginRight={1}
        display="flex"
        justifyContent="center"
        alignItems="center"
        flexDirection="column" // Arrange image and description vertically
        style={{
          textAlign: 'center',
          cursor: 'pointer',
        }}
      >
        {/* Image */}
        <Box
          p={10}
                  borderRadius={2}
          style={{
            backgroundSize: 'cover',
            backgroundImage: `url(${image.src})`, // Assign different image to each box
            backgroundPosition: 'center',
          }}
        />
        
        {/* Description under the image */}
         {/* Description under the image */}
        <Typography   sx={{
              textAlign: 'left',
              fontWeight:'bold',
              alignSelf: 'flex-start', // Align text to the start of the container
            }} variant="body2" fontWeight={'bold'}  pt={1} color="white">
          {image.description}
        </Typography>

        <Typography   sx={{
              textAlign: 'left',
              fontWeight:'bold',
              alignSelf: 'flex-start', // Align text to the start of the container
            }} variant="body2"    color="grey">
          {image.description2}
        </Typography>
        
      </Box>
 
    ))}
  </Box>
</Box>



  <Box>
                    <ImageRow />
                </Box>


              
            </Box>


            
        </WithTourSection>
        </ThemeProvider>
    );
};

export default Example;
