import { useTonAddress, useTonConnectUI } from '@tonconnect/ui-react';
import { useState, useRef, useEffect } from 'react';
import './connectbutton.css'

export const Header = () => {
  const userFriendlyAddress = useTonAddress();
  const [tonConnectUI] = useTonConnectUI();
  const [showMenu, setShowMenu] = useState(false);
  
  // Refs for the address box and menu to detect clicks outside
  const addressRef = useRef<HTMLDivElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleDisconnect = async () => {
    await tonConnectUI.disconnect();
    setShowMenu(false); // Hide the menu after disconnecting
  };

  const handleAddressClick = () => {
    setShowMenu(!showMenu); // Toggle the menu visibility
  };

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
      {!userFriendlyAddress ? (
<div style={{ fontSize: '12px' }}>
 <button className="connect-wallet-button" onClick={() => tonConnectUI.openModal()}>
  Connect Wallet
</button>
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
              <button style={styles.disconnectButton} onClick={handleDisconnect}>
                Disconnect
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
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    position: 'relative' as 'relative', // Explicitly type position as 'relative'
  },
  
  
  addressBox: {
    padding: '5px 10px',
    marginRight: '10px',
    backgroundColor: '#e0e0e0',
    borderRadius: '5px',
    maxWidth: '200px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    fontFamily: 'monospace',
    cursor: 'pointer',
  },
  menu: {
    position: 'absolute' as 'absolute', // Explicitly type position as 'absolute'
    top: '40px',
    right: '0',
    backgroundColor: '#ffffff',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    borderRadius: '5px',
    padding: '10px',
    zIndex: 10,
  },
  disconnectButton: {
    padding: '8px 12px',
    backgroundColor: '#ff4d4d',
    border: 'none',
    borderRadius: '5px',
    color: '#fff',
    cursor: 'pointer',
    width: '100%',
    transition: 'background-color 0.3s ease',
  },
  
};
