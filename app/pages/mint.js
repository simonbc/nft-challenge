import { useState, useEffect } from "react";

import { Web3Provider, useSigner, useAddress } from "../context/Web3";
import { ipfsAdd, getContract, parseEther, fetchTokens } from "../utils";

import Layout from "../components/Layout";

const MintContent = () => {
  const [tokens, setTokens] = useState([]);
  const [purchasedTokens, setPurchasedTokens] = useState([]);

  const signer = useSigner();
  const address = useAddress();

  useEffect(() => {
    if (signer) {
      fetchTokens(signer).then((tokens) => setTokens(tokens));
    }
  }, [signer]);

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
        <>
          <h2 className="mb-8 text-3xl font-semibold">Minted tokens</h2>
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
              </div>
            ))}
          </div>
        </>
      )}

      {address && (
        <>
          <h2 className="mb-8 text-3xl font-semibold">Mint token</h2>
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

const Mint = () => {
  return (
    <Web3Provider>
      <Layout>
        <MintContent />
      </Layout>
    </Web3Provider>
  );
};

export default Mint;
