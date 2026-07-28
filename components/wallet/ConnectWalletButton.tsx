"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const ConnectWalletButton = () => {
  return (
    <ConnectButton.Custom>
      {({
        account,
        chain,
        openConnectModal,
        openAccountModal,
        openChainModal,
        mounted,
      }) => {
        const ready = mounted;
        const connected = ready && account && chain;

        return (
          <div
            {...(!ready && {
              "aria-hidden": true,
              style: { opacity: 0, pointerEvents: "none", userSelect: "none" },
            })}
          >
            {!connected ? (
              <Button variant="outline" onClick={openConnectModal}>
                Connect Wallet
              </Button>
            ) : chain.unsupported ? (
              <Button variant="destructive" onClick={openChainModal}>
                Wrong network
              </Button>
            ) : (
              <Badge
                variant="outline"
                className="font-mono text-xs cursor-pointer"
                onClick={openAccountModal}
              >
                {account.displayName}
              </Badge>
            )}
          </div>
        );
      }}
    </ConnectButton.Custom>
  );
};

export default ConnectWalletButton;
