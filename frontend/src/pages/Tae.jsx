// <<<<<<< testing
// import axios from "axios";
// import html2pdf from "html2pdf.js";
// import { useState } from "react";

// // Convert string to SHA-256 hash
// async function hashMetadata(metadata) {
//   const metadataString = `${metadata.token}${metadata.name}${metadata.course}`;
//   const encoder = new TextEncoder();
//   const data = encoder.encode(metadataString);
//   const hashBuffer = await crypto.subtle.digest("SHA-256", data);

//   // Convert buffer to hex string
//   const hashArray = Array.from(new Uint8Array(hashBuffer));
//   const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
//   return hashHex;
// }

// function Tae() {
//   const [file, setFile] = useState("");
//   const [students, setStudents] = useState([
//     { name: "Alice Johnson", course: "Computer Science", token: "token123" },
//     { name: "Bob Smith", course: "Engineering", token: "token456" },
//   ]);

//   // Function to generate a PDF Blob from HTML
//   const generatePDFBlob = async (htmlElement) => {
//     return await html2pdf().from(htmlElement).outputPdf("blob");
//   };

//   // Upload each diploma to Pinata
//   const uploadDiplomas = async (students) => {
//     const smartContractOne = [];
//     const smartContractTwo =[]


//     for (const student of students) {
//       // 1. Create a temporary diploma HTML element
//       const container = document.createElement("div");
//       container.innerHTML = `
//         <div style="padding: 2rem; font-family: sans-serif; text-align: center;">
//           <h1>Diploma of ${student.name}</h1>
//           <p>This certifies that <strong>${student.name}</strong> has graduated with a degree in ${student.course}</p>
//         </div>
//       `;

//       document.body.appendChild(container); // temporarily render it

//       // 2. Generate the PDF Blob from the HTML
//       const pdfBlob = await generatePDFBlob(container);
//       document.body.removeChild(container); // clean up after generating PDF

//       // 3. Upload to Pinata
//       const formData = new FormData();
//       formData.append("file", pdfBlob, `${student.name}.pdf`);

//       try {
//         const response = await axios.post(
//           "https://api.pinata.cloud/pinning/pinFileToIPFS",
//           formData,
//           {
//             headers: {
//               pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
//               pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
//               "Content-Type": "multipart/form-data",
//             },
//           }
//         );

//         const studentHash = await hashMetadata(student);
//         const ipfsHash = response.data.IpfsHash;
//         const fileUrl = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;

//         smartContractOne.push({
//           student: student.name,
//           studentHash,
//           ipfsHash,
//           studentToken: student.token,
//           URL: fileUrl,
//         });

//         smartContractTwo.push({
//           ipfsHash,
//           studentToken:student.token
//         })

//         //database push

//       } catch (err) {
//         console.error("Upload failed for", student.name, err);
//       }
//     }

//     console.log("All metadata:", smartContractOne);
//     console.log("All metadata:", smartContractTwo);

//     return smartContractOne;
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     uploadDiplomas(students);
//   };
// =======
// // // import axios from "axios";
// // // import html2pdf from "html2pdf.js";
// // // import { useState } from "react";
// // // import { ethers } from "ethers"; // Add this import
// // // /*import bcrypt from "bcryptjs";*/

// // // function Tae() {
// // //   const [file, setFile] = useState("");
// // //   const [students, setStudents] = useState([
// // //     { name: "Alice Johnson", course: "Computer Science", token: "token123" },
// // //     { name: "Bob Smith", course: "Engineering", token: "token456" },
// // //   ]);

// // //   // Function to generate a PDF Blob from HTML
// // //   const generatePDFBlob = async (htmlElement) => {
// // //     return await html2pdf().from(htmlElement).outputPdf("blob");
// // //   };

// //   // Hash metadata using bcrypt
//   // eslint-disable-next-line no-unused-vars
//   const hashStudentData = async (student) => {
//     try {
//       const data = `${student.token}${student.name}${student.course}${student.dob}${student.department}`;
      
//       const hashBuffer = await crypto.subtle.digest(
//         'SHA-256',
//         new TextEncoder().encode(data)
//       );
      
//       const hashArray = Array.from(new Uint8Array(hashBuffer));
//       const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
//       return `0x${hashHex}`;
      
//     } catch (error) {
//       console.error("Hashing failed:", error);
//       throw error;
//     }
//   };

// // //   // Upload each diploma to Pinata
// // //   const uploadDiplomas = async (students) => {
// // //     const results = [];

