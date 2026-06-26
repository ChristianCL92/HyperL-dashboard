import {
  InfoClient,
  HttpTransport,
  WebSocketTransport,
  SubscriptionClient,
} from "@nktkas/hyperliquid";

const isTestnet = process.env.NEXT_PUBLIC_HL_NETWORK !== "mainnet";

export const infoClient = new InfoClient({
  transport: new HttpTransport({ isTestnet }),
});

export const subscribeClient = new SubscriptionClient({
  transport: new WebSocketTransport({ isTestnet }),
});
