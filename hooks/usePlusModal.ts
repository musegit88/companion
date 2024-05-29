import { set } from "zod";
import { create } from "zustand";

type usePlusModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const usePlusModal = create<usePlusModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
