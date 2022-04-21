import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { ethers } from "ethers";
import Web3Modal from "web3modal";

const Web3Context = React.createContext({
  address: "",
  signer: { current: undefined },
  connectWallet: () => Promise.resolve(),
  disconnectWallet: () => Promise.resolve(),
});

export const useAddress = () => useContext(Web3Context).address;
export const useSigner = () => {
  const ctx = useContext(Web3Context);
  return ctx.signer ? ctx.signer.current : undefined;
};
export const useConnect = () => useContext(Web3Context).connectWallet;
export const useDisconnect = () => useContext(Web3Context).disconnectWallet;
export const hasAccess = () => useContext(Web3Context).hasAccess;

const providerOptions = {};

export const Web3Provider = ({ children }) => {
  const [address, setAddress] = useState("");
  const signer = useRef();
  const web3Modal = useRef();

  const switchAccount = useCallback(
    (provider, accounts) => {
      setAddress(accounts[0]);
    },
    [setAddress]
  );

  const connectWallet = useCallback(async () => {
    if (!web3Modal.current) return Promise.resolve();

    const instance = await web3Modal.current.connect();
    const provider = new ethers.providers.Web3Provider(instance);

    if (provider.on) {
      provider.on("close", async () => {
        await web3Modal.current.clearCachedProvider();
      });
      provider.on("accountsChanged", switchAccount);
      provider.on("chainChanged", async () => {
        window.location.reload();
      });
      provider.on("networkChanged", async () => {
        window.location.reload();
      });
    }

    signer.current = provider.getSigner();

    const accounts = await provider.listAccounts();
    switchAccount(provider, accounts);

    return web3Modal.current;
  }, [switchAccount]);

  const disconnectWallet = useCallback(async () => {
    await web3Modal.current.clearCachedProvider();
    window.location.reload();
  });

  useEffect(() => {
    web3Modal.current = new Web3Modal({
      cacheProvider: true,
      providerOptions,
    });
    if (web3Modal.current.cachedProvider) {
      connectWallet();
    }
  }, [connectWallet, web3Modal]);

  return (
    <Web3Context.Provider
      value={{
        address,
        signer,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
