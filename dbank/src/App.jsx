import { useState, useEffect, createContext, useContext } from 'react';
import { ethers } from 'ethers';
import abi from "./contracts/DecentralisedBank.sol/DecentralisedBank.json";
import './App.css';

const EthereumContext = createContext();

export function useEthereum() {
  return useContext(EthereumContext);
}

function App() {
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [account, setAccount] = useState(null);
  const [balance, setBalance] = useState(0);
  const [depositAmount, setDepositAmount] = useState('');  // For deposit
  const [withdrawAmount, setWithdrawAmount] = useState(''); // For withdrawal
  const [transferAmount, setTransferAmount] = useState(''); // For transfer
  const [recipient, setRecipient] = useState(''); // Transfer recipient

  useEffect(() => {
    async function init() {
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
          const selectedAccount = accounts[0];
          console.log("Selected Account:", selectedAccount);
  
          const provider = new ethers.BrowserProvider(window.ethereum);
          const signer = await provider.getSigner();
          const contractAddress = "0x730Ba94c6078919ee3D06C97b1952dFC7A2FCF67";
          const Abi = abi.abi;
          const contract = new ethers.Contract(contractAddress, Abi, signer);
  
          setProvider(provider);
          setSigner(signer);
          setContract(contract);
          setAccount(selectedAccount);
  
          try {
            const accountExists = await contract.accountExists(selectedAccount);
            console.log("Account exists:", accountExists);
  
            if (accountExists) {
              const balance = await contract.getAccountBalance(selectedAccount);
              setBalance(ethers.formatEther(balance));
            } else {
              alert("Account does not exist. Please create an account.");
            }
          } catch (error) {
            if (error.reason && error.reason.includes("Account does not exist")) {
              alert("Account does not exist. Please create an account.");
            } else {
              console.log("Error checking if account exists:", error);
              alert("Error checking account existence. Please create an account if necessary.");
            }
          }
        } catch (error) {
          console.error("Error initializing the dApp:", error);
        }
      } else {
        alert('Please install MetaMask!');
      }
    }
  
    init();
  }, []);
  

  const createAccount = async () => {
    try {
      const tx = await contract.CreateAccount();
      await tx.wait();
      alert('Account created successfully!');
    } catch (error) {
      console.error("Error creating account:", error);
      alert('Error creating account');
    }
  };

  const deposit = async () => {
    try {
      if (!depositAmount || isNaN(depositAmount) || parseFloat(depositAmount) <= 0) {
        alert("Please enter a valid deposit amount.");
        return;
      }

      const tx = await contract.Deposit({ value: ethers.parseUnits(depositAmount, 'ether') }); // Convert amount to Wei
      await tx.wait();
      alert('Deposit successful!');
    } catch (error) {
      console.error("Error depositing:", error);
      alert('Error depositing');
    }
  };

  const withdraw = async () => {
    try {
      if (!withdrawAmount || isNaN(withdrawAmount) || parseFloat(withdrawAmount) <= 0) {
        alert("Please enter a valid withdraw amount.");
        return;
      }

      const tx = await contract.withdraw(ethers.parseUnits(withdrawAmount, 'ether')); // Convert amount to Wei
      await tx.wait();
      alert('Withdrawal successful!');
    } catch (error) {
      console.error("Error withdrawing:", error);
      alert('Error withdrawing');
    }
  };

  const transfer = async () => {
    try {
      if (!ethers.isAddress(recipient)) {
        alert("Invalid recipient address.");
        return;
      }
      if (!transferAmount || isNaN(transferAmount) || parseFloat(transferAmount) <= 0) {
        alert("Please enter a valid transfer amount.");
        return;
      }

      const tx = await contract.transfer(recipient, ethers.parseUnits(transferAmount, 'ether')); // Convert amount to Wei
      await tx.wait();
      alert('Transfer successful!');
    } catch (error) {
      console.error("Error transferring:", error);
      alert('Error transferring');
    }
  };

  const fetchBalance = async () => {
    try {
      const balance = await contract.getAccountBalance(account);
      setBalance(ethers.formatEther(balance)); // Convert Wei to Ether for display
    } catch (error) {
      console.error("Error fetching balance:", error);
    }
  };

  return (
    <div className="App">
      <h1>Decentralized Bank</h1>

      <nav className='navbar'>
        <ul>
          <li><a href="#services">Services</a></li>
          <li><a href="#Donation">Donation</a></li>
          <li><a href="Loan">Loan</a></li>
          <li><a href="Jobs"></a></li>
        </ul>
      </nav>
      <div>
        <p></p>
        <h2>Create Your Account : just one click below</h2>
        <button onClick={createAccount}>Create Your Account</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Deposit Amount (ETH)"
          value={depositAmount}
          onChange={(e) => setDepositAmount(e.target.value)}
        />
        <button onClick={deposit}>Deposit</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Withdraw Amount (ETH)"
          value={withdrawAmount}
          onChange={(e) => setWithdrawAmount(e.target.value)}
        />
        <button onClick={withdraw}>Withdraw</button>
      </div>
      <div>
        <input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <input
          type="text"
          placeholder="Transfer Amount (ETH)"
          value={transferAmount}
          onChange={(e) => setTransferAmount(e.target.value)}
        />
        <button onClick={transfer}>Transfer</button>
      </div>
      <div>
        <button onClick={fetchBalance}>Fetch Balance</button>
        <p>Balance: {balance} ETH</p>
      </div>
      <section id='services'>
        <h2>Services</h2>
        <p>Details of services</p>
      </section>
      
      <section id='donation'>
        <h2>Donation</h2>
        <p>Make a donation and contribute to </p>
      </section>

      <section id='loan'>
        <h2>Loan</h2>
        <p>you can take a multiple loans here</p>
      </section>

      <section id='jobs'></section>
      <h2>Jobs</h2>
      <p>Current job openings</p>
    </div>
  );
}

export default App;
