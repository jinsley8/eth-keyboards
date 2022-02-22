import { ethers } from "ethers";

import ABI from "../utils/Keyboards.json";

const contractAddress = '0x2Bc34FB991072D34fcA270195A531148F1F99110';
const contractABI = ABI.abi;

export default function getKeyboardsContract(ethereum) {
  if(ethereum) {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    return new ethers.Contract(contractAddress, contractABI, signer);
  } else {
    return undefined;
  }
}
