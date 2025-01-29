import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useState, useRef, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc, setDoc,  increment } from 'firebase/firestore';
import { firebaseConfig } from './firebaseConfig';
import './connectbutton.css';
import { Button } from '@mui/material';

export const Header = () => {
  const userFriendlyAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [showMenu, setShowMenu] = useState(false);
  const [isConnected, setIsConnected] = useState(false); // State to track connection status
  const [loading, setLoading] = useState(false);

  // Firebase initialization
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  // Retrieve telegramUserId from localStorage
  const telegramUserId = localStorage.getItem('telegramUserId');
  
  if (!telegramUserId) {
    console.error('telegramUserId not found in localStorage');
    return null; // Or you can handle this in another way, such as redirecting to login
  }

  // Refs for the address box and menu to detect clicks outside
  const addressRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleDisconnect = async () => {
    setLoading(true);
    await tonConnectUI.disconnect();
    setIsConnected(false); // Set connection status to false on disconnect
    setShowMenu(false); // Hide the menu after disconnecting
    setLoading(false);
  };

  const handleAddressClick = () => {
    setShowMenu(!showMenu); // Toggle the menu visibility
  };

  // Track connection status based on the user address
  useEffect(() => {
    if (userFriendlyAddress) {
      setIsConnected(true); // Set to true when the user address is available

      const updateConnectionStatus = async () => {
        setLoading(true);
        try {
          const userDocRef = doc(db, 'users', telegramUserId); // Reference to the user's document
          const userDocSnap = await getDoc(userDocRef); // Fetch the user's document

          // Check if the user document exists and if the address has already been set
          if (userDocSnap.exists() && userDocSnap.data().isAddressSet) {
            console.log('Address already set. No further update.');
            setLoading(false);
            return; // Do nothing if the address is already set
          }

          // Update Firestore with connected status for the user based on telegramUserId
          await setDoc(userDocRef, {
            isConnected: true,
            address: userFriendlyAddress, // Optionally store the wallet address
            isAddressSet: true, // Flag to indicate the address has been set
            bblip: increment(5000), // Increment the bblip field by 5000
          }, { merge: true }); // Use merge to avoid overwriting other fields in the user's document

          console.log('Address, connection status, and bblip updated.');
        } catch (error) {
          console.error('Error updating Firestore: ', error);
        } finally {
          setLoading(false);
        }
      };

      updateConnectionStatus();
    } else {
      setIsConnected(false); // Set to false if no address is available
    }
  }, [userFriendlyAddress, db, telegramUserId]);

  // Close the dropdown if the user clicks outside the address box or menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        addressRef.current && !addressRef.current.contains(event.target as Node) &&
        menuRef.current && !menuRef.current.contains(event.target as Node)
      ) {
        setShowMenu(false); // Close the dropdown if clicked outside
      }
    };

    // Add the event listener for clicks
    document.addEventListener('mousedown', handleClickOutside);

    // Cleanup the event listener on component unmount
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <header style={styles.header}>
      {/* If user is not connected, show the TonConnectButton */}
      {!isConnected ? (
        <div >
          <Button size='small' sx={{    borderRadius: 2,
    textTransform: 'none', color:'black', bgcolor:'#89d9ff',
}}    onClick={() => tonConnectUI.openModal()}>
            Connect Wallet
          </Button>
        </div>
      ) : (
        <div style={styles.addressContainer}>
          {/* User-friendly address inside a box with ellipsis if it overflows */}
          <div
            ref={addressRef} // Assign ref to the address box
            style={styles.addressBox}
            onClick={handleAddressClick}
          >
            {userFriendlyAddress.length > 10
              ? `${userFriendlyAddress.slice(0, 6)}...${userFriendlyAddress.slice(-4)}`
              : userFriendlyAddress}
          </div>

          {/* Dropdown menu with Disconnect button */}
          {showMenu && (
            <div ref={menuRef} style={styles.menu}>
              <button style={styles.disconnectButton} onClick={handleDisconnect} disabled={loading}>
                {loading ? 'Disconnecting...' : 'Disconnect'}
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '5%',
  },
  
  addressContainer: {
    display: 'flex',
        borderRadius: '5px',

    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative' as 'relative', // Explicitly type position as 'relative'
  },
  
  addressBox: {
    padding: '5px 10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    color:'black',
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: 'monospace',
    cursor: 'pointer',
  },
  
  menu: {
    position: 'absolute' as 'absolute', // Explicitly type position as 'absolute'
    top: '25px',
    right: '0',
    backgroundColor: 'transparent',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    padding: '10px',
    zIndex: 10,
  },
  
  disconnectButton: {
    padding: '4px 8px',
    backgroundColor: '#ff4d4d',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s ease',
  },
};
