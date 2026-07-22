import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { arbitrum, mainnet } from "wagmi/chains";

export const wagmiConfig = getDefaultConfig({
  appName: "Hyperliquid // Dashboard",
  projectId: process.env.NEXT_PUBLIC_WC_PROJECT_ID!,
  chains: [arbitrum, mainnet],
  ssr: true,
});
