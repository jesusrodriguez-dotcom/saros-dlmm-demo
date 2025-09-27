"use client";

import "./globals.css";
import { ReactNode } from "react";

// Solana + Wallet Adapter imports
import { ConnectionProvider, WalletProvider } from "@solana/wallet-adapter-react";
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";

// Default styles for the wallet modal
import "@solana/wallet-adapter-react-ui/styles.css";

export default function RootLayout({ children }: { children: ReactNode }) {
  // Use Solana devnet for now (you can switch to "mainnet-beta" later)
  const endpoint = "https://api.devnet.solana.com";

  // Add more wallets here if you want (e.g. Solflare)
  const wallets = [new PhantomWalletAdapter()];

  return (
    <html lang="en">
      <body>
        <ConnectionProvider endpoint={endpoint}>
          <WalletProvider wallets={wallets} autoConnect>
            <WalletModalProvider>
              {children}
            </WalletModalProvider>
          </WalletProvider>
        </ConnectionProvider>
      </body>
    </html>
  );
}
