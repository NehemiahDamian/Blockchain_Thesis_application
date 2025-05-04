// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract DiplomaRegistry {
    struct DiplomaRecord {
        string studentToken;
        string pdfIpfsHash;
        uint256 timestamp;
        bool exists;
    }

    mapping(string => DiplomaRecord) public records;

    event DiplomaRegistered(
        string indexed studentToken,
        string pdfIpfsHash,
        uint256 timestamp
    );

    function registerDiploma(
        string memory _studentToken,
        string memory _pdfIpfsHash
    ) public {
        require(!records[_studentToken].exists, "Token already registered");

        records[_studentToken] = DiplomaRecord({
            studentToken: _studentToken,
            pdfIpfsHash: _pdfIpfsHash,
            timestamp: block.timestamp,
            exists: true
        });

        emit DiplomaRegistered(_studentToken, _pdfIpfsHash, block.timestamp);
    }

    // ✅ NEW FUNCTION for batch upload
    function bulkRegisterDiplomas(
        string[] memory _studentTokens,
        string[] memory _pdfIpfsHashes
    ) public {
        require(
            _studentTokens.length == _pdfIpfsHashes.length,
            "Length mismatch"
        );

        for (uint256 i = 0; i < _studentTokens.length; i++) {
            string memory token = _studentTokens[i];
            string memory hash = _pdfIpfsHashes[i];

            // Optional: skip if already exists to avoid revert
            if (!records[token].exists) {
                records[token] = DiplomaRecord({
                    studentToken: token,
                    pdfIpfsHash: hash,
                    timestamp: block.timestamp,
                    exists: true
                });

                emit DiplomaRegistered(token, hash, block.timestamp);
            }
        }
    }

    // ✅ FIXED: Now returns the studentToken, not the IPFS hash
    function verifyDiploma(
        string memory _studentToken
    )
        public
        view
        returns (string memory studentToken, uint256 timestamp, bool isValid)
    {
        DiplomaRecord memory record = records[_studentToken];
        return (record.studentToken, record.timestamp, record.exists);
    }
}
