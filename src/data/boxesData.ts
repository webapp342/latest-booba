import { BoxData } from '../types/boxes';

// Box cover images
import alienwareBoxImage from '../assets/boxes/ALIENWARE.png';
import amazonBoxImage from '../assets/boxes/Amazon.png';
import landRoverBoxImage from '../assets/boxes/06_LANDROVER-Box-mock_box_1_pmWxJoo.png';
import rolexSubmarinerBoxImage from '../assets/boxes/06_ROLEX_SUBMARINER-Box-mock_box_HyKP6Wz.png';
import donaldTrumpBoxImage from '../assets/boxes/06-DONALD_TRUMP-Box-mock_box_1_Mtw3P4X.png';
import rolexYachtmasterBoxImage from '../assets/boxes/07_ROLEX_YACHTMASTER-Box-mock_box_1_AWKQOtA.png';
import rolexBoxImage from '../assets/boxes/19_ROLEX-Box-mock_box_Mf79Eyz.png';
import bbcBoxImage from '../assets/boxes/21-BBC-Box-mock_box_1_PJXKvVL.png';
import chanelBoxImage from '../assets/boxes/22-CHANEL-Box-mock_box_1_LJJWWSE.png';
import jordanBoxImage from '../assets/boxes/JORDAN_EXCLUSIVE-mock_box_aQCGLp6.png';
import louisVuittonBoxImage from '../assets/boxes/LOUIS_VUITTON-Deluxe-mock_box.png';
import winterBoxImage from '../assets/boxes/newwintererrer_OPdiwGJ.png';
import bmwBoxImage from '../assets/boxes/05-BMW-Box-mock_box_1_tcGgWnJ.png';
import primeBoxImage from '../assets/boxes/PRIME-Box-BLUE-mock_box_1_1_i1bhp4C.png';
import sneakersBoxImage from '../assets/boxes/SNEAKERS-Box-mock_box_1_1_XJ6yoyi.png';
import wolfBoxImage from '../assets/boxes/The-Wolf-of-Wall-Street_tRg4lgr.png';
import ufcBoxImage from '../assets/boxes/UFC_2_1_Qr3aLhG.png';
import victoriaBoxImage from '../assets/boxes/Victorias-Secret_X2kHKwy.png';
import rolexDaytonaBoxImage from '../assets/boxes/01_ROLEX_DAYTONA-Box-mock_box_tgFf3C6.png';
import corsairBoxImage from '../assets/boxes/02-CORSAIR-Box-mock_box_1_9ex9nau.png';
import versaceBoxImage from '../assets/boxes/02-VERSACE-Box-mock_box_1_Eh0sKbn.png';
import fortniteBoxImage from '../assets/boxes/03-FORTNITE-Box-mock_box_1_UANiWgs.png';
import rollsRoyceBoxImage from '../assets/boxes/04_ROLLS_ROYCE-Box-mock_box_lEnAQxE.png';
import footballBoxImage from '../assets/boxes/08_FOOTBALL_FRENZY-Box-mock_box_xTGy6uS.png';
import maseratiBoxImage from '../assets/boxes/09_MASERATI-Box-mock_box_nNGuE9m.png';
import mercedesBoxImage from '../assets/boxes/09_MERCEDES-Box-mock_box_YrkBf6x.png';
import topgBoxImage from '../assets/boxes/09-TOPG-Box-mock_box_1_DYOk6ka.png';
import porscheBoxImage from '../assets/boxes/11_PORSCHE-Box-mock_box_GsB1OjI.png';
import ferrariBoxImage from '../assets/boxes/12_FERRARI-Box-mock_box_1_gxu1E5e.png';
import rolexDayDateBoxImage from '../assets/boxes/15_DAY_DATE_VS_DAYJUST-Box-mock_box_1_APubmFH.png';
import ralphLaurenBoxImage from '../assets/boxes/15-RALPH_LAUREN-Box-mock_box_U3Pc619.png';
import oldMoneyBoxImage from '../assets/boxes/28_OLD_MONEY-Box-mock_box_1_NbdcPuo.png';
import appleBoxImage from '../assets/boxes/APPLE-Budget-mock_box_1_1_BNZNwNg.png';
import barbieBoxImage from '../assets/boxes/Barbie_1_JgeLffJ.png';
import cartierBoxImage from '../assets/boxes/Cartier_lC54zo9.png';
import diamondBoxImage from '../assets/boxes/Diamond-Vault_1_rL3pUUO.png';
import hublotBoxImage from '../assets/boxes/Hublot_wua9Wr6.png';
import highRollerBoxImage from '../assets/boxes/05_HIGH_ROLLER-Box-mock_box_bxw602J.png';

// Box item images
import alienwareRemoval740 from '../assets/boxes/ALIENWARE/Removal-740_2_1_1.png';
import alienwareRemoval204 from '../assets/boxes/ALIENWARE/Removal-204_1.png';
import alienwareRemoval669 from '../assets/boxes/ALIENWARE/Removal-669_1_1.png';
import alienwareRemoval431 from '../assets/boxes/ALIENWARE/Removal-431_1.png';
import alienwareRemoval469 from '../assets/boxes/ALIENWARE/Removal-469_1.png';

