import React, { createContext, useState, ReactNode } from 'react';
import { ethers, Signer } from 'ethers';

interface WalletContextType {
  walletConnected: boolean;
  signer: Signer | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

const WalletContext = createContext<WalletContextType>({
  walletConnected: false,
  signer: null,
  connectWallet: async () => {},
  disconnectWallet: () => {},
});

interface WalletProviderProps {
  children: ReactNode;
}

export const WalletProvider: React.FC<WalletProviderProps> = ({ children }) => {
  const [walletConnected, setWalletConnected] = useState(false);
  const [signer, setSigner] = useState<Signer | null>(null);

  const connectWallet = async () => {
  try {
    if ((window as any).ethereum) {
      const ethereum = (window as any).ethereum;
      await ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      setSigner(signer);
      setWalletConnected(true);

      // Esperar a que se obtenga la dirección
      const address = await signer.getAddress();
      console.log('Signer:', signer);
      console.log('Dirección conectada:', address);

      console.log('Conexión exitosa');
    } else {
      console.error('No se detectó ninguna billetera');
    }
  } catch (error) {
    console.error('Error al conectar la billetera:', error);
  }
};
  
  const disconnectWallet = () => {
    setSigner(null);
    setWalletConnected(false);
  };

  const contextValue: WalletContextType = {
    walletConnected,
    signer,
    connectWallet,
    disconnectWallet,
  };

  return (
    <WalletContext.Provider value={contextValue}>
      {children}
    </WalletContext.Provider>
  );
};

export default WalletContext;
