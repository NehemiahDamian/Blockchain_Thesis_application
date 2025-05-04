// import DiplomaRegistry from "./DiplomaRegistry.json";
// import { BrowserProvider, Contract, } from "ethers";
import { Contract, ethers } from 'ethers';
import{CONTRACT_ADDRESS} from "./constans.js"
// import { ethers } from 'ethers';

// Module-level variables to store provider, signer, and contract
// let provider;

const DiplomaRegistry = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "string",
        "name": "studentToken",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "pdfIpfsHash",
        "type": "string"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      }
    ],
    "name": "DiplomaRegistered",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "string[]",
        "name": "_studentTokens",
        "type": "string[]"
      },
      {
        "internalType": "string[]",
        "name": "_pdfIpfsHashes",
        "type": "string[]"
      }
    ],
    "name": "bulkRegisterDiplomas",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "",
        "type": "string"
      }
    ],
    "name": "records",
    "outputs": [
      {
        "internalType": "string",
        "name": "studentToken",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "pdfIpfsHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "exists",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_studentToken",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_pdfIpfsHash",
        "type": "string"
      }
    ],
    "name": "registerDiploma",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_studentToken",
        "type": "string"
      }
    ],
    "name": "verifyDiploma",
    "outputs": [
      {
        "internalType": "string",
        "name": "studentToken",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "isValid",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
]
let signer;
let contract;



export const initialize = async () => {
  try {
      if (!window.ethereum) {
        throw new Error("MetaMask is not installed. Please install it to use this application.");
      }
  
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      const provider = new ethers.BrowserProvider(window.ethereum);
      
      signer = await provider.getSigner();
      console.log("Connected account:", await signer.getAddress());
      
    contract = new Contract(CONTRACT_ADDRESS, DiplomaRegistry, signer);
    return contract;
  } catch (error) {
    console.error("Initialization error:", error);
    throw error;
  }
};

export const uploadToBlockchain = async (tokens, hashes) => {
  try {
    if (!contract) await initialize();
    
    console.log("Sending transaction...");
    const tx = await contract.bulkRegisterDiplomas(tokens, hashes);
    console.log("Tx sent, waiting for confirmation...", tx.hash);
    
    const timeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error("Transaction timeout (2 minutes)")), 120000)
    );
    
    const receipt = await Promise.race([tx.wait(), timeout]);
    console.log("Confirmed!", receipt);
    return receipt;
    
  } catch (error) {
    console.error("Full error details:", {
      error,
      message: error.message,
      code: error.code,
      data: error.data
    });
    
    let userMessage = error.message;
    if (error.code === "ACTION_REJECTED") {
      userMessage = "User denied transaction";
    } else if (error.code === "CALL_EXCEPTION") {
      userMessage = "Contract call failed (check parameters)";
    }
    
    throw new Error(userMessage);
  }
};

initialize();



export const verifyDiploma = async (studentToken) => {
  try {
    if (!contract) {
      await initialize();
    }
    
    const result = await contract.verifyDiploma(studentToken);
    return {
      studentToken: result[0],
      timestamp: Number(result[1]),
      isValid: result[2]
    };
  } catch (error) {
    console.error("Error verifying diploma:", error);
    throw error;
  }
};

// export const getPdfIpfsHash = async (studentToken) => {
//   try {
//     if (!contract) {
//       await initialize();
//     }
    
//     const record = await contract.records(studentToken);
//     return record.pdfIpfsHash;
//   } catch (error) {
//     console.error("Error getting PDF IPFS hash:", error);
//     throw error;
//   }
// };