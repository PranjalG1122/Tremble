import { create } from "zustand";

type PasswordsProps = {
  id: string;
  title: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
};

type PasswordProps = {
  title: string;
  username: string;
  password: string;
};

interface PasswordStoreProps {
  currentID: string;
  updateCurrentID: (id: string) => void;
  password: PasswordProps;
  updatePassword: (updatedPassword: PasswordProps) => void;
  passwords: PasswordsProps[];
  setPasswords: (newPasswords: PasswordsProps[]) => void;
}

export const usePasswordStore = create<PasswordStoreProps>((set) => ({
  currentID: "",
  updateCurrentID: (id) =>
    set((state) => ({ currentID: (state.currentID = id) })),
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
