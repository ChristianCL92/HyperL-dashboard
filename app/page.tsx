"use client";

import useClearingState from "@/hooks/useSpotState";
import usePerpState from "@/hooks/usePerpState";
import useL2BookState from "@/hooks/useL2BookState";

export default function Home() {
  const user = (process.env.NEXT_PUBLIC_USER_ADDRESS ?? "") as `0x${string}`;
  const { spot } = useClearingState(user);
  const { perps } = usePerpState(user);
  const { l2Book, isLoadingOrderBook, orderBookError } = useL2BookState("BTC");
  if (spot.isLoading || perps.isLoading) return <div>Loading...</div>;
  if (spot.error || perps.error)
    return <div>Error: {spot.error?.message || perps.error?.message}</div>;

  const spotBalance = spot.data?.balances.map((total) => (
    <div key={total.coin} className="flex gap-2">
      <div>{total.coin}</div>
      <p>{total.total}</p>
    </div>
  ));
  const bids = l2Book?.levels[0] ?? [];
  const ask = l2Book?.levels[1] ?? [];
  const bestBid = bids[0] ? parseFloat(bids[0].px) : null;
  const bestAsk = ask[0] ? parseFloat(ask[0].px) : null;
  const spread =
    bestBid !== null && bestAsk !== null ? bestBid - bestAsk : null;
  return (
    <>
      <div className="flex flex-col gap-8">
        <section>
          <p>Active perpetual futures trades</p>
          <div>{JSON.stringify(perps.data, null, 2)}</div>
        </section>
        <section>
          <p>Spot balances</p>
          <div>{spotBalance}</div>
        </section>
        <section>
          <p>BTC Order Book</p>
          {isLoadingOrderBook && <div>Loading book…</div>}
          {orderBookError && <div>Error: {orderBookError.message}</div>}
          {l2Book && (
            <>
              <div>Spread: {spread?.toFixed(2)}</div>
              <div className="flex gap-8 font-mono text-sm">
                <div>
                  <p className="font-semibold">Bids</p>
                  {bids.slice(0, 10).map((lvl) => (
                    <div key={lvl.px} className="flex gap-4">
                      <span className="text-green-600">{lvl.px}</span>
                      <span>{lvl.sz}</span>
                    </div>
                  ))}
                </div>
                <div>
                  <p className="font-semibold">Asks</p>
                  {ask.slice(0, 10).map((lvl) => (
                    <div key={lvl.px} className="flex gap-4">
                      <span className="text-red-600">{lvl.px}</span>
                      <span>{lvl.sz}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </section>
      </div>
    </>
  );
}
