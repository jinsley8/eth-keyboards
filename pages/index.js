import { useState, useEffect } from "react";
import PrimaryButton from "../components/primary-button";

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);

  // check for an account
  const handleAccounts = (accounts) => {
    if (accounts.length > 0) {
      const account = accounts[0];
      console.log('We have an authorized account: ', account);
      setConnectedAccount(account);
    } else {
      console.log("No authorized accounts yet")
    }
  };

  // Get ethereum object from MetaMask and request first wallet address
  const getConnectedAccount = async () => {
    if (window.ethereum) {
      setEthereum(window.ethereum);
    }

    if (ethereum) {
      const accounts = await ethereum.request({ method: 'eth_accounts' });
      handleAccounts(accounts);
    }
  };

  // load account on page load
  useEffect(
    () => getConnectedAccount(),
  []);

  // connect to MetaMask account
  const connectAccount = async () => {
    if (!ethereum) {
      alert('MetaMask is required to connect an account');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    handleAccounts(accounts);
  };

  if (!ethereum) {
    return <p>Please install MetaMask to connect to this site. <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">Download MetaMask</a></p>
  }

  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>
  }

  return <p>Connected Account: {connectedAccount}</p>
}