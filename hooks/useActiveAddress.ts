import { useAccount } from "wagmi";
import { useAddressStore } from "@/lib/store/useAddressStore";

const useActiveAddress = () => {
  const { address: connectedAddress, isConnected } = useAccount();
  const manualAddress = useAddressStore((s) => s.manualAddress);
  const setManualAddress = useAddressStore((s) => s.setManualAddress);
  const clearManualAddress = useAddressStore((s) => s.clearManualAddress);

  const user = (manualAddress ?? connectedAddress ?? "") as `0x${string}`;
  const source: "manual" | "wallet" | "none" = manualAddress
    ? "manual"
    : isConnected
      ? "wallet"
      : "none";

  return {
    user,
    source,
    connectedAddress,
    manualAddress,
    setManualAddress,
    clearManualAddress,
  };
};

export default useActiveAddress;
