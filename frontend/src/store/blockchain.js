import { ethers } from 'ethers';

// Import ABI - This will be generated when you compile the contract
const contractABI = [
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
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
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
      }
    ],
    "name": "DiplomaRegistered",
    "type": "event"
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
];

// The contract address will be set after deployment
// Replace this with your actual deployed contract address
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';

let contract = null;
let signer = null;

export const initializeBlockchain = async () => {
  try {
    // Check if MetaMask is installed
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed. Please install it to use this application.");
    }

    // Request account access if needed
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    
    // Create a provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    
    // Get the signer
    signer = await provider.getSigner();
    console.log("Connected account:", await signer.getAddress());
    
    // Create contract instance
    contract = new ethers.Contract(contractAddress, contractABI, signer);
    console.log("Contract initialized at:", contractAddress);
    
    return contract;
  } catch (error) {
    console.error("Failed to initialize the blockchain connection:", error);
    throw error;
  }
};

export const uploadToBlockchain = async (tokens, hashes) => {
  try {
    if (!contract) {
      await initializeBlockchain();
    }
    
    if (!contract) {
      throw new Error("Contract not initialized");
    }
    
    console.log("Uploading to blockchain:", { tokens, hashes });
    
    // Use bulk register for efficiency
    const tx = await contract.bulkRegisterDiplomas(tokens, hashes);
    console.log("Transaction sent:", tx.hash);
    
    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed:", receipt);
    
    return receipt;
  } catch (error) {
    console.error("Error uploading to blockchain:", error);
    throw error;
  }
};

export const verifyDiploma = async (studentToken) => {
  try {
    if (!contract) {
      await initializeBlockchain();
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

export const getPdfIpfsHash = async (studentToken) => {
  try {
    if (!contract) {
      await initializeBlockchain();
    }
    
    const record = await contract.records(studentToken);
    return record.pdfIpfsHash;
  } catch (error) {
    console.error("Error getting PDF IPFS hash:", error);
    throw error;
  }
};