// // //     for (const student of students) {
// // //       // 1. Create a temporary diploma HTML element
// // //       const container = document.createElement("div");
// // //       container.innerHTML = `
// // //         <div style="padding: 2rem; font-family: sans-serif; text-align: center;">
// // //           <h1>Diploma of ${student.name}</h1>
// // //           <p>This certifies that <strong>${student.name}</strong> has graduated with a degree in ${student.course}</p>
// // //         </div>
// // //       `;

// // //       document.body.appendChild(container); // temporarily render it

// // //       // 2. Generate the PDF Blob from the HTML
// // //       const pdfBlob = await generatePDFBlob(container);
// // //       document.body.removeChild(container); // clean up after generating PDF

// // //       // 3. Upload to Pinata
// // //       const formData = new FormData();
// // //       formData.append("file", pdfBlob, `${student.name}.pdf`);

// // //       try {
// // //         const response = await axios.post(
// // //           "https://api.pinata.cloud/pinning/pinFileToIPFS",
// // //           formData,
// // //           {
// // //             headers: {
// // //               pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
// // //               pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
// // //               "Content-Type": "multipart/form-data",
// // //             },
// // //           }
// // //         );

// // //         const studentData = await hashStudentData(student);

// // //         const ipfsHash = response.data.IpfsHash;
// // //         const fileUrl = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
        
// // //         // Store result with the IPFS hash and student togit pken
// // //         results.push({
// // //           student:student.name,
// // //           studentHash: studentData,
// // //           ipfsHash,
// // //           studentToken: student.token,
// // //           URL: fileUrl,
// // //         });

// // //       } catch (err) {
// // //         console.error("Upload failed for", student.name, err);
// // //       }
// // //     }

// // //     console.log("All metadata:", results);
// // //     return results;
// // //   };

// // //   // Handle file upload (no need to handle file since it's not part of this process)
// // //   const handleSubmit = (e) => {
// // //     e.preventDefault();
// // //     uploadDiplomas(students);
// // //   };

// // //   return (
// // //     <div>
// // //       <h1>IPFS Upload</h1>
// // //       <form onSubmit={handleSubmit}>
// // //         <button type="submit">Upload Diplomas to IPFS</button>
// // //       </form>
// // //     </div>
// // //   );
// // // }

// // // export default Tae;

// // // import { useState } from "react";
// // // import { ethers } from "ethers";
// // // import axios from "axios";
// // // import html2pdf from "html2pdf.js";

// // // function DiplomaApp() {
// // //   const [students, setStudents] = useState([
// // //     { name: "Alice Johnson", course: "Computer Science", token: "token123" },
// // //     { name: "Bob Smith", course: "Engineering", token: "token456" },
// // //   ]);
// // //   const [verificationResult, setVerificationResult] = useState(null);
// // //   const [contract, setContract] = useState(null);

// // //   // Initialize contract
// // //   const initContract = async () => {
// // //     const provider = new ethers.providers.Web3Provider(window.ethereum);
// // //     await provider.send("eth_requestAccounts", []);
// // //     const signer = provider.getSigner();
    
// // //     const contractAddress = "YOUR_CONTRACT_ADDRESS";
// // //     const contractABI = [
// // //       "function addRecords(bytes32[] studentHashes, string[] tokens, string[] ipfsHashes)",
// // //       "function verifyStudent(bytes32 studentHash) view returns (bool, string, string)"
// // //     ];
    
// // //     setContract(new ethers.Contract(contractAddress, contractABI, signer));
// // //   };

// // //   // Hash student data
// // //   const hashStudentData = async (student) => {
// // //     const data = `${student.token}${student.name}${student.course}`;
// // //     const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(data));
// // //     return ethers.utils.hexlify(new Uint8Array(hash));
// // //   };

// // //   // Generate PDF
// // //   const generatePDF = async (student) => {
// // //     const container = document.createElement("div");
// // //     container.innerHTML = `
// // //       <div style="padding: 2rem; font-family: sans-serif; text-align: center;">
// // //         <h1>Diploma of ${student.name}</h1>
// // //         <p>This certifies that <strong>${student.name}</strong> has graduated with a degree in ${student.course}</p>
// // //       </div>
// // //     `;
// // //     document.body.appendChild(container);
// // //     const pdf = await html2pdf().from(container).outputPdf("blob");
// // //     document.body.removeChild(container);
// // //     return pdf;
// // //   };

// // //   // Upload to IPFS and blockchain
// // //   const processDiplomas = async () => {
// // //     await initContract();
    
// // //     const results = await Promise.all(students.map(async (student) => {
// // //       const pdf = await generatePDF(student);
// // //       const formData = new FormData();
// // //       formData.append("file", pdf, `${student.name}.pdf`);
      
