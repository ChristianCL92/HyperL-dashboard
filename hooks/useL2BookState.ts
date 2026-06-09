import { useQuery } from "@tanstack/react-query";
import { infoClient } from "@/lib/hyperliquid/client";

const useL2BookState = (coin: string) => {
  const {
    data: l2Book,
    isLoading: isLoadingOrderBook,
    error: orderBookError,
  } = useQuery({
    queryKey: ["l2Book", coin],
    queryFn: () => infoClient.l2Book({ coin }),
    enabled: !!coin,
    refetchInterval: 6000,
    staleTime: 1_000,
  });

  return { l2Book, isLoadingOrderBook, orderBookError };
};

export default useL2BookState;
