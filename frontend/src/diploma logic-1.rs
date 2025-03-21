// Mock diplomas (Simulated MongoDB Data)
// const initialDiplomas = [
//   {
//     id: 1,
//     studentName: "John Doe",
//     courseName: "Computer Science",
//     date: "June 10, 2024",
//     institutionName: "Tech University",
//     deanName: null,
//     deanSignature: null,
//     digitalSignature: null,
//     unique: "kikoy",
//   },
//   {
//     id: 2,
//     studentName: "Jane Smith",
//     courseName: "Business Administration",
//     date: "May 15, 2024",
//     institutionName: "Global Business School",
//     deanName: null,
//     deanSignature: null,
//     digitalSignature: null,
//     unique: "chikoy",
//   },
// ];

function App() {
  // const [deanName, setDeanName] = useState("");
  // const [deanSignature, setDeanSignature] = useState("");
  // const [privateKey, setPrivateKey] = useState("my-secret-private-key"); // Simulated private key
  // const [diplomas, setDiplomas] = useState([]); // Start empty, populate on click

  // // Function to sign all diplomas with name & signature
  // const handleSignAllDiplomas = () => {
  //   if (!deanName || !deanSignature) {
  //     alert("Please enter your name and signature before signing.");
  //     return;
  //   }

  //   const signedDiplomas = diplomas.map((diploma) => ({
  //     ...diploma,
  //     deanName,
  //     deanSignature,
  //   }));

  //   setDiplomas(signedDiplomas);
  //   alert("All diplomas signed with name & signature!");
  // };

  // // Function to digitally sign all diplomas
  // const handleDigitalSignAllDiplomas = () => {
  //   if (!privateKey) {
  //     alert("Private key not found! Digital signing failed.");
  //     console.log(privateKey)
  //     return;
  //   }

  //   const digitallySignedDiplomas = diplomas.map((diploma) => {
  //     // Create a unique hash of the diploma data
  //     const diplomaData = JSON.stringify({
  //       studentName: diploma.studentName,
  //       courseName: diploma.courseName,
  //       date: diploma.date,
  //       unique: diploma.unique,
  //     });

  //     // Generate digital signature using private key (SHA-256 hash)
  //     const hash = crypto.createHmac("sha256", privateKey).update(diplomaData).digest("hex");

  //     return {
  //       ...diploma,
  //       digitalSignature: hash,
  //     };
  //   });

  //   const handleDigitalSignAllDiplomas = async () => {
  //     if (!diplomas.length) {
  //       alert("No diplomas to sign.");
  //       return;
  //     }
    
  //     try {
  //       const digitallySignedDiplomas = await Promise.all(
  //         diplomas.map(async (diploma) => {
  //           const response = await fetch("http://localhost:5000/sign-diploma", {
  //             method: "POST",
  //             headers: {
  //               "Content-Type": "application/json",
  //             },
  //             body: JSON.stringify({
  //               studentName: diploma.studentName,
  //               courseName: diploma.courseName,
  //               date: diploma.date,
  //               unique: diploma.unique,
  //             }),
  //           });
    
  //           const data = await response.json();
  //           return {
  //             ...diploma,
  //             digitalSignature: data.digitalSignature,
  //           };
  //         })
  //       );
    
  //       setDiplomas(digitallySignedDiplomas);
  //       alert("All diplomas digitally signed!");
  //     } catch (error) {
  //       console.error("Error signing diplomas:", error);
  //       alert("Failed to sign diplomas.");
  //     }
  //   };
    
  // };

  // // Function to process diplomas when button is clicked
  // const handleProcessDiplomas = () => {
  //   setDiplomas(initialDiplomas);
  // };

  // return (
  //   <div className="app-container">
  //     <h1>Dean Panel - Process Diplomas</h1>

  //     {/* Dean's Input Fields */}
  //     <div style={{ marginBottom: "20px" }}>
  //       <input 
  //         type="text"
  //         placeholder="Dean's Name"
  //         value={deanName}
  //         onChange={(e) => setDeanName(e.target.value)}
  //       />
  //       <input
  //         type="text"
  //         placeholder="Signature"
  //         value={deanSignature}
  //         onChange={(e) => setDeanSignature(e.target.value)}
  //       />
  //     </div>

  //     {/* Buttons */}
  //     <button onClick={handleProcessDiplomas}>Process Diplomas</button>
  //     <button onClick={handleSignAllDiplomas} disabled={!diplomas.length}>Sign All Diplomas</button>
  //     <button onClick={handleDigitalSignAllDiplomas} disabled={!diplomas.length}>Digitally Sign All Diplomas</button>

  //     {/* Render diplomas AFTER button is clicked */}
  //     <div>
  //       {diplomas.map((diploma) => (
  //         <Diploma key={diploma.id} {...diploma} />
  //       ))}
  //     </div>
//     </div>
//   );