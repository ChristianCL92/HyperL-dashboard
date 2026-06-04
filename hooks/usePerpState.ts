import { useQuery } from "@tanstack/react-query";
import { infoClient } from "@/lib/hyperliquid/client";

const usePerpState = (user: `0x${string}`) => {
  const {
    data: perps,
    isLoading: perpsLoading,
    error: perpsError,
  } = useQuery({
    queryKey: ["useClearingHouseState", user],
    queryFn: () => infoClient.clearinghouseState({ user }),
    enabled: !!user,
  });
  return {
    perps: { data: perps, isLoading: perpsLoading, error: perpsError },
  };
};

export default usePerpState;
