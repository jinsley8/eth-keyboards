import { useState } from "react";
import SecondaryButton from "./secondary-button";
import { ethers } from "ethers";
import ABI from "../utils/Keyboards.json"

export default function TipButton({ ethereum, index }) {
  const contractAddress = '0x930Fe71cd14b9463690b58D803931394E075084F';
  const contractABI = ABI.abi;

  const [mining, setMining] = useState(false)

  const submitTip = async (e) => {
    if (!ethereum) {
      console.error('Ethereum object is required to submit a tip');
      return;
    }

    setMining(true);
    try {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      const keyboardsContract = new ethers.Contract(contractAddress, contractABI, signer);

      const tipTxn = await keyboardsContract.tip(index, { value: ethers.utils.parseEther("0.01") })
      console.log('Tip transaction started...', tipTxn.hash)

      await tipTxn.wait();
      console.log('Sent tip!', tipTxn.hash);
    } finally {
      setMining(false);
    }
  }

  return <SecondaryButton onClick={submitTip} disabled={mining}>
    {mining ? 'Tipping...' : 'Tip 0.01 ETH!'}
  </SecondaryButton>
}
