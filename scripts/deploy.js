const { ethers, network } = require("hardhat");
const fs = require("fs");
const path = require("path");

const ENV_FILE_LOCATION = path.resolve(__dirname, "../app/.env");

function updateEnvVar(key, value) {
  const env = fs.readFileSync(ENV_FILE_LOCATION).toString();
  const newEnv = env.includes(key)
    ? env
        .split(/\n/)
        .map((s) => (s.startsWith(key) ? `${key}=${value}` : s))
        .join("\n")
    : `${env.trim()}\n${key}=${value}\n`;
  fs.writeFileSync(ENV_FILE_LOCATION, newEnv);
}

async function main() {
  const AccessToken = await ethers.getContractFactory("AccessToken");
  const contract = await AccessToken.deploy("https://ipfs.io/ipfs/");
  await contract.deployed();

  console.log("AccessToken deployed to:", contract.address, network.name);

  if (network.name === "localhost") {
    updateEnvVar("NEXT_PUBLIC_CONTRACT_ADDRESS", contract.address);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
