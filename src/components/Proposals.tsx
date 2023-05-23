import { useState, useEffect } from 'react';
import { ethers, Contract, ContractInterface } from 'ethers';
import { Card, CardContent, Typography } from '@mui/material';
import ContributionForm from './ContributionForm'; // Import the form component
import abi from '../ABICrowfunding.json';

function ContractInteraction() {
  const [contract, setContract] = useState<Contract | null>(null);
  const [activeProposals, setActiveProposals] = useState<any[] | null>(null);
  const [inactiveProposals, setInactiveProposals] = useState<any[] | null>(null);

  useEffect(() => {
    const contractAddress = '0x01b7D00193be70946810aB6065e372C2533eb5D9';
    const ethereum = (window as any).ethereum;
    const provider = new ethers.providers.Web3Provider(ethereum);

    const initializeContract = async () => {
      try {
        const signer = provider.getSigner();
        const abiInterface = new ethers.utils.Interface(abi);
        const contractInstance = new ethers.Contract(
          contractAddress,
          abiInterface as ContractInterface,
          signer
        );
        setContract(contractInstance);

        const totalProposals = await contractInstance.getTotalProposals();
        const fetchedActiveProposals: any[] =[] ;
        const fetchedInactiveProposals: any[] = [];

        for (let i = 0; i < totalProposals; i++) {
          const fetchedProposal = await contractInstance.proposals(i);
          console.log(`Fetched proposal ${i}:`, fetchedProposal);

          if (fetchedProposal.deadline > Math.floor(Date.now() / 1000)) {
            fetchedActiveProposals.push(fetchedProposal);
          } else {
            fetchedInactiveProposals.push(fetchedProposal);
          }
        }

        // Ajustar el índice de las propuestas activas
        const adjustedActiveProposals = fetchedActiveProposals.map((proposal, index) => ({
          ...proposal,
          id: index + fetchedInactiveProposals.length,
      }));

      setActiveProposals(adjustedActiveProposals);
      setInactiveProposals(fetchedInactiveProposals);
          } catch (error) {
            console.error('Error initializing contract:', error);
          }
    };

    initializeContract();
  }, []);

  const formatEtherValue = (value: number) => {
    const etherValue = ethers.utils.formatEther(value);
    return `${etherValue} ETH`;
  };

  const renderProposal = (proposal: any, index: number) => {
    const isDeadlinePassed = proposal.deadline < Math.floor(Date.now() / 1000);
  
    return (
      <Card key={index}>
        <CardContent>
          <Typography variant="h5" component="div">
            Proposal {index + 1} Details
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Name: {proposal.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Description: {proposal.description}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Value: {formatEtherValue(proposal.value)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Deadline: {new Date(proposal.deadline * 1000).toLocaleString()}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Received: {formatEtherValue(proposal.received)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Funded: {proposal.funded ? 'Yes' : 'No'}
          </Typography>
          {!isDeadlinePassed && (
            <ContributionForm contract={contract} proposalId={proposal.id} />
          )}
        </CardContent>
      </Card>
    );
  };
  
return (
    <div>
    {activeProposals && inactiveProposals ? (
        <>
        <h2>Active Proposals</h2>
        {activeProposals.map(renderProposal)}

        <h2>Inactive Proposals</h2>
        {inactiveProposals.map(renderProposal)}
        </>
    ) : (
        <p>Loading proposals...</p>
    )}
    </div>
);
}

export default ContractInteraction;