import NodeRSA from "node-rsa";

export const generateKeyPair = () => {
  const key = new NodeRSA().generateKeyPair(); // Generate RSA key pair
  return {
    publicKey: key.exportKey("public"),   // Export public key
    privateKey: key.exportKey("private"), // Export private key
  };
};
