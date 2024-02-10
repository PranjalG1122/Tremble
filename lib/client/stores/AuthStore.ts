import { create } from "zustand";

interface AuthStoreProps {
  name: string;
  setName: (newName: string) => void;
  registerShown: boolean;
  setRegisterShown: (bool: boolean) => void;
}

export const useAuthStore = create<AuthStoreProps>((set) => ({
  name: "",
  setName: (newName) => set((state) => ({ name: (state.name = newName) })),
  registerShown: true,
  setRegisterShown: (bool) =>
    set((state) => ({
      registerShown: (state.registerShown = bool),
    })),
}));
