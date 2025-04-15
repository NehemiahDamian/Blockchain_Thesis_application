async function hashAndCompare(input, targetHash) {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

  console.log("Hashed input:", hashHex);

  if (hashHex === targetHash) {
    console.log("✅ It matches!");
  } else {
    console.log("❌ No match.");
  }
}

// Use the actual string used for generating the hash
const input = "token123Alice JohnsonComputer Science";
const givenHash = "352b99e677918cc337cfe9d942ec4d7fb25040293a43d8c8243e1792facb4276";

hashAndCompare(input, givenHash);
