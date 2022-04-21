import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { useMemo, useCallback } from "react";

import { useAddress, useConnect, useDisconnect } from "../context/Web3";

const Tab = ({ children, to, disabled }) => {
  const router = useRouter();
  const tab = useMemo(() => router.asPath.replace(/^\/#?/, ""), [router]);
  const onClick = useCallback(
    () => !disabled && router.push(`${to}`),
    [router, to, disabled]
  );
  return (
    <div
      className="mx-1"
      active={(tab === to).toString()}
      onClick={onClick}
      disabled={disabled}
    >
      <Link href={to}>
        <a>{children}</a>
      </Link>
    </div>
  );
};

const Layout = ({ children }) => {
  const address = useAddress();

  const connect = useConnect();
  const disconnect = useDisconnect();

  return (
    <div className="max-w-5xl mx-auto p-16 flex justify-center items-center flex-col">
      <Head>
        <title>DoinGud</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="w-full mb-16">
        <div className="flex items-center w-full">
          <h1 className="grow text-5xl font-semibold">
            <Link href="/">
              <a>NFT challenge</a>
            </Link>
          </h1>
          <div className="mr-4 flex justify-center font-semibold">
            <Tab to={"/mint"} disabled={!address}>
              Mint Tokens
            </Tab>
          </div>
          <div className="mr-4 flex justify-center font-semibold">
            <Tab to={"/community"} disabled={!address}>
              Private Community
            </Tab>
          </div>
          <div className="text-center">
            {address ? (
              <>
                <button
                  className="py-2 px-8  border bg-black text-white"
                  onClick={disconnect}
                >
                  Disconnect wallet
                </button>
              </>
            ) : (
              <button
                className="py-2 px-8 border bg-black text-white"
                onClick={connect}
              >
                Connect wallet
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="w-full">{children}</main>
    </div>
  );
};

export default Layout;
