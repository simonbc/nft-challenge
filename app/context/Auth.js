import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

export const AuthContext = React.createContext({
  hasAccess: () => Promise.resolve(),
});

export const hasAccess = () => useContext(Web3Context).hasAccess;

export const Web3Provider = ({ children }) => {
  const hasAccess = useCallback(async (slug) => {
    const signer = useSigner();
    const address = useAddress();
    const contract = await getContract(signer);
    contract.authenticate(address, slug);
  }, []);

  return (
    <AuthContext.Provider value={{ hasAccess }}>
      {children}
    </AuthContext.Provider>
  );
};
