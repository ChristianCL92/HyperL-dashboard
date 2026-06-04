import { useQuery } from "@tanstack/react-query";
import { infoClient } from "@/lib/hyperliquid/client";

const useSpotState = (user: `0x${string}`) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["useSpotClearinghouseState", user],
    queryFn: () => infoClient.spotClearinghouseState({ user }),
    enabled: !!user,
  });
  return {
    spot: { data, isLoading, error },
  };
};

export default useSpotState;
