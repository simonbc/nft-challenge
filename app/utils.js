import { ethers, network } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";

import Artifact from "./artifacts/contracts/AccessToken.sol/AccessToken.json";

const ipfsClient = ipfsHttpClient("https://ipfs.infura.io:5001/api/v0");

export const getContract = async (signer) => {
  return new ethers.Contract(
    process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    Artifact.abi,
    signer
  );
};

export const fetchTokens = async (signer) => {
  const contract = await getContract(signer);
  const data = await contract.getTokens();

  const tokens = [];

  for (let token of data) {
    const tokenId = Number(token[0]);
    const amount = Number(token[1]);
    const price = parseFloat(ethers.utils.formatEther(token[2].toString()));
    const slug = token[3];

    const uri = await contract.uri(tokenId);
    const metadata = await axios.get(uri);
    const { name, description } = metadata.data;

    tokens.push({
      tokenId,
      name,
      description,
      amount,
      price,
      slug,
    });
  }

  return tokens;
};

export const fetchPurchasedTokens = async (signer) => {
  const contract = await getContract(signer);
  const data = await contract.getPurchasedTokens();

  const tokens = [];

  for (let token of data) {
    const tokenId = Number(token[0]);
    const amount = Number(token[1]);
    const price = parseFloat(ethers.utils.formatEther(token[2].toString()));
    const slug = token[3];
    const ipfsHash = token[4];

    const uri = await contract.uri(tokenId);
    const metadata = await axios.get(uri);
    const { name, description } = metadata.data;

    tokens.push({
      tokenId,
      name,
      description,
      amount,
      price,
      slug,
    });
  }

  return tokens;
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
