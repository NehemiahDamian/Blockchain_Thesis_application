        <DiplomaTemplate 

                      studentName={student.fullName}
                      studentId={student.idNumber}
                      department={student.department}
                      deanSignature={student.deanESignature}
                      graduationYear={student.expectedYearToGraduate}
                      signature={signatureUploaded ? esignatures : null}
                      signerRole="registrar"
                      registrarSignature={student.registrarDigitalSignature}

                    />

                    [
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
				"name": "ipfsHash",
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

0xD517CF823BF9f329339e5C204991D5e5F3BCE36d
