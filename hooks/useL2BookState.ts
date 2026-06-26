import {
  keepPreviousData,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { infoClient, subscribeClient } from "@/lib/hyperliquid/client";
import { useEffect } from "react";

const useL2BookState = (coin: string) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["l2Book", coin],
    queryFn: () => infoClient.l2Book({ coin }),
    enabled: !!coin,
    staleTime: Infinity,
    refetchOnWindowFocus: false,
    placeholderData: keepPreviousData,
  });

  useEffect(() => {
    if (!coin) return;

    let sub: { unsubscribe: () => Promise<void> } | null = null;
    let cancelled = false;

    subscribeClient
      .l2Book({ coin }, (book) => {
        queryClient.setQueryData(["l2Book", coin], book);
      })
      .then((s) => {
        if (cancelled) s.unsubscribe();
        else sub = s;
      });

    return () => {
      cancelled = true;
      sub?.unsubscribe();
    };
  }, [coin]);

  return {
    l2Book: query.data,
    isLoadingOrderBook: query.isLoading,
    orderBookError: query.error,
  };
};
export const useL2BookGetCoinData = () => {
  return useQuery({
    queryKey: ["l2BookCoinSelector"],
    queryFn: () => {
      return infoClient.meta();
    },
    placeholderData: keepPreviousData,
    staleTime: Infinity,
  });
};

export default useL2BookState;
