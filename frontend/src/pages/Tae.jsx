import axios from "axios";
import html2pdf from "html2pdf.js";
import { useState } from "react";
/*import bcrypt from "bcryptjs";*/

function Tae() {
  const [file, setFile] = useState("");
  const [students, setStudents] = useState([
    { name: "Alice Johnson", course: "Computer Science", token: "token123" },
    { name: "Bob Smith", course: "Engineering", token: "token456" },
  ]);

  // Function to generate a PDF Blob from HTML
  const generatePDFBlob = async (htmlElement) => {
    return await html2pdf().from(htmlElement).outputPdf("blob");
  };

  // Hash metadata using bcrypt
  function hashMetadata(metadata) {
    const metadataString = `${metadata.studentToken}${metadata.name}${metadata.department}${metadata.graduationYear}`;
    
    // Use bcrypt to hash metadata
    const salt = bcrypt.genSaltSync(10);  // 10 rounds of salting
    const hash = bcrypt.hashSync(metadataString, salt);
    
    return hash;
  }

  // Upload each diploma to Pinata
  const uploadDiplomas = async (students) => {
    const results = [];

    for (const student of students) {
      // 1. Create a temporary diploma HTML element
      const container = document.createElement("div");
      container.innerHTML = `
        <div style="padding: 2rem; font-family: sans-serif; text-align: center;">
          <h1>Diploma of ${student.name}</h1>
          <p>This certifies that <strong>${student.name}</strong> has graduated with a degree in ${student.course}</p>
        </div>
      `;

      document.body.appendChild(container); // temporarily render it

      // 2. Generate the PDF Blob from the HTML
      const pdfBlob = await generatePDFBlob(container);
      document.body.removeChild(container); // clean up after generating PDF

      // 3. Upload to Pinata
      const formData = new FormData();
      formData.append("file", pdfBlob, `${student.name}.pdf`);

      try {
        const response = await axios.post(
          "https://api.pinata.cloud/pinning/pinFileToIPFS",
          formData,
          {
            headers: {
              pinata_api_key: import.meta.env.VITE_PINATA_API_KEY,
              pinata_secret_api_key: import.meta.env.VITE_PINATA_SECRET_KEY,
              "Content-Type": "multipart/form-data",
            },
          }
        );

        const studentData = hashMetadata(student);

        const ipfsHash = response.data.IpfsHash;
        const fileUrl = "https://gateway.pinata.cloud/ipfs/" + ipfsHash;
        
        // Store result with the IPFS hash and student togit pken
        results.push({
          student:student.name,
          studentHash: studentData,
          ipfsHash,
          studentToken: student.token,
          URL: fileUrl,
        });

      } catch (err) {
        console.error("Upload failed for", student.name, err);
      }
    }

    console.log("All metadata:", results);
    return results;
  };

  // Handle file upload (no need to handle file since it's not part of this process)
  const handleSubmit = (e) => {
    e.preventDefault();
    uploadDiplomas(students);
  };

  return (
    <div>
      <h1>IPFS Upload</h1>
      <form onSubmit={handleSubmit}>
        <button type="submit">Upload Diplomas to IPFS</button>
      </form>
    </div>
  );
}

export default Tae;
