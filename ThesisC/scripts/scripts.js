// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  const DiplomaRegistry = await hre.ethers.getContractFactory("DiplomaRegistry");
  const diplomaRegistry = await DiplomaRegistry.deploy();

  await diplomaRegistry.waitForDeployment(); // ✅ Use waitForDeployment() if using ethers v6

  console.log("DiplomaRegistry deployed to:", await diplomaRegistry.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
