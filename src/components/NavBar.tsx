import { useContext, useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography, Button } from '@mui/material';
import WalletContext from '../context/WalletContext';

function Navbar() {
  const { walletConnected, connectWallet, disconnectWallet, signer } = useContext(WalletContext);
  const [address, setAddress] = useState('');

  const handleConnectWallet = () => {
    connectWallet();
  };

  const handleDisconnectWallet = () => {
    disconnectWallet();
  };

  useEffect(() => {
    const fetchAddress = async () => {
      if (signer) {
        const fetchedAddress = await signer.getAddress();
        setAddress(fetchedAddress);
      }
    };

    if (walletConnected) {
      fetchAddress();
    }
  }, [signer, walletConnected]);

  function formatAddress(address: string): string {
    if (!address) {
      return '';
    }
  
    const start = address.slice(0, 5);
    const end = address.slice(-5);
  
    return `${start}...${end}`;
  }

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Crowfunding
        </Typography>
        {walletConnected ? (
          <>
            <Typography variant="body1" sx={{ marginRight: '16px' }}>
              {formatAddress(address)}
            </Typography>
            <Button variant="contained" onClick={handleDisconnectWallet}>
              Disconnect Wallet
            </Button>
          </>
        ) : (
          <Button variant="contained" onClick={handleConnectWallet}>
            Connect Wallet
          </Button>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
