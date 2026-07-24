import { create } from "zustand";
import { persist } from "zustand/middleware";

interface AddressStore {
  manualAddress: `0x${string}` | null;
  setManualAddress: (address: `0x${string}`) => void;
  clearManualAddress: () => void;
}

export const useAddressStore = create<AddressStore>()(
  persist(
    (set) => ({
      manualAddress: null,
      setManualAddress: (address) => set({ manualAddress: address }),
      clearManualAddress: () => set({ manualAddress: null }),
    }),
    { name: "hl-dashboard-manual-address" },
  ),
);
