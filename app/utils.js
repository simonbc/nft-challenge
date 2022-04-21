import { ethers, network } from "ethers";
import { create as ipfsHttpClient } from "ipfs-http-client";

import Artifact from "./artifacts/contracts/AccessToken.sol/AccessToken.json";

const IPFS_BASE_URI = "https://ipfs.infura.io/ipfs/";
const ipfsClient = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const getContract = async (signer) => {
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    Artifact.abi,
    signer
  );
};

export const getTokenUri = (ipfsHash) => {
  return `${IPFS_BASE_URI}${ipfsHash}`;
};

export const ipfsAdd = async (name, description) => {
  const data = JSON.stringify({
    name,
    description,
  });

  try {
    const added = await ipfsClient.add(data);
    return added.path;
  } catch (error) {
    console.log("Error uploading file: ", error);
  }
};

export const parseEther = (value) => {
  return ethers.utils.parseUnits(value.toString(), "ether");
};
