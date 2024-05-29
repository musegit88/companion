import { create } from "zustand";

type useAlertModalProps = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useAlertModal = create<useAlertModalProps>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
