"use client";

import { useState } from "react";
import { isAddress } from "viem";
import { PencilLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import useActiveAddress from "@/hooks/useActiveAddress";

const ManualAddressDialog = () => {
  const { manualAddress, setManualAddress, clearManualAddress } =
    useActiveAddress();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);

  const isValid = isAddress(value);

  const handleSubmit = () => {
    if (!isValid) return;
    setManualAddress(value as `0x${string}`);
    setValue("");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button variant="ghost" size="icon-sm" aria-label="View address" />
        }
      >
        <PencilLine />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>View an address</DialogTitle>
          <DialogDescription>
            Paste any wallet address to view its Hyperliquid portfolio. This
            takes priority over a connected wallet.
          </DialogDescription>
        </DialogHeader>
        <Input
          placeholder="0x..."
          value={value}
          onChange={(e) => setValue(e.target.value.trim())}
          aria-invalid={value.length > 0 && !isValid}
        />
        {value.length > 0 && !isValid && (
          <p className="text-sm text-destructive">Not a valid address.</p>
        )}
        <DialogFooter>
          {manualAddress && (
            <Button
              variant="outline"
              onClick={() => {
                clearManualAddress();
                setOpen(false);
              }}
            >
              Clear override
            </Button>
          )}
          <DialogClose render={<Button variant="ghost" />}>
            Cancel
          </DialogClose>
          <Button disabled={!isValid} onClick={handleSubmit}>
            View
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ManualAddressDialog;
