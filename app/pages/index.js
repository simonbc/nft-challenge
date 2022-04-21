import { useState, useEffect } from "react";
import Link from "next/link";

import { Web3Provider, useSigner, useAddress } from "../context/Web3";
import {
  getContract,
  parseEther,
  fetchTokens,
  fetchPurchasedTokens,
} from "../utils";

import Layout from "../components/Layout";

const HomeContent = () => {
  const [tokens, setTokens] = useState([]);
  const [userTokens, setUserTokens] = useState([]);

  const signer = useSigner();

  useEffect(() => {
    if (signer) {
      fetchPurchasedTokens(signer).then((purchasedTokens) => {
        setUserTokens(purchasedTokens);
        fetchTokens(signer).then((tokens) => {
          setTokens(
            tokens.filter(
              (t) => !purchasedTokens.find((pt) => pt.tokenId == t.tokenId)
            )
          );
        });
      });
    }
  }, [signer]);

  const purchase = async (tokenId, price) => {
    const contract = await getContract(signer);
    const value = parseEther(price);
    const tx = await contract.purchase(tokenId, {
      value,
    });

    await tx.wait();

    location.reload();
  };

  return (
    <>
      {userTokens.length > 0 && (
        <>
          <h2 className="mb-8 text-3xl font-semibold">Your tokens</h2>
          <div className="mb-8 flex flex-wrap w-full">
            {userTokens.map((token, i) => (
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

      {tokens.length > 0 && (
        <>
          <h2 className="mb-8 text-3xl font-semibold">Purchase tokens</h2>
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
