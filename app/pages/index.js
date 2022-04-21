import { ethers } from "ethers";
import { useState, useEffect } from "react";
import axios from "axios";

import {
  Web3Provider,
  useSigner,
  useAddress,
  useConnect,
  useDisconnect,
} from "../context/Web3";
import { ipfsAdd, getContract, parseEther } from "../utils";

import Layout from "../components/Layout";

const HomeContent = () => {
  const [tokens, setTokens] = useState([]);

  const signer = useSigner();
  const address = useAddress();
  const connect = useConnect();
  const disconnect = useDisconnect();

  useEffect(() => {
    if (signer) {
      fetchTokens();
    }
  }, [signer]);

  const fetchTokens = async () => {
    const contract = await getContract(signer);
    const data = await contract.getTokens();

    const newTokens = [];

    for (let token of data) {
      const tokenId = Number(token[0]);
      const amount = Number(token[1]);
      const price = parseFloat(ethers.utils.formatEther(token[2].toString()));
      const slug = token[3];
      const ipfsHash = token[4];

      const uri = await contract.uri(tokenId);
      const metadata = await axios.get(uri);
      const { name, description } = metadata.data;

      newTokens.push({
        tokenId,
        name,
        description,
        amount,
        price,
        slug,
      });
    }

    setTokens(newTokens);
  };

  const purchase = async (tokenId, price) => {
    const contract = await getContract(signer);
    const value = parseEther(price);
    const tx = await contract.purchase(tokenId, {
      value,
    });

    await tx.wait();

    location.reload();
  };

  const mint = async (e) => {
    e.preventDefault();

    const { name, description, slug, amount, price } = e.target;

    // Save metadata to IPFS
    const ipfsHash = await ipfsAdd(name.value, description.value);

    const priceEther = parseEther(price.value);

    const contract = await getContract(signer);
    const tx = await contract.mint(
      slug.value,
      parseInt(amount.value),
      priceEther,
      ipfsHash
    );

    await tx.wait();

    location.reload();
  };

  return (
    <>
      {tokens.length > 0 && (
        <div className="mb-8 flex flex-wrap w-full">
          {tokens.map((token, i) => (
            <div key={i} className="mb-4 mr-4 p-8 border w-96 shadow rounded">
              <div className="flex items-center">
                <h3 className="mb-4 grow text-xl font-semibold">
                  {token.name}
                </h3>
                <div className="mb-2 text-sm font-semibold">
                  {token.price} matic
                </div>
              </div>
              <div className="mb-2 text">{token.description}</div>

              <button
                className="px-4 py-2 border bg-black text-white"
                onClick={() => purchase(token.tokenId, token.price)}
              >
                Purchase
              </button>
            </div>
          ))}
        </div>
      )}

      {address && (
        <>
          <h2 className="mb-8 text-3xl font-semibold">Mint tokens</h2>
          <form className="w-96" onSubmit={mint}>
            <div className="mb-4 w-full">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-semibold"
              >
                Name
              </label>
              <input
                required
                id="name"
                className="p-4 border w-full"
                type="text"
                name="name"
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-semibold"
              >
                Description
              </label>
              <textarea
                required
                id="description"
                className="p-4 border w-full"
                type="text"
                name="description"
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="slug"
                className="block mb-2 text-sm font-semibold"
              >
                Slug
              </label>
              <input
                required
                id="slug"
                className="p-4 border w-full"
                type="text"
                name="slug"
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="amount"
                className="block mb-2 text-sm font-semibold"
              >
                Amount
              </label>
              <input
                required
                id="amount"
                className="p-4 border w-full"
                type="number"
                name="amount"
              />
            </div>
            <div className="mb-4 w-full">
              <label
                htmlFor="price"
                className="block mb-2 text-sm font-semibold"
              >
                Price
              </label>
              <input
                required
                id="price"
                className="p-4 border w-full"
                type="text"
                name="price"
              />
            </div>
            <button
              type="submit"
              className="w-full mb-4 p-4 border bg-black text-white"
            >
              Mint access token
            </button>
          </form>
        </>
      )}
    </>
  );
};

const Home = () => {
  return (
    <Web3Provider>
      <Layout>
        <HomeContent />
      </Layout>
    </Web3Provider>
  );
};

export default Home;
