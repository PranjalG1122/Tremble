import { create } from "zustand";

export type PasswordsProps = {
  id: string;
  title: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

export type PasswordProps = {
  title: string;
  username: string;
  password: string;
};

interface PasswordStoreProps {
  search: string;
  setSearch: (search: string) => void;
  currentIndex: number;
  setCurrentIndex: (index: number) => void;
  password: PasswordProps;
  updatePassword: (updatedPassword: PasswordProps) => void;
  passwords: PasswordsProps[];
  setPasswords: (newPasswords: PasswordsProps[]) => void;
}

export const usePasswordStore = create<PasswordStoreProps>((set) => ({
  search: "",
  setSearch: (search) => set((state) => ({ search: (state.search = search) })),
  currentIndex: 0,
  setCurrentIndex: (index) =>
    set((state) => ({ currentIndex: (state.currentIndex = index) })),
  password: {
    title: "",
    username: "",
    password: "",
  },
  updatePassword: (updatedPassword) =>
    set((state) => ({ password: (state.password = updatedPassword) })),
  passwords: [],
  setPasswords: (updatedPasswords) =>
    set((state) => ({
      passwords: (state.passwords = updatedPasswords),
    })),
}));
