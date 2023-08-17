import React, { useEffect, useState } from 'react';
import Web3 from 'web3';

function EthereumComponent() {
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [accounts, setAccounts] = useState<string[]>([]);
  const [selectedAccount, setSelectedAccount] = useState<string>('');

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        const web3Instance = new Web3(window.ethereum);

        try {
          await window.ethereum.enable(); // Request access to accounts
          setWeb3(web3Instance);
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }

        const accounts = await web3Instance.eth.getAccounts();
        setAccounts(accounts);
        setSelectedAccount(accounts[0] || '');
      } else {
        console.error('MetaMask not detected.');
      }
    };

    initWeb3();
  }, []);

  return (
    <div>
      <h1>Ethereum Integration with Next.js</h1>
      {web3 && (
        <div>
          <p>Connected to Ethereum</p>
          <p>Selected Account: {selectedAccount}</p>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
          >
            {accounts.map((account) => (
              <option key={account} value={account}>
                {account}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}

export default EthereumComponent;