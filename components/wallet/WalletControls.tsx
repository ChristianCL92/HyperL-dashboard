"use client";

import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ConnectWalletButton from "@/components/wallet/ConnectWalletButton";
import ManualAddressDialog from "@/components/wallet/ManualAddressDialog";
import useActiveAddress from "@/hooks/useActiveAddress";

const WalletControls = () => {
  const { manualAddress, clearManualAddress } = useActiveAddress();

  return (
    <div className="flex items-center gap-2">
      {manualAddress && (
        <Badge variant="secondary" className="font-mono text-xs gap-1">
          Viewing {manualAddress.slice(0, 6)}…{manualAddress.slice(-4)}
          <button
            type="button"
            aria-label="Clear address override"
            onClick={clearManualAddress}
            className="ml-0.5"
          >
            <X className="size-3" />
          </button>
        </Badge>
      )}
      <ManualAddressDialog />
      <ConnectWalletButton />
    </div>
  );
};

export default WalletControls;