import amazonSMX110 from '../assets/boxes/Amazon/SM-X110NZSEEUB_1_1.png';
import amazonRemoval527 from '../assets/boxes/Amazon/Removal-527_2_1_1.png';
import amazonRemoval8f26 from '../assets/boxes/Amazon/removal.ai_8f2627b9-be53-448e-84af-51339a04d303-image_1.png';
import amazonRemoval336 from '../assets/boxes/Amazon/Removal-336_2_1.png';
import amazonRemovald736 from '../assets/boxes/Amazon/removal.ai_d73686ad-d090-4849-93ab-6fecdb72f9da-image.png';



export const boxesData: Record<string, BoxData> = {
  'alienware': {
    title: 'ALIENWARE',
    image: alienwareBoxImage,
    description: 'Gaming gear from Alienware',
    normalPrice: '16.89',
    salePrice: '14.49',
    drops: [
      { name: 'Alienware Aurora R15', image: alienwareRemoval740, price: '2499.99', rarity: 0.0003, code: 'AW0001' },
      { name: 'Alienware 34" QD-OLED', image: alienwareRemoval204, price: '1299.99', rarity: 0.0089, code: 'AW0002' },
      { name: 'Alienware Pro Wireless', image: alienwareRemoval669, price: '249.99', rarity: 0.0456, code: 'AW0003' },
      { name: 'Alienware Mechanical KB', image: alienwareRemoval431, price: '179.99', rarity: 0.0845, code: 'AW0004' },
      { name: 'Alienware Backpack', image: alienwareRemoval469, price: '89.99', rarity: 0.000567, code: 'AW0005' }
    ]
  },
  'amazon': {
    title: 'Amazon',
    image: amazonBoxImage,
    description: 'Amazon mystery box with various items',
    normalPrice: '10.49',
    salePrice: '8.89',
    drops: [
      { name: 'Samsung Galaxy Tab S9', image: amazonSMX110, price: '899.99', rarity: 0.0006, code: 'AM0001' },
      { name: 'Apple AirPods Pro', image: amazonRemoval527, price: '249.99', rarity: 0.0078, code: 'AM0002' },
      { name: 'Echo Show 10', image: amazonRemoval8f26, price: '149.99', rarity: 0.0567, code: 'AM0003' },
      { name: 'Kindle Paperwhite', image: amazonRemoval336, price: '139.99', rarity: 0.0923, code: 'AM0004' },
      { name: 'Fire TV Stick 4K', image: amazonRemovald736, price: '49.99', rarity: 0.1789, code: 'AM0005' }
    ]
  },
  'landrover': {
    title: 'Land Rover',
    image: landRoverBoxImage,
    description: 'Luxury SUV themed box with exclusive Land Rover items',
    normalPrice: '199.99',
    salePrice: '169.99',
    drops: [
      { name: 'Land Rover Experience Day', image: landRoverBoxImage, price: '1500.00', rarity: 10.5, code: 'LR0001' },
      { name: 'Land Rover Leather Jacket', image: landRoverBoxImage, price: '800.00', rarity: 20.5, code: 'LR0002' },
      { name: 'Land Rover Watch', image: landRoverBoxImage, price: '500.00', rarity: 30.5, code: 'LR0003' },
      { name: 'Land Rover Luggage Set', image: landRoverBoxImage, price: '400.00', rarity: 40.5, code: 'LR0004' },
      { name: 'Land Rover Scale Model', image: landRoverBoxImage, price: '200.00', rarity: 50.5, code: 'LR0005' }
    ]
  },
  'rolex-submariner': {
    title: 'Rolex Submariner',
    image: rolexSubmarinerBoxImage,
    description: 'Luxury diving watch themed box',
    normalPrice: '299.99',
    salePrice: '249.99',
    drops: [
      { name: 'Rolex Submariner Watch', image: rolexSubmarinerBoxImage, price: '15000.00', rarity: 10.5, code: 'RS0001' },
      { name: 'Diving Equipment Set', image: rolexSubmarinerBoxImage, price: '5000.00', rarity: 20.5, code: 'RS0002' },
      { name: 'Luxury Watch Box', image: rolexSubmarinerBoxImage, price: '1000.00', rarity: 30.5, code: 'RS0003' },
      { name: 'Watch Service Kit', image: rolexSubmarinerBoxImage, price: '500.00', rarity: 40.5, code: 'RS0004' },
      { name: 'Rolex Catalog Collection', image: rolexSubmarinerBoxImage, price: '200.00', rarity: 50.5, code: 'RS0005' }
    ]
  },
  'donald-trump': {
    title: 'Donald Trump',
    image: donaldTrumpBoxImage,
    description: 'Political memorabilia box',
    normalPrice: '49.99',
    salePrice: '39.99',
    drops: [
      { name: 'Signed MAGA Hat', image: donaldTrumpBoxImage, price: '500.00', rarity: 0.00789, code: 'DT0001' },
      { name: 'Commemorative Coin Set', image: donaldTrumpBoxImage, price: '300.00', rarity: 0.00089, code: 'DT0002' },
      { name: 'Campaign Poster Collection', image: donaldTrumpBoxImage, price: '200.00', rarity: 0.1089, code: 'DT0003' },
      { name: 'Trump Playing Cards', image: donaldTrumpBoxImage, price: '100.00', rarity: 0.489, code: 'DT0004' },
      { name: 'Political Pin Set', image: donaldTrumpBoxImage, price: '50.00', rarity: 0.1789, code: 'DT0005' }
    ]
  },
  'rolex-yachtmaster': {
    title: 'Rolex Yachtmaster',
    image: rolexYachtmasterBoxImage,
    description: 'Luxury yacht watch themed box',
    normalPrice: '299.99',
    salePrice: '249.99',
    drops: [
      { name: 'Rolex Yachtmaster Watch', image: rolexYachtmasterBoxImage, price: '35000.00', rarity: 5.5, code: 'RY0001' },
      { name: 'Luxury Yacht Experience', image: rolexYachtmasterBoxImage, price: '15000.00', rarity: 15.5, code: 'RY0002' },
      { name: 'Marine Equipment Set', image: rolexYachtmasterBoxImage, price: '5000.00', rarity: 25.5, code: 'RY0003' },
      { name: 'Nautical Collection', image: rolexYachtmasterBoxImage, price: '2500.00', rarity: 35.5, code: 'RY0004' },
      { name: 'Maritime Accessories', image: rolexYachtmasterBoxImage, price: '1000.00', rarity: 45.5, code: 'RY0005' }
    ]
  },
  'rolex': {
    title: 'Rolex Collection',
    image: rolexBoxImage,
    description: 'Premium Rolex collection box',
    normalPrice: '399.99',
    salePrice: '349.99',
    drops: [
      { name: 'Rolex Collection Set', image: rolexBoxImage, price: '50000.00', rarity: 5.5, code: 'RX0001' },
      { name: 'Luxury Watch Display', image: rolexBoxImage, price: '20000.00', rarity: 15.5, code: 'RX0002' },
      { name: 'Watch Collector Kit', image: rolexBoxImage, price: '10000.00', rarity: 25.5, code: 'RX0003' },
      { name: 'Premium Service Package', image: rolexBoxImage, price: '5000.00', rarity: 35.5, code: 'RX0004' },
      { name: 'Rolex Accessories Set', image: rolexBoxImage, price: '2500.00', rarity: 45.5, code: 'RX0005' }
    ]
  },
  'bbc': {
    title: 'BBC Box',
    image: bbcBoxImage,
    description: 'British Broadcasting themed box',
    normalPrice: '29.99',
    salePrice: '24.99',
    drops: [
      { name: 'BBC Premium Subscription', image: bbcBoxImage, price: '500.00', rarity: 15.5, code: 'BBC001' },
      { name: 'Studio Tour Experience', image: bbcBoxImage, price: '300.00', rarity: 25.5, code: 'BBC002' },
      { name: 'Classic Shows Collection', image: bbcBoxImage, price: '200.00', rarity: 35.5, code: 'BBC003' },
      { name: 'BBC Merchandise Set', image: bbcBoxImage, price: '100.00', rarity: 45.5, code: 'BBC004' },
      { name: 'Documentary Package', image: bbcBoxImage, price: '50.00', rarity: 55.5, code: 'BBC005' }
    ]
  },
  'high-roller': {
    title: 'High Roller',
    image: highRollerBoxImage,
    description: 'Ultra-premium luxury items box',
    normalPrice: '1999.99',
    salePrice: '1799.99',
    drops: [
      { name: 'Luxury Watch Collection', image: highRollerBoxImage, price: '25000.00', rarity: 5.5, code: 'HR0001' },
      { name: 'Designer Wardrobe Set', image: highRollerBoxImage, price: '15000.00', rarity: 15.5, code: 'HR0002' },
      { name: 'Premium Jewelry Set', image: highRollerBoxImage, price: '10000.00', rarity: 25.5, code: 'HR0003' },
      { name: 'Luxury Accessories Pack', image: highRollerBoxImage, price: '5000.00', rarity: 35.5, code: 'HR0004' },
      { name: 'VIP Experience Package', image: highRollerBoxImage, price: '3000.00', rarity: 45.5, code: 'HR0005' }
    ]
  },
  'chanel': {
    title: 'Chanel',
    image: chanelBoxImage,
    description: 'Luxury fashion box featuring Chanel items',
    normalPrice: '199.99',
    salePrice: '169.99',
    drops: [
      { name: 'Chanel Classic Flap Bag', image: chanelBoxImage, price: '8500.00', rarity: 5.5, code: 'CH0001' },
      { name: 'Chanel Perfume Set', image: chanelBoxImage, price: '1500.00', rarity: 15.5, code: 'CH0002' },
      { name: 'Chanel Sunglasses', image: chanelBoxImage, price: '800.00', rarity: 25.5, code: 'CH0003' },
      { name: 'Chanel Wallet', image: chanelBoxImage, price: '1200.00', rarity: 35.5, code: 'CH0004' },
      { name: 'Chanel Accessories Set', image: chanelBoxImage, price: '2000.00', rarity: 45.5, code: 'CH0005' }
    ]
  },
  'jordan': {
    title: 'Jordan Exclusive',
    image: jordanBoxImage,
    description: 'Exclusive Jordan sneakers and apparel',
    normalPrice: '149.99',
    salePrice: '129.99',
    drops: [
      { name: 'Air Jordan 1 High OG', image: jordanBoxImage, price: '2500.00', rarity: 5.5, code: 'JE0001' },
      { name: 'Jordan Supreme Collection', image: jordanBoxImage, price: '1500.00', rarity: 15.5, code: 'JE0002' },
      { name: 'Jordan Varsity Jacket', image: jordanBoxImage, price: '800.00', rarity: 25.5, code: 'JE0003' },
      { name: 'Jordan Apparel Set', image: jordanBoxImage, price: '500.00', rarity: 35.5, code: 'JE0004' },
      { name: 'Jordan Accessories Pack', image: jordanBoxImage, price: '300.00', rarity: 45.5, code: 'JE0005' }
    ]
  },
  'louis-vuitton': {
    title: 'Louis Vuitton Deluxe',
    image: louisVuittonBoxImage,
    description: 'Premium Louis Vuitton fashion items',
    normalPrice: '299.99',
    salePrice: '249.99',
    drops: [
      { name: 'LV Travel Collection', image: louisVuittonBoxImage, price: '12000.00', rarity: 5.5, code: 'LV0001' },
      { name: 'LV Handbag Set', image: louisVuittonBoxImage, price: '8000.00', rarity: 15.5, code: 'LV0002' },
      { name: 'LV Wallet Collection', image: louisVuittonBoxImage, price: '3000.00', rarity: 25.5, code: 'LV0003' },
      { name: 'LV Accessories Pack', image: louisVuittonBoxImage, price: '2000.00', rarity: 35.5, code: 'LV0004' },
      { name: 'LV Small Leather Goods', image: louisVuittonBoxImage, price: '1000.00', rarity: 45.5, code: 'LV0005' }
    ]
  },
  'winter': {
    title: 'Winter Collection',
    image: winterBoxImage,
    description: 'Winter themed mystery box',
    normalPrice: '79.99',
    salePrice: '69.99',
    drops: [
      { name: 'Luxury Ski Equipment', image: winterBoxImage, price: '3000.00', rarity: 5.5, code: 'WC0001' },
      { name: 'Winter Fashion Set', image: winterBoxImage, price: '2000.00', rarity: 15.5, code: 'WC0002' },
      { name: 'Snow Gear Collection', image: winterBoxImage, price: '1500.00', rarity: 25.5, code: 'WC0003' },
      { name: 'Winter Accessories Pack', image: winterBoxImage, price: '800.00', rarity: 35.5, code: 'WC0004' },
      { name: 'Thermal Wear Set', image: winterBoxImage, price: '500.00', rarity: 45.5, code: 'WC0005' }
    ]
  },
  'bmw': {
    title: 'BMW Box',
    image: bmwBoxImage,
    description: 'BMW themed luxury automotive box',
    normalPrice: '189.99',
    salePrice: '159.99',
    drops: [
      { name: 'BMW Driving Experience', image: bmwBoxImage, price: '5000.00', rarity: 5.5, code: 'BM0001' },
      { name: 'BMW Lifestyle Collection', image: bmwBoxImage, price: '3000.00', rarity: 15.5, code: 'BM0002' },
      { name: 'BMW Watch Set', image: bmwBoxImage, price: '2000.00', rarity: 25.5, code: 'BM0003' },
      { name: 'BMW Leather Goods', image: bmwBoxImage, price: '1000.00', rarity: 35.5, code: 'BM0004' },
      { name: 'BMW Accessories Pack', image: bmwBoxImage, price: '500.00', rarity: 45.5, code: 'BM0005' }
    ]
  },
  'versace': {
    title: 'Versace',
    image: versaceBoxImage,
    description: 'Luxury Italian fashion box',
    normalPrice: '249.99',
    salePrice: '219.99',
    drops: [
      { name: 'Versace Couture Set', image: versaceBoxImage, price: '15000.00', rarity: 5.5, code: 'VS0001' },
      { name: 'Versace Home Collection', image: versaceBoxImage, price: '8000.00', rarity: 15.5, code: 'VS0002' },
      { name: 'Versace Accessories Set', image: versaceBoxImage, price: '5000.00', rarity: 25.5, code: 'VS0003' },
      { name: 'Versace Fragrance Collection', image: versaceBoxImage, price: '2000.00', rarity: 35.5, code: 'VS0004' },
      { name: 'Versace Small Items', image: versaceBoxImage, price: '1000.00', rarity: 45.5, code: 'VS0005' }
    ]
  },
  'ferrari': {
    title: 'Ferrari',
    image: ferrariBoxImage,
    description: 'Italian supercar themed box',
    normalPrice: '399.99',
    salePrice: '349.99',
    drops: [
      { name: 'Ferrari Track Experience', image: ferrariBoxImage, price: '25000.00', rarity: 5.5, code: 'FR0001' },
      { name: 'Ferrari Collection Set', image: ferrariBoxImage, price: '15000.00', rarity: 15.5, code: 'FR0002' },
      { name: 'Ferrari Merchandise Pack', image: ferrariBoxImage, price: '5000.00', rarity: 25.5, code: 'FR0003' },
      { name: 'Ferrari Watch', image: ferrariBoxImage, price: '3000.00', rarity: 35.5, code: 'FR0004' },
      { name: 'Ferrari Accessories', image: ferrariBoxImage, price: '1000.00', rarity: 45.5, code: 'FR0005' }
    ]
  },
  'prime': {
    title: 'Prime Box',
    image: primeBoxImage,
    description: 'Premium selection mystery box',
    normalPrice: '39.99',
    salePrice: '34.99',
    drops: [
      { name: 'Prime Gaming', image: primeBoxImage, price: '3000.00', rarity: 0.0002, code: 'PM0001' },
      { name: 'Prime Streaming', image: primeBoxImage, price: '2000.00', rarity: 0.01, code: 'PM0002' },
      { name: 'Accessories', image: primeBoxImage, price: '1000.00', rarity: 0.003, code: 'PM0003' },
      { name: 'Prime Merch Pack', image: primeBoxImage, price: '500.00', rarity: 0.0002, code: 'PM0004' },
      { name: 'Gaming Collectibles', image: primeBoxImage, price: '250.00', rarity: 0.06, code: 'PM0005' }
    ]
  },
  'sneakers': {
    title: 'Sneakers Box',
    image: sneakersBoxImage,
    description: 'Premium sneaker collection box',
    normalPrice: '129.99',
    salePrice: '109.99',
    drops: [
      { name: 'Limited Edition Sneakers', image: sneakersBoxImage, price: '5000.00', rarity: 5.5, code: 'SN0001' },
      { name: 'Collector\'s Edition Set', image: sneakersBoxImage, price: '3000.00', rarity: 15.5, code: 'SN0002' },
      { name: 'Rare Sneakers Pack', image: sneakersBoxImage, price: '2000.00', rarity: 25.5, code: 'SN0003' },
      { name: 'Sneaker Care Kit', image: sneakersBoxImage, price: '500.00', rarity: 35.5, code: 'SN0004' },
      { name: 'Sneaker Accessories', image: sneakersBoxImage, price: '250.00', rarity: 45.5, code: 'SN0005' }
    ]
  },
  'wolf-of-wall-street': {
    title: 'Wolf of Wall Street',
    image: wolfBoxImage,
    description: 'Luxury lifestyle themed box',
    normalPrice: '199.99',
    salePrice: '169.99',
    drops: [
      { name: 'Wall Street Experience', image: wolfBoxImage, price: '10000.00', rarity: 5.5, code: 'WW0001' },
      { name: 'Luxury Watch Set', image: wolfBoxImage, price: '5000.00', rarity: 15.5, code: 'WW0002' },
      { name: 'Designer Suit Collection', image: wolfBoxImage, price: '3000.00', rarity: 25.5, code: 'WW0003' },
      { name: 'Premium Accessories', image: wolfBoxImage, price: '1000.00', rarity: 35.5, code: 'WW0004' },
      { name: 'Lifestyle Essentials', image: wolfBoxImage, price: '500.00', rarity: 45.5, code: 'WW0005' }
    ]
  },
  'ufc': {
    title: 'UFC Box',
    image: ufcBoxImage,
    description: 'Ultimate Fighting Championship themed box',
    normalPrice: '89.99',
    salePrice: '79.99',
    drops: [
      { name: 'UFC VIP Experience', image: ufcBoxImage, price: '5000.00', rarity: 5.5, code: 'UFC001' },
      { name: 'Signed Fight Gear', image: ufcBoxImage, price: '2000.00', rarity: 15.5, code: 'UFC002' },
      { name: 'Training Equipment Set', image: ufcBoxImage, price: '1000.00', rarity: 25.5, code: 'UFC003' },
      { name: 'UFC Apparel Pack', image: ufcBoxImage, price: '500.00', rarity: 35.5, code: 'UFC004' },
      { name: 'UFC Merchandise', image: ufcBoxImage, price: '250.00', rarity: 45.5, code: 'UFC005' }
    ]
  },
  'victoria-secret': {
    title: 'Victoria\'s Secret',
    image: victoriaBoxImage,
    description: 'Luxury lingerie and beauty box',
    normalPrice: '99.99',
    salePrice: '89.99',
    drops: [
      { name: 'Luxury Lingerie Collection', image: victoriaBoxImage, price: '3000.00', rarity: 5.5, code: 'VS0001' },
      { name: 'Beauty & Fragrance Set', image: victoriaBoxImage, price: '1500.00', rarity: 15.5, code: 'VS0002' },
      { name: 'Designer Sleepwear', image: victoriaBoxImage, price: '1000.00', rarity: 25.5, code: 'VS0003' },
      { name: 'Accessories Pack', image: victoriaBoxImage, price: '500.00', rarity: 35.5, code: 'VS0004' },
      { name: 'Beauty Essentials', image: victoriaBoxImage, price: '250.00', rarity: 45.5, code: 'VS0005' }
    ]
  },
  'rolex-daytona': {
    title: 'Rolex Daytona',
    image: rolexDaytonaBoxImage,
    description: 'Luxury racing watch themed box',
    normalPrice: '299.99',
    salePrice: '249.99',
    drops: [
      { name: 'Rolex Daytona Watch', image: rolexDaytonaBoxImage, price: '40000.00', rarity: 5.5, code: 'RD0001' },
      { name: 'Racing Experience', image: rolexDaytonaBoxImage, price: '15000.00', rarity: 15.5, code: 'RD0002' },
      { name: 'Luxury Watch Box', image: rolexDaytonaBoxImage, price: '5000.00', rarity: 25.5, code: 'RD0003' },
      { name: 'Watch Care Kit', image: rolexDaytonaBoxImage, price: '2000.00', rarity: 35.5, code: 'RD0004' },
      { name: 'Collector\'s Items', image: rolexDaytonaBoxImage, price: '1000.00', rarity: 45.5, code: 'RD0005' }
    ]
  },
  'corsair': {
    title: 'Corsair Gaming',
    image: corsairBoxImage,
    description: 'Premium gaming gear box',
    normalPrice: '149.99',
    salePrice: '129.99',
    drops: [
      { name: 'Ultimate Gaming Setup', image: corsairBoxImage, price: '5000.00', rarity: 5.5, code: 'CS0001' },
      { name: 'RGB Collection', image: corsairBoxImage, price: '2000.00', rarity: 15.5, code: 'CS0002' },
      { name: 'Gaming Peripherals Set', image: corsairBoxImage, price: '1000.00', rarity: 25.5, code: 'CS0003' },
      { name: 'Streaming Equipment', image: corsairBoxImage, price: '500.00', rarity: 35.5, code: 'CS0004' },
      { name: 'Gaming Accessories', image: corsairBoxImage, price: '250.00', rarity: 45.5, code: 'CS0005' }
    ]
  },
  'fortnite': {
    title: 'Fortnite',
    image: fortniteBoxImage,
    description: 'Fortnite gaming themed box',
    normalPrice: '39.99',
    salePrice: '34.99',
    drops: [
      { name: 'Rare Skin Collection', image: fortniteBoxImage, price: '1000.00', rarity: 5.5, code: 'FN0001' },
      { name: 'V-Bucks Package', image: fortniteBoxImage, price: '500.00', rarity: 15.5, code: 'FN0002' },
      { name: 'Gaming Gear Set', image: fortniteBoxImage, price: '300.00', rarity: 25.5, code: 'FN0003' },
      { name: 'Fortnite Merch Pack', image: fortniteBoxImage, price: '200.00', rarity: 35.5, code: 'FN0004' },
      { name: 'Gaming Accessories', image: fortniteBoxImage, price: '100.00', rarity: 45.5, code: 'FN0005' }
    ]
  },
  'rolls-royce': {
    title: 'Rolls Royce',
    image: rollsRoyceBoxImage,
    description: 'Ultra-luxury automotive themed box',
    normalPrice: '399.99',
    salePrice: '349.99',
    drops: [
      { name: 'Rolls Royce Experience', image: rollsRoyceBoxImage, price: '50000.00', rarity: 5.5, code: 'RR0001' },
      { name: 'Luxury Lifestyle Pack', image: rollsRoyceBoxImage, price: '25000.00', rarity: 15.5, code: 'RR0002' },
      { name: 'Premium Collection Set', image: rollsRoyceBoxImage, price: '10000.00', rarity: 25.5, code: 'RR0003' },
      { name: 'Exclusive Accessories', image: rollsRoyceBoxImage, price: '5000.00', rarity: 35.5, code: 'RR0004' },
      { name: 'Collector\'s Items', image: rollsRoyceBoxImage, price: '2500.00', rarity: 45.5, code: 'RR0005' }
    ]
  },
  'football-frenzy': {
    title: 'Football Frenzy',
    image: footballBoxImage,
    description: 'Football themed mystery box',
    normalPrice: '79.99',
    salePrice: '69.99',
    drops: [
      { name: 'VIP Match Experience', image: footballBoxImage, price: '5000.00', rarity: 5.5, code: 'FF0001' },
      { name: 'Signed Jersey Collection', image: footballBoxImage, price: '2000.00', rarity: 15.5, code: 'FF0002' },
      { name: 'Premium Football Gear', image: footballBoxImage, price: '1000.00', rarity: 25.5, code: 'FF0003' },
      { name: 'Fan Merchandise Pack', image: footballBoxImage, price: '500.00', rarity: 35.5, code: 'FF0004' },
      { name: 'Team Accessories', image: footballBoxImage, price: '250.00', rarity: 45.5, code: 'FF0005' }
    ]
  },
  'maserati': {
    title: 'Maserati',
    image: maseratiBoxImage,
    description: 'Italian luxury automotive box',
    normalPrice: '299.99',
    salePrice: '249.99',
    drops: [
      { name: 'Maserati Track Day', image: maseratiBoxImage, price: '25000.00', rarity: 5.5, code: 'MS0001' },
      { name: 'Luxury Collection Set', image: maseratiBoxImage, price: '10000.00', rarity: 15.5, code: 'MS0002' },
      { name: 'Premium Accessories', image: maseratiBoxImage, price: '5000.00', rarity: 25.5, code: 'MS0003' },
      { name: 'Lifestyle Package', image: maseratiBoxImage, price: '2500.00', rarity: 35.5, code: 'MS0004' },
      { name: 'Brand Collection', image: maseratiBoxImage, price: '1000.00', rarity: 45.5, code: 'MS0005' }
    ]
  },
  'mercedes': {
    title: 'Mercedes',
    image: mercedesBoxImage,
    description: 'German luxury automotive box',
    normalPrice: '299.99',
    salePrice: '249.99',
    drops: [
      { name: 'AMG Experience Day', image: mercedesBoxImage, price: '25000.00', rarity: 5.5, code: 'MB0001' },
      { name: 'Mercedes Collection', image: mercedesBoxImage, price: '10000.00', rarity: 15.5, code: 'MB0002' },
      { name: 'Luxury Accessories Set', image: mercedesBoxImage, price: '5000.00', rarity: 25.5, code: 'MB0003' },
      { name: 'Premium Package', image: mercedesBoxImage, price: '2500.00', rarity: 35.5, code: 'MB0004' },
      { name: 'Brand Essentials', image: mercedesBoxImage, price: '1000.00', rarity: 45.5, code: 'MB0005' }
    ]
  },
  'topg': {
    title: 'Top G',
    image: topgBoxImage,
    description: 'Premium lifestyle box',
    normalPrice: '149.99',
    salePrice: '129.99',
    drops: [
      { name: 'Luxury Experience', image: topgBoxImage, price: '10000.00', rarity: 5.5, code: 'TG0001' },
      { name: 'Premium Collection', image: topgBoxImage, price: '5000.00', rarity: 15.5, code: 'TG0002' },
      { name: 'Lifestyle Package', image: topgBoxImage, price: '2500.00', rarity: 25.5, code: 'TG0003' },
      { name: 'Exclusive Set', image: topgBoxImage, price: '1000.00', rarity: 35.5, code: 'TG0004' },
      { name: 'Brand Accessories', image: topgBoxImage, price: '500.00', rarity: 45.5, code: 'TG0005' }
    ]
  },
  'porsche': {
    title: 'Porsche',
    image: porscheBoxImage,
    description: 'Sports car themed luxury box',
    normalPrice: '349.99',
    salePrice: '299.99',
    drops: [
      { name: 'Porsche Track Experience', image: porscheBoxImage, price: '25000.00', rarity: 5.5, code: 'PS0001' },
      { name: 'Premium Collection', image: porscheBoxImage, price: '10000.00', rarity: 15.5, code: 'PS0002' },
      { name: 'Luxury Accessories', image: porscheBoxImage, price: '5000.00', rarity: 25.5, code: 'PS0003' },
      { name: 'Design Package', image: porscheBoxImage, price: '2500.00', rarity: 35.5, code: 'PS0004' },
      { name: 'Brand Collection', image: porscheBoxImage, price: '1000.00', rarity: 45.5, code: 'PS0005' }
    ]
  },
  'cartier': {
    title: 'Cartier',
    image: cartierBoxImage,
    description: 'Luxury jewelry themed box',
    normalPrice: '299.99',
    salePrice: '249.99',
    drops: [
      { name: 'Cartier Watch Collection', image: cartierBoxImage, price: '50000.00', rarity: 5.5, code: 'CT0001' },
      { name: 'Jewelry Set', image: cartierBoxImage, price: '25000.00', rarity: 15.5, code: 'CT0002' },
      { name: 'Premium Accessories', image: cartierBoxImage, price: '10000.00', rarity: 25.5, code: 'CT0003' },
      { name: 'Luxury Package', image: cartierBoxImage, price: '5000.00', rarity: 35.5, code: 'CT0004' },
      { name: 'Brand Collection', image: cartierBoxImage, price: '2500.00', rarity: 45.5, code: 'CT0005' }
    ]
  },
  'diamond-vault': {
    title: 'Diamond Vault',
    image: diamondBoxImage,
    description: 'Premium diamond jewelry box',
    normalPrice: '999.99',
    salePrice: '899.99',
    drops: [
      { name: 'Diamond Collection', image: diamondBoxImage, price: '100000.00', rarity: 5.5, code: 'DV0001' },
      { name: 'Luxury Jewelry Set', image: diamondBoxImage, price: '50000.00', rarity: 15.5, code: 'DV0002' },
      { name: 'Premium Gems', image: diamondBoxImage, price: '25000.00', rarity: 25.5, code: 'DV0003' },
      { name: 'Exclusive Package', image: diamondBoxImage, price: '10000.00', rarity: 35.5, code: 'DV0004' },
      { name: 'Jewelry Accessories', image: diamondBoxImage, price: '5000.00', rarity: 45.5, code: 'DV0005' }
    ]
  },
  'hublot': {
    title: 'Hublot',
    image: hublotBoxImage,
    description: 'Luxury Swiss watch themed box',
    normalPrice: '399.99',
    salePrice: '349.99',
    drops: [
      { name: 'Hublot Limited Edition', image: hublotBoxImage, price: '75000.00', rarity: 5.5, code: 'HB0001' },
      { name: 'Collector\'s Set', image: hublotBoxImage, price: '35000.00', rarity: 15.5, code: 'HB0002' },
      { name: 'Premium Watch', image: hublotBoxImage, price: '15000.00', rarity: 25.5, code: 'HB0003' },
      { name: 'Luxury Accessories', image: hublotBoxImage, price: '7500.00', rarity: 35.5, code: 'HB0004' },
      { name: 'Watch Care Kit', image: hublotBoxImage, price: '2500.00', rarity: 45.5, code: 'HB0005' }
    ]
  },
  'old-money': {
    title: 'Old Money',
    image: oldMoneyBoxImage,
    description: 'Classic luxury lifestyle box',
    normalPrice: '499.99',
    salePrice: '449.99',
    drops: [
      { name: 'Luxury Lifestyle Experience', image: oldMoneyBoxImage, price: '50000.00', rarity: 5.5, code: 'OM0001' },
      { name: 'Heritage Collection Set', image: oldMoneyBoxImage, price: '25000.00', rarity: 15.5, code: 'OM0002' },
      { name: 'Vintage Luxury Items', image: oldMoneyBoxImage, price: '15000.00', rarity: 25.5, code: 'OM0003' },
      { name: 'Premium Accessories', image: oldMoneyBoxImage, price: '10000.00', rarity: 35.5, code: 'OM0004' },
      { name: 'Classic Collection', image: oldMoneyBoxImage, price: '5000.00', rarity: 45.5, code: 'OM0005' }
    ]
  },
  'apple': {
    title: 'Apple Budget',
    image: appleBoxImage,
    description: 'Apple technology themed box',
    normalPrice: '99.99',
    salePrice: '89.99',
    drops: [
      { name: 'Latest iPhone', image: appleBoxImage, price: '1500.00', rarity: 5.5, code: 'AP0001' },
      { name: 'Apple Watch', image: appleBoxImage, price: '800.00', rarity: 15.5, code: 'AP0002' },
      { name: 'AirPods Pro', image: appleBoxImage, price: '400.00', rarity: 25.5, code: 'AP0003' },
      { name: 'Apple Accessories Set', image: appleBoxImage, price: '300.00', rarity: 35.5, code: 'AP0004' },
      { name: 'Apple Care Package', image: appleBoxImage, price: '200.00', rarity: 45.5, code: 'AP0005' }
    ]
  },
  'barbie': {
    title: 'Barbie',
    image: barbieBoxImage,
    description: 'Collector\'s edition Barbie themed box',
    normalPrice: '79.99',
    salePrice: '69.99',
    drops: [
      { name: 'Limited Edition Barbie', image: barbieBoxImage, price: '5000.00', rarity: 5.5, code: 'BB0001' },
      { name: 'Collector\'s Set', image: barbieBoxImage, price: '2500.00', rarity: 15.5, code: 'BB0002' },
      { name: 'Fashion Collection', image: barbieBoxImage, price: '1500.00', rarity: 25.5, code: 'BB0003' },
      { name: 'Accessories Pack', image: barbieBoxImage, price: '800.00', rarity: 35.5, code: 'BB0004' },
      { name: 'Display Collection', image: barbieBoxImage, price: '500.00', rarity: 45.5, code: 'BB0005' }
    ]
  },
  'rolex-day-date': {
    title: 'Rolex Day-Date',
    image: rolexDayDateBoxImage,
    description: 'Luxury Rolex Day-Date themed box',
    normalPrice: '399.99',
    salePrice: '349.99',
    drops: [
      { name: 'Rolex Day-Date Watch', image: rolexDayDateBoxImage, price: '45000.00', rarity: 5.5, code: 'RD0001' },
      { name: 'Luxury Watch Set', image: rolexDayDateBoxImage, price: '25000.00', rarity: 15.5, code: 'RD0002' },
      { name: 'Premium Collection', image: rolexDayDateBoxImage, price: '15000.00', rarity: 25.5, code: 'RD0003' },
      { name: 'Watch Accessories', image: rolexDayDateBoxImage, price: '5000.00', rarity: 35.5, code: 'RD0004' },
      { name: 'Collector\'s Items', image: rolexDayDateBoxImage, price: '2500.00', rarity: 45.5, code: 'RD0005' }
    ]
  },
  'ralph-lauren': {
    title: 'Ralph Lauren',
    image: ralphLaurenBoxImage,
    description: 'Premium Ralph Lauren fashion box',
    normalPrice: '199.99',
    salePrice: '169.99',
    drops: [
      { name: 'Purple Label Collection', image: ralphLaurenBoxImage, price: '10000.00', rarity: 5.5, code: 'RL0001' },
      { name: 'Luxury Apparel Set', image: ralphLaurenBoxImage, price: '5000.00', rarity: 15.5, code: 'RL0002' },
      { name: 'Designer Collection', image: ralphLaurenBoxImage, price: '3000.00', rarity: 25.5, code: 'RL0003' },
      { name: 'Accessories Pack', image: ralphLaurenBoxImage, price: '1500.00', rarity: 35.5, code: 'RL0004' },
      { name: 'Fashion Essentials', image: ralphLaurenBoxImage, price: '800.00', rarity: 45.5, code: 'RL0005' }
    ]
  }
}; 