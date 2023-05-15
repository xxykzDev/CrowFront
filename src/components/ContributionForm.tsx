import { useState } from 'react';
import { ethers } from 'ethers';
import { TextField, Button } from '@mui/material';

interface ContributionFormProps {
  contract: ethers.Contract | null;
  proposalId: number;
}

const ContributionForm: React.FC<ContributionFormProps> = ({ contract, proposalId }) => {
    console.log(proposalId)
  const [contribution, setContribution] = useState<number | null>(null);

  const handleContributionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setContribution(Number(event.target.value));
  };

  const handleContributionSubmit = async () => {
    console.log(contribution); // Verificar si el valor se captura correctamente

    if (contract && contribution) {
      try {
        const value = ethers.utils.parseEther(contribution.toString());
        const tx = await contract.contribute(proposalId, { value });
        await tx.wait();
      } catch (err) {
        console.error('Error contributing:', err);
      }
    }
  };

  return (
    <form noValidate autoComplete="off">
      <TextField
        label="Contribution (ETH)"
        type="number"
        onChange={handleContributionChange}
      />
      <Button
        variant="contained"
        color="primary"
        onClick={handleContributionSubmit}
      >
        Contribute
      </Button>
    </form>
  );
};

export default ContributionForm;
