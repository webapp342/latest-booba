export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '10px',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2rem',
    color: '#333',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },

  
  historyContainer: {
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '8px',
    color: '#333',
    width: '100%',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    margin: 'auto',
  },
  historyList: {
    listStyle: 'none',
    padding: 0,
    marginTop: '20px',
  },
  historyItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px',
    borderBottom: '1px solid #ddd',
    transition: 'background-color 0.3s',
  },
  historyItemHovered: {
    backgroundColor: '#f1f1f1',
  },
  spinInfo: {
    display: 'flex',
    alignItems: 'center',
  },
  logo: {
    width: '20px',
    height: '20px',
    marginRight: '10px',
  },
  arrowIcon: {
    color: '#4CAF50',
  },
  balanceInfo: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '16px',
    fontWeight: '500',
  },
  balanceSelection: {
    marginBottom: '20px',
    padding: '10px',
    color: '#000', // Metin rengi siyah yapıldı

  
    borderRadius: '8px',
    boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.1)',
  },
  resultContainer: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: '12px', // Aralarındaki boşluğu biraz azaltarak daha kompakt bir görünüm elde ettik
    padding: '16px',
    backgroundColor: '#fafafa', // Daha hafif bir arka plan rengi
    borderRadius: '10px',
    boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
    width: '300px', // Sabit genişlik, daha düzenli görünmesini sağlar
    margin: '0 auto', // Ortalar
  },
  resultItem: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
  },
  header: {
    fontSize: '1.1rem', // Daha küçük başlıklar
    fontWeight: '500',
    color: '#333', // Başlıkları daha okunaklı ve şık tutmak için
    marginBottom: '4px', // Daha sıkı bir düzen
  },
  resultText: {
    fontSize: '1rem', // Daha küçük metin boyutu
    color: '#333', // Siyah metin
    fontWeight: '400', // Hafif ince font
  },
 
  slotBox: (isActive: boolean) => ({
    backgroundColor: isActive ? 'green' : 'red',
    padding: '10px',
    borderRadius: '10px',
    boxShadow: isActive ? '0 4px 10px rgba(0, 255, 0, 0.5)' : '0 4px 10px rgba(255, 0, 0, 0.5)',
    width: '30px',
    height: '30px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  }),

  staticNumber: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: '24px',
    fontWeight: 'bold',
    color: 'white', // Kırmızı kutular için renk ayarı
  },
  slotChar: {
    fontSize: '10px', // Diğer animasyonlu sayılar için stil
    fontWeight: 'bold',
    color: 'white', // Diğer animasyonlu sayılar için de beyaz renk
  },

  
  slotsContainer: {
    display: 'flex',
    flexDirection: 'row' as const, // Kutuları yatay hizalamak için 'row' kullanıyoruz
    gap: '10px',
    color: '#000', // Metin rengi siyah yapıldı

    padding: '2rem',
    backgroundColor: '#f8f8f8',
    borderRadius: '12px',
    boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)',
    margin: '1rem 0 2rem 0',
  },
  totalContainer: {
    marginTop: '2rem',
    padding: '1rem',
    color: 'black',
    borderTop: '1px solid #ddd',
    textAlign: 'center' as const,
  },
  
  separator: {
    marginLeft: '8px', // Boşluk için
    marginRight: '8px', // Boşluk için
    
    fontSize: '1.5rem', // Virgülün boyutunu belirlemek için
    color: '#333', // Virgül rengi
  },
  slotRow: {
    backgroundColor: '#fff',
    padding: '5px 10px',
    borderRadius: '8px',
    color: '#333',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    textAlign: 'center' as const,
  },
};
