"use client";

import { useEffect, useState } from "react";
import { useConnection } from "@solana/wallet-adapter-react";
import { PublicKey } from "@solana/web3.js";

type Props = {
  poolAddress: string;           // base58 account address to inspect
};

export default function DlmmPoolInfo({ poolAddress }: Props) {
  const { connection } = useConnection();
  const [status, setStatus] = useState<"idle"|"loading"|"ok"|"error">("idle");
  const [owner, setOwner] = useState<string | null>(null);
  const [lamports, setLamports] = useState<number | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    async function run() {
      setStatus("loading");
      setErr(null);
      setOwner(null);
      setLamports(null);

      try {
        // Validate address
        const pk = new PublicKey(poolAddress.trim());
        // Fetch basic account info
        const acct = await connection.getAccountInfo(pk);
        if (!acct) {
          setErr("Account not found on this cluster (check Devnet vs Mainnet).");
          setStatus("error");
          return;
        }
        setOwner(acct.owner.toBase58());
        setLamports(acct.lamports);
        setStatus("ok");
      } catch (e: any) {
        setErr(e?.message ?? String(e));
        setStatus("error");
      }
    }
    run();
  }, [poolAddress, connection]);

  if (status === "loading") {
    return <p className="mt-8 text-slate-300">Loading pool account…</p>;
  }
  if (status === "error") {
    return <p className="mt-8 text-red-500">{err}</p>;
  }
  if (status === "ok") {
    return (
      <div className="mt-8 rounded-lg border border-slate-700 p-4 text-slate-200">
        <p className="mb-2"><span className="font-semibold">Pool:</span> {poolAddress}</p>
        <p className="mb-2"><span className="font-semibold">Owner:</span> {owner}</p>
        <p><span className="font-semibold">Lamports:</span> {lamports}</p>
        <p className="mt-2 text-xs text-slate-400">
          Tip: if Owner is a program address (not System Program), this account is likely
          managed by that program. Use real DLMM pool addresses on **Devnet** for testing.
        </p>
      </div>
    );
  }
  return null;
}
