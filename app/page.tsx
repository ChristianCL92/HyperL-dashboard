"use client";

import { useState } from "react";
import useClearingState from "@/hooks/useSpotState";
import usePerpState from "@/hooks/usePerpState";
import useL2BookState from "@/hooks/useL2BookState";
import { useL2BookGetCoinData } from "@/hooks/useL2BookState";
import { cn } from "@/lib/utils";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";

export default function Home() {
  const user = (process.env.NEXT_PUBLIC_USER_ADDRESS ?? "") as `0x${string}`;
  const [coin, setCoin] = useState("BTC");
  const { spot } = useClearingState(user);
  const { perps } = usePerpState(user);
  const { l2Book, isLoadingOrderBook, orderBookError } = useL2BookState(coin);
  const meta = useL2BookGetCoinData();
  console.log("meta data", meta);

  const isLoading = spot.isLoading || perps.isLoading;
  const summary = perps.data?.marginSummary;
  const positions = perps.data?.assetPositions ?? [];
  const balances = spot.data?.balances ?? [];
  const bids = l2Book?.levels[0] ?? [];
  const asks = l2Book?.levels[1] ?? [];
  const bestBid = bids[0] ? parseFloat(bids[0].px) : null;
  const bestAsk = asks[0] ? parseFloat(asks[0].px) : null;
  const spread =
    bestBid !== null && bestAsk !== null
      ? (bestAsk - bestBid).toFixed(2)
      : null;

  const shortAddr = user ? `${user.slice(0, 6)}…${user.slice(-4)}` : "—";

  return (
    <div className="max-w-screen-xl mx-auto px-6 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold tracking-widest uppercase">
          Hyperliquid // Dashboard
        </h1>
        <Badge variant="outline" className="font-mono text-xs">
          {shortAddr}
        </Badge>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[
          { label: "Account Value", value: summary?.accountValue },
          { label: "Total Notional", value: summary?.totalNtlPos },
          { label: "Margin Used", value: summary?.totalMarginUsed },
          { label: "Withdrawable", value: perps.data?.withdrawable },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-1">
              <CardDescription className="text-xs uppercase tracking-wider">
                {label}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-6 w-24" />
              ) : (
                <p className="text-lg font-semibold font-mono">
                  $
                  {value
                    ? parseFloat(value).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                    : "—"}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Perpetual Positions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Perpetual Positions</CardTitle>
            <CardDescription>
              Active open positions across all markets
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex flex-col gap-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-10 w-full" />
                ))}
              </div>
            ) : positions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                No open positions
              </p>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Coin</TableHead>
                    <TableHead>Direction</TableHead>
                    <TableHead className="text-right">Size</TableHead>
                    <TableHead className="text-right">Entry</TableHead>
                    <TableHead className="text-right">Liq. Price</TableHead>
                    <TableHead className="text-right">Unr. PnL</TableHead>
                    <TableHead className="text-right">Leverage</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {positions.map(({ position: p }) => {
                    const isLong = parseFloat(p.szi) >= 0;
                    const pnl = parseFloat(p.unrealizedPnl);
                    return (
                      <TableRow key={p.coin}>
                        <TableCell className="font-semibold">
                          {p.coin}
                        </TableCell>
                        <TableCell>
                          <Badge variant={isLong ? "secondary" : "destructive"}>
                            {isLong ? "LONG" : "SHORT"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {Math.abs(parseFloat(p.szi)).toFixed(4)}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          ${parseFloat(p.entryPx).toLocaleString()}
                        </TableCell>
                        <TableCell className="text-right font-mono text-muted-foreground">
                          {p.liquidationPx
                            ? `$${parseFloat(p.liquidationPx).toLocaleString()}`
                            : "—"}
                        </TableCell>
                        <TableCell
                          className={cn(
                            "text-right font-mono",
                            pnl >= 0 ? "text-emerald-500" : "text-red-500",
                          )}
                        >
                          {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Badge variant="outline">
                            {p.leverage.value}x {p.leverage.type}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>

        {/* Right column */}
        <div className="flex flex-col gap-6">
          {/* Spot Balances */}
          <Card>
            <CardHeader>
              <CardTitle>Spot Balances</CardTitle>
              <CardDescription>Token holdings</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-8 w-full" />
                  ))}
                </div>
              ) : balances.length === 0 ? (
                <p className="text-sm text-muted-foreground py-4 text-center">
                  No balances
                </p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Coin</TableHead>
                      <TableHead className="text-right">Balance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {balances.map((b) => (
                      <TableRow key={b.coin}>
                        <TableCell className="font-semibold">
                          {b.coin}
                        </TableCell>
                        <TableCell className="text-right font-mono">
                          {parseFloat(String(b.total)).toFixed(4)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>

          {/* Order Book */}
          <Select
            value={coin}
            onValueChange={(value) => value && setCoin(value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a coin" />
            </SelectTrigger>
            <SelectContent>
              {meta.data?.universe.map((asset) => (
                <SelectItem key={asset.name} value={asset.name}>
                  {asset.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>{coin} Order Book</CardTitle>
                  <CardDescription>
                    <CardDescription>
                      {coin
                        ? "Top 10 levels · refreshes every 6s"
                        : "Enter a valid coin to view order book"}
                    </CardDescription>
                  </CardDescription>
                </div>
                {spread && (
                  <Badge variant="outline" className="font-mono text-xs">
                    Spread ${spread}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              {isLoadingOrderBook && !l2Book && (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              )}
              {orderBookError && (
                <p className="text-sm text-destructive">
                  {orderBookError.message}
                </p>
              )}
              {l2Book && (
                <div className="flex gap-6 font-mono text-xs">
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className="text-muted-foreground uppercase tracking-wider mb-1">
                      Bids
                    </p>
                    <Separator className="mb-1" />
                    {bids.slice(0, 10).map((lvl) => (
                      <div key={lvl.px} className="flex justify-between">
                        <span className="text-emerald-500">{lvl.px}</span>
                        <span className="text-muted-foreground">{lvl.sz}</span>
                      </div>
                    ))}
                  </div>
                  <Separator orientation="vertical" className="h-auto" />
                  <div className="flex-1 flex flex-col gap-0.5">
                    <p className="text-muted-foreground uppercase tracking-wider mb-1">
                      Asks
                    </p>
                    <Separator className="mb-1" />
                    {asks.slice(0, 10).map((lvl) => (
                      <div key={lvl.px} className="flex justify-between">
                        <span className="text-red-500">{lvl.px}</span>
                        <span className="text-muted-foreground">{lvl.sz}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
