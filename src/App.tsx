import { useContext } from 'react';
import WalletContext from './context/WalletContext';
import Navbar from './components/NavBar';
import ContractInteraction from './components/Proposals';

function App() {
  const { walletConnected} = useContext(WalletContext);


  return (
    <div className="app-container">
      <Navbar />
      {walletConnected && <ContractInteraction />}
    </div>
  );
}

export default App;
