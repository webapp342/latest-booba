export const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: '20px',
    padding: '2rem',
    backgroundColor: 'white',
    borderRadius: '16px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  },
  title: {
    fontSize: '2.5rem',
    color: '#333',
    marginBottom: '1rem',
    fontWeight: 'bold',
  },
  slotsContainer: {
    display: 'flex',
    flexDirection: 'row' as const, // Kutuları yatay hizalamak için 'row' kullanıyoruz
    gap: '10px',
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
    padding: '10px 20px',
    borderRadius: '8px',
    color: '#333',
    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
    textAlign: 'center' as const,
  },
};
