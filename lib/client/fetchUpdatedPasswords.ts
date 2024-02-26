import { toast } from "react-toastify";
import { fetchPasswords } from "../ServerActions/passwords";
import { PasswordsProps } from "./stores/PasswordStore";

export const fetchUpdatedPasswords = async (
  setPasswords: (newPasswords: PasswordsProps[]) => void,
  search: string
): Promise<boolean> => {
  const res = await fetchPasswords();
  if (!res) {
    toast.error("Failed to fetch passwords");
    return false;
  }

  const filteredPasswords: any = res.filter((password) => {
    if (!password) return false;
    return password.title.toLowerCase().includes(search.toLowerCase());
  });

  if (!filteredPasswords) {
    toast.error("Failed to fetch passwords");
    return false;
  }

  setPasswords(filteredPasswords);
  return true;
};
