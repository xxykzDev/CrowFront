import { useContext, useEffect, useState } from 'react';
import WalletContext from './context/WalletContext';
import Navbar from './components/NavBar';
import ContractInteraction from './components/Proposals';

function App() {
  const { walletConnected, connectWallet, disconnectWallet, signer } = useContext(WalletContext);
  const [accountAddress, setAccountAddress] = useState('');

  const handleWalletToggle = () => {
    if (walletConnected) {
      disconnectWallet();
    } else {
      connectWallet();
    }
  };

  useEffect(() => {
    const getAccountAddress = async () => {
      if (signer) {
        const address = await signer.getAddress();
        setAccountAddress(address);
      }
    };

    getAccountAddress();
  }, [signer]);

  return (
    <div className="app-container">
      <Navbar />
      {walletConnected && <ContractInteraction />}
    </div>
  );
}

export default App;
