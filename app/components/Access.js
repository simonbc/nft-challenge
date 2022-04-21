import { useState, useEffect } from "react";
import { useRouter } from "next/router";

import { getContract } from "../utils";
import { useAddress, useSigner } from "../context/Web3";

const Access = ({ slug, children }) => {
  const [authenticated, setAuthenticated] = useState(false);
  const router = useRouter();
  const signer = useSigner();
  const address = useAddress();

  const authenticate = async () => {
    const contract = await getContract(signer);
    const hasAccess = await contract.authenticate(address, slug);

    if (hasAccess) {
      setAuthenticated(true);
    } else {
      router.push("/");
    }
  };

  useEffect(() => {
    if (address && signer) {
      authenticate();
    }
  }, [address, signer]);

  if (authenticated) {
    return <div>{children}</div>;
  }
};

export default Access;
