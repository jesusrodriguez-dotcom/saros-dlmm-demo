'use client';

import { useEffect, useState } from 'react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useConnection, useWallet } from '@solana/wallet-adapter-react';
import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';
import DlmmPoolInfo from '@/components/DlmmPoolInfo';

export default function Home() {
  const { connection } = useConnection();
  const { publicKey } = useWallet();
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function loadBalance() {
      if (!publicKey) {
        setBalance(null);
        return;
      }
      const lamports = await connection.getBalance(publicKey);
      setBalance(lamports / LAMPORTS_PER_SOL);
    }
    loadBalance();
  }, [publicKey, connection]);

  const shortKey = publicKey
    ? `${publicKey.toBase58().slice(0, 4)}...${publicKey.toBase58().slice(-4)}`
    : null;

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900 text-white">
      <h1 className="text-3xl font-bold mb-6">Saros DLMM Demo</h1>
      <WalletMultiButton />
      <div className="mt-6 text-center">
        {shortKey ? (
          <>
            <p className="mb-2">Connected: {shortKey}</p>
            <p className="mb-4">Balance: {balance?.toFixed(2) ?? '—'} SOL</p>
          </>
        ) : (
          <p className="mb-4">Not connected</p>
        )}
      </div>

      {/* OPTION A: System Program account (always valid) */}
      <DlmmPoolInfo poolAddress={"11111111111111111111111111111111"} />
    </main>
  );
}