// // //       const ipfsRes = await axios.post(
// // //         "https://api.pinata.cloud/pinning/pinFileToIPFS",
// // //         formData,
// // //         {
// // //           headers: {
// // //             pinata_api_key: process.env.REACT_APP_PINATA_KEY,
// // //             pinata_secret_api_key: process.env.REACT_APP_PINATA_SECRET,
// // //             "Content-Type": "multipart/form-data",
// // //           },
// // //         }
// // //       );
      
// // //       const ipfsHash = ipfsRes.data.IpfsHash;
// // //       const studentHash = await hashStudentData(student);
      
// // //       return {
// // //         studentHash,
// // //         token: student.token,
// // //         ipfsHash,
// // //         name: student.name,
// // //         url: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
// // //       };
// // //     }));
    
// // //     // Batch upload to blockchain
// // //     await contract.addRecords(
// // //       results.map(r => r.studentHash),
// // //       results.map(r => r.token),
// // //       results.map(r => r.ipfsHash)
// // //     );
    
// // //     return results;
// // //   };

// // //   // Verify diploma
// // //   const verifyDiploma = async (name, course, token) => {
// // //     const studentHash = await hashStudentData({ name, course, token });
// // //     const [isValid, storedToken, ipfsHash] = await contract.verifyStudent(studentHash);
    
// // //     setVerificationResult({
// // //       isValid,
// // //       name,
// // //       token: storedToken,
// // //       ipfsHash,
// // //       diplomaUrl: `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
// // //     });
// // //   };

// // //   return (
// // //     <div>
// // //       <h1>Diploma Registry</h1>
      
// // //       <button onClick={processDiplomas}>Process All Diplomas</button>
      
// // //       <div>
// // //         <h2>Verify Diploma</h2>
// // //         <input placeholder="Name" id="verifyName" />
// // //         <input placeholder="Course" id="verifyCourse" />
// // //         <input placeholder="Token" id="verifyToken" />
// // //         <button onClick={() => verifyDiploma(
// // //           document.getElementById("verifyName").value,
// // //           document.getElementById("verifyCourse").value,
// // //           document.getElementById("verifyToken").value
// // //         )}>Verify</button>
        
// // //         {verificationResult && (
// // //           <div>
// // //             {verificationResult.isValid ? (
// // //               <div>
// // //                 <p>✅ Verified: {verificationResult.name}</p>
// // //                 <a href={verificationResult.diplomaUrl} target="_blank">View Diploma</a>
// // //               </div>
// // //             ) : (
// // //               <p>❌ Verification Failed</p>
// // //             )}
// // //           </div>
// // //         )}
// // //       </div>
// // //     </div>
// // //   );
// // // }

// // // export default DiplomaApp;

// >>>>>>> main



// // // // SPDX-License-Identifier: MIT
// // // pragma solidity ^0.8.0;

// // // contract DiplomaRegistry {
// // //     address public owner;
// // //     struct Record {
// // //         string token;
// // //         string ipfsHash;
// // //     }
    
// // //     mapping(bytes32 => Record) public records;
// // //     mapping(bytes32 => bool) public exists; // Simple existence flag

// // //     constructor(){
// // //         owner = msg.sender;
// // //     }
    
// // //     event DiplomaAdded(bytes32 indexed studentHash, string token, string ipfsHash);
// // //     event DuplicateSkipped(bytes32 indexed studentHash);

// // //     function addRecords(bytes32[] calldata studentHashes,string[] calldata tokens, string[] calldata ipfsHashes
// // //     ) external {
// // //         require(
// // //             studentHashes.length == tokens.length && 
// // //             tokens.length == ipfsHashes.length,
// // //             "Input length mismatch"
// // //         );
        
// // //         for (uint i = 0; i < studentHashes.length; i++) {
// // //             bytes32 hash = studentHashes[i];
            
// // //             if (exists[hash]) {
// // //                 emit DuplicateSkipped(hash);
// // //                 continue; // Skip duplicates but process others
// // //             }
            
// // //             records[hash] = Record(tokens[i], ipfsHashes[i]);
// // //             exists[hash] = true;
// // //             emit DiplomaAdded(hash, tokens[i], ipfsHashes[i]);
// // //         }
// // //     }

// // //     function verifyStudent(bytes32 studentHash) external view returns (
// // //         bool isValid,
// // //         string memory token,
// // //         string memory ipfsHash
// // //     ) {
// // //         Record memory record = records[studentHash];
// // //         return (
// // //             exists[studentHash], 
// // //             record.token,
// // //             record.ipfsHash
// // //         );
// // //     }
// // // }