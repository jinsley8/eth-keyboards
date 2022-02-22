import { useState, useEffect } from "react";
import { ethers } from "ethers";
import PrimaryButton from "../components/primary-button";
import TipButton from "../components/tip-button";
import Keyboard from "../components/keyboard";
import addressesEqual from "../utils/addressesEqual";
import ABI from "../utils/Keyboards.json";
import { UserCircleIcon } from "@heroicons/react/solid";

export default function Home() {
  const [ethereum, setEthereum] = useState(undefined);
  const [connectedAccount, setConnectedAccount] = useState(undefined);
  const [keyboards, setKeyboards] = useState([]);
  const [keyboardsLoading, setKeyboardsLoading] = useState(false);

  const contractAddress = '0x2Bc34FB991072D34fcA270195A531148F1F99110';
  const contractABI = ABI.abi;

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
  useEffect(() => getConnectedAccount(), []);

  // connect to MetaMask account
  const connectAccount = async () => {
    if (!ethereum) {
      alert('MetaMask is required to connect an account');
      return;
    }

    const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
    handleAccounts(accounts);
  };

  const getKeyboards = async () => {
    if (ethereum && connectedAccount) {
      setKeyboardsLoading(true);
      try {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const keyboardsContract = new ethers.Contract(contractAddress, contractABI, signer);
  
        const keyboards = await keyboardsContract.getKeyboards();
        console.log('Retrieved keyboards...', keyboards)
        
        setKeyboards(keyboards)
      } finally {
        setKeyboardsLoading(false);
      }
    }
  }

  useEffect(() => getKeyboards(), [connectedAccount])

  if (!ethereum) {
    return <p>Please install MetaMask to connect to this site. <a href="https://metamask.io/download/" target="_blank" rel="noopener noreferrer">Download MetaMask</a></p>
  }

  if (!connectedAccount) {
    return <PrimaryButton onClick={connectAccount}>Connect MetaMask Wallet</PrimaryButton>
  }

  if (keyboards.length > 0) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">Create a Keyboard</PrimaryButton>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2">
        {keyboards.map(
          ([kind, isPBT, filter, owner], i) => (
            <div key={i} className="relative">
              <Keyboard kind={kind} isPBT={isPBT} filter={filter} />
              <span className="absolute top-1 right-6">
                {addressesEqual(owner, connectedAccount) ?
                  <UserCircleIcon className="h-5 w-5 text-indigo-100" /> :
                  <TipButton ethereum={ethereum} index={i} />
                }
              </span>
            </div>
          )
        )}
        </div>
      </div>
    )
  }

  if (keyboardsLoading) {
    return (
      <div className="flex flex-col gap-4">
        <PrimaryButton type="link" href="/create">Create a Keyboard!</PrimaryButton>
        <p>Loading Keyboards...</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      <PrimaryButton type="link" href="/create">Create a Keyboard</PrimaryButton>
      <p>No keyboards yet!</p>
    </div>
  );
}